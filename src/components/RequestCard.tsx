import { Request } from '@/types/pokemon';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ClipboardList, User, MapPin } from 'lucide-react';

interface RequestCardProps {
  request: Request;
}

export function RequestCard({ request }: RequestCardProps) {
  const { t } = useLanguage();

  return (
    <Link to={`/requests/${request.id}`}>
      <div className={cn(
        'group relative rounded-xl border border-border/50 bg-gradient-to-br from-accent/10 to-primary/5 p-4 card-hover sparkle cursor-pointer'
      )}>
        {/* Icon */}
        <div className="absolute top-3 end-3 p-1.5 rounded-full bg-accent/20">
          <ClipboardList className="w-4 h-4 text-accent" />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-3 pe-8">
          {t(request.title_ar, request.title_en)}
        </h3>

        {/* Giver */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <User className="w-4 h-4" />
          <span>{request.giver}</span>
        </div>

        {/* Location hint */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{request.location_id.replace(/-/g, ' ')}</span>
        </div>
      </div>
    </Link>
  );
}