import { useEffect, useCallback } from "react";

const useSpeech = (text: string, autoPlay = true) => {
  const speak = useCallback((override?: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(override ?? text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang.startsWith("pt"));
    if (ptVoice) utterance.voice = ptVoice;

    window.speechSynthesis.speak(utterance);
  }, [text]);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(() => speak(), 400);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [speak, autoPlay, stop]);

  return { speak, stop };
};

export default useSpeech;
