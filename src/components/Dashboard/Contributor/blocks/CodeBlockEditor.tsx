"use client";

import type {
  CodeBlockContent,
} from "@/types/article-editor";

type Props = {
  content: CodeBlockContent;
  onChange: (
    content: CodeBlockContent
  ) => void;
};

export default function CodeBlockEditor({
  content,
  onChange,
}: Props) {
  function update(
    updates: Partial<CodeBlockContent>
  ) {
    onChange({
      ...content,
      ...updates,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">
          Language
        </label>

        <select
          value={content.language}
          onChange={(event) =>
            update({
              language:
                event.target.value,
            })
          }
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Select language
          </option>

          <option value="javascript">
            JavaScript
          </option>

          <option value="typescript">
            TypeScript
          </option>

          <option value="jsx">
            JSX
          </option>

          <option value="tsx">
            TSX
          </option>

          <option value="python">
            Python
          </option>

          <option value="java">
            Java
          </option>

          <option value="c">
            C
          </option>

          <option value="cpp">
            C++
          </option>

          <option value="csharp">
            C#
          </option>

          <option value="php">
            PHP
          </option>

          <option value="rust">
            Rust
          </option>

          <option value="go">
            Go
          </option>

          <option value="sql">
            SQL
          </option>

          <option value="bash">
            Bash
          </option>

          <option value="json">
            JSON
          </option>

          <option value="html">
            HTML
          </option>

          <option value="css">
            CSS
          </option>

          <option value="text">
            Plain Text
          </option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Code
        </label>

        <textarea
          value={content.code}
          onChange={(event) =>
            update({
              code: event.target.value,
            })
          }
          rows={12}
          spellCheck={false}
          placeholder="Write code..."
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>
  );
}