import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface TypeProgressChartProps {
  caught: number;
  totalPokemon: number;
  pokemonByType?: Array<{
    name: string;
    total: number;
    caught: number;
    percentage: number;
  }>;
}

export function TypeProgressChart({ caught, totalPokemon, pokemonByType }: TypeProgressChartProps) {
  const { t } = useLanguage();

  const pieData = [
    { name: t('مُمسك', 'Caught'), value: caught, color: 'hsl(var(--primary))' },
    { name: t('غير مُمسك', 'Not Caught'), value: totalPokemon - caught, color: 'hsl(var(--muted))' },
  ];

  return (
    <div className="space-y-4">
      {/* Pie Chart */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary" />
          {t('نسبة الإكمال', 'Completion Rate')}
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm">{t('مُمسك', 'Caught')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span className="text-sm">{t('غير مُمسك', 'Not Caught')}</span>
          </div>
        </div>
      </div>

      {/* Type Progress Bar Chart */}
      {pokemonByType && pokemonByType.length > 0 && (
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {t('التقدم حسب النوع', 'Progress by Type')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pokemonByType.slice(0, 8)} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={60} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    value, 
                    name === 'caught' ? t('مُمسك', 'Caught') : t('إجمالي', 'Total')
                  ]}
                />
                <Bar dataKey="total" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="caught" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
