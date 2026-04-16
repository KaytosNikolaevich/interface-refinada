import { useEffect, useCallback, useRef } from "react";

let cachedVoices: SpeechSynthesisVoice[] = [];

function pickPt(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  // Prioridade: pt-BR exato > qualquer pt-BR (case-insensitive) > qualquer pt
  return (
    voices.find((v) => v.lang === "pt-BR") ||
    voices.find((v) => v.lang.toLowerCase() === "pt-br") ||
    voices.find((v) => v.lang.toLowerCase().startsWith("pt-br")) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("pt"))
  );
}

function getPortugueseVoice(): Promise<SpeechSynthesisVoice | undefined> {
  return new Promise((resolve) => {
    if (cachedVoices.length > 0) {
      resolve(pickPt(cachedVoices));
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(pickPt(voices));
      return;
    }
    const handler = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(pickPt(cachedVoices));
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Fallback timeout: alguns browsers nunca disparam voiceschanged
    setTimeout(() => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        cachedVoices = v;
        resolve(pickPt(v));
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
      } else {
        resolve(undefined);
      }
    }, 1000);
  });
}

// Pré-carrega vozes assim que o módulo é importado
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const preload = () => {
    const v = window.speechSynthesis.getVoices();
    if (v.length > 0) cachedVoices = v;
  };
  preload();
  window.speechSynthesis.addEventListener?.("voiceschanged", preload);
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
