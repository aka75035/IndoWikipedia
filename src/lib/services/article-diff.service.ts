import type {
  RevisionBlock,
  BlockChange,
  BlockChanges,
  Section,
  SectionChange,
  SectionChanges,
  InfoboxData,
  InfoboxChanges,
  InfoboxField,
  InfoboxFieldChange,
  ReferenceChanges,
  ArticleReference,
  ReferenceChange,
  SimpleArrayChanges,
  RevisionComparison,
} from "@/types/article-diff";

export type AnyObject = Record<string, unknown>;

type MongooseLikeObject = {
  toObject(options?: {
    depopulate?: boolean;
  }): Record<string, unknown>;
};

/**
 * Check whether a value is a plain object.
 */
function isObject(
  value: unknown
): value is AnyObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * Convert an unknown value into an object.
 */
function asObject(
  value: unknown
): AnyObject {
  return isObject(value) ? value : {};
}

/**
 * Check whether an object is a Mongoose document
 * or subdocument with toObject().
 */
function isMongooseObject(
  value: object
): value is MongooseLikeObject {
  return (
    "toObject" in value &&
    typeof value.toObject === "function"
  );
}

/**
 * Safely get a string value.
 */
function getString(
  value: unknown
): string {
  return typeof value === "string"
    ? value
    : String(value ?? "");
}

/**
 * Safely get a number.
 */
function getNumber(
  value: unknown,
  fallback: number
): number {
  return typeof value === "number"
    ? value
    : fallback;
}

/**
 * Normalize text for comparison.
 */
function normalizeText(
  value: unknown
): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Normalize any value for comparison.
 */
function normalizeValue(
  value: unknown
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (typeof value === "string") {
    return normalizeText(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Normalize a block into the application's
 * RevisionBlock type.
 */
function normalizeRevisionBlock(
  value: unknown
): RevisionBlock {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return {
      type: "paragraph",
      content: "",
    };
  }

  const object =
    value as Record<string, unknown>;

  const validTypes = [
    "paragraph",
    "heading",
    "quote",
    "image",
    "video",
    "link",
    "code",
    "table",
    "list",
    "ordered-list",
    "math",
  ] as const;

  const type =
    typeof object.type === "string" &&
    validTypes.includes(
      object.type as (typeof validTypes)[number]
    )
      ? (object.type as (typeof validTypes)[number])
      : "paragraph";

  return {
    _id:
      typeof object._id === "string"
        ? object._id
        : undefined,

    type,

    content:
      object.content ?? "",

    order:
      typeof object.order === "number"
        ? object.order
        : undefined,
  };
}

/**
 * Normalize a section.
 */
function normalizeSection(
  value: unknown
): Section {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return {
      title: "",
      blocks: [],
    };
  }

  const object =
    value as Record<string, unknown>;

  return {
    ...object,

    title:
      typeof object.title === "string"
        ? object.title
        : "",

    level:
      typeof object.level === "number"
        ? object.level
        : undefined,

    order:
      typeof object.order === "number"
        ? object.order
        : undefined,

    blocks: Array.isArray(object.blocks)
      ? object.blocks.map(
          normalizeRevisionBlock
        )
      : [],
  };
}

/**
 * Normalize an infobox.
 */
function normalizeInfobox(
  value: unknown
): InfoboxData {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return {
      fields: [],
    };
  }

  const object =
    value as Record<string, unknown>;

  const fields: InfoboxField[] =
    Array.isArray(object.fields)
      ? object.fields.map((field) => {
          if (
            typeof field !== "object" ||
            field === null
          ) {
            return {
              value: field,
            };
          }

          const item =
            field as Record<string, unknown>;

          return {
            _id:
              typeof item._id === "string"
                ? item._id
                : undefined,

            label:
              typeof item.label === "string"
                ? item.label
                : undefined,

            value: item.value,

            order:
              typeof item.order === "number"
                ? item.order
                : undefined,
          };
        })
      : [];

  return {
    ...object,
    fields,
  };
}

/**
 * Remove MongoDB-specific identifiers before
 * comparing content.
 */
