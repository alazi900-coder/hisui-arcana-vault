/**
 * Offline-first cloud sync.
 *
 * Each Dexie table is serialized as a single JSONB payload and stored in
 * `public.user_cloud_data` keyed by (user_id, table_name). Sync is explicit:
 * the user clicks Push (local → cloud) or Pull (cloud → local). Conflict
 * resolution is "user decides" by which button they click; this is the
 * simplest correct policy for a single-user-multi-device app.
 *
 * The IO surface — `pushTable` and `pullTable` — is parameterised over a
 * Supabase-like client and a Dexie-like table, so unit tests can substitute
 * fakes and verify the round-trip in isolation.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export type SyncTableName = 'favorites' | 'livingDex' | 'outbreaks' | 'inventory';
export const SYNC_TABLES: readonly SyncTableName[] = ['favorites', 'livingDex', 'outbreaks', 'inventory'];

export interface DexieLikeTable<T> {
  toArray(): Promise<T[]>;
  clear(): Promise<void> | Promise<unknown>;
  bulkPut(rows: T[]): Promise<unknown>;
}

export interface SyncResult {
  table: SyncTableName;
  rows: number;
}

export interface CloudRow {
  user_id: string;
  table_name: SyncTableName;
  payload: unknown[];
  updated_at: string;
}

interface CloudClientLike {
  from(table: 'user_cloud_data'): {
    upsert(row: Pick<CloudRow, 'user_id' | 'table_name' | 'payload' | 'updated_at'>): Promise<{ error: { message: string } | null }>;
    select(columns: string): {
      eq(col: 'user_id', val: string): {
        eq(col: 'table_name', val: SyncTableName): {
          maybeSingle(): Promise<{ data: CloudRow | null; error: { message: string } | null }>;
        };
      };
    };
  };
}

export async function pushTable<T>(
  supabase: CloudClientLike | SupabaseClient,
  userId: string,
  tableName: SyncTableName,
  dexieTable: DexieLikeTable<T>,
): Promise<SyncResult> {
  const rows = await dexieTable.toArray();
  const client = supabase as CloudClientLike;
  const { error } = await client.from('user_cloud_data').upsert({
    user_id: userId,
    table_name: tableName,
    payload: rows as unknown[],
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return { table: tableName, rows: rows.length };
}

export async function pullTable<T>(
  supabase: CloudClientLike | SupabaseClient,
  userId: string,
  tableName: SyncTableName,
  dexieTable: DexieLikeTable<T>,
): Promise<SyncResult> {
  const client = supabase as CloudClientLike;
  const { data, error } = await client
    .from('user_cloud_data')
    .select('user_id, table_name, payload, updated_at')
    .eq('user_id', userId)
    .eq('table_name', tableName)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return { table: tableName, rows: 0 };

  const payload = Array.isArray(data.payload) ? (data.payload as T[]) : [];
  await dexieTable.clear();
  if (payload.length > 0) {
    await dexieTable.bulkPut(payload);
  }
  return { table: tableName, rows: payload.length };
}
