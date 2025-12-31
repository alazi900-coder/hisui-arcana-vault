import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIChat } from './AIChat';

interface AIChatButtonProps {
  context?: {
    currentPokemon?: { name: string; types: string[] };
    team?: { name: string; types: string[] }[];
  };
}

export function AIChatButton({ context }: AIChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
      <AIChat isOpen={isOpen} onClose={() => setIsOpen(false)} context={context} />
    </>
  );
}
