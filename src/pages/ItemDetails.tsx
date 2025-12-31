import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addRecent } from '@/lib/db';
import { 
  ChevronLeft, ChevronRight, Circle, Heart, Cherry, Sparkles, 
  Hammer, Key, Package, MapPin, ShoppingBag, Beaker, Info, ArrowRight, FlaskConical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Recipe, Item } from '@/types/pokemon';

// PokeAPI item sprites base URL
const ITEM_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

// Helper to convert item name to sprite filename
const getItemSpriteUrl = (itemName: string): string => {
  const spriteName = itemName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/é/g, 'e')
    .replace(/['']/g, '')
    .replace(/\./g, '');
  return `${ITEM_SPRITE_BASE}/${spriteName}.png`;
};

const typeIcons: Record<string, React.ReactNode> = {
  pokeball: <Circle className="w-8 h-8" />,
  medicine: <Heart className="w-8 h-8" />,
  berry: <Cherry className="w-8 h-8" />,
  evolution: <Sparkles className="w-8 h-8" />,
  crafting: <Hammer className="w-8 h-8" />,
  key: <Key className="w-8 h-8" />,
  other: <Package className="w-8 h-8" />,
};

const typeColors: Record<string, { bg: string; text: string; glow: string; gradient: string }> = {
  pokeball: { 
    bg: 'bg-destructive/20', 
    text: 'text-destructive',
    glow: 'shadow-[0_0_60px_hsl(var(--destructive)/0.4)]',
    gradient: 'from-destructive/30 via-destructive/10 to-transparent'
  },
  medicine: { 
    bg: 'bg-type-grass/20', 
    text: 'text-type-grass',
    glow: 'shadow-[0_0_60px_hsl(var(--type-grass)/0.4)]',
    gradient: 'from-type-grass/30 via-type-grass/10 to-transparent'
  },
  berry: { 
    bg: 'bg-accent/20', 
    text: 'text-accent',
    glow: 'shadow-[0_0_60px_hsl(var(--accent)/0.4)]',
    gradient: 'from-accent/30 via-accent/10 to-transparent'
  },
  evolution: { 
    bg: 'bg-type-psychic/20', 
    text: 'text-type-psychic',
    glow: 'shadow-[0_0_60px_hsl(var(--type-psychic)/0.4)]',
    gradient: 'from-type-psychic/30 via-type-psychic/10 to-transparent'
  },
  crafting: { 
    bg: 'bg-type-rock/20', 
    text: 'text-type-rock',
    glow: 'shadow-[0_0_60px_hsl(var(--type-rock)/0.4)]',
    gradient: 'from-type-rock/30 via-type-rock/10 to-transparent'
  },
  key: { 
    bg: 'bg-gold/20', 
    text: 'text-gold',
    glow: 'shadow-[0_0_60px_hsl(var(--gold)/0.4)]',
    gradient: 'from-gold/30 via-gold/10 to-transparent'
  },
  other: { 
    bg: 'bg-muted', 
    text: 'text-muted-foreground',
    glow: 'shadow-[0_0_40px_hsl(var(--muted)/0.3)]',
    gradient: 'from-muted/30 via-muted/10 to-transparent'
  },
};

