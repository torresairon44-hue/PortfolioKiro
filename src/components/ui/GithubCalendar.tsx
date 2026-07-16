"use client";

import { memo, useMemo, useState, useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";
import { useGithubContributions } from "@/hooks/useGithubContributions";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ContributionLevel = 0 | 1 | 2 | 3 | 4;
export type ContributionData = {
  [date: string]: {
    level: ContributionLevel;
    label?: string;
    count?: number;
  };
};
export type ThemeColors = {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
};
export type CellShape = "rounded" | "circle";

// ─── Interface Segregation ────────────────────────────────────────────────────
// Split into two focused interfaces so consumers only depend on what they need.
//
// GithubCalendarDisplayProps — pure display, no fetching.
//   Use this when you already have ContributionData and just want to render it.
//
// GithubCalendarProps — extends display with optional username for auto-fetching.
//   Use this when you want the component to fetch data by GitHub username.

export type GithubCalendarDisplayProps = {
  /** Pre-loaded contribution data. If provided, username fetch is skipped. */
  data?: ContributionData;
  startDate?: string;
  endDate?: string;
  startsOnSunday?: boolean;
  cellSize?: number;
  cellGap?: number;
  cellShape?: CellShape;
  theme?: "github" | ThemeColors;
  showMonthLabels?: boolean;
  showStats?: boolean;
  showLegend?: boolean;
  className?: string;
};

export type GithubCalendarProps = GithubCalendarDisplayProps & {
  /** GitHub username to fetch contribution data for. Optional if data is provided directly. */
  username?: string;
};

// ─── Built-in themes ──────────────────────────────────────────────────────────
const THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#ebedf0",
    level1: "#9be9a8",
    level2: "#40c463",
    level3: "#30a14e",
    level4: "#216e39",
  },
};
const DARK_THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#161b22",
    level1: "#0e4429",
    level2: "#006d32",
    level3: "#26a641",
    level4: "#39d353",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FULL_MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
