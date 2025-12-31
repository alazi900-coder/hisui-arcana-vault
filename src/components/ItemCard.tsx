import { Item } from '@/types/pokemon';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Circle, Heart, Cherry, Sparkles, Hammer, Key, Package } from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  pokeball: <Circle className="w-4 h-4" />,
  medicine: <Heart className="w-4 h-4" />,
  berry: <Cherry className="w-4 h-4" />,
  evolution: <Sparkles className="w-4 h-4" />,
  crafting: <Hammer className="w-4 h-4" />,
  key: <Key className="w-4 h-4" />,
  other: <Package className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  pokeball: 'from-destructive/20 to-destructive/5',
  medicine: 'from-type-grass/20 to-type-grass/5',
  berry: 'from-accent/20 to-accent/5',
  evolution: 'from-type-psychic/20 to-type-psychic/5',
  crafting: 'from-type-rock/20 to-type-rock/5',
  key: 'from-gold/20 to-gold/5',
  other: 'from-muted/20 to-muted/5',
};

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const { t } = useLanguage();
  const gradient = typeColors[item.type] || typeColors.other;
  const icon = typeIcons[item.type] || typeIcons.other;

  return (
    <Link to={`/items/${item.id}`}>
      <div className={cn(
        'group relative rounded-xl border border-border/50 bg-gradient-to-br p-4 card-hover sparkle cursor-pointer',
        gradient
      )}>
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center mb-3 mx-auto">
          {icon}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-foreground text-center text-sm truncate">
          {t(item.name_ar, item.name_en)}
        </h3>

        {/* Type badge */}
        <div className="text-center mt-2">
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-secondary text-muted-foreground capitalize">
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