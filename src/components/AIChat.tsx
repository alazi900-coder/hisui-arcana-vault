import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { classifyAiError, parseSseChunk } from '@/lib/ai';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  context?: {
    currentPokemon?: { name: string; types: string[] };
    team?: { name: string; types: string[] }[];
  };
}

const SUGGESTED_QUESTIONS_AR = [
  'ما هو أفضل فريق ضد Alpha Pokémon؟',
  'كيف أطور Eevee إلى Leafeon؟',
  'ما الذي يهزم Garchomp؟',
  'أين أجد Pichu؟',
];

const SUGGESTED_QUESTIONS_EN = [
  'What is the best team against Alpha Pokémon?',
  'How do I evolve Eevee into Leafeon?',
  'What beats Garchomp?',
  'Where can I find Pichu?',
];

export function AIChat({ isOpen, onClose, context }: AIChatProps) {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const suggested = lang === 'ar' ? SUGGESTED_QUESTIONS_AR : SUGGESTED_QUESTIONS_EN;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pokemon-ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content,
            })),
            context,
          }),
        }
      );

      if (!response.ok) {
        let bodyText = '';
        try { bodyText = await response.text(); } catch { /* ignore */ }
        const cls = classifyAiError(response.status, bodyText);
        throw new Error(lang === 'ar' ? cls.text_ar : cls.text_en);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response stream');

      // Add empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      let buffer = '';
      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const parsed = parseSseChunk(buffer, chunk);
        buffer = parsed.leftover;
        streamDone = parsed.done;
        if (parsed.delta) {
          assistantContent += parsed.delta;
          setMessages(prev => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (updated[lastIdx]?.role === 'assistant') {
              updated[lastIdx] = { ...updated[lastIdx], content: assistantContent };
            }
            return updated;
          });
        }
      }

    } catch (error) {
      console.error('AI Chat error:', error);
      toast({
        title: t('خطأ', 'Error'),
        description: error instanceof Error ? error.message : t('حدث خطأ غير متوقع', 'An unexpected error occurred'),
        variant: 'destructive',
      });
      // Remove the empty assistant message on error
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-lg h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t('مساعد البوكيمون الذكي', 'Pokémon AI Assistant')}</h3>
              <p className="text-xs text-muted-foreground">{t('اسألني أي شيء عن Hisui!', 'Ask me anything about Hisui!')}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('مرحباً! أنا مساعدك الذكي للبوكيمون.', 'Hi! I am your Pokémon AI assistant.')}</p>
                <p className="text-sm">{t('اسألني عن الأنواع، الفرق، التطور، أو أي شيء!', 'Ask me about types, teams, evolutions — anything!')}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{t('أسئلة مقترحة:', 'Suggested questions:')}</p>
                <div className="flex flex-wrap gap-2">
                  {suggested.map((q, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`p-2 rounded-full shrink-0 ${
                    msg.role === 'user' ? 'bg-primary' : 'bg-muted'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content || '...'}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl px-4 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('اكتب سؤالك هنا...', 'Type your question here...')}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
