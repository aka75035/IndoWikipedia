type AnyObject = Record<string, any>;

type BlockChange = {
  order: number;
  from: AnyObject;
  to: AnyObject;
};

type SectionChange = {
  title: string;
  from: AnyObject;
  to: AnyObject;
  blocks: {
    added: AnyObject[];
    removed: AnyObject[];
    modified: BlockChange[];
  };
};

/**
 * Normalize text for comparison.
 */
function normalizeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Normalize any value for comparison.
 */
function normalizeValue(value: unknown): string {
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
 * Remove MongoDB-specific identifiers before
 * comparing content.
 */
function cleanObject(
  value: any,
  seen?: WeakSet<object>
): any {
  /*
   * Array.map(cleanObject) passes:
   *
   * cleanObject(value, index, array)
   *
   * Therefore the second argument may NOT
   * be a WeakSet.
   */
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
  if (
    typeof value.toObject === "function"
  ) {
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
   * Arrays
   */
  if (Array.isArray(value)) {
    return value.map((item) =>
      cleanObject(item, seen)
    );
  }

  /*
   * Dates
   */
  if (value instanceof Date) {
    return value.toISOString();
  }

  const result: AnyObject = {};

  for (const key of Object.keys(value)) {
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
      value[key],
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
    JSON.stringify(cleanObject(from)) ===
    JSON.stringify(cleanObject(to))
  );
}

/**
 * Get a stable signature for blocks that can
 * safely be identified by their structure.
 *
 * Text blocks are intentionally excluded because
 * their content may change while remaining the
 * same logical block.
 */
function blockSignature(
  block: AnyObject
): string | null {
  if (!block) {
    return null;
  }

  const type = block.type;
  const content = block.content;

  switch (type) {
    case "image":
      return [
        type,
        normalizeValue(content?.caption),
        normalizeValue(content?.alt),
      ].join("|");

    case "video":
      return [
        type,
        normalizeValue(content?.caption),
      ].join("|");

    case "link":
      return [
        type,
        normalizeValue(content?.text),
      ].join("|");

    case "code":
      return [
        type,
        normalizeValue(content?.language),
      ].join("|");

    case "table":
      return [
        type,
        normalizeValue(
          content?.headers
        ),
      ].join("|");

    case "list":
    case "ordered-list":
      return [
        type,
        normalizeValue(content),
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
    !from ||
    !to ||
    from.type !== to.type
  ) {
    return 0;
  }

  const type = from.type;

  const oldContent = from.content;
  const newContent = to.content;

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

  /**
   * Images
   */
  if (type === "image") {
    let score = 0;

    if (
      normalizeValue(
        oldContent.caption
      ) ===
      normalizeValue(
        newContent.caption
      )
    ) {
      score += 0.3;
    }

    if (
      normalizeValue(oldContent.alt) ===
      normalizeValue(newContent.alt)
    ) {
      score += 0.3;
    }

    if (
      normalizeValue(oldContent.url) ===
      normalizeValue(newContent.url)
    ) {
      score += 0.4;
    }

    return score;
  }

  /**
   * Videos
   */
  if (type === "video") {
    let score = 0;

    if (
      normalizeValue(
        oldContent.caption
      ) ===
      normalizeValue(
        newContent.caption
      )
    ) {
      score += 0.4;
    }

    if (
      normalizeValue(oldContent.url) ===
      normalizeValue(newContent.url)
    ) {
      score += 0.6;
    }

    return score;
  }

  /**
   * Links
   */
  if (type === "link") {
    let score = 0;

    if (
      normalizeValue(oldContent.text) ===
      normalizeValue(newContent.text)
    ) {
      score += 0.4;
    }

    if (
      normalizeValue(oldContent.url) ===
      normalizeValue(newContent.url)
    ) {
      score += 0.6;
    }

    return score;
  }

  /**
   * Code
   */
  if (type === "code") {
    let score = 0;

    if (
      normalizeValue(
        oldContent.language
      ) ===
      normalizeValue(
        newContent.language
      )
    ) {
      score += 0.3;
    }

    if (
      normalizeValue(oldContent.code) ===
      normalizeValue(newContent.code)
    ) {
      score += 0.7;
    }

    return score;
  }

  /**
   * Tables
   */
  if (type === "table") {
    let score = 0;

    if (
      normalizeValue(
        oldContent.headers
      ) ===
      normalizeValue(
        newContent.headers
      )
    ) {
      score += 0.4;
    }

    if (
      normalizeValue(oldContent.rows) ===
      normalizeValue(newContent.rows)
    ) {
      score += 0.6;
    }

    return score;
  }

  /**
   * Lists
   */
  if (
    type === "list" ||
    type === "ordered-list"
  ) {
    return (
      normalizeValue(oldContent) ===
      normalizeValue(newContent)
        ? 1
        : 0
    );
  }

  /**
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
) {
  const added: AnyObject[] = [];
  const removed: AnyObject[] = [];
  const modified: BlockChange[] = [];

  const usedFrom = new Set<number>();
  const usedTo = new Set<number>();

  /**
   * STEP 1
   *
   * Match blocks using a stable semantic
   * signature.
   *
   * Text blocks are skipped here because
   * their content is allowed to change.
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
      if (usedFrom.has(fromIndex)) {
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
        order:
          toBlock.order ??
          toIndex,
        from: fromBlock,
        to: toBlock,
      });
    }
  }

  /**
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
      if (usedFrom.has(fromIndex)) {
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

    /**
     * Conservative threshold.
     */
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
          order:
            toBlock.order ??
            toIndex,
          from: fromBlock,
          to: toBlock,
        });
      }
    }
  }

  /**
   * STEP 3
   *
   * Unmatched old blocks are removed.
   */
  for (
    let fromIndex = 0;
    fromIndex < fromBlocks.length;
    fromIndex++
  ) {
    if (!usedFrom.has(fromIndex)) {
      removed.push(
        fromBlocks[fromIndex]
      );
    }
  }

  /**
   * STEP 4
   *
   * Unmatched new blocks are added.
   */
  for (
    let toIndex = 0;
    toIndex < toBlocks.length;
    toIndex++
  ) {
    if (!usedTo.has(toIndex)) {
      added.push(
        toBlocks[toIndex]
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
    section?.title
  );
}

/**
 * Compare sections.
 */
function compareSections(
  fromSections: AnyObject[] = [],
  toSections: AnyObject[] = []
) {
  const added: AnyObject[] = [];
  const removed: AnyObject[] = [];
  const modified: SectionChange[] = [];

  const usedFrom = new Set<number>();
  const usedTo = new Set<number>();

  /**
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
        fromSection.blocks ?? [],
        toSection.blocks ?? []
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
        title:
          toSection.title,
        from: fromSection,
        to: toSection,
        blocks,
      });
    }
  }

  /**
   * Unmatched old sections were removed.
   */
  for (
    let i = 0;
    i < fromSections.length;
    i++
  ) {
    if (!usedFrom.has(i)) {
      removed.push(
        fromSections[i]
      );
    }
  }

  /**
   * Unmatched new sections were added.
   */
  for (
    let i = 0;
    i < toSections.length;
    i++
  ) {
    if (!usedTo.has(i)) {
      added.push(
        toSections[i]
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
) {
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

  if (!from && to) {
    return {
      changed: true,
      added: cleanObject(to),
      removed: null,
    };
  }

  if (from && !to) {
    return {
      changed: true,
      added: null,
      removed: cleanObject(from),
    };
  }
    if (!from || !to) {
    throw new Error("Invalid infobox comparison state");
  }

  const oldFields: AnyObject[] = from.fields ?? [];

  const newFields: AnyObject[] =
    to.fields ?? [];

  const oldMap = new Map(
    oldFields.map((field) => [
      normalizeText(field.label),
      field,
    ])
  );

  const newMap = new Map(
    newFields.map((field) => [
      normalizeText(field.label),
      field,
    ])
  );

  const added: AnyObject[] = [];
  const removed: AnyObject[] = [];
  const modified: AnyObject[] = [];

  /**
   * Added fields.
   */
  for (const [key, field] of newMap) {
    if (!oldMap.has(key)) {
      added.push(
        cleanObject(field)
      );
    }
  }

  /**
   * Removed fields.
   */
  for (const [key, field] of oldMap) {
    if (!newMap.has(key)) {
      removed.push(
        cleanObject(field)
      );
    }
  }

  /**
   * Modified fields.
   */
  for (const [key, oldField] of oldMap) {
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
      modified.push({
        from: cleanObject(
          oldField
        ),
        to: cleanObject(
          newField
        ),
      });
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
 * Compare references.
 *
 * References are matched by URL first,
 * then by title.
 */
function compareReferences(
  from: AnyObject[] = [],
  to: AnyObject[] = []
) {
  const oldReferences = from.map((value) => cleanObject(value));

  const newReferences = to.map((value) => cleanObject(value));

  const usedOld = new Set<number>();
  const usedNew = new Set<number>();

  const added: AnyObject[] = [];
  const removed: AnyObject[] = [];
  const modified: AnyObject[] = [];

  /**
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
        oldReferences[oldIndex],
        newReference
      )
    ) {
      modified.push({
        from: oldReferences[oldIndex],
        to: newReference,
      });
    }
  }

  /**
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
        oldReferences[oldIndex],
        newReference
      )
    ) {
      modified.push({
        from: oldReferences[oldIndex],
        to: newReference,
      });
    }
  }

  /**
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

  /**
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
 *
 * Unlike the previous implementation, this
 * does not compare items by their array index.
 * Each item is matched and consumed once.
 */
function compareSimpleArrays(
  from: any[] = [],
  to: any[] = []
) {
  const oldValues = from.map((value) => cleanObject(value));

  const newValues = to.map((value) => cleanObject(value));

  const usedOld = new Set<number>();
  const usedNew = new Set<number>();

  const added: any[] = [];
  const removed: any[] = [];

  /**
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

  /**
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

  /**
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
  };
}

/**
 * Main revision comparison.
 */
export function compareRevisionData(
  fromRevision: AnyObject,
  toRevision: AnyObject
) {
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
      fromRevision.infobox ?? null,
      toRevision.infobox ?? null
    ),

    sections: compareSections(
      fromRevision.sections ?? [],
      toRevision.sections ?? []
    ),

    references: compareReferences(
      fromRevision.references ?? [],
      toRevision.references ?? []
    ),

    categories: compareSimpleArrays(
      fromRevision.categories ?? [],
      toRevision.categories ?? []
    ),

    media: compareSimpleArrays(
      fromRevision.media ?? [],
      toRevision.media ?? []
    ),
  };
}