function formatTooltipDate(dateStr: string): string {
  try {
    const date = parseDate(dateStr);
    const month = FULL_MONTH_NAMES[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}${getOrdinalSuffix(day)}`;
  } catch { return dateStr; }
}

// ─── API fetch ────────────────────────────────────────────────────────────────
// Moved to src/hooks/useGithubContributions.ts (Dependency Inversion principle).
// The component no longer owns the data-fetching concern — it just uses the hook.

// ─── Build calendar grid ──────────────────────────────────────────────────────
function buildGrid(startDate: string, endDate: string, startsOnSunday: boolean) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const startDay = startsOnSunday ? 0 : 1;
  const startDow = start.getDay();
  const offset = (startDow - startDay + 7) % 7;
  const gridStart = addDays(start, -offset);
  const weeks: (string | null)[][] = [];
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let current = new Date(gridStart);
  let weekIndex = 0;
  let lastMonth = -1;
  while (current <= end || (weeks.length > 0 && (weeks[weeks.length - 1]?.length ?? 0) < 7)) {
    const week: (string | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = formatDate(current);
      const isInRange = current >= start && current <= end;
      week.push(isInRange ? dateStr : null);
      if (isInRange && current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth();
        monthLabels.push({ label: MONTH_NAMES[current.getMonth()]!, weekIndex });
      }
      current = addDays(current, 1);
    }
    weeks.push(week);
    weekIndex++;
    if (current > end && weeks.length > 0 && (weeks[weeks.length - 1]?.every((d) => d === null || parseDate(d) > end) ?? false)) break;
  }
  return { weeks, monthLabels, gridStart: formatDate(gridStart) };
}

type TooltipState = { visible: boolean; date: string; count: number | undefined; label: string | undefined; x: number; y: number };

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function CalendarSkeleton({ cellSize = 12, cellGap = 3, className }: { cellSize?: number; cellGap?: number; className?: string }) {
  const step = cellSize + cellGap;
  const weeks = 53;
  const days = 7;
  return (
    <div className={cn("w-fit mx-auto space-y-3 animate-pulse", className)}>
      <div className="flex gap-6">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="h-4 w-20 rounded bg-white/10" />
        <div className="h-4 w-24 rounded bg-white/10" />
      </div>
      <div className="overflow-x-auto">
        <svg width={weeks * step - cellGap} height={16 + days * step - cellGap} className="overflow-visible">
          {Array.from({ length: weeks }).map((_, wi) =>
            Array.from({ length: days }).map((_, di) => (
              <rect key={`${wi}-${di}`} x={wi * step} y={16 + di * step} width={cellSize} height={cellSize} rx={cellSize * 0.2} fill="rgba(255,255,255,0.08)" />
            ))
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export const GithubCalendar = memo(function GithubCalendar({
  username,
  data: dataProp,
  startDate,
  endDate,
  startsOnSunday = true,
  cellSize = 12,
  cellGap = 3,
  cellShape = "rounded",
  theme = "github",
  showMonthLabels = true,
  showStats = true,
  showLegend = true,
  className,
}: GithubCalendarProps) {
  const id = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(true);
  const [gameActive, setGameActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark") ||
        document.documentElement.style.colorScheme === "dark"
      );
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const [fetchedData, setFetchedData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(!!username);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch contributions via the custom hook (data-fetching separated from UI)
  const { data: hookedData, loading: hookLoading, error: hookError } = useGithubContributions(username);

  useEffect(() => {
    setFetchedData(hookedData);
    setLoading(hookLoading);
    setFetchError(hookError);
  }, [hookedData, hookLoading, hookError]);

  const data: ContributionData = dataProp ?? fetchedData ?? {};

  const resolvedEnd = endDate ?? formatDate(new Date());
  const resolvedStart = useMemo(() => {
    if (startDate) return startDate;
    const d = parseDate(resolvedEnd);
    d.setFullYear(d.getFullYear() - 1);
    d.setDate(d.getDate() + 1);
    return formatDate(d);
  }, [startDate, resolvedEnd]);

  const activeColors = useMemo(() => {
    if (typeof theme === "object") return theme;
    return isDark ? DARK_THEMES.github : THEMES.github;
  }, [theme, isDark]);

  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, date: "", count: undefined, label: undefined, x: 0, y: 0 });

  const { weeks, monthLabels, gridStart } = useMemo(
    () => buildGrid(resolvedStart, resolvedEnd, startsOnSunday),
    [resolvedStart, resolvedEnd, startsOnSunday]
  );

  const stats = useMemo(() => {
    const entries = Object.entries(data);
    const total = entries.reduce((sum, [, v]) => sum + (v.count ?? (v.level > 0 ? 1 : 0)), 0);
    const activeDays = entries.filter(([, v]) => v.level > 0).length;
    const maxStreak = (() => {
      let max = 0, cur = 0;
      const sorted = entries.filter(([, v]) => v.level > 0).map(([d]) => d).sort();
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) { cur = 1; max = 1; continue; }
        const prev = parseDate(sorted[i - 1]!);
        const curr = parseDate(sorted[i]!);
        const diff = (curr.getTime() - prev.getTime()) / 86400000;
        if (diff === 1) { cur++; max = Math.max(max, cur); } else cur = 1;
      }
      return max;
    })();
    return { total, activeDays, maxStreak };
  }, [data]);

  const step = cellSize + cellGap;
  const monthLabelHeight = showMonthLabels && !gameActive ? 20 : 0;
  const svgWidth = weeks.length * step - cellGap;
  const svgHeight = monthLabelHeight + 7 * step - cellGap;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [fetchedData, dataProp]);

  // ── Game loop ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!gameActive) {
      weeks.forEach((week) => {
        week.forEach((date) => {
          if (!date) return;
          const rect = document.getElementById(`cell-${id}-${date}`);
          if (rect) {
            rect.style.opacity = "1";
            rect.style.pointerEvents = "auto";
            const originalLevel = data[date]?.level ?? 0;
            rect.setAttribute("fill", activeColors[`level${originalLevel}` as keyof ThemeColors] || activeColors.level0);
          }
        });
      });
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    const width = svgWidth;
    const height = svgHeight + 80;
    canvas.width = width;
    canvas.height = height;

    const cellLevels = new Map<string, number>();
    weeks.forEach((week) => {
      week.forEach((date) => {
        if (!date) return;
        const initialLevel = data[date]?.level ?? 0;
        cellLevels.set(date, initialLevel);
        const rect = document.getElementById(`cell-${id}-${date}`);
        if (rect) {
          rect.style.opacity = initialLevel === 0 ? "0" : "1";
          rect.style.pointerEvents = initialLevel === 0 ? "none" : "auto";
        }
      });
    });

    const player = { x: width / 2 - 15, y: height - 25, width: 30, height: 20, speed: 4, direction: 1, color: "#38bdf8" };
    type Bullet = { x: number; y: number; vy: number; width: number; height: number; color: string };
    type Particle = { x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number; life: number; maxLife: number };
    let bullets: Bullet[] = [];
    let lastShot = 0;
    const stars = Array.from({ length: 140 }).map(() => ({ x: Math.random() * width, y: Math.random() * height, speed: Math.random() * 0.4 + 0.1, size: Math.random() * 1.2 + 0.5, alpha: Math.random() * 0.5 + 0.1 }));
    let particles: Particle[] = [];

    const explode = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1.2;
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color, size: Math.random() * 2 + 1, alpha: 1, life: 0, maxLife: Math.random() * 15 + 15 });
      }
    };

    const update = () => {
      let minWi = -1, maxWi = -1;
      weeks.forEach((week, wi) => { week.forEach((date) => { if (!date) return; if ((cellLevels.get(date) ?? 0) > 0) { if (minWi === -1) minWi = wi; minWi = Math.min(minWi, wi); maxWi = Math.max(maxWi, wi); } }); });
      const minX = minWi !== -1 ? minWi * step : 0;
      const maxX = maxWi !== -1 ? Math.max(minX, Math.min(width - player.width, (maxWi + 1) * step - player.width)) : width - player.width;
      player.x = Math.max(minX, Math.min(maxX, player.x));
      player.x += player.speed * player.direction;
      if (player.x >= maxX) { player.x = maxX; player.direction = -1; } else if (player.x <= minX) { player.x = minX; player.direction = 1; }
      const now = Date.now();
      if (now - lastShot >= 140) { bullets.push({ x: player.x + player.width / 2 - 1.5, y: player.y - 4, vy: -6, width: 3, height: 8, color: "#fbbf24" }); lastShot = now; }
      let anyActive = false;
      cellLevels.forEach((level) => { if (level > 0) anyActive = true; });
      if (!anyActive) {
        weeks.forEach((week) => { week.forEach((date) => { if (!date) return; const orig = data[date]?.level ?? 0; cellLevels.set(date, orig); const rect = document.getElementById(`cell-${id}-${date}`); if (rect) { rect.setAttribute("fill", activeColors[`level${orig}` as keyof ThemeColors] || activeColors.level0); rect.style.opacity = orig === 0 ? "0" : "1"; rect.style.pointerEvents = orig === 0 ? "none" : "auto"; } }); });
      }
      stars.forEach((s) => { s.y += s.speed; if (s.y > height) { s.y = 0; s.x = Math.random() * width; } });
      bullets = bullets.filter((b) => { b.y += b.vy; return b.y > 0; });
      particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life++; p.alpha = 1 - p.life / p.maxLife; });
      particles = particles.filter((p) => p.life < p.maxLife);
      bullets.forEach((bullet, bi) => {
        weeks.forEach((week, wi) => { week.forEach((date, di) => { if (!date) return; const currentLevel = cellLevels.get(date) ?? 0; if (currentLevel === 0) return; const cellX = wi * step, cellY = monthLabelHeight + di * step; if (bullet.x < cellX + cellSize && bullet.x + bullet.width > cellX && bullet.y < cellY + cellSize && bullet.y + bullet.height > cellY) { bullets.splice(bi, 1); const newLevel = currentLevel - 1; cellLevels.set(date, newLevel); const rect = document.getElementById(`cell-${id}-${date}`); if (rect) { if (newLevel === 0) { rect.style.opacity = "0"; rect.style.pointerEvents = "none"; } else { rect.setAttribute("fill", activeColors[`level${newLevel}` as keyof ThemeColors] || activeColors.level0); } } explode(cellX + cellSize / 2, cellY + cellSize / 2, activeColors[`level${currentLevel}` as keyof ThemeColors] || activeColors.level0); } }); });
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      stars.forEach((s) => { ctx.globalAlpha = s.alpha; ctx.fillRect(s.x, s.y, s.size, s.size); });
      ctx.globalAlpha = 1.0;
      bullets.forEach((b) => { ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, b.width, b.height); });
      particles.forEach((p) => { ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fillRect(p.x, p.y, p.size, p.size); });
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = player.color; ctx.shadowColor = player.color; ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.lineTo(player.x + player.width * 0.7, player.y + player.height * 0.75);
      ctx.lineTo(player.x + player.width * 0.3, player.y + player.height * 0.75);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
    };

    const loop = () => { update(); render(); if (gameActive) animationFrameId = requestAnimationFrame(loop); };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameActive, data, weeks, step, cellSize, monthLabelHeight, activeColors, id, svgWidth, svgHeight]);

  if (loading) return <CalendarSkeleton cellSize={cellSize} cellGap={cellGap} className={className} />;

  if (fetchError) return (
    <div className={cn("w-fit mx-auto flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400", className)}>
      {fetchError}
    </div>
  );

  const cellRx = cellShape === "circle" ? cellSize / 2 : cellSize * 0.2;

  return (
    <div className={cn("w-full rounded-2xl border border-[#30363d] bg-[#0d1117] transition-all duration-500 overflow-hidden", gameActive ? "shadow-[0_0_0_1px_rgba(57,211,83,0.16)]" : "shadow-[0_0_0_1px_rgba(255,255,255,0.03)]", className)}>
      <div className="w-full flex flex-col gap-4 p-4 md:p-5">
        {/* Scrollable grid */}
        <div ref={scrollRef} className={cn("relative w-full overflow-x-auto transition-all duration-500", gameActive ? "pb-[80px]" : "")} style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(110,118,129,0.45) transparent" } as React.CSSProperties}>
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="overflow-visible mx-auto block">
            {showMonthLabels && !gameActive && (() => {
              const byWeek = new Map<number, string>();
              monthLabels.forEach(({ label, weekIndex }) => byWeek.set(weekIndex, label));
              const entries = Array.from(byWeek.entries());
              const validEntries: [number, string][] = [];
              for (let i = 0; i < entries.length; i++) {
                const current = entries[i]!;
                const next = entries[i + 1];
                if (i === 0 && next && next[0] - current[0] < 3) continue;
                const lastValid = validEntries[validEntries.length - 1];
                if (lastValid && current[0] - lastValid[0] < 3) continue;
                validEntries.push(current);
              }
              return validEntries.map(([weekIndex, label]) => (
                <text key={`${label}-${weekIndex}`} x={weekIndex * step} y={10} fontSize={11} fill="#8b949e" fontFamily="inherit">{label}</text>
              ));
            })()}
            {weeks.map((week, wi) =>
              week.map((date, di) => {
                const entry = date ? data[date] : undefined;
                const level: ContributionLevel = entry?.level ?? 0;
                const cellCenterX = wi * step + cellSize / 2;
                const cellTopY = monthLabelHeight + di * step;
                if (!date) {
                  const cellDate = formatDate(addDays(parseDate(gridStart), wi * 7 + di));
                  if (cellDate > resolvedEnd) return null;
                }
                return (
                  <rect
                    key={`${wi}-${di}`}
                    id={date ? `cell-${id}-${date}` : undefined}
                    x={wi * step} y={cellTopY}
                    width={cellSize} height={cellSize} rx={cellRx}
                    fill={activeColors[`level${level}` as keyof ThemeColors]}
                    style={{ transition: "opacity 0.1s", opacity: gameActive ? (level === 0 || !date ? 0 : 1) : 1, pointerEvents: gameActive ? (level === 0 || !date ? "none" : "auto") : "auto" }}
                    onMouseEnter={() => { if (!date || gameActive) return; setTooltip({ visible: true, date, count: entry?.count, label: entry?.label, x: cellCenterX, y: cellTopY }); }}
                    onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                  />
                );
              })
            )}
          </svg>
          {gameActive && <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto z-10 cursor-crosshair" style={{ width: svgWidth, height: svgHeight + 80 }} />}
          {tooltip.visible && (() => {
            const count = tooltip.count ?? 0;
            const formattedDate = formatTooltipDate(tooltip.date);
            const tooltipText = tooltip.label ? `${tooltip.label} on ${formattedDate}.` : count === 0 ? `No contributions on ${formattedDate}.` : `${count} contribution${count !== 1 ? "s" : ""} on ${formattedDate}.`;
            return (
              <div className="pointer-events-none absolute z-50 rounded-md border border-[#30363d] bg-[#161b22] px-2.5 py-1 text-[11px] font-medium text-[#c9d1d9] shadow-[0_10px_30px_rgba(0,0,0,0.35)] whitespace-nowrap" style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, calc(-100% - 6px))" }}>
                {tooltipText}
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rotate-45 border-r border-b border-[#30363d] bg-[#161b22]" />
              </div>
            );
          })()}
        </div>

        {/* Bottom bar — legend left, stats right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#30363d] pt-3">
          {showLegend && (
            <div className="flex items-center gap-4 text-xs text-[#8b949e]">
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
                  <svg key={level} width={cellSize} height={cellSize}>
                    <rect width={cellSize} height={cellSize} rx={cellRx} fill={activeColors[`level${level}`]} />
                  </svg>
                ))}
                <span>More</span>
              </div>
              <div className="flex items-center gap-2 border-l border-[#30363d] pl-3">
                <span className="text-[11px] text-[#6e7681] select-none">Game Mode</span>
                <button
                  onClick={() => setGameActive(!gameActive)}
                  aria-label="Toggle game mode"
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39d353] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117]",
                    gameActive ? "bg-[#39d353]" : "bg-[#30363d]"
                  )}
                >
                  <span className={cn("pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#f0f6fc] shadow ring-0 transition duration-200", gameActive ? "translate-x-4" : "translate-x-0")} />
                </button>
              </div>
            </div>
          )}
          {showStats && (
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-[#8b949e] transition-colors hover:text-[#c9d1d9]"
            >
              <span className="font-semibold text-[#c9d1d9]">{username}</span>
              <span>·</span>
              <span className="font-bold text-[#39d353]">{stats.total.toLocaleString()}</span>
              <span>contributions this year</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

GithubCalendar.displayName = "GithubCalendar";
export default GithubCalendar;