function cleanObject(
  value: unknown,
  seen?: WeakSet<object>
): unknown {
  if (!(seen instanceof WeakSet)) {
    seen = new WeakSet<object>();
  }

  if (
    value === null ||
    value === undefined
  ) {
    return value;
  }

  if (
    typeof value !== "object"
  ) {
    return value;
  }

  /*
   * Convert Mongoose documents/subdocuments
   * into plain objects.
   */
  if (isMongooseObject(value)) {
    value = value.toObject({
      depopulate: true,
    });
  }

  if (
    value === null ||
    typeof value !== "object"
  ) {
    return value;
  }

  /*
   * Prevent circular references.
   */
  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  /*
   * Arrays.
   */
  if (Array.isArray(value)) {
    return value.map((item) =>
      cleanObject(item, seen)
    );
  }

  /*
   * Dates.
   */
  if (value instanceof Date) {
    return value.toISOString();
  }

  const objectValue =
    value as Record<string, unknown>;

  const result: AnyObject = {};

  for (const key of Object.keys(objectValue)) {
    if (
      key === "_id" ||
      key === "__v" ||
      key === "$__" ||
      key === "$isNew" ||
      key === "$locals" ||
      key === "$op"
    ) {
      continue;
    }

    result[key] = cleanObject(
      objectValue[key],
      seen
    );
  }

  return result;
}


/**
 * Compare two objects while ignoring
 * MongoDB-specific fields.
 */
function objectsEqual(
  from: AnyObject,
  to: AnyObject
): boolean {
  return (
    JSON.stringify(
      cleanObject(from)
    ) ===
    JSON.stringify(
      cleanObject(to)
    )
  );
}

/**
 * Get a stable signature for blocks.
 */
function blockSignature(
  block: AnyObject
): string | null {
  const type = block.type;

  const content = asObject(
    block.content
  );

  switch (type) {
    case "image":
      return [
        type,
        normalizeValue(
          content.caption
        ),
        normalizeValue(
          content.alt
        ),
      ].join("|");

    case "video":
      return [
        type,
        normalizeValue(
          content.caption
        ),
      ].join("|");

    case "link":
      return [
        type,
        normalizeValue(
          content.text
        ),
      ].join("|");

    case "code":
      return [
        type,
        normalizeValue(
          content.language
        ),
      ].join("|");

    case "table":
      return [
        type,
        normalizeValue(
          content.headers
        ),
      ].join("|");

    case "list":
    case "ordered-list":
      return [
        type,
        normalizeValue(
          block.content
        ),
      ].join("|");

    default:
      return null;
  }
}

/**
 * Calculate similarity between two blocks.
 */
