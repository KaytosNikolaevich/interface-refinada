// Stub: tables (user_progress, user_achievements) ainda não foram criadas no Cloud.
// Quando o schema for criado, restaurar as chamadas reais ao supabase.

export const saveExerciseResult = async (
  _exerciseId: string,
  _isCorrect: boolean,
  _timeSpent: number
) => {
  // no-op
};

export const getAchievements = async () => {
  return [] as any[];
};

export const getProgressSummary = async () => {
  return { totalScore: 0, completedLessons: 0, streak: 0, todayStars: 0 };
};
