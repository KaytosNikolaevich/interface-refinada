import { supabase } from "@/integrations/supabase/client";

export const saveExerciseResult = async (
  childId: string,
  exerciseId: string,
  isCorrect: boolean,
  _timeSpent: number
) => {
  if (!childId || !exerciseId) {
    console.warn("saveExerciseResult: childId ou exerciseId ausente, operação cancelada.");
    return;
  }
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: childId,
      lesson_id: exerciseId,
      completed: isCorrect,
      score: isCorrect ? 1 : 0,
      last_access: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );
  if (error) console.error("Erro ao salvar resultado:", error);
};

export const getAchievements = async (childId: string) => {
  const { data, error } = await supabase
    .from("user_achievements")
    .select("*, achievements(*)")
    .eq("user_id", childId);
  if (error) console.error("Erro ao obter conquistas:", error);
  return data ?? [];
};

export const getProgressSummary = async (childId: string) => {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", childId);

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