function blockSimilarity(
  from: AnyObject,
  to: AnyObject
): number {
  if (
    from.type === undefined ||
    to.type === undefined ||
    from.type !== to.type
  ) {
    return 0;
  }

  const type = from.type;

  const oldContent =
    from.content;

  const newContent =
    to.content;

  if (
    oldContent === undefined ||
    newContent === undefined
  ) {
    return 0;
  }

  if (
    normalizeValue(oldContent) ===
    normalizeValue(newContent)
  ) {
    return 1;
  }

  /*
   * Images.
   */
  if (type === "image") {
    const oldImage =
      asObject(oldContent);

    const newImage =
      asObject(newContent);

    let score = 0;

    if (
      normalizeValue(
        oldImage.caption
      ) ===
      normalizeValue(
        newImage.caption
      )
    ) {
      score += 0.3;
    }

    if (
      normalizeValue(
        oldImage.alt
      ) ===
      normalizeValue(
        newImage.alt
      )
    ) {
      score += 0.3;
    }

    if (
      normalizeValue(
        oldImage.url
      ) ===
      normalizeValue(
        newImage.url
      )
    ) {
      score += 0.4;
    }

    return score;
  }

  /*
   * Videos.
   */
  if (type === "video") {
    const oldVideo =
      asObject(oldContent);

    const newVideo =
      asObject(newContent);

    let score = 0;

    if (
      normalizeValue(
        oldVideo.caption
      ) ===
      normalizeValue(
        newVideo.caption
      )
    ) {
      score += 0.4;
    }

    if (
      normalizeValue(
        oldVideo.url
      ) ===
      normalizeValue(
        newVideo.url
      )
    ) {
      score += 0.6;
    }

    return score;
  }

  /*
   * Links.
   */
  if (type === "link") {
    const oldLink =
      asObject(oldContent);

    const newLink =
      asObject(newContent);

    let score = 0;

    if (
      normalizeValue(
        oldLink.text
      ) ===
      normalizeValue(
        newLink.text
      )
    ) {
      score += 0.4;
    }

    if (
      normalizeValue(
        oldLink.url
      ) ===
      normalizeValue(
        newLink.url
      )
    ) {
      score += 0.6;
    }

    return score;
  }

  /*
   * Code.
   */
  if (type === "code") {
    const oldCode =
      asObject(oldContent);

    const newCode =
      asObject(newContent);

    let score = 0;

    if (
      normalizeValue(
        oldCode.language
      ) ===
      normalizeValue(
        newCode.language
      )
    ) {
      score += 0.3;
    }

    if (
      normalizeValue(
        oldCode.code
      ) ===
      normalizeValue(
        newCode.code
      )
    ) {
      score += 0.7;
    }

    return score;
  }

  /*
   * Tables.
   */
  if (type === "table") {
    const oldTable =
      asObject(oldContent);

    const newTable =
      asObject(newContent);

    let score = 0;

    if (
      normalizeValue(
        oldTable.headers
      ) ===
      normalizeValue(
        newTable.headers
      )
    ) {
      score += 0.4;
    }

    if (
      normalizeValue(
        oldTable.rows
      ) ===
      normalizeValue(
        newTable.rows
      )
    ) {
      score += 0.6;
    }

    return score;
  }

  /*
   * Lists.
   */
  if (
    type === "list" ||
    type === "ordered-list"
  ) {
    return normalizeValue(
      oldContent
    ) ===
      normalizeValue(
        newContent
      )
      ? 1
      : 0;
  }

  /*
   * Text blocks.
   */
  if (
    type === "paragraph" ||
    type === "heading" ||
    type === "quote" ||
    type === "math"
  ) {
    const oldWords = new Set(
      normalizeText(oldContent)
        .split(" ")
        .filter(Boolean)
    );

    const newWords = new Set(
      normalizeText(newContent)
        .split(" ")
        .filter(Boolean)
    );

    if (
      oldWords.size === 0 ||
      newWords.size === 0
    ) {
      return 0;
    }

    let common = 0;

    for (const word of oldWords) {
      if (newWords.has(word)) {
        common++;
      }
    }

    return (
      common /
      Math.max(
        oldWords.size,
        newWords.size
      )
    );
  }

  return 0;
}

/**
 * Compare blocks inside a section.
 */
