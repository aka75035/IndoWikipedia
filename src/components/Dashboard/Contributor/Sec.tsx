// "use client";
// import BlockEditor from "./blocks/BlockEditor";

// import type {
//   ArticleEditorBlock,
//   ArticleEditorSection,
// } from "@/types/article-editor";

// type Props = {
//   section: ArticleEditorSection;
//   onChange: (section: ArticleEditorSection) => void;
//   onDelete: () => void;
//   onMoveUp: () => void;
//   onMoveDown: () => void;
// };



// function createBlock(
//   type: ArticleEditorBlock["type"],
//   order: number
// ): ArticleEditorBlock {
//   switch (type) {
//     case "paragraph":
//       return {
//         type: "paragraph",
//         content: "",
//         order,
//       };

//     case "heading":
//       return {
//         type: "heading",
//         content: "",
//         order,
//       };

//     case "image":
//       return {
//         type: "image",
//         content: {
//           url: "",
//           alt: "",
//           caption: "",
//         },
//         order,
//       };

//     case "gallery":
//       return {
//         type: "gallery",
//         content: {
//           images: [],
//         },
//         order,
//       };

//     case "video":
//       return {
//         type: "video",
//         content: {
//           url: "",
//           title: "",
//           caption: "",
//         },
//         order,
//       };

//     case "quote":
//       return {
//         type: "quote",
//         content: {
//           text: "",
//           author: "",
//           source: "",
//         },
//         order,
//       };

//     case "list":
//       return {
//         type: "list",
//         content: {
//           items: [""],
//         },
//         order,
//       };

//     case "ordered-list":
//       return {
//         type: "ordered-list",
//         content: {
//           items: [""],
//         },
//         order,
//       };

//     case "table":
//       return {
//         type: "table",
//         content: {
//           headers: [""],
//           rows: [[""]],
//         },
//         order,
//       };

//     case "code":
//       return {
//         type: "code",
//         content: {
//           code: "",
//           language: "",
//         },
//         order,
//       };

//     case "math":
//       return {
//         type: "math",
//         content: {
//           expression: "",
//         },
//         order,
//       };

//     case "reference":
//       return {
//         type: "reference",
//         content: {
//           title: "",
//           url: "",
//           publisher: "",
//           author: "",
//         },
//         order,
//       };

//     case "link":
//       return {
//         type: "link",
//         content: {
//           url: "",
//           label: "",
//         },
//         order,
//       };

//     case "infobox":
//       return {
//         type: "infobox",
//         content: {
//           title: "",
//           image: null,
//           fields: [],
//         },
//         order,
//       };
//   }
// }

// export default function SectionEditor({
//   section,
//   onChange,
//   onDelete,
//   onMoveUp,
//   onMoveDown,
// }: Props) {
//   function updateSection(
//     updates: Partial<ArticleEditorSection>
//   ) {
//     onChange({
//       ...section,
//       ...updates,
//     });
//   }

//   function addBlock(
//     type: ArticleEditorBlock["type"]
//   ) {
//     const block = createBlock(
//       type,
//       section.blocks.length
//     );

//     updateSection({
//       blocks: [
//         ...section.blocks,
//         block,
//       ],
//     });
//   }

//   function updateBlock(
//     index: number,
//     content: ArticleEditorBlock["content"]
//   ) {
//     const blocks = [...section.blocks];

//     blocks[index] = {
//       ...blocks[index],
//       content,
//     } as ArticleEditorBlock;

//     updateSection({
//       blocks,
//     });
//   }

//   function moveBlockUp(index: number) {
//     if (index === 0) return;

//     const blocks = [...section.blocks];

//     [blocks[index - 1], blocks[index]] = [
//       blocks[index],
//       blocks[index - 1],
//     ];

//     updateSection({
//       blocks: blocks.map((block, i) => ({
//         ...block,
//         order: i,
//       })),
//     });
//   }

//   function moveBlockDown(index: number) {
//     if (index === section.blocks.length - 1) {
//       return;
//     }

//     const blocks = [...section.blocks];

