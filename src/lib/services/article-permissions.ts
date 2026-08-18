type ArticleForPermission = {
  status?: string;

  createdBy?: {
    _id?: {
      toString(): string;
    };
  };
};

type UserForPermission = {
  role?: string;

  _id?: {
    toString(): string;
  };
};

export function canViewArticle(
  article: ArticleForPermission,
  user: UserForPermission | null | undefined
): boolean {
  // Published articles are public
  if (article.status === "published") {
    return true;
  }

  // Unpublished article requires login
  if (!user) {
    return false;
  }

  // Editor and admin can view all
  if (
    user.role === "editor" ||
    user.role === "admin"
  ) {
    return true;
  }

  // Contributor can view own article
  if (
    user.role === "contributor" &&
    article.createdBy?._id?.toString() ===
      user._id?.toString()
  ) {
    return true;
  }

  return false;
}