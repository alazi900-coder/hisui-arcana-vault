import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50 safe-area-inset">
      <div className="container flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PX</span>
          </div>
          <span className="font-bold text-lg text-gradient hidden sm:block">PLA Dex X</span>
        </Link>

        {/* Search Link */}
        <div className="flex-1 max-w-md mx-4">
          <Link to="/search">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground gap-2 bg-secondary/30"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">{t('بحث عن بوكيمون، حركات، عناصر...', 'Search Pokémon, moves, items...')}</span>
              <span className="sm:hidden">{t('بحث...', 'Search...')}</span>
            </Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Globe className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
