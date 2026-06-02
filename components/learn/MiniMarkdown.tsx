import React from "react";

/** Render inline **bold** segments within a single line of text. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>
      );
    }
    return <React.Fragment key={`${keyPrefix}-t-${i}`}>{part}</React.Fragment>;
  });
}

/**
 * Tiny, dependency-free markdown renderer for lesson content. Supports:
 * headings (## ), bullet lists (- / •), numbered lists, **bold**, blank lines.
 * Intentionally minimal — lesson cards are short.
 */
export function MiniMarkdown({ source }: { source: string }) {
  const lines = (source ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: { ordered: boolean; text: string }[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    const ordered = listItems[0].ordered;
    const items = listItems.map((it, i) => (
      <li key={`li-${key}-${i}`} className="leading-relaxed">
        {renderInline(it.text, `li-${key}-${i}`)}
      </li>
    ));
    blocks.push(
      ordered ? (
        <ol key={`ol-${key++}`} className="list-decimal pl-5 space-y-1 my-2">
          {items}
        </ol>
      ) : (
        <ul key={`ul-${key++}`} className="list-disc pl-5 space-y-1 my-2">
          {items}
        </ul>
      )
    );
    listItems = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    const heading = line.match(/^#{2,3}\s+(.*)$/);
    const bullet = line.match(/^[-•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);

    if (heading) {
      flushList();
      blocks.push(
        <h4 key={`h-${key++}`} className="font-bold mt-3 mb-1">
          {renderInline(heading[1], `h-${key}`)}
        </h4>
      );
    } else if (bullet) {
      listItems.push({ ordered: false, text: bullet[1] });
    } else if (numbered) {
      listItems.push({ ordered: true, text: numbered[1] });
    } else {
      flushList();
      blocks.push(
        <p key={`p-${key++}`} className="my-1 leading-relaxed">
          {renderInline(line, `p-${key}`)}
        </p>
      );
    }
  }
  flushList();

  return <div className="space-y-1">{blocks}</div>;
}
