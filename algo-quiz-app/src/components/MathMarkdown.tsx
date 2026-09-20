import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathMarkdownProps {
  content: string;
  className?: string;
}

export const MathMarkdown: React.FC<MathMarkdownProps> = ({ content, className = '' }) => {
  // Render math string using KaTeX
  const renderMathAndText = (text: string) => {
    if (!text) return null;

    // First replace block math $$...$$
    const parts: React.ReactNode[] = [];
    const blockRegex = /\$\$([\s\S]*?)\$\$/g;
    let lastIndex = 0;
    let match;

    const renderInline = (subText: string, keyPrefix: string): React.ReactNode[] => {
      const inlineParts: React.ReactNode[] = [];
      const inlineRegex = /\$([^\$\n]+?)\$/g;
      let inlineLastIndex = 0;
      let inlineMatch;

      while ((inlineMatch = inlineRegex.exec(subText)) !== null) {
        if (inlineMatch.index > inlineLastIndex) {
          inlineParts.push(renderFormattedText(subText.substring(inlineLastIndex, inlineMatch.index), `${keyPrefix}-t-${inlineLastIndex}`));
        }
        try {
          const html = katex.renderToString(inlineMatch[1], {
            throwOnError: false,
            displayMode: false,
          });
          inlineParts.push(
            <span
              key={`${keyPrefix}-m-${inlineMatch.index}`}
              className="inline-math px-0.5 text-emerald-600 dark:text-emerald-400 font-serif"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          inlineParts.push(<code key={`${keyPrefix}-err-${inlineMatch.index}`}>{inlineMatch[1]}</code>);
        }
        inlineLastIndex = inlineRegex.lastIndex;
      }

      if (inlineLastIndex < subText.length) {
        inlineParts.push(renderFormattedText(subText.substring(inlineLastIndex), `${keyPrefix}-t-${inlineLastIndex}`));
      }
      return inlineParts;
    };

    // Formatted text for bold, inline code, links
    const renderFormattedText = (str: string, key: string): React.ReactNode => {
      // Split by backticks for inline code
      const codeParts = str.split(/(`[^`]+`)/g);
      return (
        <span key={key}>
          {codeParts.map((cp, idx) => {
            if (cp.startsWith('`') && cp.endsWith('`')) {
              return (
                <code
                  key={idx}
                  className="px-1.5 py-0.5 mx-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 rounded border border-slate-200 dark:border-slate-700"
                >
                  {cp.slice(1, -1)}
                </code>
              );
            }
            // Parse bold **text**
            const boldParts = cp.split(/(\*\*[^*]+\*\*)/g);
            return (
              <span key={idx}>
                {boldParts.map((bp, bidx) => {
                  if (bp.startsWith('**') && bp.endsWith('**')) {
                    return (
                      <strong key={bidx} className="font-semibold text-slate-900 dark:text-slate-100">
                        {bp.slice(2, -2)}
                      </strong>
                    );
                  }
                  return bp;
                })}
              </span>
            );
          })}
        </span>
      );
    };

    let pIndex = 0;
    while ((match = blockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textChunk = text.substring(lastIndex, match.index);
        parts.push(...renderInline(textChunk, `b-${pIndex}`));
      }
      try {
        const html = katex.renderToString(match[1], {
          throwOnError: false,
          displayMode: true,
        });
        parts.push(
          <div
            key={`bm-${match.index}`}
            className="my-3 py-2 px-3 overflow-x-auto bg-slate-50 dark:bg-slate-900/60 rounded-lg text-center border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-serif"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (e) {
        parts.push(<pre key={`bmerr-${match.index}`}>{match[1]}</pre>);
      }
      lastIndex = blockRegex.lastIndex;
      pIndex++;
    }

    if (lastIndex < text.length) {
      parts.push(...renderInline(text.substring(lastIndex), `tail`));
    }

    return parts;
  };

  // Split lines into headings, lists, tables, paragraphs
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = (k: number) => {
    if (tableRows.length === 0) return null;
    const header = tableRows[0];
    const rows = tableRows.slice(1);
    const tableNode = (
      <div key={`table-${k}`} className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              {header.map((th, thi) => (
                <th key={thi} className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">
                  {renderMathAndText(th)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-slate-700 dark:text-slate-300">
                    {renderMathAndText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
    return tableNode;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---')) {
        // separator line, skip
        continue;
      }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      inTable = true;
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      const t = flushTable(i);
      if (t) elements.push(t);
    }

    if (!line) {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block"></span>
          {renderMathAndText(line.replace('### ', ''))}
        </h4>
      );
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h5 key={`h5-${i}`} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1.5">
          {renderMathAndText(line.replace('#### ', ''))}
        </h5>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={`li-${i}`} className="ml-5 list-disc text-slate-700 dark:text-slate-300 my-1 leading-relaxed">
          {renderMathAndText(line.substring(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const dotIndex = line.indexOf('.');
      const num = line.substring(0, dotIndex);
      const text = line.substring(dotIndex + 1).trim();
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 my-1 text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
            {num}
          </span>
          <div>{renderMathAndText(text)}</div>
        </div>
      );
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-slate-700 dark:text-slate-300 leading-relaxed my-1">
          {renderMathAndText(line)}
        </p>
      );
    }
  }

  if (inTable) {
    const t = flushTable(lines.length);
    if (t) elements.push(t);
  }

  return <div className={`math-markdown text-sm leading-relaxed ${className}`}>{elements}</div>;
};
