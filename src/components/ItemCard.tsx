import { forwardRef, useState } from 'react';
import { Item } from '@/types/pokemon';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Circle, Heart, Cherry, Sparkles, Hammer, Key, Package } from 'lucide-react';

// PokeAPI item sprites base URL
const ITEM_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

// Helper to convert item name to sprite filename
const getItemSpriteUrl = (itemName: string): string => {
  // Convert name to kebab-case for PokeAPI
  const spriteName = itemName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/é/g, 'e')
    .replace(/['']/g, '')
    .replace(/\./g, '');
  return `${ITEM_SPRITE_BASE}/${spriteName}.png`;
};

const typeIcons: Record<string, React.ReactNode> = {
  pokeball: <Circle className="w-5 h-5" />,
  medicine: <Heart className="w-5 h-5" />,
  berry: <Cherry className="w-5 h-5" />,
  evolution: <Sparkles className="w-5 h-5" />,
  crafting: <Hammer className="w-5 h-5" />,
  key: <Key className="w-5 h-5" />,
  other: <Package className="w-5 h-5" />,
};

const typeColors: Record<string, { bg: string; border: string; glow: string }> = {
  pokeball: { 
    bg: 'from-destructive/30 to-destructive/10', 
    border: 'border-destructive/30',
    glow: 'shadow-[0_0_20px_hsl(var(--destructive)/0.3)]'
  },
  medicine: { 
    bg: 'from-type-grass/30 to-type-grass/10', 
    border: 'border-type-grass/30',
    glow: 'shadow-[0_0_20px_hsl(var(--type-grass)/0.3)]'
  },
  berry: { 
    bg: 'from-accent/30 to-accent/10', 
    border: 'border-accent/30',
    glow: 'shadow-[0_0_20px_hsl(var(--accent)/0.3)]'
  },
  evolution: { 
    bg: 'from-type-psychic/30 to-type-psychic/10', 
    border: 'border-type-psychic/30',
    glow: 'shadow-[0_0_20px_hsl(var(--type-psychic)/0.3)]'
  },
  crafting: { 
    bg: 'from-type-rock/30 to-type-rock/10', 
    border: 'border-type-rock/30',
    glow: 'shadow-[0_0_20px_hsl(var(--type-rock)/0.3)]'
  },
  key: { 
    bg: 'from-gold/30 to-gold/10', 
    border: 'border-gold/30',
    glow: 'shadow-[0_0_20px_hsl(var(--gold)/0.3)]'
  },
  other: { 
    bg: 'from-muted/30 to-muted/10', 
    border: 'border-muted/30',
    glow: 'shadow-[0_0_20px_hsl(var(--muted)/0.2)]'
  },
};

interface ItemCardProps {
  item: Item;
}

export const ItemCard = forwardRef<HTMLAnchorElement, ItemCardProps>(
  function ItemCard({ item }, ref) {
    const { t } = useLanguage();
    const [imgError, setImgError] = useState(false);
    const colors = typeColors[item.type] || typeColors.other;
    const icon = typeIcons[item.type] || typeIcons.other;
    const spriteUrl = getItemSpriteUrl(item.name_en);

    return (
      <Link to={`/items/${item.id}`} ref={ref}>
        <div className={cn(
          'group relative rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300 cursor-pointer',
          'hover:scale-105 hover:-translate-y-1',
          colors.bg,
          colors.border,
          'hover:' + colors.glow
        )}>
          {/* Item Image */}
          <div className="relative w-14 h-14 mx-auto mb-3">
            {!imgError ? (
              <img 
                src={spriteUrl}
                alt={t(item.name_ar, item.name_en)}
                className="w-full h-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-125"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-secondary/50 flex items-center justify-center">
                {icon}
              </div>
            )}
            
            {/* Glow effect behind image */}
            <div className={cn(
              "absolute inset-0 -z-10 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300",
              item.type === 'pokeball' && "bg-destructive",
              item.type === 'medicine' && "bg-type-grass",
              item.type === 'berry' && "bg-accent",
              item.type === 'evolution' && "bg-type-psychic",
              item.type === 'crafting' && "bg-type-rock",
              item.type === 'key' && "bg-gold",
              item.type === 'other' && "bg-muted"
            )} />
          </div>

          {/* Name */}
          <h3 className="font-semibold text-foreground text-center text-sm truncate group-hover:text-primary transition-colors">
            {t(item.name_ar, item.name_en)}
          </h3>

          {/* Type badge */}
          <div className="text-center mt-2">
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-background/50 backdrop-blur-sm capitalize",
              item.type === 'pokeball' && "text-destructive",
              item.type === 'medicine' && "text-type-grass",
              item.type === 'berry' && "text-accent",
              item.type === 'evolution' && "text-type-psychic",
              item.type === 'crafting' && "text-type-rock",
              item.type === 'key' && "text-gold",
              item.type === 'other' && "text-muted-foreground"
            )}>
              {icon}
              {t(
                item.type === 'pokeball' ? 'كرة' :
                item.type === 'medicine' ? 'دواء' :
                item.type === 'berry' ? 'توت' :
                item.type === 'evolution' ? 'تطور' :
                item.type === 'crafting' ? 'تصنيع' :
                item.type === 'key' ? 'مفتاح' : 'أخرى',
                item.type
              )}
            </span>
          </div>
        </div>
      </Link>
    );
  }
);
