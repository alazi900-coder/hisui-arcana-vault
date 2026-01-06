import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { InventoryEntry } from '@/types/save-data';

export function useInventory() {
  const inventory = useLiveQuery(() => db.inventory.toArray(), []);
  
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await db.inventory.delete(itemId);
    } else {
      await db.inventory.put({
        item_id: itemId,
        quantity,
        updated_at: Date.now(),
      });
    }
  };
  
  const addItem = async (itemId: string, quantity: number = 1) => {
    const existing = await db.inventory.get(itemId);
    const newQuantity = (existing?.quantity || 0) + quantity;
    
    await db.inventory.put({
      item_id: itemId,
      quantity: newQuantity,
      updated_at: Date.now(),
    });
  };
  
  const removeItem = async (itemId: string, quantity: number = 1) => {
    const existing = await db.inventory.get(itemId);
    if (!existing) return;
    
    const newQuantity = existing.quantity - quantity;
    
    if (newQuantity <= 0) {
      await db.inventory.delete(itemId);
    } else {
      await db.inventory.put({
        item_id: itemId,
        quantity: newQuantity,
        updated_at: Date.now(),
      });
    }
  };
  
  const clearInventory = async () => {
    await db.inventory.clear();
  };
  
  const getItemQuantity = async (itemId: string): Promise<number> => {
    const entry = await db.inventory.get(itemId);
    return entry?.quantity || 0;
  };
  
  // Get inventory grouped by item type
  const inventoryByType = useLiveQuery(async () => {
    const items = await db.inventory.toArray();
    const grouped: Record<string, InventoryEntry[]> = {};
    
    for (const inv of items) {
      const item = await db.items.get(inv.item_id);
      if (item) {
        const type = item.type;
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(inv);
      }
    }
    
    return grouped;
  }, []);
  
  return {
    inventory,
    inventoryByType,
    updateQuantity,
    addItem,
    removeItem,
    clearInventory,
    getItemQuantity,
    totalItems: inventory?.reduce((sum, i) => sum + i.quantity, 0) || 0,
    uniqueItems: inventory?.length || 0,
  };
}