//     [blocks[index], blocks[index + 1]] = [
//       blocks[index + 1],
//       blocks[index],
//     ];

//     updateSection({
//       blocks: blocks.map((block, i) => ({
//         ...block,
//         order: i,
//       })),
//     });
//   }

//   function deleteBlock(index: number) {
//     const blocks = section.blocks
//       .filter((_, i) => i !== index)
//       .map((block, i) => ({
//         ...block,
//         order: i,
//       }));

//     updateSection({
//       blocks,
//     });
//   }

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
//       {/* Section header */}
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex-1">
//           <label className="text-sm font-medium text-slate-700">
//             Section Title
//           </label>

//           <input
//             type="text"
//             value={section.title}
//             onChange={(event) =>
//               updateSection({
//                 title: event.target.value,
//               })
//             }
//             className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             placeholder="e.g. Early Life"
//           />
//         </div>

//         <div className="mt-7 flex items-center gap-2">
//           <button
//             type="button"
//             onClick={onMoveUp}
//             disabled={section.order === 0}
//             className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
//             aria-label="Move section up"
//           >
//             ↑
//           </button>

//           <button
//             type="button"
//             onClick={onMoveDown}
//             className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
//             aria-label="Move section down"
//           >
//             ↓
//           </button>

//           <button
//             type="button"
//             onClick={onDelete}
//             className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       {/* Section level */}
//       <div className="mt-4">
//         <label className="text-sm font-medium text-slate-700">
//           Heading Level
//         </label>

//         <select
//           value={section.level}
//           onChange={(event) =>
//             updateSection({
//               level: Number(event.target.value),
//             })
//           }
//           className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
//         >
//           {[1, 2, 3, 4, 5, 6].map(
//             (level) => (
//               <option
//                 key={level}
//                 value={level}
//               >
//                 H{level}
//               </option>
//             )
//           )}
//         </select>
//       </div>

//       {/* Blocks */}
//       <div className="mt-6 space-y-4">
//         {section.blocks.map(
//           (block, index) => (
//             <BlockEditor
//               key={`${block.order}-${index}`}
//               block={block}
//               index={index}
//               totalBlocks={section.blocks.length}
//               onDelete={() => deleteBlock(index)}
//               onMoveUp={() => moveBlockUp(index)}
//               onMoveDown={() => moveBlockDown(index)}
//             >           

//               {/* Paragraph */}
//               {block.type ===
//                 "paragraph" && (
//                 <textarea
//                   value={block.content}
//                   onChange={(event) =>
//                     updateBlock(
//                       index,
//                       event.target.value
//                     )
//                   }
//                   rows={6}
//                   placeholder="Write paragraph content..."
//                   className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               )}

//               {/* Heading */}
//               {block.type ===
//                 "heading" && (
//                 <input
//                   type="text"
//                   value={block.content}
//                   onChange={(event) =>
//                     updateBlock(
//                       index,
//                       event.target.value
//                     )
//                   }
//                   placeholder="Heading text..."
//                   className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               )}

//               {/* Image */}
//               {block.type === "image" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Image URL
//                     </label>

//                     <input
//                       type="url"
//                       value={block.content.url}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           url: event.target.value,
//                         })
//                       }
//                       placeholder="https://example.com/image.jpg"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Alt Text
//                     </label>

//                     <input
//                       type="text"
//                       value={block.content.alt}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           alt: event.target.value,
//                         })
//                       }
//                       placeholder="Describe the image"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Caption
//                     </label>

//                     <input
//                       type="text"
//                       value={block.content.caption ?? ""}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           caption: event.target.value,
//                         })
//                       }
//                       placeholder="Image caption"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   {block.content.url && (
//                     <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
//                       <img
//                         src={block.content.url}
//                         alt={block.content.alt}
//                         className="max-h-80 w-full object-contain"
//                       />
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Quote */}
//               {block.type === "quote" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Quote
//                     </label>

//                     <textarea
//                       value={block.content.text}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           text: event.target.value,
//                         })
//                       }
//                       rows={5}
//                       placeholder="Enter the quoted text..."
//                       className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Author
//                     </label>

