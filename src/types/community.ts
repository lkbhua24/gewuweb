export interface Circle {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  membersCount: number;
  postsCount: number;
}

export interface Post {
  id: string;
  circleId: string;
  userId: string;
  title: string;
  content: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author?: PostAuthor;
}

export interface PostAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentId: string | null;
  likesCount: number;
  createdAt: string;
  author?: PostAuthor;
  replies?: Comment[];
}
