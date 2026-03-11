import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  if (!text) return null;

  // Simple parser to split text into math and non-math segments
  // Matches $$...$$ or $...$
  const regex = /(\$\$.*?\$\$|\$.*?\$)/g;
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2);
          return <BlockMath key={index} math={math} renderError={(error) => <span className="text-red-500">{error.name}</span>} />;
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return <InlineMath key={index} math={math} renderError={(error) => <span className="text-red-500">{error.name}</span>} />;
        } else {
          // Render newlines as <br />
          return (
            <span key={index}>
              {part.split("\n").map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          );
        }
      })}
    </span>
  );
};