// Item acquisition locations based on type
const getAcquisitionLocations = (item: { type: string; name_en: string }, t: (ar: string, en: string) => string) => {
  const locations: { icon: React.ReactNode; label: string; detail: string }[] = [];
  
  switch (item.type) {
    case 'pokeball':
      locations.push(
        { icon: <ShoppingBag className="w-4 h-4" />, label: t('متجر جينكو', 'Ginkgo Guild Cart'), detail: t('متاح للشراء', 'Available for purchase') },
        { icon: <Beaker className="w-4 h-4" />, label: t('التصنيع', 'Crafting'), detail: t('يمكن صنعه من المواد', 'Can be crafted from materials') }
      );
      break;
    case 'medicine':
      locations.push(
        { icon: <ShoppingBag className="w-4 h-4" />, label: t('متجر جينكو', 'Ginkgo Guild Cart'), detail: t('متاح للشراء', 'Available for purchase') },
        { icon: <Beaker className="w-4 h-4" />, label: t('التصنيع', 'Crafting'), detail: t('صنعه من التوت والأعشاب', 'Craft from berries and herbs') },
        { icon: <MapPin className="w-4 h-4" />, label: t('المناطق البرية', 'Wild Areas'), detail: t('يوجد في الصناديق', 'Found in chests') }
      );
      break;
    case 'berry':
      locations.push(
        { icon: <MapPin className="w-4 h-4" />, label: t('الأشجار', 'Berry Trees'), detail: t('اهزز الأشجار لجمعها', 'Shake trees to collect') },
        { icon: <MapPin className="w-4 h-4" />, label: t('جميع المناطق', 'All Areas'), detail: t('متوفر في كل مكان', 'Available everywhere') }
      );
      break;
    case 'evolution':
      locations.push(
        { icon: <MapPin className="w-4 h-4" />, label: t('أراضي السبج', 'Obsidian Fieldlands'), detail: t('نادر في الأرض', 'Rare ground spawn') },
        { icon: <MapPin className="w-4 h-4" />, label: t('مرتفعات كورونيت', 'Coronet Highlands'), detail: t('في المناطق الصخرية', 'In rocky areas') },
        { icon: <ShoppingBag className="w-4 h-4" />, label: t('نقاط الجدارة', 'Merit Points'), detail: t('اشترِ من التاجر', 'Buy from trader') }
      );
      break;
    case 'crafting':
      locations.push(
        { icon: <MapPin className="w-4 h-4" />, label: t('جميع المناطق', 'All Areas'), detail: t('اجمع من الأرض', 'Gather from ground') },
        { icon: <MapPin className="w-4 h-4" />, label: t('الصخور والأشجار', 'Rocks & Trees'), detail: t('اضرب لجمع المواد', 'Hit to gather materials') }
      );
      break;
    case 'key':
      locations.push(
        { icon: <Info className="w-4 h-4" />, label: t('المهام الرئيسية', 'Main Story'), detail: t('يُحصل عليه تلقائياً', 'Obtained automatically') }
      );
      break;
    default:
      locations.push(
        { icon: <MapPin className="w-4 h-4" />, label: t('متنوع', 'Various'), detail: t('تحقق من المناطق', 'Check various areas') }
      );
  }
  
  return locations;
};

