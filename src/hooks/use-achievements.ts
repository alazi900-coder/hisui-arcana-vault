import { useEffect, useRef, useCallback } from 'react';
import { useLivingDexStats } from '@/hooks/use-living-dex';
import { db } from '@/lib/db';
import { toast } from 'sonner';
import { ACHIEVEMENTS, AchievementToast } from '@/components/AchievementToast';
import { createElement } from 'react';

const UNLOCKED_ACHIEVEMENTS_KEY = 'pla-unlocked-achievements';

interface AchievementCheck {
  id: string;
  condition: (stats: { caught: number; alpha: number; shiny: number; totalPokemon: number }) => boolean;
}

const achievementChecks: AchievementCheck[] = [
  { id: 'first', condition: (s) => s.caught >= 1 },
  { id: '10', condition: (s) => s.caught >= 10 },
  { id: '25', condition: (s) => s.caught >= 25 },
  { id: '50', condition: (s) => s.caught >= 50 },
  { id: '75', condition: (s) => s.caught >= 75 },
  { id: '100', condition: (s) => s.caught >= 100 },
  { id: 'all', condition: (s) => s.caught >= s.totalPokemon && s.totalPokemon > 0 },
  { id: 'alpha5', condition: (s) => s.alpha >= 5 },
  { id: 'alpha15', condition: (s) => s.alpha >= 15 },
  { id: 'shiny3', condition: (s) => s.shiny >= 3 },
  { id: 'shiny10', condition: (s) => s.shiny >= 10 },
];

async function getUnlockedAchievements(): Promise<Set<string>> {
  try {
    const meta = await db.metadata.get(UNLOCKED_ACHIEVEMENTS_KEY);
    if (meta?.value) {
      return new Set(JSON.parse(meta.value));
    }
  } catch (error) {
    console.error('Error getting unlocked achievements:', error);
  }
  return new Set();
}

async function saveUnlockedAchievements(unlocked: Set<string>): Promise<void> {
  try {
    await db.metadata.put({
      key: UNLOCKED_ACHIEVEMENTS_KEY,
      value: JSON.stringify(Array.from(unlocked)),
    });
  } catch (error) {
    console.error('Error saving unlocked achievements:', error);
  }
}

export function useAchievementChecker() {
  const stats = useLivingDexStats();
  const previousStatsRef = useRef<typeof stats>(null);
  const hasInitializedRef = useRef(false);

  const checkAchievements = useCallback(async () => {
    if (!stats) return;

    const unlocked = await getUnlockedAchievements();
    const newUnlocked = new Set(unlocked);
    let hasNewAchievement = false;

    for (const check of achievementChecks) {
      if (!unlocked.has(check.id) && check.condition({
        caught: stats.caught ?? 0,
        alpha: stats.alpha ?? 0,
        shiny: stats.shiny ?? 0,
        totalPokemon: stats.totalPokemon ?? 242,
      })) {
        newUnlocked.add(check.id);
        hasNewAchievement = true;

        // Show toast notification
        const achievement = ACHIEVEMENTS.find(a => a.id === check.id);
        if (achievement) {
          toast.custom(() => createElement(AchievementToast, { achievement }), {
            duration: 5000,
            position: 'top-center',
          });
        }
      }
    }

    if (hasNewAchievement) {
      await saveUnlockedAchievements(newUnlocked);
    }
  }, [stats]);

  useEffect(() => {
    // Skip first render to avoid showing achievements on page load
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      // Initialize by checking current achievements silently
      getUnlockedAchievements().then(async (unlocked) => {
        if (stats) {
          const newUnlocked = new Set(unlocked);
          for (const check of achievementChecks) {
            if (!unlocked.has(check.id) && check.condition({
              caught: stats.caught ?? 0,
              alpha: stats.alpha ?? 0,
              shiny: stats.shiny ?? 0,
              totalPokemon: stats.totalPokemon ?? 242,
            })) {
              newUnlocked.add(check.id);
            }
          }
          if (newUnlocked.size > unlocked.size) {
            await saveUnlockedAchievements(newUnlocked);
          }
        }
      });
      return;
    }

    // Only check if stats actually changed
    if (previousStatsRef.current?.caught !== stats?.caught ||
        previousStatsRef.current?.alpha !== stats?.alpha ||
        previousStatsRef.current?.shiny !== stats?.shiny) {
      checkAchievements();
    }

    previousStatsRef.current = stats;
  }, [stats, checkAchievements]);
}

export function useUnlockedAchievements(): Set<string> {
  const stats = useLivingDexStats();
  
  // Calculate currently unlocked achievements
  const unlocked = new Set<string>();
  
  if (stats) {
    for (const check of achievementChecks) {
      if (check.condition({
        caught: stats.caught ?? 0,
        alpha: stats.alpha ?? 0,
        shiny: stats.shiny ?? 0,
        totalPokemon: stats.totalPokemon ?? 242,
      })) {
        unlocked.add(check.id);
      }
    }
  }
  
  return unlocked;
}