function compareBlocks(
  fromBlocks: AnyObject[] = [],
  toBlocks: AnyObject[] = []
): BlockChanges {
  const added: RevisionBlock[] = [];
  const removed: RevisionBlock[] = [];
  const modified: BlockChange[] = [];

  const usedFrom =
    new Set<number>();

  const usedTo =
    new Set<number>();

  /*
   * STEP 1
   *
   * Match blocks using stable semantic
   * signatures.
   */
  for (
    let toIndex = 0;
    toIndex < toBlocks.length;
    toIndex++
  ) {
    const toBlock =
      toBlocks[toIndex];

    const signature =
      blockSignature(toBlock);

    if (signature === null) {
      continue;
    }

    let matchIndex = -1;

    for (
      let fromIndex = 0;
      fromIndex < fromBlocks.length;
      fromIndex++
    ) {
      if (
        usedFrom.has(fromIndex)
      ) {
        continue;
      }

      const fromSignature =
        blockSignature(
          fromBlocks[fromIndex]
        );

      if (
        fromSignature !== null &&
        fromSignature === signature
      ) {
        matchIndex = fromIndex;
        break;
      }
    }

    if (matchIndex === -1) {
      continue;
    }

    usedFrom.add(matchIndex);
    usedTo.add(toIndex);

    const fromBlock =
      fromBlocks[matchIndex];

    if (
      !objectsEqual(
        fromBlock,
        toBlock
      )
    ) {
      modified.push({
        order: getNumber(
          toBlock.order,
          toIndex
        ),
        from:
          normalizeRevisionBlock(
            fromBlock
          ),
        to:
          normalizeRevisionBlock(
            toBlock
          ),
      });
    }
  }

  /*
   * STEP 2
   *
   * Match remaining blocks using
   * similarity.
   */
  for (
    let toIndex = 0;
    toIndex < toBlocks.length;
    toIndex++
  ) {
    if (usedTo.has(toIndex)) {
      continue;
    }

    const toBlock =
      toBlocks[toIndex];

    let bestIndex = -1;
    let bestScore = 0;

    for (
      let fromIndex = 0;
      fromIndex < fromBlocks.length;
      fromIndex++
    ) {
      if (
        usedFrom.has(fromIndex)
      ) {
        continue;
      }

      const fromBlock =
        fromBlocks[fromIndex];

      const score =
        blockSimilarity(
          fromBlock,
          toBlock
        );

      if (score > bestScore) {
        bestScore = score;
        bestIndex = fromIndex;
      }
    }

    if (
      bestIndex !== -1 &&
      bestScore >= 0.35
    ) {
      usedFrom.add(bestIndex);
      usedTo.add(toIndex);

      const fromBlock =
        fromBlocks[bestIndex];

      if (
        !objectsEqual(
          fromBlock,
          toBlock
        )
      ) {
        modified.push({
          order: getNumber(
            toBlock.order,
            toIndex
          ),
          from:
            normalizeRevisionBlock(
              fromBlock
            ),
          to:
            normalizeRevisionBlock(
              toBlock
            ),
        });
      }
    }
  }

  /*
   * STEP 3
   *
   * Unmatched old blocks are removed.
   */
  for (
    let fromIndex = 0;
    fromIndex < fromBlocks.length;
    fromIndex++
  ) {
    if (
      !usedFrom.has(fromIndex)
    ) {
      removed.push(
        normalizeRevisionBlock(
          fromBlocks[fromIndex]
        )
      );
    }
  }

  /*
   * STEP 4
   *
   * Unmatched new blocks are added.
   */
  for (
    let toIndex = 0;
    toIndex < toBlocks.length;
    toIndex++
  ) {
    if (
      !usedTo.has(toIndex)
    ) {
      added.push(
        normalizeRevisionBlock(
          toBlocks[toIndex]
        )
      );
    }
  }

  return {
    added,
    removed,
    modified,
  };
}

/**
 * Find a section by title.
 */
function sectionKey(
  section: AnyObject
): string {
  return normalizeText(
    section.title
  );
}

/**
 * Convert an unknown sections value
 * into an array of objects.
 */
function asObjectArray(
  value: unknown
): AnyObject[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    isObject
  );
}

/**
 * Compare sections.
 */
