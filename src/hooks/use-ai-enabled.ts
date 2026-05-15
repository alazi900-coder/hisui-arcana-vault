import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/lib/db';

/**
 * Reads the user's AI-features toggle from settings. AI is on by default;
 * users can disable from /settings if they don't have an API key configured
 * or don't want to spend credit.
 */
export function useAiEnabled() {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSettings().then(s => {
      if (cancelled) return;
      setEnabled(s.aiEnabled !== false);
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  const setAiEnabled = async (next: boolean) => {
    setEnabled(next);
    await updateSettings({ aiEnabled: next });
  };

  return { aiEnabled: enabled, loaded, setAiEnabled };
}
