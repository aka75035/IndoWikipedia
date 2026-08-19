import type {
  TableBlockContent,
} from "@/types/article-editor";

type Props = {
  content: TableBlockContent;
};

export default function TableBlock({
  content,
}: Props) {
  return (
    <div className="my-8 max-w-full overflow-x-auto border border-slate-300">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100">
            {content.headers.map(
              (header, index) => (
                <th
                  key={`${index}-${header}`}
                  scope="col"
                  className="border-b border-slate-300 px-4 py-3 text-left font-semibold text-slate-900"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {content.rows.map(
            (row, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="border-b border-slate-200 last:border-b-0 even:bg-slate-50/60"
              >
                {row.map(
                  (cell, cellIndex) => (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className="border-r border-slate-200 px-4 py-3 align-top leading-6 text-slate-700 last:border-r-0"
                    >
                      {cell}
                    </td>
                  )
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
} 