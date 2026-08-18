import mongoose, {
  Schema,
  models,
} from "mongoose";

/* -----------------------------
   BLOCK SCHEMA
----------------------------- */

const BlockSchema = new Schema(
  {
    type: {
      type: String,

      enum: [
        "paragraph",
        "heading",
        "table",
        "image",
        "gallery",
        "video",
        "quote",
        "list",
        "ordered-list",
        "code",
        "math",
        "reference",
        "link",
        "infobox",
      ],

      required: true,
    },

    content: {
      type: Schema.Types.Mixed,
      default: null,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    _id: true,
  }
);


/* -----------------------------
   SECTION SCHEMA
----------------------------- */

const SectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },

    blocks: {
      type: [BlockSchema],
      default: [],
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    _id: true,
  }
);


/* -----------------------------
   REFERENCE SCHEMA
----------------------------- */

const ReferenceSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    url: {
      type: String,
      trim: true,
    },

    publisher: {
      type: String,
      trim: true,
    },

    author: {
      type: String,
      trim: true,
    },

    publishedAt: {
      type: Date,
    },

    accessedAt: {
      type: Date,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  }
);


/* -----------------------------
   MEDIA SCHEMA
----------------------------- */

const MediaSchema = new Schema(
  {
    type: {
      type: String,

      enum: [
        "image",
        "video",
        "file",
      ],

      required: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      default: "",
    },

    caption: {
      type: String,
      default: "",
    },

    alt: {
      type: String,
      default: "",
    },

    width: {
      type: Number,
      default: null,
    },

    height: {
      type: Number,
      default: null,
    },
  },
  {
    _id: true,
  }
);


/* -----------------------------
   INFOBOX FIELD SCHEMA
----------------------------- */

const InfoboxFieldSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: Schema.Types.Mixed,
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    _id: true,
  }
);


/* -----------------------------
   INFOBOX SCHEMA
----------------------------- */

const InfoboxSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: null,
    },

    fields: {
      type: [InfoboxFieldSchema],
      default: [],
    },
  },
  {
    _id: false,
  }
);


/* -----------------------------
   ARTICLE REVISION
----------------------------- */

const ArticleRevisionSchema = new Schema(
  {
    article: {
      type: Schema.Types.ObjectId,

      ref: "Article",

      required: true,

      index: true,
    },


    version: {
      type: Number,

      required: true,

      min: 1,
    },


    title: {
      type: String,

      required: true,

      trim: true,

      maxlength: 300,
    },


    summary: {
      type: String,

      default: "",
    },


    /* -------------------------
       ARTICLE SECTIONS
    ------------------------- */

    sections: {
      type: [SectionSchema],

      default: [],
    },


    /* -------------------------
       INFOBOX
    ------------------------- */

    infobox: {
      type: InfoboxSchema,

      default: null,
    },


    /* -------------------------
       REFERENCES
    ------------------------- */

    references: {
      type: [ReferenceSchema],

      default: [],
    },


    /* -------------------------
       MEDIA
    ------------------------- */

    media: {
      type: [MediaSchema],

      default: [],
    },


    /* -------------------------
       CATEGORIES
    ------------------------- */

    categories: [
      {
        type: Schema.Types.ObjectId,

        ref: "Category",
      },
    ],


    /* -------------------------
       EDIT INFORMATION
    ------------------------- */

    editSummary: {
      type: String,

      default: "",

      maxlength: 500,
    },


    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },
  },

  {
    timestamps: true,
  }
);


/* -----------------------------
   UNIQUE VERSION PER ARTICLE
----------------------------- */

ArticleRevisionSchema.index(
  {
    article: 1,
    version: 1,
  },
  {
    unique: true,
  }
);


export default models.ArticleRevision || mongoose.model("ArticleRevision", ArticleRevisionSchema);