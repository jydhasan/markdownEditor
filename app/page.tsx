'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const mathJaxConfig = {
  loader: { load: ['input/tex', 'output/chtml'] },
  tex: {
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
  },
};

export default function MarkdownEditor() {
  const [content, setContent] = useState<string>(`
# 📝 Welcome to Markdown Editor

Write markdown text, drag & drop images, and render math, code, and tables.

---

## ✨ Features

- **Bold**, *Italic*, and \`Inline Code\`
- Code blocks with syntax highlighting:
\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

- Inline math: $E = mc^2$
- Block math:

$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

- Tables:

| Name     | Subject   | Score |
|----------|-----------|-------|
| Alice    | Math      | $95$  |
| Bob      | Physics   | $88$  |
| Charlie  | Chemistry | $92$  |

- Image (drop below to upload):
![example](/uploads/sample.jpg)

---

## 🔢 Ordered List Example
1. First step
2. Second step
3. Final step

## 📌 Unordered List Example
- Milk
- Bread
- Eggs



Try it out! 👇
  `.trim());

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.filename;
  }

  async function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      alert('Please drop a valid image file.');
      return;
    }

    const filename = await uploadImage(file);
    const imageMarkdown = `\n\n![${filename}](/uploads/${filename})\n\n`;
    setContent((prev) => prev + imageMarkdown);
  }

  function handleDragOver(e: React.DragEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  function renderImage({ alt, src }: { alt?: string; src?: string }) {
    if (!src) return null;
    return (
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-96 rounded border mt-2"
      />
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        Markdown Editor (Drag & Drop Only)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          placeholder="Write markdown and drag & drop image files here"
          className="h-[70vh] w-full p-4 border rounded resize-none shadow bg-white font-mono"
        />

        <div className="h-[70vh] overflow-auto p-4 border rounded bg-white shadow">
          <MathJaxContext version={3} config={mathJaxConfig}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                img: renderImage,
                p({ children }) {
                  return (
                    <p className="mb-3 text-base text-justify">
                      <MathJax dynamic inline>{children}</MathJax>
                    </p>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children }) {
                  return <thead className="bg-gray-200">{children}</thead>;
                },
                tbody({ children }) {
                  return <tbody>{children}</tbody>;
                },
                tr({ children }) {
                  return <tr>{children}</tr>;
                },
                th({ children }) {
                  return (
                    <th className="border border-gray-300 p-2 font-semibold text-left">
                      <MathJax dynamic inline>{children}</MathJax>
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="border border-gray-300 p-2">
                      <MathJax dynamic inline>{children}</MathJax>
                    </td>
                  );
                },
                 ul({ children }) {
                      return <ul className="list-disc list-inside pl-4 mb-3">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="list-decimal list-inside pl-4 mb-3">{children}</ol>;
                    },
                    li({ children }) {
                      return (
                        <li className="mb-1 text-base">
                          <MathJax dynamic inline>{children}</MathJax>
                        </li>
                      );
                    },

                    h1({ children }) {
                      return (
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                          <MathJax dynamic inline>{children}</MathJax>
                        </h1>
                      );
                    },
                    h2({ children }) {
                      return (
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          <MathJax dynamic inline>{children}</MathJax>
                        </h2>
                      );
                    },
                    h3({ children }) {
                      return (
                        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center bg-blue-500 text-white">
                          <MathJax dynamic inline>{children}</MathJax>
                        </h3>
                      );
                    },
                    h4({ children }) {
                      return (
                        <h4 className="text-base font-bold text-gray-800 mb-4">
                          <MathJax dynamic inline>{children}</MathJax>
                        </h4>
                      );
                    },
                    h5({ children }) {
                      return (
                        <h5 className="text-sm font-bold text-gray-800 mb-4">
                          <MathJax dynamic inline>{children}</MathJax>
                        </h5>
                      );
                    },
                    h6({ children }) {
                      return (
                        <h6 className="text-base font-normal text-gray-800 mb-4 text-justify max-w-prose" >
                          <MathJax dynamic inline>{children}</MathJax>
                          </h6>)
                    },
                      



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
