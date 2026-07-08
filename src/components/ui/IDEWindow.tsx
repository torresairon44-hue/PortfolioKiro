"use client";

/**
 * IDEWindow.tsx
 *
 * Flow:
 *   1. Visitor sees Challenge.tsx tab — editable code with 3 syntax bugs
 *   2. They click Run — validator parses what they actually typed
 *   3. On success → terminal output animates in → "Play Game" button appears
 *   4. Game panel slides in: Memory Card Match with tech-logo cards
 *   5. Red dot from game/terminal → back to IDE editor
 *   6. Red dot from IDE → close overlay (click Restore to reopen)
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiGit, SiMongodb, SiFigma,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { TbBrandFramerMotion } from "react-icons/tb";

// ─── Types ────────────────────────────────────────────────────────────────────

type WindowState = "ide" | "terminal" | "game" | "closed";

interface RunResult {
  ok: boolean;
  logs: string[];
  error?: string;
  hint?: string;
}

// ─── Challenge code ───────────────────────────────────────────────────────────
// The broken snippet IS the memory match boot logic.
// Fixing it "compiles" the game and launches it.
//
// Bug 1: missing closing quote on cards array string
// Bug 2: wrong operator  ==  instead of  ===  in isMatch check
// Bug 3: missing closing brace on the flipCard function

export const CHALLENGE_BROKEN = `// Fix the 3 bugs to boot the Memory Match game

const cards = ["React", "Next.js", "TypeScript,   // Bug 1: unclosed string
               "Tailwind", "Git", "Figma"];

function isMatch(a, b) {
  return a.id == b.id;                             // Bug 2: == should be ===
}

function flipCard(card) {
  card.flipped = true;
  console.log("Flipped:", card.label);
                                                   // Bug 3: missing closing }

console.log("Cards loaded:", cards.length);
console.log("Ready to play!");
`;

export const CHALLENGE_FIXED = `// All bugs fixed — booting Memory Match

const cards = ["React", "Next.js", "TypeScript",
               "Tailwind", "Git", "Figma"];

function isMatch(a, b) {
  return a.id === b.id;
}

function flipCard(card) {
  card.flipped = true;
  console.log("Flipped:", card.label);
}

console.log("Cards loaded:", cards.length);
console.log("Ready to play!");
`;

// ─── Validator ────────────────────────────────────────────────────────────────

function validateAndRun(code: string): RunResult {
  const bugs: string[] = [];

  // Bug 1: "TypeScript, without closing quote before the newline/comma
  if (/TypeScript,\s*(\/\/[^\n]*)?\s*$\s*"/m.test(code) ||
      /"TypeScript,\s*(\/\/[^\n]*)?$/m.test(code)) {
    bugs.push('Bug 1 — Unclosed string: "TypeScript,  →  close it with a " before the comma');
  }

  // Bug 2: == instead of ===
  if (/a\.id\s*==\s*b\.id/.test(code) && !/a\.id\s*===\s*b\.id/.test(code)) {
    bugs.push("Bug 2 — Loose equality: a.id == b.id  →  use strict  a.id === b.id");
  }

  // Bug 3: flipCard function body not closed
  // Look for a lone } that closes flipCard (after the console.log inside it)
  const flipBlock = code.match(/function flipCard[\s\S]*?console\.log\("Flipped:"[^\n]*\n([\s\S]*?)(?=\n\s*console\.log\("Cards|$)/);
  const blockAfterLog = flipBlock?.[1] ?? "";
  if (!/^\s*\}\s*$/m.test(blockAfterLog)) {
    bugs.push("Bug 3 — flipCard is never closed. Add a  }  on its own line after the console.log inside it.");
  }

  if (bugs.length > 0) {
    return {
      ok: false,
      logs: ["$ node memoryMatch.ts", ""],
      error: bugs[0],
      hint: `${bugs.length} bug${bugs.length > 1 ? "s" : ""} remaining`,
    };
  }

  return {
    ok: true,
    logs: [
      "$ node memoryMatch.ts",
      "",
      "Cards loaded: 6",
      "Ready to play!",
      "",
      "Compiled — 0 errors, 0 warnings",
      "Launching Memory Match...",
    ],
  };
}

// ─── Memory Card Match — data ─────────────────────────────────────────────────

interface CardDef {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string; // icon accent color
}

const CARD_DEFS: CardDef[] = [
  { id: "react",    label: "React",         Icon: SiReact,              color: "#61dafb" },
  { id: "next",     label: "Next.js",       Icon: SiNextdotjs,          color: "#ffffff" },
  { id: "ts",       label: "TypeScript",    Icon: SiTypescript,         color: "#3178c6" },
  { id: "tailwind", label: "Tailwind",      Icon: SiTailwindcss,        color: "#38bdf8" },
  { id: "node",     label: "Node.js",       Icon: SiNodedotjs,          color: "#6cc24a" },
  { id: "git",      label: "Git",           Icon: SiGit,                color: "#f05032" },
  { id: "mongo",    label: "MongoDB",       Icon: SiMongodb,            color: "#4db33d" },
  { id: "figma",    label: "Figma",         Icon: SiFigma,              color: "#a259ff" },
  { id: "vscode",   label: "VS Code",       Icon: VscVscode,            color: "#007acc" },
  { id: "framer",   label: "Framer Motion", Icon: TbBrandFramerMotion,  color: "#bb00ff" },
];

interface MemCard {
  uid: string;   // unique per card instance (two copies per def)
  defId: string;
  def: CardDef;
  flipped: boolean;
  matched: boolean;
}

function buildDeck(): MemCard[] {
  // Pick 6 random defs, duplicate, shuffle
  const picked = [...CARD_DEFS].sort(() => Math.random() - 0.5).slice(0, 6);
  const cards: MemCard[] = [...picked, ...picked].map((def, i) => ({
    uid: `${def.id}-${i}`,
    defId: def.id,
    def,
    flipped: false,
    matched: false,
  }));
  return cards.sort(() => Math.random() - 0.5);
}

// ─── Memory Card Match — component ───────────────────────────────────────────

const MemoryGame = ({ onBack }: { onBack: () => void }) => {
  const [cards, setCards]     = useState<MemCard[]>(buildDeck);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [locked, setLocked]   = useState(false);
  const [moves, setMoves]     = useState(0);
  const [won, setWon]         = useState(false);

  const matchedCount = cards.filter(c => c.matched).length;
  const totalPairs   = cards.length / 2;

  const restart = () => {
    setCards(buildDeck());
    setFlipped([]);
    setLocked(false);
    setMoves(0);
    setWon(false);
  };

  const handleFlip = (uid: string) => {
    if (locked) return;
    const card = cards.find(c => c.uid === uid);
    if (!card || card.flipped || card.matched) return;
    if (flipped.length === 2) return;

    const nextFlipped = [...flipped, uid];
    setFlipped(nextFlipped);
    setCards(prev => prev.map(c => c.uid === uid ? { ...c, flipped: true } : c));

    if (nextFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = nextFlipped.map(id => cards.find(c => c.uid === id)!);
      if (a.defId === b.defId) {
        setCards(prev => prev.map(c =>
          nextFlipped.includes(c.uid) ? { ...c, matched: true } : c
        ));
        setFlipped([]);
        setLocked(false);
        if (matchedCount + 2 === cards.length) setWon(true);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            nextFlipped.includes(c.uid) ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) setWon(true);
  }, [cards]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.22 }}
      className="flex-1 flex flex-col overflow-hidden bg-[#100f0d]"
    >
      {/* Header — larger tap targets on mobile */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2.5
                      bg-[#1a1815] border-b border-[#2e2b26]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[#D4B26F] text-[11px] font-mono font-bold whitespace-nowrap">
            Memory Match
          </span>
          <span className="text-[#7a7268] text-[10px] font-mono whitespace-nowrap">
            {matchedCount / 2}/{totalPairs}
          </span>
          <span className="text-[#7a7268] text-[10px] font-mono whitespace-nowrap">
            {moves} moves
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={restart}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#2e2b26]
                       text-[#c0b99e] active:bg-[#3d3a34] transition-colors
                       min-h-[28px] touch-manipulation">
            New
          </button>
          <button onClick={onBack}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#2e2b26]
                       text-[#c0b99e] active:bg-[#3d3a34] transition-colors
                       min-h-[28px] touch-manipulation">
            Editor
          </button>
        </div>
      </div>

      {/* Card grid — 3 cols on mobile, 4 on larger */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 w-full max-w-xs sm:max-w-sm">
          {cards.map(card => (
            <MemCardTile key={card.uid} card={card} onFlip={handleFlip} />
          ))}
        </div>
      </div>

      {/* Win overlay */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center
                       bg-[#0c0b09]/90 backdrop-blur-sm rounded-xl md:rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex flex-col items-center gap-4 p-6 mx-4 rounded-2xl
                         bg-[#131210] border border-[#D4B26F]/40 shadow-2xl text-center"
            >
              <p className="text-[#D4B26F] font-mono font-bold text-base">You won!</p>
              <p className="text-[#c0b99e] text-[11px] font-mono">{moves} moves</p>
              <div className="flex gap-2">
                <button onClick={restart}
                  className="px-5 py-2 rounded-lg text-[12px] font-mono font-bold
                             bg-[#D4B26F] text-[#131210] active:bg-[#b8933a]
                             transition-colors min-h-[36px] touch-manipulation">
                  Play Again
                </button>
                <button onClick={onBack}
                  className="px-5 py-2 rounded-lg text-[12px] font-mono
                             bg-[#2e2b26] text-[#e8dfc8] active:bg-[#3d3a34]
                             transition-colors min-h-[36px] touch-manipulation">
                  Editor
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Single memory card tile ──────────────────────────────────────────────────

const MemCardTile = ({ card, onFlip }: { card: MemCard; onFlip: (uid: string) => void }) => {
  const { Icon, label, color } = card.def;
  const faceUp = card.flipped || card.matched;

  return (
    <button
      onClick={() => onFlip(card.uid)}
      className="relative aspect-square touch-manipulation focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#D4B26F]"
      style={{ perspective: "800px" }}
      aria-label={faceUp ? label : "Hidden card"}
      aria-pressed={faceUp}
    >
      <motion.div
        animate={{ rotateY: faceUp ? 0 : 180 }}
        transition={{ duration: 0.32, ease: "easeInOut" }}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face — icon + label */}
        <div
          className={`absolute inset-0 rounded-lg flex flex-col items-center
                       justify-center gap-1 border transition-colors duration-300
                       ${card.matched
                         ? "border-[#D4B26F]/50 bg-[#D4B26F]/10"
                         : "border-[#2e2b26] bg-[#131210]"}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
          <span className="text-[7px] sm:text-[9px] font-mono text-[#7a7268]
                           leading-none text-center px-0.5 line-clamp-1">
            {label}
          </span>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-lg border border-[#2e2b26]
                     bg-[#1a1815] flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded border border-[#3d3a34]
                          bg-[#2e2b26] opacity-60" />
        </div>
      </motion.div>
    </button>
  );
};

// ─── Terminal / Output Panel ──────────────────────────────────────────────────

const TerminalPanel = ({
  result,
  onBack,
  onPlayGame,
}: {
  result: RunResult;
  onBack: () => void;
  onPlayGame: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.22, ease: "easeOut" }}
    className="flex-1 flex flex-col overflow-hidden"
  >
    {/* Log area */}
    <div
      className="flex-1 overflow-y-auto p-3 md:p-4 bg-[#0c0b09]
                 font-mono text-[11px] md:text-[12px] leading-[1.9]"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#2e2b26 transparent" }}
    >
      {result.logs.map((line, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.055, duration: 0.18 }}
          className={
            line.startsWith("$")           ? "text-[#a8c8d0]" :
            line.includes("0 errors")      ? "text-[#a6e3a1]" :
            line === ""                    ? "text-transparent select-none" :
            "text-[#e8dfc8]"
          }
        >
          {line || "\u00A0"}
        </motion.div>
      ))}

      {/* Error block */}
      {!result.ok && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-3 p-3 rounded-lg border border-[#f38ba8]/40 bg-[#f38ba8]/8">
          <p className="text-[#f38ba8] font-bold text-[11px] mb-1">SyntaxError</p>
          <p className="text-[#fab387] text-[10px]">{result.error}</p>
          {result.hint && (
            <p className="mt-1.5 text-[#c0b99e] text-[10px]">{result.hint}</p>
          )}
        </motion.div>
      )}

      {/* Success block — game launch */}
      {result.ok && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: result.logs.length * 0.055 + 0.1, type: "spring", stiffness: 260, damping: 22 }}
          className="mt-4 p-3 rounded-xl border border-[#D4B26F]/40
                     bg-gradient-to-br from-[#131210] to-[#1a1815]"
        >
          <p className="text-[#a6e3a1] text-[10px] mb-3">
            All bugs fixed — Memory Match is ready
          </p>
          <button onClick={onPlayGame}
            className="w-full py-1.5 rounded-lg text-[11px] font-mono font-bold
                       bg-[#D4B26F] text-[#131210] hover:bg-[#b8933a]
                       transition-colors duration-150">
            Launch Memory Match
          </button>
        </motion.div>
      )}
    </div>

    {/* Footer bar */}
    <div className="shrink-0 flex items-center justify-between px-3 py-2
                    bg-[#1a1815] border-t border-[#2e2b26]">
      <span className="text-[#7a7268] text-[10px] font-mono truncate mr-2">
        {result.ok ? "0 errors · 0 warnings" : result.hint}
      </span>
      <button onClick={onBack}
        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-md
                   text-[10px] font-mono bg-[#2e2b26] text-[#e8dfc8]
                   active:bg-[#3d3a34] transition-colors
                   min-h-[28px] touch-manipulation">
        Back to Editor
      </button>
    </div>
  </motion.div>
);

// ─── Challenge Tab (editable code editor) ─────────────────────────────────────

const ChallengeTab = ({ onRun }: { onRun: (code: string) => void }) => {
  const [code, setCode] = useState(CHALLENGE_BROKEN);
  const lineCount       = code.split("\n").length;

  const handleReset = () => setCode(CHALLENGE_BROKEN);
  const handleSolve = () => setCode(CHALLENGE_FIXED);

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Toolbar — two rows on very small screens */}
      <div className="shrink-0 px-3 py-2 bg-[#1a1815] border-b border-[#2e2b26]
                      flex flex-wrap items-center justify-between gap-y-1.5 gap-x-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#fab387] bg-[#fab387]/15
                           px-2 py-0.5 rounded-full whitespace-nowrap">
            3 bugs
          </span>
          <span className="text-[10px] font-mono text-[#7a7268] hidden sm:inline">
            Fix all, then click Run
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSolve}
            className="text-[10px] font-mono text-[#7a7268] active:text-[#c0b99e]
                       underline underline-offset-2 transition-colors touch-manipulation
                       min-h-[28px]">
            solution
          </button>
          <button onClick={handleReset}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#2e2b26]
                       text-[#c0b99e] active:bg-[#3d3a34] transition-colors
                       min-h-[28px] touch-manipulation">
            reset
          </button>
          <button onClick={() => onRun(code)}
            className="px-3 py-1 rounded-md text-[11px] font-mono font-bold
                       bg-[#a6e3a1] text-[#131210] active:bg-[#7ec87e]
                       transition-colors min-h-[28px] touch-manipulation">
            Run
          </button>
        </div>
      </div>

      {/* Editable area */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* Line numbers — hide on very small screens to save space */}
        <div className="select-none pt-3 pl-2 pr-2 text-right shrink-0
                        bg-[#131210] overflow-hidden hidden xs:block"
             aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}
              className="text-[#4a4540] text-[10px] leading-[1.65] font-mono">
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="none"
          autoComplete="off"
          aria-label="Challenge code editor"
          className="flex-1 resize-none outline-none border-none bg-[#131210]
                     text-[#e8dfc8] text-[11px] leading-[1.65]
                     font-mono p-3 pl-2 overflow-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#2e2b26 transparent",
            caretColor: "#D4B26F",
            /* Prevent iOS auto-zoom on focus (needs ≥16px or transform trick) */
            fontSize: "clamp(11px, 2.5vw, 12px)",
          }}
        />
      </div>
    </div>
  );
};

// ─── Closed overlay ───────────────────────────────────────────────────────────

const ClosedOverlay = ({ onRestore }: { onRestore: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 z-40 flex flex-col items-center justify-center
               bg-[#0c0b09]/90 backdrop-blur-sm rounded-xl md:rounded-2xl"
  >
    <p className="text-[#7a7268] text-xs font-mono mb-4">Window closed</p>
    <button onClick={onRestore}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#131210]
                 border border-[#2e2b26] text-[#e8dfc8] text-[11px] font-mono
                 hover:border-[#D4B26F] hover:text-[#D4B26F]
                 transition-colors duration-200 shadow-lg">
      Restore IDE
    </button>
  </motion.div>
);

// ─── Main IDEWindow ───────────────────────────────────────────────────────────

interface IDEWindowProps {
  motionStyle?: React.CSSProperties;
  className?: string;
}

export const IDEWindow = ({ motionStyle, className = "" }: IDEWindowProps) => {
  const [windowState, setWindowState] = useState<WindowState>("ide");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isRunning, setIsRunning]     = useState(false);
  const [runResult, setRunResult]     = useState<RunResult | null>(null);

  // ── Red dot behaviour ──────────────────────────────────────────────────────
  // game     → back to terminal (keep result)
  // terminal → back to IDE
  // ide      → close
  // closed   → (handled by ClosedOverlay)
  const handleRed = () => {
    if (windowState === "game")     { setWindowState("terminal"); return; }
    if (windowState === "terminal") { setWindowState("ide");      return; }
    if (windowState === "ide")      { setWindowState("closed");   return; }
  };

  const handleRun = useCallback((code: string) => {
    setIsRunning(true);
    setWindowState("terminal");
    setTimeout(() => {
      setRunResult(validateAndRun(code));
      setIsRunning(false);
    }, 700);
  }, []);

  const titleMap: Record<WindowState, string> = {
    ide:      "Challenge.tsx",
    terminal: "Terminal — Challenge.tsx",
    game:     "Memory Match",
    closed:   "Challenge.tsx",
  };

  const redLabel =
    windowState === "game"     ? "Back to terminal" :
    windowState === "terminal" ? "Back to editor"   :
    windowState === "ide"      ? "Close window"     : "";

  const redSymbol =
    windowState === "game"     ? "-" :
    windowState === "terminal" ? "-" :
    "x";

  return (
    <motion.div
      style={motionStyle}
      animate={isMaximized ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className={`relative w-full h-full flex flex-col rounded-xl md:rounded-2xl
                  overflow-hidden bg-[#131210] border border-[#2e2b26] shadow-2xl
                  ${className}`}
    >
      {/* Closed overlay */}
      <AnimatePresence>
        {windowState === "closed" && (
          <ClosedOverlay onRestore={() => setWindowState("ide")} />
        )}
      </AnimatePresence>

      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2.5
                      bg-[#1a1815] border-b border-[#2e2b26] shrink-0">
        <div className="flex items-center gap-2 mr-2">
          {/* Red */}
          <button aria-label={redLabel} onClick={handleRed}
            className="group w-3.5 h-3.5 rounded-full bg-[#ff5f57] active:bg-[#ff3a2d]
                       transition-colors flex items-center justify-center
                       touch-manipulation">
            <span className="opacity-0 group-hover:opacity-100 text-[#4a0000]
                             text-[8px] leading-none font-bold">
              {redSymbol}
            </span>
          </button>

          {/* Yellow — decorative */}
          <button aria-label="Minimize"
            className="group w-3.5 h-3.5 rounded-full bg-[#febc2e] active:bg-[#f5a623]
                       transition-colors flex items-center justify-center
                       touch-manipulation">
            <span className="opacity-0 group-hover:opacity-100 text-[#4a3200]
                             text-[8px] leading-none font-bold">-</span>
          </button>

          {/* Green — maximize */}
          <button aria-label={isMaximized ? "Restore" : "Maximize"}
            onClick={() => setIsMaximized(v => !v)}
            className="group w-3.5 h-3.5 rounded-full bg-[#28c840] active:bg-[#1aad30]
                       transition-colors flex items-center justify-center
                       touch-manipulation">
            <span className="opacity-0 group-hover:opacity-100 text-[#002200]
                             text-[8px] leading-none font-bold">
              {isMaximized ? "-" : "+"}
            </span>
          </button>
        </div>

        <span className="text-[#7a7268] text-[10px] md:text-xs font-mono
                         mx-auto truncate max-w-[60%]">
          {titleMap[windowState]}
        </span>
      </div>

      {/* Tab bar — only in IDE view */}
      <AnimatePresence>
        {windowState === "ide" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-end bg-[#1a1815] border-b border-[#2e2b26]
                       shrink-0 overflow-x-auto"
          >
            <div className="relative flex items-center gap-1.5 px-3 md:px-4 py-2
                            text-[11px] md:text-xs font-mono border-r border-[#2e2b26]
                            bg-[#131210] text-[#e8dfc8]">
              Challenge.tsx
              <span className="text-[9px] text-[#fab387] bg-[#fab387]/15 px-1 rounded-sm">
                3 bugs
              </span>
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D4B26F]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <AnimatePresence mode="wait">

          {/* Compiling spinner */}
          {windowState === "terminal" && isRunning && (
            <motion.div key="running"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center
                         gap-3 bg-[#0c0b09]">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    animate={{ y: [0, -7, 0] }}
                    transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.13 }}
                    className="w-2 h-2 rounded-full bg-[#D4B26F]" />
                ))}
              </div>
              <p className="text-[#7a7268] text-[11px] font-mono">Compiling</p>
            </motion.div>
          )}

          {/* Terminal result */}
          {windowState === "terminal" && !isRunning && runResult && (
            <TerminalPanel
              key="terminal"
              result={runResult}
              onBack={() => { setWindowState("ide"); setRunResult(null); }}
              onPlayGame={() => setWindowState("game")}
            />
          )}

          {/* Memory game */}
          {windowState === "game" && (
            <MemoryGame
              key="game"
              onBack={() => setWindowState("ide")}
            />
          )}

          {/* IDE editor */}
          {windowState === "ide" && (
            <motion.div key="ide"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="flex-1 flex flex-col overflow-hidden min-h-0"
            >
              <ChallengeTab onRun={handleRun} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 md:px-4 py-1
                      bg-[#9E1F26] shrink-0">
        <div className="flex items-center gap-3 text-[#131210]
                        text-[9px] md:text-[10px] font-mono font-medium">
          <span>main</span>
          <span>
            {windowState === "terminal" ? "Running" :
             windowState === "game"     ? "Memory Match" :
             "Prettier"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#131210]
                        text-[9px] md:text-[10px] font-mono font-medium">
          <span>
            {windowState === "game" ? "Game Active" : "JS Challenge"}
          </span>
          <span>UTF-8</span>
        </div>
      </div>
    </motion.div>
  );
};

export default IDEWindow;