// Recipe Card Component
function RecipeCard({ 
  recipe, 
  allItems, 
  t, 
  highlightItemId,
  isOutput 
}: { 
  recipe: Recipe; 
  allItems: Item[]; 
  t: (ar: string, en: string) => string;
  highlightItemId?: string;
  isOutput: boolean;
}) {
  const getItem = (itemId: string) => allItems.find(i => i.id === itemId);
  
  return (
    <div className="p-4 rounded-xl bg-background/50 border border-border/30">
      {/* Recipe name and unlock notes */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">
          {t(recipe.name_ar, recipe.name_en)}
        </h3>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
          {t(recipe.unlock_notes_ar, recipe.unlock_notes_en)}
        </span>
      </div>
      
      {/* Recipe flow: Ingredients → Output */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Ingredients */}
        <div className="flex items-center gap-2 flex-wrap">
          {recipe.ingredients.map((ing, idx) => {
            const ingItem = getItem(ing.item_id);
            if (!ingItem) return null;
            const isHighlighted = ing.item_id === highlightItemId && !isOutput;
            
            return (
              <div key={idx} className="flex items-center gap-1">
                {idx > 0 && <span className="text-muted-foreground text-xs">+</span>}
                <Link 
                  to={`/items/${ingItem.id}`}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105",
                    isHighlighted 
                      ? "bg-primary/20 border border-primary/50 ring-2 ring-primary/30" 
                      : "bg-secondary/50 hover:bg-secondary"
                  )}
                >
                  <img 
                    src={getItemSpriteUrl(ingItem.name_en)}
                    alt={t(ingItem.name_ar, ingItem.name_en)}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className={cn(
                    "text-sm font-medium",
                    isHighlighted ? "text-primary" : "text-foreground"
                  )}>
                    {ing.qty}x
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* Arrow */}
        <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
        
        {/* Outputs */}
        <div className="flex items-center gap-2">
          {recipe.outputs.map((out, idx) => {
            const outItem = getItem(out.item_id);
            if (!outItem) return null;
            const isHighlighted = out.item_id === highlightItemId && isOutput;
            
            return (
              <Link 
                key={idx}
                to={`/items/${outItem.id}`}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:scale-105",
                  isHighlighted 
                    ? "bg-accent/20 border border-accent/50 ring-2 ring-accent/30" 
                    : "bg-type-grass/10 border border-type-grass/30 hover:bg-type-grass/20"
                )}
              >
                <img 
                  src={getItemSpriteUrl(outItem.name_en)}
                  alt={t(outItem.name_ar, outItem.name_en)}
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className={cn(
                  "text-sm font-semibold",
                  isHighlighted ? "text-accent" : "text-type-grass"
                )}>
                  {out.qty}x {t(outItem.name_ar, outItem.name_en)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const item = useLiveQuery(() => db.items.get(id || ''), [id]);
  const allItems = useLiveQuery(() => db.items.toArray(), []);
  const allRecipes = useLiveQuery(() => db.recipes.toArray(), []);
  
  // Get previous and next items
  const currentIndex = allItems?.findIndex(i => i.id === id) ?? -1;
  const prevItem = currentIndex > 0 ? allItems?.[currentIndex - 1] : null;
  const nextItem = currentIndex < (allItems?.length ?? 0) - 1 ? allItems?.[currentIndex + 1] : null;
  
  // Find recipes that use this item as ingredient
  const recipesUsingItem = allRecipes?.filter(recipe => 
    recipe.ingredients.some(ing => ing.item_id === id)
  ) || [];
  
  // Find recipes that produce this item
  const recipesProducingItem = allRecipes?.filter(recipe => 
    recipe.outputs.some(out => out.item_id === id)
  ) || [];

  // Track recent view
  useEffect(() => {
    if (id) {
      addRecent('item', id);
    }
  }, [id]);

  // Reset image error when item changes
  useEffect(() => {
    setImgError(false);
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  const icon = typeIcons[item.type] || typeIcons.other;
  const colors = typeColors[item.type] || typeColors.other;
  const spriteUrl = getItemSpriteUrl(item.name_en);
  const acquisitionLocations = getAcquisitionLocations(item, t);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pokeball': return t('كرة بوكيمون', 'Pokéball');
      case 'medicine': return t('دواء', 'Medicine');
      case 'berry': return t('توت', 'Berry');
      case 'evolution': return t('حجر تطور', 'Evolution Item');
      case 'crafting': return t('مادة تصنيع', 'Crafting Material');
      case 'key': return t('عنصر مفتاح', 'Key Item');
      default: return t('عنصر آخر', 'Other');
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-16">
      {/* Hero Header with Gradient */}
      <div className={cn(
        'relative h-72 flex items-center justify-center overflow-hidden',
        `bg-gradient-to-b ${colors.gradient}`
      )}>
        {/* Navigation */}
        <div className="absolute top-4 start-4 end-4 flex items-center justify-between z-10">
          <Link 
            to="/items" 
            className="p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </Link>
          
          <div className="flex items-center gap-2">
            {prevItem && (
              <Link 
                to={`/items/${prevItem.id}`}
                className="p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </Link>
            )}
            {nextItem && (
              <Link 
                to={`/items/${nextItem.id}`}
                className="p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            )}
          </div>
        </div>

        {/* Large Item Image */}
        <div className={cn(
          'relative w-40 h-40 flex items-center justify-center animate-float',
          colors.glow
        )}>
          {!imgError ? (
            <img 
              src={spriteUrl}
              alt={t(item.name_ar, item.name_en)}
              className="w-32 h-32 object-contain drop-shadow-2xl"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={cn(
              'w-32 h-32 rounded-3xl flex items-center justify-center',
              colors.bg,
              colors.text
            )}>
              {icon}
            </div>
          )}
          
          {/* Background glow */}
          <div className={cn(
            'absolute inset-0 -z-10 rounded-full blur-3xl opacity-50',
            colors.bg
          )} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-12 relative z-10">
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-6 shadow-2xl">
          {/* Type badge */}
          <div className="flex justify-center mb-4">
            <span className={cn(
              'inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full',
              colors.bg,
              colors.text
            )}>
              {icon}
              {getTypeLabel(item.type)}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-center mb-2 text-gradient">
            {t(item.name_ar, item.name_en)}
          </h1>
          
          {/* English name subtitle */}
          <p className="text-center text-muted-foreground text-sm mb-6">
            {item.name_en}
          </p>

          {/* Description Card */}
          <div className="bg-secondary/30 rounded-2xl p-5 mb-6 border border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">
                {t('الوصف', 'Description')}
              </h2>
            </div>
            <p className="text-foreground leading-relaxed text-base">
              {t(item.description_ar, item.description_en)}
            </p>
          </div>

          {/* Acquisition Locations */}
          <div className="bg-secondary/30 rounded-2xl p-5 border border-border/30">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">
                {t('كيفية الحصول عليه', 'How to Obtain')}
              </h2>
            </div>
            
            <div className="space-y-3">
              {acquisitionLocations.map((location, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/30 hover:bg-background/80 transition-colors"
                >
                  <div className={cn(
                    'p-2 rounded-lg shrink-0',
                    colors.bg,
                    colors.text
                  )}>
                    {location.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{location.label}</h3>
                    <p className="text-sm text-muted-foreground">{location.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipes that produce this item */}
          {recipesProducingItem.length > 0 && (
            <div className="mt-6 bg-secondary/30 rounded-2xl p-5 border border-border/30">
              <div className="flex items-center gap-2 mb-4">
                <Beaker className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  {t('كيفية صنعه', 'How to Craft')}
                </h2>
              </div>
              
              <div className="space-y-4">
                {recipesProducingItem.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    allItems={allItems || []} 
                    t={t}
                    highlightItemId={id}
                    isOutput
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recipes using this item */}
          {recipesUsingItem.length > 0 && (
            <div className="mt-6 bg-secondary/30 rounded-2xl p-5 border border-border/30">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold">
                  {t('يُستخدم في صنع', 'Used in Crafting')}
                </h2>
              </div>
              
              <div className="space-y-4">
                {recipesUsingItem.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    allItems={allItems || []} 
                    t={t}
                    highlightItemId={id}
                    isOutput={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Related Items - Same Type */}
          {allItems && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                {t('عناصر مشابهة', 'Similar Items')}
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allItems
                  .filter(i => i.type === item.type && i.id !== item.id)
                  .slice(0, 6)
                  .map(relatedItem => (
                    <Link
                      key={relatedItem.id}
                      to={`/items/${relatedItem.id}`}
                      className="shrink-0 w-20 text-center group"
                    >
                      <div className={cn(
                        'w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-1 transition-all group-hover:scale-110',
                        colors.bg
                      )}>
                        <img 
                          src={getItemSpriteUrl(relatedItem.name_en)}
                          alt={t(relatedItem.name_ar, relatedItem.name_en)}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                        {t(relatedItem.name_ar, relatedItem.name_en)}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}