import type { History } from "../services/types";
import { formatTimestamp } from "../utils/DateTime";
import AudioPlayer from "./AudioPlayer";

interface HistoryItemProps {
  history: History;
  localAudioUrl?: string;
}

export default function HistoryItem({ history }: HistoryItemProps) {
  return (
    <div className="bg-white rounded-3xl p-5 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-4 mx-4">
      {/* Waveform Player */}
      <AudioPlayer
        audioUrl={history.audioFile}
      />

      {/* Transcription Text */}
      <p className="text-[#2D3139] text-[15px] leading-relaxed font-normal text-left px-1">
        {history.transcript}
      </p>

      {/* Timestamp */}
      <span className="text-[11px] text-slate-400 text-right font-medium self-end px-1">
        {formatTimestamp(history.createdAt)}
      </span>
    </div>
  );
}