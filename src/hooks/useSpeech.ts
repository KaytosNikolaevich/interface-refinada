import { useEffect, useCallback, useRef } from "react";

let cachedVoices: SpeechSynthesisVoice[] = [];

function getPortugueseVoice(): Promise<SpeechSynthesisVoice | undefined> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices.find((v) => v.lang.startsWith("pt")));
      return;
    }
    const handler = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices.find((v) => v.lang.startsWith("pt")));
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
  });
}

const useSpeech = (text: string, autoPlay = true) => {
  const isMounted = useRef(true);

  const speak = useCallback(async (override?: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(override ?? text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const ptVoice = await getPortugueseVoice();
    if (!isMounted.current) return;
    if (ptVoice) utterance.voice = ptVoice;

    window.speechSynthesis.speak(utterance);
  }, [text]);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    isMounted.current = true;
    if (!autoPlay) return;
    const timer = setTimeout(() => speak(), 400);
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
      stop();
    };
  }, [speak, autoPlay, stop]);

  return { speak, stop };
};

export default useSpeech;
