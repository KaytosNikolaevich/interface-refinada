import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

/**
 * Garante uma sessão Supabase. Se não existir, cria uma sessão anônima
 * (apropriada para crianças que usam o app sem cadastro com email).
 * Toda operação no banco deve usar auth.uid(), nunca um id vindo do cliente.
 */
export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
    });

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      if (data.session) {
        setSession(data.session);
        setLoading(false);
        return;
      }

      const { data: anon, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error("Falha ao iniciar sessão anônima:", error);
      } else {
        setSession(anon.session);
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, loading, userId: session?.user.id ?? null };
};

export default useAuthSession;
