import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useInventory } from '@/hooks/use-inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Package, Search, Trash2, Plus, Minus,
  Circle, FlaskConical, Sparkles, Wrench, Key
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Item } from '@/types/pokemon';

const typeIcons: Record<string, React.ElementType> = {
  pokeball: Circle,
  medicine: FlaskConical,
  berry: Sparkles,
  evolution: Sparkles,
  crafting: Wrench,
  key: Key,
  other: Package,
};

const typeColors: Record<string, string> = {
  pokeball: 'bg-destructive/20 text-destructive',
  medicine: 'bg-type-grass/20 text-type-grass',
  berry: 'bg-accent/20 text-accent',
  evolution: 'bg-primary/20 text-primary',
  crafting: 'bg-type-ground/20 text-type-ground',
  key: 'bg-gold/20 text-gold',
  other: 'bg-secondary text-foreground',
};

const typeLabels: Record<string, { ar: string; en: string }> = {
  pokeball: { ar: 'كرات البوكيمون', en: 'Poké Balls' },
  medicine: { ar: 'الأدوية', en: 'Medicine' },
  berry: { ar: 'التوت', en: 'Berries' },
  evolution: { ar: 'عناصر التطور', en: 'Evolution Items' },
  crafting: { ar: 'مواد التصنيع', en: 'Crafting Materials' },
  key: { ar: 'العناصر المفتاحية', en: 'Key Items' },
  other: { ar: 'أخرى', en: 'Other' },
};

function InventoryItem({ 
  item, 
  quantity, 
  onUpdate 
}: { 
  item: Item; 
  quantity: number;
  onUpdate: (newQty: number) => void;
}) {
  const { t } = useLanguage();
  const Icon = typeIcons[item.type] || Package;
  
  return (
    <div className="glass rounded-xl p-3 flex items-center gap-3">
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
        typeColors[item.type]
      )}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {t(item.name_ar, item.name_en)}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {t(item.description_ar, item.description_en)}
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onUpdate(quantity - 1)}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center font-bold">{quantity}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onUpdate(quantity + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function Inventory() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string | null>(null);
  
  const { inventory, updateQuantity, clearInventory, totalItems, uniqueItems } = useInventory();
  
  // Get all items from db
  const allItems = useLiveQuery(() => db.items.toArray(), []);
  
  // Create a map of inventory items with their details
  const inventoryWithDetails = useLiveQuery(async () => {
    if (!inventory) return [];
    
    const details = await Promise.all(
      inventory.map(async (inv) => {
        const item = await db.items.get(inv.item_id);
        return item ? { ...inv, item } : null;
      })
    );
    
    return details.filter(Boolean) as { item_id: string; quantity: number; item: Item }[];
  }, [inventory]);
  
  // Filter items
  const filteredItems = inventoryWithDetails?.filter((entry) => {
    const matchesSearch = !search || 
      entry.item.name_ar.includes(search) || 
      entry.item.name_en.toLowerCase().includes(search.toLowerCase());
    const matchesType = !activeType || entry.item.type === activeType;
    return matchesSearch && matchesType;
  });
  
  // Group by type
  const groupedItems = filteredItems?.reduce((acc, entry) => {
    const type = entry.item.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(entry);
    return acc;
  }, {} as Record<string, typeof filteredItems>);
  
  const itemTypes = Object.keys(typeLabels);
  
  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">
              {t('الحقيبة', 'Inventory')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                `${uniqueItems} عنصر (${totalItems} إجمالي)`,
                `${uniqueItems} items (${totalItems} total)`
              )}
            </p>
          </div>
          {inventory && inventory.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-destructive"
              onClick={() => {
                if (confirm(t('هل تريد مسح الحقيبة؟', 'Clear inventory?'))) {
                  clearInventory();
                }
              }}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('بحث...', 'Search...')}
            className="ps-9"
          />
        </div>
        
        {/* Type Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <Button
            variant={activeType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveType(null)}
            className="shrink-0"
          >
            {t('الكل', 'All')}
          </Button>
          {itemTypes.map((type) => {
            const Icon = typeIcons[type];
            return (
              <Button
                key={type}
                variant={activeType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveType(type)}
                className="shrink-0"
              >
                <Icon className="w-4 h-4 me-1" />
                {t(typeLabels[type].ar, typeLabels[type].en)}
              </Button>
            );
          })}
        </div>
        
        {/* Empty State */}
        {(!inventoryWithDetails || inventoryWithDetails.length === 0) && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t('الحقيبة فارغة', 'Inventory Empty')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'استورد بياناتك من اللعبة لملء الحقيبة',
                'Import your game data to fill the inventory'
              )}
            </p>
            <Button onClick={() => navigate('/save-import')}>
              {t('استيراد البيانات', 'Import Data')}
            </Button>
          </div>
        )}
        
        {/* Items List */}
        {groupedItems && Object.keys(groupedItems).length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([type, items]) => (
              <div key={type}>
                <div className="flex items-center gap-2 mb-3">
                  {(() => {
                    const Icon = typeIcons[type];
                    return <Icon className={cn('w-5 h-5', typeColors[type].split(' ')[1])} />;
                  })()}
                  <h2 className="font-semibold">
                    {t(typeLabels[type].ar, typeLabels[type].en)}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({items?.length})
                  </span>
                </div>
                
                <div className="space-y-2">
                  {items?.map((entry) => (
                    <InventoryItem
                      key={entry.item_id}
                      item={entry.item}
                      quantity={entry.quantity}
                      onUpdate={(newQty) => updateQuantity(entry.item_id, newQty)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
