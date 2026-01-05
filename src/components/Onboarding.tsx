import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, Grid3X3, Target, Map, Swords, 
  ChevronRight, ChevronLeft, X, Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/db';

interface OnboardingProps {
  onComplete: () => void;
}

const ONBOARDING_KEY = 'pla-dex-onboarding-complete';

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const meta = await db.metadata.get(ONBOARDING_KEY);
        if (!meta) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
      } finally {
        setIsChecking(false);
      }
    };
    checkOnboarding();
  }, []);

  const completeOnboarding = async () => {
    try {
      await db.metadata.put({ key: ONBOARDING_KEY, value: 'true' });
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      setShowOnboarding(false);
    }
  };

  return { showOnboarding, isChecking, completeOnboarding };
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Sparkles,
      title: t('مرحباً بك في PLA Dex X', 'Welcome to PLA Dex X'),
      description: t(
        'دليلك الشامل لعالم Pokémon Legends: Arceus. اكتشف كل بوكيمون، حركة، وعنصر في منطقة هيسوي.',
        'Your complete guide to Pokémon Legends: Arceus. Discover every Pokémon, move, and item in the Hisui region.'
      ),
      color: 'from-primary to-accent',
    },
    {
      icon: Grid3X3,
      title: t('بوكيدكس شامل', 'Complete Pokédex'),
      description: t(
        'تصفح جميع بوكيمونات هيسوي مع إحصائياتها، تطوراتها، ومواقع ظهورها. ابحث وفلتر بسهولة.',
        'Browse all Hisui Pokémon with their stats, evolutions, and spawn locations. Search and filter easily.'
      ),
      color: 'from-type-grass to-type-water',
    },
    {
      icon: Target,
      title: t('تتبع Living Dex', 'Living Dex Tracker'),
      description: t(
        'سجّل كل بوكيمون أمسكته، بما في ذلك الألفا واللامع. تابع تقدمك واحصل على إنجازات.',
        'Track every Pokémon you catch, including Alpha and Shiny. Monitor your progress and earn achievements.'
      ),
      color: 'from-gold to-type-fire',
    },
    {
      icon: Map,
      title: t('خريطة هيسوي التفاعلية', 'Interactive Hisui Map'),
      description: t(
        'اكتشف مواقع ظهور البوكيمونات في كل منطقة. استخدم الفلاتر للعثور على ما تبحث عنه.',
        'Discover Pokémon spawn locations in each region. Use filters to find exactly what you need.'
      ),
      color: 'from-type-water to-type-ice',
    },
    {
      icon: Swords,
      title: t('أدوات متقدمة', 'Advanced Tools'),
      description: t(
        'حاسبة الضرر، بناء الفريق، مقارنة البوكيمونات، ومساعد AI ذكي. كل ما تحتاجه في مكان واحد.',
        'Damage calculator, team builder, Pokémon comparison, and smart AI assistant. Everything you need in one place.'
      ),
      color: 'from-destructive to-accent',
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center animate-fade-in-up" key={currentStep}>
          {/* Icon */}
          <div className={cn(
            "w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl",
            currentStepData.color
          )}>
            <Icon className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gradient mb-4">
            {currentStepData.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 px-4">
            {currentStepData.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  index === currentStep 
                    ? "bg-primary w-8" 
                    : "bg-muted hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={isFirstStep}
              className={cn("gap-2", isFirstStep && "invisible")}
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {t('السابق', 'Previous')}
            </Button>

            <Button
              onClick={handleNext}
              size="lg"
              className="gap-2 px-8"
            >
              {isLastStep ? (
                <>
                  <Rocket className="w-4 h-4" />
                  {t('ابدأ الآن', 'Get Started')}
                </>
              ) : (
                <>
                  {t('التالي', 'Next')}
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
