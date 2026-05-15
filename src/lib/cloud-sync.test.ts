import { describe, expect, it } from 'vitest';
import { pullTable, pushTable, SYNC_TABLES, type CloudRow, type DexieLikeTable } from './cloud-sync';

function fakeDexie<T>(initial: T[] = []): DexieLikeTable<T> & { state: T[] } {
  const state: T[] = [...initial];
  return {
    state,
    async toArray() { return [...state]; },
    async clear() { state.length = 0; },
    async bulkPut(rows: T[]) { state.push(...rows); return undefined; },
  };
}

function fakeSupabase(initialRows: CloudRow[] = []) {
  const rows = new Map<string, CloudRow>(
    initialRows.map(r => [`${r.user_id}:${r.table_name}`, r]),
  );
  return {
    rows,
    from(_table: 'user_cloud_data') {
      return {
        async upsert(row: Pick<CloudRow, 'user_id' | 'table_name' | 'payload' | 'updated_at'>) {
          rows.set(`${row.user_id}:${row.table_name}`, row as CloudRow);
          return { error: null };
        },
        select(_columns: string) {
          return {
            eq(_col1: 'user_id', userVal: string) {
              return {
                eq(_col2: 'table_name', tableVal: 'favorites' | 'livingDex' | 'outbreaks' | 'inventory') {
                  return {
                    async maybeSingle() {
                      const found = rows.get(`${userVal}:${tableVal}`) ?? null;
                      return { data: found, error: null };
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
  };
}

describe('cloud-sync', () => {
  it('SYNC_TABLES covers exactly the four user-data tables', () => {
    expect(SYNC_TABLES).toEqual(['favorites', 'livingDex', 'outbreaks', 'inventory']);
  });

  it('pushTable serializes the dexie rows to cloud storage', async () => {
    const dexie = fakeDexie([{ pokemon_id: 'pikachu', caught: true }]);
    const supabase = fakeSupabase();
    const result = await pushTable(supabase, 'user-1', 'livingDex', dexie);

    expect(result).toEqual({ table: 'livingDex', rows: 1 });
    const stored = supabase.rows.get('user-1:livingDex');
    expect(stored?.payload).toEqual([{ pokemon_id: 'pikachu', caught: true }]);
    expect(stored?.user_id).toBe('user-1');
  });

  it('pushTable allows empty arrays (clearing cloud state)', async () => {
    const dexie = fakeDexie<{ id: string }>([]);
    const supabase = fakeSupabase();
    const result = await pushTable(supabase, 'user-1', 'favorites', dexie);
    expect(result.rows).toBe(0);
    expect(supabase.rows.get('user-1:favorites')?.payload).toEqual([]);
  });

  it('pullTable replaces local rows with the cloud payload', async () => {
    const dexie = fakeDexie([{ id: 'old', count: 0 }]);
    const supabase = fakeSupabase([
      {
        user_id: 'user-1',
        table_name: 'outbreaks',
        payload: [{ id: 'new', count: 17 }, { id: 'fresh', count: 0 }],
        updated_at: '2025-01-01T00:00:00Z',
      },
    ]);

    const result = await pullTable(supabase, 'user-1', 'outbreaks', dexie);
    expect(result).toEqual({ table: 'outbreaks', rows: 2 });
    expect(dexie.state).toEqual([{ id: 'new', count: 17 }, { id: 'fresh', count: 0 }]);
  });

  it('pullTable on missing cloud row leaves local state alone', async () => {
    const dexie = fakeDexie([{ id: 'kept', count: 99 }]);
    const supabase = fakeSupabase();
    const result = await pullTable(supabase, 'user-1', 'favorites', dexie);
    expect(result.rows).toBe(0);
    expect(dexie.state).toEqual([{ id: 'kept', count: 99 }]);
  });

  it('round-trip push then pull preserves data', async () => {
    const localA = fakeDexie([
      { id: 'a', x: 1 },
      { id: 'b', x: 2 },
    ]);
    const localB = fakeDexie<{ id: string; x: number }>();
    const supabase = fakeSupabase();

    await pushTable(supabase, 'user-7', 'favorites', localA);
    await pullTable(supabase, 'user-7', 'favorites', localB);

    expect(localB.state).toEqual(localA.state);
  });
});
