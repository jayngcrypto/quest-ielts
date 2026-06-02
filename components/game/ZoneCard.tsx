import { cn } from "@/lib/utils";
import { ZONE_CONFIG } from "@/lib/tokens";
import { VocabIllo, ListenIllo, ReadIllo, WriteIllo, SpeakIllo, CastleIllo } from "./ZoneIllos";

type ZoneId = keyof typeof ZONE_CONFIG;

const ILLOS: Record<ZoneId, React.FC<{ size?: number }>> = {
  vocabulary: VocabIllo,
  listening:  ListenIllo,
  reading:    ReadIllo,
  writing:    WriteIllo,
  speaking:   SpeakIllo,
  castle:     CastleIllo,
};

interface ZoneCardProps {
  zoneId: ZoneId;
  progress?: number;
  level?: number;
  locked?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ZoneCard({
  zoneId, progress = 0, level = 1, locked, active, onClick, className
}: ZoneCardProps) {
  const z = ZONE_CONFIG[zoneId];
  const Illo = ILLOS[zoneId];

  return (
    <div
      onClick={!locked ? onClick : undefined}
      className={cn(
        "rounded-3xl border-[2.5px] p-4 text-center relative overflow-hidden transition-transform duration-150",
        !locked && "cursor-pointer hover:-translate-y-1",
        locked && "opacity-55",
        className
      )}
      style={{ background: z.bg, borderColor: z.border }}
    >
      {active && (
        <div className="absolute top-[-8px] right-[-8px] w-6 h-6 bg-q-amber border-2 border-q-amber-d rounded-full flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden>
            <polygon points="7,1 8.8,5.2 13.5,5.4 10,8.4 11.1,13 7,10.5 2.9,13 4,8.4 0.5,5.4 5.2,5.2" fill="#FFF" stroke="#B45309" strokeWidth=".8"/>
          </svg>
        </div>
      )}

      <div className="flex justify-center mb-2">
        <Illo size={56} />
      </div>

      <div className="text-sm font-extrabold leading-snug" style={{ color: z.colorD }}>
        {z.name}
      </div>
      <div className="text-xs font-bold mt-0.5 opacity-75" style={{ color: z.colorD }}>
        {z.skill}
      </div>

      {!locked ? (
        <>
          <div
            className="w-full h-1.5 rounded-pill overflow-hidden mt-2 border border-current opacity-30"
            style={{ background: z.border }}
          >
            <div
              className="h-full rounded-pill transition-all duration-700"
              style={{ width: `${progress}%`, background: z.color }}
            />
          </div>
          <div className="text-[10px] font-extrabold mt-1.5 opacity-80" style={{ color: z.colorD }}>
            Lv.{level} · {progress}%
          </div>
        </>
      ) : (
        <div
          className="inline-flex items-center gap-1 rounded-pill px-2.5 py-1 mt-2 text-[10px] font-extrabold border-2"
          style={{ background: z.bg, borderColor: z.border, color: z.colorD }}
        >
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="3" y="6" width="8" height="7" rx="1.5"/>
            <path d="M5 6V4.5C5 3.1 5.9 2 7 2C8.1 2 9 3.1 9 4.5V6"/>
          </svg>
          Chưa mở
        </div>
      )}
    </div>
  );
}
