import { useEffect, useState } from "react";
import { useAudioRecorder } from "../hooks/AudioRecorderHooks";
import { useTranscribeAudio } from "../hooks/APIHooks";
import Icon from "./Icon";
import AudioUploader, { type AudioUploadData } from "./AudioUploader";
import { type AudioStorageData } from "../storage/Firebase";
import type { History } from "../services/types";

interface AudioInputBarProps {
  onTranscribeSuccess?: (newHistory: History) => void;
  onTranscribeStart: () => void;
  onTranscribeEnd: () => void;
}


export default function AudioInputBar({
  onTranscribeSuccess,
  onTranscribeStart,
  onTranscribeEnd,
}: AudioInputBarProps) {
  const transcribeMutation = useTranscribeAudio();
  const [language, setLanguage] = useState("detect");
  const [audioInputError, setAudioInputError] = useState<string | null>(null);

  // Sync mutation pending state to parent
  useEffect(() => {
    if (transcribeMutation.isPending) {
      onTranscribeStart();
      setAudioInputError(null);
    } else {
      onTranscribeEnd();
    }
  }, [transcribeMutation.isPending]);

  function handleTranscribe(data: AudioStorageData) {
    if (!data.blob) {
      return;
    }

    const selectedLanguage = language === "detect" ? null : language;
    transcribeMutation.mutateAsync({
      data,
      lang: selectedLanguage,
    })
    .then((newHistory) => {
      onTranscribeSuccess?.(newHistory);
    })
    .catch((error) => setAudioInputError(error));
  }

  const {
    isRecording,
    ellapsedSeconds,
    isError,
    error,
    startRecording,
    stopRecording,
  } = useAudioRecorder({
    async onStop(output): Promise<void> {
      handleTranscribe(output);
    },
  });

  const handleRecordToggle = () => {
    setAudioInputError(null);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleUpload = async (data: AudioUploadData) => {
    setAudioInputError(null);
    handleTranscribe(data);
  };

  const handleValidationError = (errorMsg: string) => {
    setAudioInputError(errorMsg);
  };

  const formatRecordTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] w-full shrink-0 z-10">
      <div className="max-w-[900px] mx-auto py-4 px-6 flex items-center justify-end gap-3 w-full">
        {/* Pill Container (Shown when recording, or if there's a recorder error or validation error) */}
        {(isRecording || isError || audioInputError) && (
          <div className="flex-1 rounded-full py-3 px-5 flex items-center justify-between gap-3 border bg-red-50 border-red-200 h-12 transition-all">
            {/* Status Text */}
            <span className="text-sm font-semibold text-red-700 pr-2 truncate">
              {isRecording 
                ? `Recording: ${formatRecordTime(ellapsedSeconds)}` 
                : (audioInputError || error?.message || "unknonwn error")}
            </span>
            {audioInputError && (
              <button 
                onClick={() => setAudioInputError(null)}
                className="text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 rounded-xl hover:bg-red-100 transition-colors text-xs flex items-center justify-center"
                title="Clear error"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="detect">Detect Language</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>

          {/* Audio Uploader */}
          <AudioUploader
            onUpload={handleUpload}
            onValidationError={handleValidationError}
          />

          {/* Mic / Stop Button */}
          <button
            onClick={handleRecordToggle}
            title={isRecording ? "Stop Recording" : "Record Audio"}
            className="text-slate-500 hover:text-slate-700 p-2.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all focus:outline-none flex items-center justify-center relative group"
          >
            {isRecording ? (
              <Icon src="/icons/record_stop.svg" className="w-6 h-6" colorClass="bg-red-600" />
            ) : (
              <Icon src="/icons/mic.svg" className="w-6 h-6" colorClass="bg-slate-500" />
            )}
            <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50">
              {isRecording ? "Stop Recording" : "Record Audio"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
