
const BAR_HEIGHTS = Array.from({ length: 28 }, (_, idx) => {
    const seed = (idx * 7) % 19;
    return 6 + (seed % 3) * 6 + (idx % 2 === 0 ? 4 : 0); // ranges from 6px to 22px
  })

interface WaveformProps {
  progress?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Waveform({ progress, onClick }: WaveformProps = {}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-[3px] h-full cursor-pointer"
    >
      {BAR_HEIGHTS.map((h, i) => {
        const isPlayed = i / BAR_HEIGHTS.length < (progress ?? 0);
        return (
          <div
            key={i}
            className="w-[3px] rounded-full waveform-bar transition-all duration-200"
            style={{
              height: `${h}px`,
              backgroundColor: isPlayed ? "#F5A623" : "#D1D5DB",
            }}
          />
        );
      })}
    </div>
  );
}