function compareSections(
  fromSections: AnyObject[] = [],
  toSections: AnyObject[] = []
): SectionChanges {
  const added: Section[] = [];
  const removed: Section[] = [];
  const modified: SectionChange[] = [];

  const usedFrom =
    new Set<number>();

  const usedTo =
    new Set<number>();

  /*
   * Match sections by title.
   */
  for (
    let toIndex = 0;
    toIndex < toSections.length;
    toIndex++
  ) {
    const toSection =
      toSections[toIndex];

    const key =
      sectionKey(toSection);

    let fromIndex = -1;

    for (
      let i = 0;
      i < fromSections.length;
      i++
    ) {
      if (usedFrom.has(i)) {
        continue;
      }

      if (
        sectionKey(
          fromSections[i]
        ) === key
      ) {
        fromIndex = i;
        break;
      }
    }

    if (fromIndex === -1) {
      continue;
    }

    usedFrom.add(fromIndex);
    usedTo.add(toIndex);

    const fromSection =
      fromSections[fromIndex];

    const blocks =
      compareBlocks(
        asObjectArray(
          fromSection.blocks
        ),
        asObjectArray(
          toSection.blocks
        )
      );

    const sectionChanged =
      fromSection.level !==
        toSection.level ||
      fromSection.order !==
        toSection.order ||
      blocks.added.length > 0 ||
      blocks.removed.length > 0 ||
      blocks.modified.length > 0;

    if (sectionChanged) {
      modified.push({
        title: getString(
          toSection.title
        ),

        from:
          normalizeSection(
            fromSection
          ),

        to:
          normalizeSection(
            toSection
          ),

        blocks: {
          added:
            blocks.added ?? [],

          removed:
            blocks.removed ?? [],

          modified:
            blocks.modified ?? [],
        },
      });
    }
  }

  /*
   * Unmatched old sections were removed.
   */
  for (
    let i = 0;
    i < fromSections.length;
    i++
  ) {
    if (!usedFrom.has(i)) {
      removed.push(
        normalizeSection(
          fromSections[i]
        )
      );
    }
  }

  /*
   * Unmatched new sections were added.
   */
  for (
    let i = 0;
    i < toSections.length;
    i++
  ) {
    if (!usedTo.has(i)) {
      added.push(
        normalizeSection(
          toSections[i]
        )
      );
    }
  }

  return {
    added,
    removed,
    modified,
  };
}

/**
 * Compare infobox.
 */
function compareInfobox(
  from: AnyObject | null,
  to: AnyObject | null
): InfoboxChanges {
  /*
   * Neither revision has an infobox.
   */
  if (!from && !to) {
    return {
      changed: false,

      title: {
        changed: false,
        from: null,
        to: null,
      },

      image: {
        changed: false,
        from: null,
        to: null,
      },

      fields: {
        added: [],
        removed: [],
        modified: [],
      },
    };
  }

  /*
   * Infobox added.
   */
  if (!from && to) {
    return {
      changed: true,
      added: normalizeInfobox(to),
    };
  }

  /*
   * Infobox removed.
   */
  if (from && !to) {
    return {
      changed: true,
      removed: normalizeInfobox(from),
    };
  }

  /*
   * At this point both values exist.
   */
  if (!from || !to) {
    throw new Error(
      "Invalid infobox comparison state"
    );
  }

  const oldFields =
    asObjectArray(
      from.fields
    );

  const newFields =
    asObjectArray(
      to.fields
    );

  const oldMap =
    new Map<string, AnyObject>();

  for (const field of oldFields) {
    oldMap.set(
      normalizeText(
        field.label
      ),
      field
    );
  }

  const newMap =
    new Map<string, AnyObject>();

  for (const field of newFields) {
    newMap.set(
      normalizeText(
        field.label
      ),
      field
    );
  }

  const added: InfoboxField[] = [];
  const removed: InfoboxField[] = [];
  const modified: InfoboxFieldChange[] = [];

  /*
   * Added fields.
   */
  for (
    const [key, field] of newMap
  ) {
    if (!oldMap.has(key)) {
      const normalized =
        normalizeInfobox({
          fields: [field],
        });

      if (normalized.fields[0]) {
        added.push(
          normalized.fields[0]
        );
      }
    }
  }

  /*
   * Removed fields.
   */
  for (
    const [key, field] of oldMap
  ) {
    if (!newMap.has(key)) {
      const normalized =
        normalizeInfobox({
          fields: [field],
        });

      if (normalized.fields[0]) {
        removed.push(
          normalized.fields[0]
        );
      }
    }
  }

  /*
   * Modified fields.
   */
  for (
    const [key, oldField] of oldMap
  ) {
    const newField =
      newMap.get(key);

    if (!newField) {
      continue;
    }

    if (
      oldField.label !==
        newField.label ||
      oldField.value !==
        newField.value ||
      oldField.order !==
        newField.order
    ) {
      const oldNormalized =
        normalizeInfobox({
          fields: [oldField],
        });

      const newNormalized =
        normalizeInfobox({
          fields: [newField],
        });

      if (
        oldNormalized.fields[0] &&
        newNormalized.fields[0]
      ) {
        modified.push({
          from:
            oldNormalized.fields[0],
          to:
            newNormalized.fields[0],
        });
      }
    }
  }

  const titleChanged =
    from.title !== to.title;

  const imageChanged =
    from.image !== to.image;

  const changed =
    titleChanged ||
    imageChanged ||
    added.length > 0 ||
    removed.length > 0 ||
    modified.length > 0;

  return {
    changed,

    title: {
      changed: titleChanged,
      from: from.title ?? null,
      to: to.title ?? null,
    },

    image: {
      changed: imageChanged,
      from: from.image ?? null,
      to: to.image ?? null,
    },

    fields: {
      added,
      removed,
      modified,
    },
  };
}

