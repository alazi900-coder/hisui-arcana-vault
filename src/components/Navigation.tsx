import { forwardRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Grid3X3, Swords, Package, MapPin, ClipboardCheck, Settings } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, labelAr: 'الرئيسية', labelEn: 'Home' },
  { path: '/pokemon', icon: Grid3X3, labelAr: 'بوكيمون', labelEn: 'Pokémon' },
  { path: '/tracker', icon: ClipboardCheck, labelAr: 'المتتبع', labelEn: 'Tracker' },
  { path: '/items', icon: Package, labelAr: 'عناصر', labelEn: 'Items' },
  { path: '/moves', icon: Swords, labelAr: 'حركات', labelEn: 'Moves' },
  { path: '/settings', icon: Settings, labelAr: 'إعدادات', labelEn: 'Settings' },
];

export const Navigation = forwardRef<HTMLElement, object>(
  function Navigation(_props, ref) {
    const { t } = useLanguage();
    const location = useLocation();

    return (
      <nav ref={ref} className="fixed bottom-0 inset-x-0 z-50 glass border-t border-border/50 safe-area-inset">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all',
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'animate-scale-in')} />
                <span className="text-[10px] font-medium">
                  {t(item.labelAr, item.labelEn)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }
);
