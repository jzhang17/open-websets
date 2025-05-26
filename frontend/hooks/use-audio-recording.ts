import { useEffect, useRef, useState } from "react";

import { recordAudio } from "@/lib/audio-utils";

interface UseAudioRecordingOptions {
  transcribeAudio?: (blob: Blob) => Promise<string>;
  onTranscriptionComplete?: (text: string) => void;
}

export function useAudioRecording({
  transcribeAudio,
  onTranscriptionComplete,
}: UseAudioRecordingOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(!!transcribeAudio);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const activeRecordingRef = useRef<Promise<Blob> | null>(null);

  useEffect(() => {
    const checkSpeechSupport = async () => {
      const hasMediaDevices = !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      );
      setIsSpeechSupported(hasMediaDevices && !!transcribeAudio);
    };

    checkSpeechSupport();
  }, [transcribeAudio]);

  const stopRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(true);
    try {
      // Stop the recorder and fetch the audio
      recordAudio.stop();
      const recording = activeRecordingRef.current
        ? await activeRecordingRef.current
        : null;
      if (recording && transcribeAudio) {
        const text = await transcribeAudio(recording);
        onTranscriptionComplete?.(text);
      }
    } catch (error) {
      // Error transcribing audio
    } finally {
      setIsTranscribing(false);
      setIsListening(false);
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }
      activeRecordingRef.current = null;
    }
  };

  const toggleListening = async () => {
    if (!isListening) {
      try {
        setIsListening(true);
        setIsRecording(true);
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(stream);

        // Begin recording
        activeRecordingRef.current = recordAudio(stream);
      } catch (error) {
        // Error recording audio
        setIsListening(false);
        setIsRecording(false);
        if (audioStream) {
          audioStream.getTracks().forEach((track) => track.stop());
          setAudioStream(null);
        }
      }
    } else {
      await stopRecording();
    }
  };

  return {
    isListening,
    isSpeechSupported,
    isRecording,
    isTranscribing,
    audioStream,
    toggleListening,
    stopRecording,
  };
}
