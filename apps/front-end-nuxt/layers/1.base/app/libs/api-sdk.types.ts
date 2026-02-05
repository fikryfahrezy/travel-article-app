export type ResponseError = {
  name: string;
  message: string;
  errors: string[];
};

export type RegisterReqDto = {
  name: string;
  username: string;
  password: string;
};

export type LoginReqDto = {
  username: string;
  password: string;
};

export type AuthResDto = {
  tokenType: "Bearer";
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export type LogoutReqDto = {
  token?: string;
};

export type LogoutResDto = {
  success: boolean;
};

export type ProfileReqDto = {
  token?: string;
};

export type ProfileResDto = {
  user_id: string;
  username: string;
};

export type CreateArticleReqDto = {
  title: string;
  content: string;
};

export type PaginationReqDto = {
  page?: number;
  limit?: number;
};

export type GetArticleReqDto = {
  idOrSlug: string;
};

export type UpdateArticleReqDto = {
  article_id: string;
  title: string;
  content: string;
};

export type DeleteArticleReqDto = {
  article_id: string;
};

export type LikeArticleReqDto = {
  article_id: string;
  like: boolean;
};

export type CreateArticleCommentReqDto = {
  content: string;
  article_id: string;
};

export type GetAllArticleCommentReqDto = {
  article_id: string;
  pagination: PaginationReqDto;
};

export type GetArticleCommentReqDto = {
  comment_id: string;
};

export type UpdateArticleCommentReqDto = {
  content: string;
  comment_id: string;
};

export type DeleteArticleCommentReqDto = {
  comment_id: string;
};

export type MutationResDto = {
  id: string;
};

export type PaginationResDto<TData> = Required<PaginationReqDto> & {
  total_data: number;
  total_pages: number;
  data: TData[];
};

export type GetAllArticleItemResDto = {
  id: string;
  title: string;
  liked: boolean;
  slug: string;
  author_id: string;
  author_username: string;
  updated_at: string;
  created_at: string;
};

export type GetAllArticleResDto = PaginationResDto<GetAllArticleItemResDto>;

export type GetArticleResDto = GetAllArticleItemResDto & {
  content: string;
};

export type GetAllArticleCommentItemResDto = {
  id: string;
  content: string;
  article_id: string;
  article_title: string;
  article_slug: string;
  article_author_id: string;
  article_author_username: string;
  author_id: string;
  author_username: string;
  updated_at: string;
  created_at: string;
};

export type GetAllArticleCommentResDto =
  PaginationResDto<GetAllArticleCommentItemResDto>;

export type GetArticleCommentResDto = GetAllArticleCommentItemResDto & {
  content: string;
};

export type Result<TData> =
  | {
    success: true;
    data: TData;
  }
  | {
    success: false;
    error: Error;
  };
