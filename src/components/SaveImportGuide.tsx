import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileDown, FileJson, Upload, 
  CheckCircle, ArrowRight, Monitor, Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepData {
  icon: React.ElementType;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  detailsAr: string[];
  detailsEn: string[];
}

const steps: StepData[] = [
  {
    icon: FileDown,
    titleAr: 'احصل على ملف الحفظ',
    titleEn: 'Get Your Save File',
    descAr: 'انسخ ملف الحفظ من المحاكي (Ryujinx/Yuzu) أو من جهاز Nintendo Switch',
    descEn: 'Copy your save file from emulator (Ryujinx/Yuzu) or Nintendo Switch',
    detailsAr: [
      'Ryujinx: ملف > فتح مجلد حفظ Ryujinx',
      'Yuzu: انقر بزر الماوس الأيمن على اللعبة > فتح مجلد الحفظ',
      'Switch: استخدم Checkpoint أو JKSV لتصدير الحفظ',
    ],
    detailsEn: [
      'Ryujinx: File > Open Ryujinx Folder > saves',
      'Yuzu: Right-click game > Open Save Data Location',
      'Switch: Use Checkpoint or JKSV to export save',
    ],
  },
  {
    icon: Monitor,
    titleAr: 'افتح PKHeX',
    titleEn: 'Open PKHeX',
    descAr: 'حمّل برنامج PKHeX وافتح ملف الحفظ فيه',
    descEn: 'Download PKHeX and open your save file in it',
    detailsAr: [
      'حمّل PKHeX من projectpokemon.org',
      'اسحب ملف الحفظ وأفلته في البرنامج',
      'تأكد من ظهور البوكيمون في الصناديق',
    ],
    detailsEn: [
      'Download PKHeX from projectpokemon.org',
      'Drag and drop your save file into PKHeX',
      'Make sure Pokémon appear in the boxes',
    ],
  },
  {
    icon: FileJson,
    titleAr: 'صدّر كـ JSON',
    titleEn: 'Export as JSON',
    descAr: 'من قائمة Tools، اختر Export SAV to JSON',
    descEn: 'From Tools menu, select Export SAV to JSON',
    detailsAr: [
      'اذهب إلى Tools > Export',
      'اختر "Export SAV to JSON"',
      'احفظ الملف في مكان تتذكره',
    ],
    detailsEn: [
      'Go to Tools > Export',
      'Select "Export SAV to JSON"',
      'Save the file somewhere you can find it',
    ],
  },
  {
    icon: Upload,
    titleAr: 'ارفع الملف هنا',
    titleEn: 'Upload Here',
    descAr: 'ارفع ملف JSON واضغط زر الاستيراد',
    descEn: 'Upload the JSON file and click Import',
    detailsAr: [
      'اضغط على زر "اختيار ملف"',
      'اختر ملف JSON الذي صدّرته',
      'اضغط "استيراد" وانتظر الانتهاء',
    ],
    detailsEn: [
      'Click "Choose File" button',
      'Select the JSON file you exported',
      'Click "Import" and wait for completion',
    ],
  },
];

export function SaveImportGuide() {
  const { lang, t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">
          {t('كيفية استيراد بيانات اللعبة', 'How to Import Game Data')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t(
            'اتبع هذه الخطوات لاستيراد بوكيموناتك وعناصرك من اللعبة',
            'Follow these steps to import your Pokémon and items from the game'
          )}
        </p>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const details = lang === 'ar' ? step.detailsAr : step.detailsEn;
          
          return (
            <div 
              key={index}
              className="glass rounded-xl p-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Step number and icon */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    'bg-primary/20 text-primary'
                  )}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground mt-1">
                    {index + 1}/{steps.length}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {t(step.titleAr, step.titleEn)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t(step.descAr, step.descEn)}
                  </p>
                  
                  {/* Details */}
                  <ul className="space-y-1.5">
                    {details.map((detail, i) => (
                      <li 
                        key={i}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-type-grass shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Arrow to next step */}
              {index < steps.length - 1 && (
                <div className="flex justify-center mt-3">
                  <ArrowRight className="w-5 h-5 text-muted-foreground/30 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Supported platforms */}
      <div className="glass rounded-xl p-4">
        <h4 className="font-medium text-sm mb-3">
          {t('المنصات المدعومة', 'Supported Platforms')}
        </h4>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-foreground">
            <Monitor className="w-3.5 h-3.5 inline me-1" />
            Ryujinx
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-foreground">
            <Monitor className="w-3.5 h-3.5 inline me-1" />
            Yuzu
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-foreground">
            <Smartphone className="w-3.5 h-3.5 inline me-1" />
            Nintendo Switch
          </span>
        </div>
      </div>
    </div>
  );
}
