import { useRef, useEffect, useState } from "react";
import { useAudioRecorder } from "../hooks/AudioRecorderHooks";
import { useTranscribeAudio } from "../hooks/APIHooks";
import Icon from "./Icon";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_AUDIO_EXTENSIONS = [".mp3", ".m4a", ".webm", ".wav", ".aac", ".ogg", ".flac"];
const ALLOWED_AUDIO_MIMETYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/webm",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/aac",
  "audio/x-aac",
  "audio/ogg",
  "application/ogg",
  "audio/flac",
  "audio/x-flac"
];

interface AudioInputBarProps {
  onTranscribeSuccess: (id: number, localUrl: string) => void;
  onTranscribeStart: () => void;
  onTranscribeEnd: () => void;
}


export default function AudioInputBar({
  onTranscribeSuccess,
  onTranscribeStart,
  onTranscribeEnd,
}: AudioInputBarProps) {
  const transcribeMutation = useTranscribeAudio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [language, setLanguage] = useState("detect");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync mutation pending state to parent
  useEffect(() => {
    if (transcribeMutation.isPending) {
      onTranscribeStart();
      setValidationError(null);
    } else {
      onTranscribeEnd();
    }
  }, [transcribeMutation.isPending]);

  function handleTranscribe(audioUrl: string) {
    const selectedLanguage = language === "detect" ? null : language;
    transcribeMutation.mutate({
      audioUrl,
      lang: selectedLanguage,
    }, {
      onSuccess(newHistory) {
        onTranscribeSuccess(newHistory.id, newHistory.audioFile);
      },

      onError(error) {
        console.error("Transcription failed:", error);
      },
    });
  };

  const {
    isRecording,
    ellapsedSeconds,
    isError,
    error,
    startRecording,
    stopRecording,
  } = useAudioRecorder({
    stream: false,
    async onStop(output): Promise<void> {
      if (output.audioRecordUrl) {
        const sampleFirebaseUrl = "/audio.mp3"; // TODO: change with uploaded firebase url
        handleTranscribe(sampleFirebaseUrl);
      }
    },
  });

  const handleRecordToggle = () => {
    setValidationError(null);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      const isTypeValid = ALLOWED_AUDIO_MIMETYPES.includes(file.type) || ALLOWED_AUDIO_EXTENSIONS.includes(fileExtension);

      if (!isTypeValid) {
        setValidationError("Unsupported file type. Please upload MP3, M4A, WEBM, WAV, AAC, OGG, or FLAC.");
        e.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setValidationError("File is too large. Maximum size allowed is 100MB.");
        e.target.value = "";
        return;
      }

      const sampleFirebaseUrl = "/audio.mp3"; // TODO: change with upload firease url
      handleTranscribe(sampleFirebaseUrl);
      e.target.value = "";
    }
  };

  const formatRecordTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] w-full shrink-0 z-10">
      <div className="max-w-[900px] mx-auto py-4 px-6 flex items-center justify-end gap-3 w-full">
        {/* Hidden File Input for Audio Selection */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a,audio/webm,audio/wav,audio/x-wav,audio/wave,audio/aac,audio/x-aac,audio/ogg,application/ogg,audio/flac,audio/x-flac,.mp3,.m4a,.webm,.wav,.aac,.ogg,.flac"
          className="hidden"
        />

        {/* Pill Container (Shown when recording, or if there's a recorder error or validation error) */}
        {(isRecording || isError || validationError) && (
          <div className="flex-1 rounded-full py-3 px-5 flex items-center justify-between gap-3 border bg-red-50 border-red-200 h-12 transition-all">
            {/* Status Text */}
            <span className="text-sm font-semibold text-red-700 pr-2 truncate">
              {isRecording 
                ? `Recording: ${formatRecordTime(ellapsedSeconds)}` 
                : (validationError || error?.message || "Microphone error")}
            </span>
            {validationError && (
              <button 
                onClick={() => setValidationError(null)}
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

          {/* Attachment Button */}
          <button
            onClick={handleAttachmentClick}
            title="Add Audio File"
            className="text-slate-500 hover:text-slate-700 p-2.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all focus:outline-none flex items-center justify-center relative group"
          >
            <Icon src="/icons/attachment.svg" className="w-6 h-6" colorClass="bg-slate-500" />
            <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50">
              Add Audio File
            </span>
          </button>

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
