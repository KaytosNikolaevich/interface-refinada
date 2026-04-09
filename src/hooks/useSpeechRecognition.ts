import { useState, useCallback, useRef } from "react";

interface UseSpeechRecognitionOptions {
  lang?: string;
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
}

const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const { lang = "pt-BR", onResult, onEnd } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
      if (event.results[0]?.isFinal) {
        onResult?.(finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, lang, onResult, onEnd]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
  };
};

export default useSpeechRecognition;
