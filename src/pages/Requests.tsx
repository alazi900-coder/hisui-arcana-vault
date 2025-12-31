import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { RequestCard } from '@/components/RequestCard';
import { Input } from '@/components/ui/input';
import { Search, Filter, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RequestsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const requests = useLiveQuery(() => db.requests.toArray(), []);
  const locations = useLiveQuery(() => db.locations.toArray(), []);

  const filteredRequests = requests?.filter(req => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      req.title_ar.includes(search) ||
      req.title_en.toLowerCase().includes(searchLower) ||
      req.giver.toLowerCase().includes(searchLower);
    
    const matchesLocation = !locationFilter || req.location_id === locationFilter;

    return matchesSearch && matchesLocation;
  }) || [];

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-accent/20">
            <ClipboardList className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              {t('المهام الجانبية', 'Side Requests')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredRequests.length} {t('مهمة', 'requests')}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ابحث عن مهمة...', 'Search requests...')}
            className="ps-10 bg-secondary/50 border-border/50"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm mb-4 transition-colors',
            showFilters ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
          )}
        >
          <Filter className="w-4 h-4" />
          {t('فلتر حسب الموقع', 'Filter by Location')}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up">
            {locations?.map(loc => (
              <button
                key={loc.id}
                onClick={() => setLocationFilter(locationFilter === loc.id ? null : loc.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-all',
                  locationFilter === loc.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                {t(loc.name_ar, loc.name_en)}
              </button>
            ))}
          </div>
        )}

        {/* Requests Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredRequests.map((request, i) => (
            <div 
              key={request.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <RequestCard request={request} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('لا توجد مهام', 'No requests found')}
          </div>
        )}
      </div>
    </div>
  );
}