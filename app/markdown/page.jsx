"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const mathJaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
  },
};

export default function MarkdownEditor() {
  const [content, setContent] = useState(`# Markdown + Math Example

Type markdown with math:

Inline math: $E=mc^2$

Block math:

$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$
`);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Markdown Editor with MathJax</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write markdown with $math$ and $$block math$$"
          className="h-[80vh] w-full p-4 border rounded resize-none shadow bg-white font-mono"
        />

        <div className="h-[80vh] overflow-auto p-4 border rounded bg-white shadow">
          <MathJaxContext version={3} config={mathJaxConfig}>
            <ReactMarkdown
              components={{
                p({ children }) {
                  return <p className="mb-3 text-base"><MathJax dynamic inline>{children}</MathJax></p>;
                },
                h1({ children }) {
                  return <h1 className="text-2xl font-bold mt-4 mb-2"><MathJax dynamic inline>{children}</MathJax></h1>;
                },
                h2({ children }) {
                  return <h2 className="text-xl font-semibold mt-3 mb-1"><MathJax dynamic inline>{children}</MathJax></h2>;
                },
                li({ children }) {
                  return <li className="list-disc ml-6"><MathJax dynamic inline>{children}</MathJax></li>;
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </MathJaxContext>
        </div>
      </div>
    </div>
  );
}
