import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { decodeCursor } from "src/lib/cursor";

export class AuthReqDto {
  userId: string;

  constructor(obj: AuthReqDto) {
    this.userId = obj.userId;
  }
}

export class CursorReqDto {
  identifer?: string;
  date?: Date;
  limit: number;

  constructor(cursor: string = "", limit: number = 10) {
    this.limit = limit;

    const [identifer, date] = decodeCursor(cursor);
    if (identifer) {
      this.identifer = identifer;
    }

    if (date) {
      this.date = new Date(date);
    }
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

export class GetAllArticleResDto {
  @Expose({ name: "id" })
  id: string;

  @Expose({ name: "title" })
  title: string;

  @Expose({ name: "liked" })
  liked: boolean;

  @Expose({ name: "slug" })
  slug: string;

  @Expose({ name: "author_id" })
  authorId: string;

  @Expose({ name: "updated_at" })
  updatedAt: Date;

  @Expose({ name: "created_at" })
  createdAt: Date;

  constructor(obj: GetAllArticleResDto) {
    this.id = obj.id;
    this.title = obj.title;
    this.liked = obj.liked;
    this.slug = obj.slug;
    this.authorId = obj.authorId;
    this.updatedAt = obj.updatedAt;
    this.createdAt = obj.createdAt;
  }
}

export class GetArticleReqDto {
  articleId: string;

  constructor(obj: GetArticleReqDto) {
    this.articleId = obj.articleId;
  }
}

export class GetArticleResDto {
  @Expose({ name: "id" })
  id: string;

  @Expose({ name: "title" })
  title: string;

  @Expose({ name: "liked" })
  liked: boolean;

  @Expose({ name: "slug" })
  slug: string;

  @Expose({ name: "author_id" })
  authorId: string;

  @Expose({ name: "updated_at" })
  updatedAt: Date;

  @Expose({ name: "created_at" })
  createdAt: Date;

  constructor(obj: GetArticleResDto) {
    this.id = obj.id;
    this.title = obj.title;
    this.liked = obj.liked;
    this.slug = obj.slug;
    this.authorId = obj.authorId;
    this.updatedAt = obj.updatedAt;
    this.createdAt = obj.createdAt;
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

  constructor(obj: GetArticleCommentReqDto) {
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
  cursor: CursorReqDto;

  constructor(obj: GetAllArticleCommentReqDto) {
    this.articleId = obj.articleId;
    this.cursor = obj.cursor;
  }
}

export class GetArticleCommentReqDto {
  articleId: string;

  constructor(obj: GetArticleCommentReqDto) {
    this.articleId = obj.articleId;
  }
}

export class UpdateArticleCommentReqDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @Exclude()
  articleId: string;

  @Exclude()
  commentId: string;
}

export class DeleteArticleCommentReqDtoDto {
  articleId: string;
  commentId: string;

  constructor(obj: DeleteArticleCommentReqDtoDto) {
    this.articleId = obj.articleId;
    this.commentId = obj.commentId;
  }
}

export class PaginationQueryReqDto {
  @ApiProperty()
  @IsOptional()
  cursor: string = "";

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit: number = 10;
}

export class MutationResDto {
  id: string;

  constructor(obj: MutationResDto) {
    this.id = obj.id;
  }
}
