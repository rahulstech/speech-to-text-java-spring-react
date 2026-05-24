import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Waveform from "./Waveform";

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load duration if cached/available
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && audio.duration !== Infinity && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (audio.duration && audio.duration !== Infinity && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    // If metadata is already loaded
    if (audio.readyState >= 1 && audio.duration && audio.duration !== Infinity && !isNaN(audio.duration)) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.warn("Playback failed or interrupted:", err);
      });
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration || duration === Infinity) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = clickX / width;
    const newTime = clickPercentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return "00:00:00";
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
      />

      {/* Audio Waveform Player Bar */}
      <div className="bg-[#F3F4F6] rounded-full py-2.5 px-5 flex items-center justify-between gap-4 border border-slate-100 select-none">
        {/* Playback time */}
        <span className="text-xs font-mono text-slate-500 font-semibold min-w-[55px]">
          {formatTime(isPlaying ? currentTime : duration || 0)}
        </span>

        {/* Waveform Visualization Container */}
        <div className="hidden min-[450px]:flex flex-1 items-center justify-center h-7">
          <Waveform
            progress={progress}
            onClick={handleWaveformClick}
          />
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center rounded-full active:scale-95 transition-transform duration-100 focus:outline-none"
        >
          {isPlaying ? (
            <Icon src="/icons/media_pause.svg" className="w-5 h-5" colorClass="bg-[#F5A623]" />
          ) : (
            <Icon src="/icons/media_play.svg" className="w-5 h-5 translate-x-px" colorClass="bg-[#F5A623]" />
          )}
        </button>
      </div>
    </>
  );
}
