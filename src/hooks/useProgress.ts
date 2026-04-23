import { supabase } from "@/integrations/supabase/client";

const getAuthUserId = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    console.warn("useProgress: usuário não autenticado.");
    return null;
  }
  return data.user.id;
};

export const saveExerciseResult = async (
  exerciseId: string,
  isCorrect: boolean,
  _timeSpent: number
) => {
  const userId = await getAuthUserId();
  if (!userId || !exerciseId) {
    console.warn("saveExerciseResult: sessão ou exerciseId ausente, operação cancelada.");
    return;
  }
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      lesson_id: exerciseId,
      completed: isCorrect,
      score: isCorrect ? 1 : 0,
      last_access: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );
  if (error) console.error("Erro ao salvar resultado:", error);
};

export const getAchievements = async () => {
  const userId = await getAuthUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from("user_achievements")
    .select("*, achievements(*)")
    .eq("user_id", userId);
  if (error) console.error("Erro ao obter conquistas:", error);
  return data ?? [];
};

export const getProgressSummary = async () => {
  const userId = await getAuthUserId();
  if (!userId) return { totalScore: 0, completedLessons: 0, streak: 0, todayStars: 0 };

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) console.error("Erro ao obter progresso:", error);

  const progress = data ?? [];
  const totalScore = progress.reduce((sum, p) => sum + (p.score || 0), 0);
  const completedLessons = progress.filter((p) => p.completed).length;

  const today = new Date().toISOString().split("T")[0];
  const todayStars = progress
    .filter((p) => p.last_access?.startsWith(today))
    .reduce((sum, p) => sum + (p.score || 0), 0);

  return { totalScore, completedLessons, streak: 1, todayStars };
};