/**
 * Normalize a reference.
 */
function normalizeReference(
  value: unknown
): ArticleReference {
  const object =
    asObject(value);

  return {
    _id:
      typeof object._id === "string"
        ? object._id
        : undefined,

    title:
      typeof object.title === "string"
        ? object.title
        : undefined,

    url:
      typeof object.url === "string"
        ? object.url
        : undefined,

    publisher:
      typeof object.publisher === "string"
        ? object.publisher
        : undefined,

    accessedAt:
      typeof object.accessedAt ===
        "string" ||
      object.accessedAt instanceof Date
        ? object.accessedAt
        : undefined,

    description:
      typeof object.description ===
      "string"
        ? object.description
        : undefined,
  };
}

/**
 * Compare references.
 *
 * References are matched by URL first,
 * then by title.
 */
function compareReferences(
  from: AnyObject[] = [],
  to: AnyObject[] = []
): ReferenceChanges {
  const oldReferences =
    from.map(normalizeReference);

  const newReferences =
    to.map(normalizeReference);

  const usedOld =
    new Set<number>();

  const usedNew =
    new Set<number>();

  const added: ArticleReference[] = [];
  const removed: ArticleReference[] = [];
  const modified: ReferenceChange[] = [];

  /*
   * STEP 1
   *
   * Match by URL.
   */
  for (
    let newIndex = 0;
    newIndex < newReferences.length;
    newIndex++
  ) {
    const newReference =
      newReferences[newIndex];

    let oldIndex = -1;

    for (
      let i = 0;
      i < oldReferences.length;
      i++
    ) {
      if (usedOld.has(i)) {
        continue;
      }

      if (
        normalizeText(
          oldReferences[i].url
        ) ===
        normalizeText(
          newReference.url
        )
      ) {
        oldIndex = i;
        break;
      }
    }

    if (oldIndex === -1) {
      continue;
    }

    usedOld.add(oldIndex);
    usedNew.add(newIndex);

    if (
      !objectsEqual(
        oldReferences[oldIndex] as AnyObject,
        newReference as AnyObject
      )
    ) {
      modified.push({
        from:
          oldReferences[oldIndex],
        to: newReference,
      });
    }
  }

  /*
   * STEP 2
   *
   * Match remaining references by title.
   */
  for (
    let newIndex = 0;
    newIndex < newReferences.length;
    newIndex++
  ) {
    if (usedNew.has(newIndex)) {
      continue;
    }

    const newReference =
      newReferences[newIndex];

    let oldIndex = -1;

    for (
      let i = 0;
      i < oldReferences.length;
      i++
    ) {
      if (usedOld.has(i)) {
        continue;
      }

      if (
        normalizeText(
          oldReferences[i].title
        ) ===
        normalizeText(
          newReference.title
        )
      ) {
        oldIndex = i;
        break;
      }
    }

    if (oldIndex === -1) {
      continue;
    }

    usedOld.add(oldIndex);
    usedNew.add(newIndex);

    if (
      !objectsEqual(
        oldReferences[oldIndex] as AnyObject,
        newReference as AnyObject
      )
    ) {
      modified.push({
        from:
          oldReferences[oldIndex],
        to: newReference,
      });
    }
  }

  /*
   * STEP 3
   *
   * Remaining old references were removed.
   */
  for (
    let i = 0;
    i < oldReferences.length;
    i++
  ) {
    if (!usedOld.has(i)) {
      removed.push(
        oldReferences[i]
      );
    }
  }

  /*
   * STEP 4
   *
   * Remaining new references were added.
   */
  for (
    let i = 0;
    i < newReferences.length;
    i++
  ) {
    if (!usedNew.has(i)) {
      added.push(
        newReferences[i]
      );
    }
  }

  return {
    added,
    removed,
    modified,
  };
}

