import mongoose, { Schema, models } from "mongoose";

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
},
{
  timestamps:true,
});

const Article = models.Article || mongoose.model("Article", ArticleSchema);

export default Article;