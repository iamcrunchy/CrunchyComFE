// models/post.interface.ts
export interface Post {
  _id?: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  published: boolean;
}