/**
 * Compare simple arrays.
 */
function compareSimpleArrays(
  from: unknown[] = [],
  to: unknown[] = []
): SimpleArrayChanges {
  const oldValues =
    from.map((value) =>
      cleanObject(value)
    );

  const newValues =
    to.map((value) =>
      cleanObject(value)
    );

  const usedOld =
    new Set<number>();

  const usedNew =
    new Set<number>();

  const added: unknown[] = [];
  const removed: unknown[] = [];

  /*
   * Match equal values.
   */
  for (
    let newIndex = 0;
    newIndex < newValues.length;
    newIndex++
  ) {
    const newValue =
      newValues[newIndex];

    const newJson =
      JSON.stringify(newValue);

    let oldIndex = -1;

    for (
      let oldIndexCandidate = 0;
      oldIndexCandidate < oldValues.length;
      oldIndexCandidate++
    ) {
      if (
        usedOld.has(
          oldIndexCandidate
        )
      ) {
        continue;
      }

      if (
        JSON.stringify(
          oldValues[
            oldIndexCandidate
          ]
        ) === newJson
      ) {
        oldIndex =
          oldIndexCandidate;
        break;
      }
    }

    if (oldIndex !== -1) {
      usedOld.add(oldIndex);
      usedNew.add(newIndex);
    }
  }

  /*
   * Remaining new values were added.
   */
  for (
    let i = 0;
    i < newValues.length;
    i++
  ) {
    if (!usedNew.has(i)) {
      added.push(
        newValues[i]
      );
    }
  }

  /*
   * Remaining old values were removed.
   */
  for (
    let i = 0;
    i < oldValues.length;
    i++
  ) {
    if (!usedOld.has(i)) {
      removed.push(
        oldValues[i]
      );
    }
  }

  return {
    added,
    removed,
    modified: [],
  };
}

/**
 * Main revision comparison.
 *
 * Explicit RevisionComparison return type is
 * important because it forces this service to
 * produce exactly the types consumed by the UI.
 */
export function compareRevisionData(
  fromRevision: AnyObject,
  toRevision: AnyObject
): RevisionComparison {
  const titleChanged =
    fromRevision.title !==
    toRevision.title;

  const summaryChanged =
    fromRevision.summary !==
    toRevision.summary;

  return {
    title: {
      changed: titleChanged,
      from: fromRevision.title,
      to: toRevision.title,
    },

    summary: {
      changed: summaryChanged,
      from: fromRevision.summary,
      to: toRevision.summary,
    },

    infobox: compareInfobox(
      isObject(
        fromRevision.infobox
      )
        ? fromRevision.infobox
        : null,

      isObject(
        toRevision.infobox
      )
        ? toRevision.infobox
        : null
    ),

    sections: compareSections(
      asObjectArray(
        fromRevision.sections
      ),
      asObjectArray(
        toRevision.sections
      )
    ),

    references: compareReferences(
      asObjectArray(
        fromRevision.references
      ),
      asObjectArray(
        toRevision.references
      )
    ),

    categories:
      compareSimpleArrays(
        Array.isArray(
          fromRevision.categories
        )
          ? fromRevision.categories
          : [],

        Array.isArray(
          toRevision.categories
        )
          ? toRevision.categories
          : []
      ),

    media:
      compareSimpleArrays(
        Array.isArray(
          fromRevision.media
        )
          ? fromRevision.media
          : [],

        Array.isArray(
          toRevision.media
        )
          ? toRevision.media
          : []
      ),
  };
}