//                     <input
//                       type="text"
//                       value={block.content.author ?? ""}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           author: event.target.value,
//                         })
//                       }
//                       placeholder="Person who said the quote"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Source
//                     </label>

//                     <input
//                       type="text"
//                       value={block.content.source ?? ""}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           source: event.target.value,
//                         })
//                       }
//                       placeholder="Book, speech, interview, etc."
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   {block.content.text && (
//                     <blockquote className="rounded-lg border-l-4 border-slate-400 bg-slate-100 p-4">
//                       <p className="text-base italic text-slate-700">
//                         “{block.content.text}”
//                       </p>

//                       {(block.content.author ||
//                         block.content.source) && (
//                         <footer className="mt-3 text-sm text-slate-500">
//                           {block.content.author &&
//                             `— ${block.content.author}`}

//                           {block.content.source &&
//                             `, ${block.content.source}`}
//                         </footer>
//                       )}
//                     </blockquote>
//                   )}
//                 </div>
//               )}

//               {/* List */}
//               {block.type === "list" && (
//                 <div className="space-y-3">
//                   <label className="text-sm font-medium text-slate-700">
//                     List Items
//                   </label>

//                   {block.content.items.map(
//                     (item, itemIndex) => (
//                       <div
//                         key={itemIndex}
//                         className="flex gap-2"
//                       >
//                         <span className="pt-3 text-sm text-slate-500">
//                           •
//                         </span>

//                         <input
//                           type="text"
//                           value={item}
//                           onChange={(event) => {
//                             const items = [
//                               ...block.content.items,
//                             ];

//                             items[itemIndex] =
//                               event.target.value;

//                             updateBlock(index, {
//                               ...block.content,
//                               items,
//                             });
//                           }}
//                           placeholder={`List item ${
//                             itemIndex + 1
//                           }`}
//                           className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                         />

//                         <button
//                           type="button"
//                           onClick={() => {
//                             const items =
//                               block.content.items.filter(
//                                 (_, i) =>
//                                   i !== itemIndex
//                               );

//                             updateBlock(index, {
//                               ...block.content,
//                               items:
//                                 items.length > 0
//                                   ? items
//                                   : [""],
//                             });
//                           }}
//                           className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     )
//                   )}

//                   <button
//                     type="button"
//                     onClick={() =>
//                       updateBlock(index, {
//                         ...block.content,
//                         items: [
//                           ...block.content.items,
//                           "",
//                         ],
//                       })
//                     }
//                     className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                   >
//                     + Add Item
//                   </button>
//                 </div>
//               )}

//               {/* Ordered List */}
//               {block.type === "ordered-list" && (
//                 <div className="space-y-3">
//                   <label className="text-sm font-medium text-slate-700">
//                     Ordered List Items
//                   </label>

//                   {block.content.items.map(
//                     (item, itemIndex) => (
//                       <div
//                         key={itemIndex}
//                         className="flex gap-2"
//                       >
//                         <span className="w-6 pt-3 text-sm text-slate-500">
//                           {itemIndex + 1}.
//                         </span>

//                         <input
//                           type="text"
//                           value={item}
//                           onChange={(event) => {
//                             const items = [
//                               ...block.content.items,
//                             ];

//                             items[itemIndex] =
//                               event.target.value;

//                             updateBlock(index, {
//                               ...block.content,
//                               items,
//                             });
//                           }}
//                           placeholder={`List item ${
//                             itemIndex + 1
//                           }`}
//                           className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                         />

//                         <button
//                           type="button"
//                           onClick={() => {
//                             const items =
//                               block.content.items.filter(
//                                 (_, i) =>
//                                   i !== itemIndex
//                               );

//                             updateBlock(index, {
//                               ...block.content,
//                               items:
//                                 items.length > 0
//                                   ? items
//                                   : [""],
//                             });
//                           }}
//                           className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     )
//                   )}

//                   <button
//                     type="button"
//                     onClick={() =>
//                       updateBlock(index, {
//                         ...block.content,
//                         items: [
//                           ...block.content.items,
//                           "",
//                         ],
//                       })
//                     }
//                     className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                   >
//                     + Add Item
//                   </button>
//                 </div>
//               )}

//               {/* Table */}
//               {block.type === "table" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Table
//                     </label>

//                     {/* Headers */}
//                     <div className="mt-3">
//                       <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
//                         Columns
//                       </p>

//                       <div className="space-y-2">
//                         {block.content.headers.map(
//                           (header, columnIndex) => (
//                             <div
//                               key={columnIndex}
//                               className="flex gap-2"
//                             >
//                               <input
//                                 type="text"
//                                 value={header}
//                                 onChange={(event) => {
//                                   const headers = [
//                                     ...block.content.headers,
//                                   ];

//                                   headers[columnIndex] =
//                                     event.target.value;

//                                   updateBlock(index, {
//                                     ...block.content,
//                                     headers,
//                                   });
//                                 }}
//                                 placeholder={`Column ${
//                                   columnIndex + 1
//                                 }`}
//                                 className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                               />

//                               <button
//                                 type="button"
//                                 disabled={
//                                   block.content.headers
//                                     .length <= 1
//                                 }
//                                 onClick={() => {
//                                   const headers =
//                                     block.content.headers.filter(
//                                       (_, i) =>
//                                         i !== columnIndex
//                                     );

//                                   const rows =
//                                     block.content.rows.map(
//                                       (row) =>
//                                         row.filter(
//                                           (_, i) =>
//                                             i !==
//                                             columnIndex
//                                         )
//                                     );

//                                   updateBlock(index, {
//                                     ...block.content,
//                                     headers,
//                                     rows,
//                                   });
//                                 }}
//                                 className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
//                               >
//                                 Remove
//                               </button>
//                             </div>
//                           )
//                         )}
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => {
//                           const headers = [
//                             ...block.content.headers,
//                             "",
//                           ];

//                           const rows =
//                             block.content.rows.map(
//                               (row) => [...row, ""]
//                             );

//                           updateBlock(index, {
//                             ...block.content,
//                             headers,
//                             rows,
//                           });
//                         }}
//                         className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                       >
//                         + Add Column
//                       </button>
//                     </div>
//                   </div>

//                   {/* Rows */}
//                   <div>
//                     <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
//                       Rows
//                     </p>

//                     <div className="space-y-3">
//                       {block.content.rows.map(
//                         (row, rowIndex) => (
//                           <div
//                             key={rowIndex}
//                             className="rounded-lg border border-slate-200 bg-white p-3"
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="text-xs font-medium text-slate-500">
//                                 Row {rowIndex + 1}
//                               </span>

//                               <button
//                                 type="button"
//                                 disabled={
//                                   block.content.rows
//                                     .length <= 1
//                                 }
//                                 onClick={() => {
//                                   const rows =
//                                     block.content.rows.filter(
//                                       (_, i) =>
//                                         i !== rowIndex
//                                     );

//                                   updateBlock(index, {
//                                     ...block.content,
//                                     rows,
//                                   });
//                                 }}
//                                 className="text-sm text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
//                               >
//                                 Remove Row
//                               </button>
//                             </div>

//                             <div className="mt-3 grid gap-2">
//                               {row.map(
//                                 (cell, columnIndex) => (
//                                   <input
//                                     key={columnIndex}
//                                     type="text"
//                                     value={cell}
//                                     onChange={(event) => {
//                                       const rows =
//                                         block.content.rows.map(
//                                           (
//                                             currentRow,
//                                             currentRowIndex
//                                           ) =>
//                                             currentRowIndex ===
//                                             rowIndex
//                                               ? currentRow.map(
//                                                   (
//                                                     currentCell,
//                                                     currentColumnIndex
//                                                   ) =>
//                                                     currentColumnIndex ===
//                                                     columnIndex
//                                                       ? event
//                                                           .target
//                                                           .value
//                                                       : currentCell
//                                                 )
//                                               : currentRow
//                                         );

//                                       updateBlock(index, {
//                                         ...block.content,
//                                         rows,
//                                       });
//                                     }}
//                                     placeholder={`Cell ${
//                                       columnIndex + 1
//                                     }`}
//                                     className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                   />
//                                 )
//                               )}
//                             </div>
//                           </div>
//                         )
//                       )}
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() => {
//                         const rows = [
//                           ...block.content.rows,
//                           block.content.headers.map(
//                             () => ""
//                           ),
//                         ];

//                         updateBlock(index, {
//                           ...block.content,
//                           rows,
//                         });
//                       }}
//                       className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                     >
//                       + Add Row
//                     </button>
//                   </div>

//                   {/* Preview */}
//                   <div>
//                     <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
//                       Preview
//                     </p>

//                     <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
//                       <table className="w-full border-collapse text-sm">
//                         <thead>
//                           <tr>
//                             {block.content.headers.map(
//                               (header, index) => (
//                                 <th
//                                   key={index}
//                                   className="border border-slate-200 bg-slate-100 px-4 py-2 text-left font-semibold text-slate-700"
//                                 >
//                                   {header ||
//                                     `Column ${
//                                       index + 1
//                                     }`}
//                                 </th>
//                               )
//                             )}
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {block.content.rows.map(
//                             (row, rowIndex) => (
//                               <tr key={rowIndex}>
//                                 {row.map(
//                                   (cell, cellIndex) => (
//                                     <td
//                                       key={cellIndex}
//                                       className="border border-slate-200 px-4 py-2 text-slate-700"
//                                     >
//                                       {cell}
//                                     </td>
//                                   )
//                                 )}
//                               </tr>
//                             )
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Code */}
//               {block.type === "code" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Programming Language
//                     </label>

//                     <select
//                       value={block.content.language}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           language: event.target.value,
//                         })
//                       }
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     >
//                       <option value="">Select language</option>
//                       <option value="javascript">JavaScript</option>
//                       <option value="typescript">TypeScript</option>
//                       <option value="jsx">JSX</option>
//                       <option value="tsx">TSX</option>
//                       <option value="python">Python</option>
//                       <option value="java">Java</option>
//                       <option value="c">C</option>
//                       <option value="cpp">C++</option>
//                       <option value="csharp">C#</option>
//                       <option value="php">PHP</option>
//                       <option value="rust">Rust</option>
//                       <option value="go">Go</option>
//                       <option value="sql">SQL</option>
//                       <option value="bash">Bash</option>
//                       <option value="json">JSON</option>
//                       <option value="html">HTML</option>
//                       <option value="css">CSS</option>
//                       <option value="text">Plain Text</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Code
//                     </label>

//                     <textarea
//                       value={block.content.code}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           code: event.target.value,
//                         })
//                       }
//                       rows={12}
//                       spellCheck={false}
//                       placeholder="Write your code here..."
//                       className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   {block.content.code && (
//                     <div>
//                       <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
//                         Preview
//                       </p>

//                       <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
//                         <code>
//                           {block.content.code}
//                         </code>
//                       </pre>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Math */}
//               {block.type === "math" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Mathematical Expression
//                     </label>

//                     <textarea
//                       value={block.content.expression}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           expression: event.target.value,
//                         })
//                       }
//                       rows={4}
//                       placeholder="e.g. E = mc²"
//                       className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   {block.content.expression && (
//                     <div>
//                       <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
//                         Expression
//                       </p>

//                       <div className="rounded-lg border border-slate-200 bg-white p-5">
//                         <p className="font-mono text-lg text-slate-800">
//                           {block.content.expression}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Video */}
//               {block.type === "video" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Video URL
//                     </label>

//                     <input
//                       type="url"
//                       value={block.content.url}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           url: event.target.value,
//                         })
//                       }
//                       placeholder="https://example.com/video.mp4"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Title
//                     </label>

//                     <input
//                       type="text"
//                       value={block.content.title ?? ""}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           title: event.target.value,
//                         })
//                       }
//                       placeholder="Video title"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Caption
//                     </label>

//                     <input
//                       type="text"
//                       value={block.content.caption ?? ""}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           caption: event.target.value,
//                         })
//                       }
//                       placeholder="Video caption"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   {block.content.url && (
//                     <div className="overflow-hidden rounded-lg border border-slate-200 bg-black">
//                       <video
//                         src={block.content.url}
//                         controls
//                         className="max-h-96 w-full"
//                       />
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Gallery */}
//               {block.type === "gallery" && (
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <label className="text-sm font-medium text-slate-700">
//                         Gallery Images
//                       </label>

//                       <p className="mt-1 text-xs text-slate-500">
//                         Add multiple images to this gallery.
//                       </p>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         updateBlock(index, {
//                           ...block.content,
//                           images: [
//                             ...block.content.images,
//                             {
//                               url: "",
//                               alt: "",
//                               caption: "",
//                             },
//                           ],
//                         })
//                       }
//                       className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                     >
//                       + Add Image
//                     </button>
//                   </div>

//                   {block.content.images.length === 0 && (
//                     <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
//                       No images added yet.
//                     </div>
//                   )}

//                   <div className="space-y-4">
//                     {block.content.images.map(
//                       (image, imageIndex) => (
//                         <div
//                           key={imageIndex}
//                           className="rounded-lg border border-slate-200 bg-white p-4"
//                         >
//                           <div className="mb-4 flex items-center justify-between">
//                             <span className="text-sm font-medium text-slate-700">
//                               Image {imageIndex + 1}
//                             </span>

//                             <button
//                               type="button"
//                               onClick={() => {
//                                 const images =
//                                   block.content.images.filter(
//                                     (_, i) =>
//                                       i !== imageIndex
//                                   );

//                                 updateBlock(index, {
//                                   ...block.content,
//                                   images,
//                                 });
//                               }}
//                               className="text-sm text-red-600 hover:underline"
//                             >
//                               Remove
//                             </button>
//                           </div>

//                           <div className="space-y-4">
//                             <div>
//                               <label className="text-sm font-medium text-slate-700">
//                                 Image URL
//                               </label>

//                               <input
//                                 type="url"
//                                 value={image.url}
//                                 onChange={(event) => {
//                                   const images =
//                                     block.content.images.map(
//                                       (
//                                         currentImage,
//                                         currentIndex
//                                       ) =>
//                                         currentIndex ===
//                                         imageIndex
//                                           ? {
//                                               ...currentImage,
//                                               url: event.target
//                                                 .value,
//                                             }
//                                           : currentImage
//                                     );

//                                   updateBlock(index, {
//                                     ...block.content,
//                                     images,
//                                   });
//                                 }}
//                                 placeholder="https://example.com/image.jpg"
//                                 className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                               />
//                             </div>

//                             <div>
//                               <label className="text-sm font-medium text-slate-700">
//                                 Alt Text
//                               </label>

//                               <input
//                                 type="text"
//                                 value={image.alt}
//                                 onChange={(event) => {
//                                   const images =
//                                     block.content.images.map(
//                                       (
//                                         currentImage,
//                                         currentIndex
//                                       ) =>
//                                         currentIndex ===
//                                         imageIndex
//                                           ? {
//                                               ...currentImage,
//                                               alt: event.target
//                                                 .value,
//                                             }
//                                           : currentImage
//                                     );

//                                   updateBlock(index, {
//                                     ...block.content,
//                                     images,
//                                   });
//                                 }}
//                                 placeholder="Describe the image"
//                                 className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                               />
//                             </div>

//                             <div>
//                               <label className="text-sm font-medium text-slate-700">
//                                 Caption
//                               </label>

//                               <input
//                                 type="text"
//                                 value={image.caption ?? ""}
//                                 onChange={(event) => {
//                                   const images =
//                                     block.content.images.map(
//                                       (
//                                         currentImage,
//                                         currentIndex
//                                       ) =>
//                                         currentIndex ===
//                                         imageIndex
//                                           ? {
//                                               ...currentImage,
//                                               caption:
//                                                 event.target
//                                                   .value,
//                                             }
//                                           : currentImage
//                                     );

//                                   updateBlock(index, {
//                                     ...block.content,
//                                     images,
//                                   });
//                                 }}
//                                 placeholder="Image caption"
//                                 className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                               />
//                             </div>

//                             {image.url && (
//                               <div className="overflow-hidden rounded-lg border border-slate-200">
//                                 <img
//                                   src={image.url}
//                                   alt={image.alt}
//                                   className="max-h-72 w-full object-contain"
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Reference */}
//               {block.type === "reference" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Reference Title
//                     </label>

//                     <input
//                       type="text"
//                       value={block.content.title}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           title: event.target.value,
//                         })
//                       }
//                       placeholder="Reference title"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       URL
//                     </label>

//                     <input
//                       type="url"
//                       value={block.content.url}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           url: event.target.value,
//                         })
//                       }
//                       placeholder="https://example.com"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <div>
//                       <label className="text-sm font-medium text-slate-700">
//                         Publisher
//                       </label>

//                       <input
//                         type="text"
//                         value={block.content.publisher ?? ""}
//                         onChange={(event) =>
//                           updateBlock(index, {
//                             ...block.content,
//                             publisher: event.target.value,
//                           })
//                         }
//                         placeholder="Publisher"
//                         className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-slate-700">
//                         Author
//                       </label>

//                       <input
//                         type="text"
//                         value={block.content.author ?? ""}
//                         onChange={(event) =>
//                           updateBlock(index, {
//                             ...block.content,
//                             author: event.target.value,
//                           })
//                         }
//                         placeholder="Author"
//                         className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Link */}
//               {block.type === "link" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Link Text
//                     </label>

//                     <input
//                       type="text"
//                       value={block.content.label}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           label: event.target.value,
//                         })
//                       }
//                       placeholder="Wikipedia article"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       URL
//                     </label>

//                     <input
//                       type="url"
//                       value={block.content.url}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           url: event.target.value,
//                         })
//                       }
//                       placeholder="https://example.com"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   {block.content.url &&
//                     block.content.label && (
//                       <div className="rounded-lg border border-slate-200 bg-white p-4">
//                         <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                           Preview
//                         </p>

//                         <a
//                           href={block.content.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="mt-2 inline-block text-blue-600 hover:underline"
//                         >
//                           {block.content.label}
//                         </a>
//                       </div>
//                     )}
//                 </div>
//               )}

//               {/* Infobox */}
//               {block.type === "infobox" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Infobox Title
//                     </label>

//                     <input
//                       type="text"
//                       value={block.content.title}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           title: event.target.value,
//                         })
//                       }
//                       placeholder="e.g. Ashoka"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-700">
//                       Image URL
//                     </label>

//                     <input
//                       type="url"
//                       value={block.content.image ?? ""}
//                       onChange={(event) =>
//                         updateBlock(index, {
//                           ...block.content,
//                           image:
//                             event.target.value || null,
//                         })
//                       }
//                       placeholder="https://example.com/image.jpg"
//                       className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   {/* Fields */}
//                   <div>
//                     <div className="flex items-center justify-between">
//                       <label className="text-sm font-medium text-slate-700">
//                         Fields
//                       </label>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           updateBlock(index, {
//                             ...block.content,
//                             fields: [
//                               ...block.content.fields,
//                               {
//                                 label: "",
//                                 value: "",
//                                 order:
//                                   block.content.fields
//                                     .length,
//                               },
//                             ],
//                           })
//                         }
//                         className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                       >
//                         + Add Field
//                       </button>
//                     </div>

//                     <div className="mt-3 space-y-3">
//                       {block.content.fields.map(
//                         (field, fieldIndex) => (
//                           <div
//                             key={fieldIndex}
//                             className="rounded-lg border border-slate-200 bg-white p-4"
//                           >
//                             <div className="mb-3 flex items-center justify-between">
//                               <span className="text-sm font-medium text-slate-600">
//                                 Field {fieldIndex + 1}
//                               </span>

//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   const fields =
//                                     block.content.fields
//                                       .filter(
//                                         (_, i) =>
//                                           i !== fieldIndex
//                                       )
//                                       .map(
//                                         (
//                                           currentField,
//                                           currentIndex
//                                         ) => ({
//                                           ...currentField,
//                                           order:
//                                             currentIndex,
//                                         })
//                                       );

//                                   updateBlock(index, {
//                                     ...block.content,
//                                     fields,
//                                   });
//                                 }}
//                                 className="text-sm text-red-600 hover:underline"
//                               >
//                                 Remove
//                               </button>
//                             </div>

//                             <div className="grid gap-3 sm:grid-cols-2">
//                               <div>
//                                 <label className="text-xs font-medium text-slate-500">
//                                   Label
//                                 </label>

//                                 <input
//                                   type="text"
//                                   value={field.label}
//                                   onChange={(event) => {
//                                     const fields =
//                                       block.content.fields.map(
//                                         (
//                                           currentField,
//                                           currentIndex
//                                         ) =>
//                                           currentIndex ===
//                                           fieldIndex
//                                             ? {
//                                                 ...currentField,
//                                                 label:
//                                                   event.target
//                                                     .value,
//                                               }
//                                             : currentField
//                                       );

//                                     updateBlock(index, {
//                                       ...block.content,
//                                       fields,
//                                     });
//                                   }}
//                                   placeholder="Born"
//                                   className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                 />
//                               </div>

//                               <div>
//                                 <label className="text-xs font-medium text-slate-500">
//                                   Value
//                                 </label>

//                                 <input
//                                   type="text"
//                                   value={
//                                     typeof field.value ===
//                                     "string"
//                                       ? field.value
//                                       : ""
//                                   }
//                                   onChange={(event) => {
//                                     const fields =
//                                       block.content.fields.map(
//                                         (
//                                           currentField,
//                                           currentIndex
//                                         ) =>
//                                           currentIndex ===
//                                           fieldIndex
//                                             ? {
//                                                 ...currentField,
//                                                 value:
//                                                   event.target
//                                                     .value,
//                                               }
//                                             : currentField
//                                       );

//                                     updateBlock(index, {
//                                       ...block.content,
//                                       fields,
//                                     });
//                                   }}
//                                   placeholder="304 BC"
//                                   className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </div>

//                   {/* Preview */}
//                   {(block.content.title ||
//                     block.content.image ||
//                     block.content.fields.length > 0) && (
//                     <div className="rounded-lg border border-slate-300 bg-white overflow-hidden">
//                       {block.content.title && (
//                         <div className="bg-slate-100 px-4 py-3">
//                           <h3 className="font-semibold text-slate-800">
//                             {block.content.title}
//                           </h3>
//                         </div>
//                       )}

//                       {block.content.image && (
//                         <div className="border-b border-slate-200 p-4">
//                           <img
//                             src={block.content.image}
//                             alt={block.content.title}
//                             className="mx-auto max-h-64 object-contain"
//                           />
//                         </div>
//                       )}

//                       {block.content.fields.length > 0 && (
//                         <div>
//                           {block.content.fields.map(
//                             (field, fieldIndex) => (
//                               <div
//                                 key={fieldIndex}
//                                 className="grid grid-cols-2 border-b border-slate-200 last:border-b-0"
//                               >
//                                 <div className="bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//                                   {field.label}
//                                 </div>

//                                 <div className="px-4 py-2 text-sm text-slate-700">
//                                   {String(field.value)}
//                                 </div>
//                               </div>
//                             )
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//             </BlockEditor>
//           )
//         )}
//       </div>

//       {/* Add block */}
//       <div className="mt-5">
//         <p className="mb-3 text-sm font-medium text-slate-700">
//           Add Block
//         </p>

//         <div className="flex flex-wrap gap-2">
//           <button
//             type="button"
//             onClick={() =>
//               addBlock("paragraph")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Paragraph
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("heading")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Heading
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("image")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Image
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("gallery")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Gallery
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("video")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Video
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("quote")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Quote
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("list")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + List
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock(
//                 "ordered-list"
//               )
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Ordered List
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("table")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Table
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("code")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Code
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("math")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Math
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("reference")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Reference
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("link")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Link
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               addBlock("infobox")
//             }
//             className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >
//             + Infobox
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }