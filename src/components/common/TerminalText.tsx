import { useState, useEffect } from 'react';

interface TerminalTextProps {
  lines: string[];
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function TerminalText({ lines, speed = 50, onComplete, className = '' }: TerminalTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => {
          const next = [...prev];
          next[currentLineIndex] = (next[currentLineIndex] || '') + currentLine[currentCharIndex];
          return next;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, speed * 5);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, lines, speed, onComplete]);

  return (
    <div className={`font-mono-custom ${className}`}>
      {displayedLines.map((line, i) => (
        <div key={i} className="mb-1">
          {line}
          {i === currentLineIndex && !isComplete && (
            <span className="cursor-blink ml-0.5 text-cyan-400">▊</span>
          )}
        </div>
      ))}
      {!isComplete && displayedLines.length === 0 && (
        <span className="cursor-blink text-cyan-400">▊</span>
      )}
    </div>
  );
}
