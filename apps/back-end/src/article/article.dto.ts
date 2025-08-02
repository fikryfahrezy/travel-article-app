import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class AuthReqDto {
  userId: string;

  constructor(obj: AuthReqDto) {
    this.userId = obj.userId;
  }
}

export class PaginationReqDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number = 0;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit: number = 10;
}

export class PaginationResDto extends PaginationReqDto {
  @ApiProperty({ name: "total_data" })
  @Expose({ name: "total_data" })
  totalData: number;

  @ApiProperty({ name: "total_pages" })
  @Expose({ name: "total_pages" })
  totalPages: number;

  constructor(obj: Omit<PaginationResDto & PaginationReqDto, "totalPages">) {
    super();
    this.totalData = obj.totalData;
    this.totalPages = Math.ceil(obj.totalData / obj.limit);
    this.page = obj.page;
    this.limit = obj.limit;
  }
}

export class CreateArticleReqDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;
}

export class GetAllArticleItemResDto {
  @ApiProperty({ name: "id" })
  @Expose({ name: "id" })
  id: string;

  @ApiProperty({ name: "title" })
  @Expose({ name: "title" })
  title: string;

  @ApiProperty({ name: "liked" })
  @Expose({ name: "liked" })
  liked: boolean;

  @ApiProperty({ name: "slug" })
  @Expose({ name: "slug" })
  slug: string;

  @ApiProperty({ name: "author_id" })
  @Expose({ name: "author_id" })
  authorId: string;

  @ApiProperty({ name: "author_username" })
  @Expose({ name: "author_username" })
  authorUsername: string;

  @ApiProperty({ name: "updated_at" })
  @Expose({ name: "updated_at" })
  updatedAt: Date;

  @ApiProperty({ name: "created_at" })
  @Expose({ name: "created_at" })
  createdAt: Date;

  constructor(obj: GetAllArticleItemResDto) {
    this.id = obj.id;
    this.title = obj.title;
    this.liked = obj.liked;
    this.slug = obj.slug;
    this.authorId = obj.authorId;
    this.authorUsername = obj.authorUsername;
    this.updatedAt = obj.updatedAt;
    this.createdAt = obj.createdAt;
  }
}

export class GetAllArticleResDto extends PaginationResDto {
  @ApiProperty({ type: [GetAllArticleItemResDto] })
  @Expose({ name: "data" })
  data: GetAllArticleItemResDto[];

  constructor(obj: Omit<GetAllArticleResDto & PaginationResDto, "totalPages">) {
    super(obj);
    this.data = obj.data;
  }
}

export class GetArticleReqDto {
  articleIdOrSlug: string;

  constructor(obj: GetArticleReqDto) {
    this.articleIdOrSlug = obj.articleIdOrSlug;
  }
}

export class GetArticleResDto extends GetAllArticleItemResDto {
  @Expose({ name: "content" })
  content: string;

  constructor(obj: GetArticleResDto & GetAllArticleItemResDto) {
    super(obj);
    this.content = obj.content;
  }
}

export class UpdateArticleReqDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @Exclude()
  articleId: string;
}

export class DeleteArticleReqDto {
  articleId: string;

  constructor(obj: DeleteArticleReqDto) {
    this.articleId = obj.articleId;
  }
}

export class LikeArticleReqDto {
  @ApiProperty()
  @IsBoolean()
  like: boolean;

  @Exclude()
  articleId: string;
}

export class CreateArticleCommentReqDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @Exclude()
  articleId: string;
}

export class GetAllArticleCommentReqDto {
  articleId: string;
  pagination: PaginationReqDto;

  constructor(obj: GetAllArticleCommentReqDto) {
    this.articleId = obj.articleId;
    this.pagination = obj.pagination;
  }
}

export class GetAllArticleCommentItemResDto {
  @ApiProperty({ name: "id" })
  @Expose({ name: "id" })
  id: string;

  @ApiProperty({ name: "content" })
  @Expose({ name: "content" })
  content: string;

  @ApiProperty({ name: "article_id" })
  @Expose({ name: "article_id" })
  articleId: string;

  @ApiProperty({ name: "article_title" })
  @Expose({ name: "article_title" })
  articleTitle: string;

  @ApiProperty({ name: "article_slug" })
  @Expose({ name: "article_slug" })
  articleSlug: string;

  @ApiProperty({ name: "article_author_id" })
  @Expose({ name: "article_author_id" })
  articleAuthorId: string;

  @ApiProperty({ name: "article_author_username" })
  @Expose({ name: "article_author_username" })
  articleAuthorUsername: string;

  @ApiProperty({ name: "author_id" })
  @Expose({ name: "author_id" })
  authorId: string;

  @ApiProperty({ name: "author_username" })
  @Expose({ name: "author_username" })
  authorUsername: string;

  @ApiProperty({ name: "updated_at" })
  @Expose({ name: "updated_at" })
  updatedAt: Date;

  @ApiProperty({ name: "created_at" })
  @Expose({ name: "created_at" })
  createdAt: Date;

  constructor(obj: GetAllArticleCommentItemResDto) {
    this.id = obj.id;
    this.content = obj.content;
    this.articleId = obj.articleId;
    this.articleSlug = obj.articleSlug;
    this.articleTitle = obj.articleTitle;
    this.articleAuthorId = obj.articleAuthorId;
    this.articleAuthorUsername = obj.articleAuthorUsername;
    this.authorId = obj.authorId;
    this.authorUsername = obj.authorUsername;
    this.updatedAt = obj.updatedAt;
    this.createdAt = obj.createdAt;
  }
}

export class GetAllArticleCommentResDto extends PaginationResDto {
  @ApiProperty({ type: [GetAllArticleCommentItemResDto] })
  @Expose({ name: "data" })
  data: GetAllArticleCommentItemResDto[];

  constructor(
    obj: Omit<GetAllArticleCommentResDto & PaginationResDto, "totalPages">,
  ) {
    super(obj);
    this.data = obj.data;
  }
}

export class GetArticleCommentReqDto {
  commentId: string;

  constructor(obj: GetArticleCommentReqDto) {
    this.commentId = obj.commentId;
  }
}

export class GetArticleCommentResDto extends GetAllArticleCommentItemResDto {
  @ApiProperty({ name: "content" })
  @Expose({ name: "content" })
  content: string;

  constructor(obj: GetArticleCommentResDto & GetAllArticleCommentItemResDto) {
    super(obj);
    this.content = obj.content;
  }
}

export class UpdateArticleCommentReqDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @Exclude()
  commentId: string;
}

export class DeleteArticleCommentReqDto {
  commentId: string;

  constructor(obj: DeleteArticleCommentReqDto) {
    this.commentId = obj.commentId;
  }
}

export class MutationResDto {
  @ApiProperty()
  id: string;

  constructor(obj: MutationResDto) {
    this.id = obj.id;
  }
}
