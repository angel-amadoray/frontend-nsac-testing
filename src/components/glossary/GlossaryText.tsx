
import { useEffect, useMemo, useState } from "react";
import { GLOSSARY_TERMS } from "@/data/glossary";
import type { GlossaryTerm } from "@/data/glossary";

interface GlossaryTextProps {
  children: string;
}

interface TextPart {
  text: string;
  term?: GlossaryTerm;
}

interface GlossaryTermTriggerProps {
  term: GlossaryTerm;
}

function GlossaryTermTrigger({ term }: GlossaryTermTriggerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isOpen = isHovered || isPinned;

  useEffect(() => {
    if (!isPinned) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPinned(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPinned]);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        className="
          inline border-b border-dotted border-[#d8c7a1]
          text-[#e6d5ad] cursor-help
          transition-colors duration-200
          hover:text-white hover:border-white
          focus-visible:outline-none
          focus-visible:ring-1 focus-visible:ring-[#d8c7a1]
        "
        aria-expanded={isOpen}
        onClick={() => setIsPinned((previous) => !previous)}
      >
        {term.term}
      </button>

      {isOpen && (
        <span
          role="tooltip"
          className="
            absolute left-0 bottom-full z-50 mb-3
            block w-64 max-w-[80vw]
            border border-white/15
            bg-[#111111] p-4
            text-left shadow-2xl
            animate-in fade-in duration-150
          "
        >
          <span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#d8c7a1]">
            Glossary definition
          </span>

          <span className="mb-2 block text-sm font-semibold text-white">
            {term.term}
          </span>

          <span className="block text-xs leading-relaxed text-white/65">
            {term.definition}
          </span>
        </span>
      )}
    </span>
  );
}

export function GlossaryText({ children }: GlossaryTextProps) {
  const parts = useMemo(() => {
    const sortedTerms = [...GLOSSARY_TERMS].sort(
      (a, b) => b.term.length - a.term.length
    );

    const escapedTerms = sortedTerms.map((term) =>
      term.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    const matcher = new RegExp(
      `(?<![\\p{L}\\p{N}_])(${escapedTerms.join("|")})(?![\\p{L}\\p{N}_])`,
      "giu"
    );

    const result: TextPart[] = [];
    let lastIndex = 0;

    for (const match of children.matchAll(matcher)) {
      const matchedText = match[0];
      const index = match.index ?? 0;

      if (index > lastIndex) {
        result.push({
          text: children.slice(lastIndex, index),
        });
      }

      const glossaryTerm = sortedTerms.find(
        (term) => term.term.toLowerCase() === matchedText.toLowerCase()
      );

      result.push({
        text: matchedText,
        term: glossaryTerm,
      });

      lastIndex = index + matchedText.length;
    }

    if (lastIndex < children.length) {
      result.push({
        text: children.slice(lastIndex),
      });
    }

    return result;
  }, [children]);

  return (
    <>
      {parts.map((part, index) =>
        part.term ? (
          <GlossaryTermTrigger
            key={`${part.term.id}-${index}`}
            term={part.term}
          />
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
  );
}
