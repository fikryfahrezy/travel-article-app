import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UnhandledError } from "src/auth/auth.exception";
import { JwtPayload } from "src/core/jwt.service";
import { Jwt } from "src/decorators/jwt.decorator";
import { JwtAuthGuard } from "src/guards/jwt.guard";
import {
  AuthReqDto,
  CreateArticleCommentReqDto,
  CreateArticleReqDto,
  CursorReqDto,
  DeleteArticleCommentReqDtoDto,
  DeleteArticleReqDto,
  GetAllArticleCommentReqDto,
  GetArticleCommentReqDto,
  GetArticleReqDto,
  LikeArticleReqDto,
  MutationResDto,
  PaginationQueryReqDto,
  UpdateArticleCommentReqDto,
  UpdateArticleReqDto,
} from "./article.dto";
import { ArticleNotFoundError } from "./article.exception";
import { ArticleService } from "./article.service";

@Controller("articles")
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create article" })
  @ApiResponse({ status: 201, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Jwt() jwt: JwtPayload,
    @Body() createArticleReqDto: CreateArticleReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    const result = await this.articleService.createArticle(
      authReqDto,
      createArticleReqDto,
    );
    return result;
  }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all article" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  async getAllArticle(
    @Jwt() jwt: JwtPayload,
    @Query() query: PaginationQueryReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    const cursorReqDto = new CursorReqDto(query.cursor, query.limit);
    const result = await this.articleService.getAllArticle(
      authReqDto,
      cursorReqDto,
    );
    return result;
  }

  @Get(":articleId")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get one article" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 404, type: ArticleNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  async getArticle(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    const getArticleReqDto = new GetArticleReqDto({ articleId });
    const result = await this.articleService.getArticle(
      authReqDto,
      getArticleReqDto,
    );
    return result;
  }

  @Patch(":articleId")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update article" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
    @Body() updateArticleReqDto: UpdateArticleReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    updateArticleReqDto.articleId = articleId;
    const result = await this.articleService.updateArticle(
      authReqDto,
      updateArticleReqDto,
    );
    return result;
  }

  @Delete(":articleId")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete article" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  deleteArticle(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    const deleteArticleReqDto = new DeleteArticleReqDto({
      articleId: articleId,
    });
    const result = this.articleService.deleteArticle(
      authReqDto,
      deleteArticleReqDto,
    );
    return result;
  }

  @Post(":articleId/likes")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Like / unlike article" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  likeArticle(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
    @Body() likeArticleReqDto: LikeArticleReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    likeArticleReqDto.articleId = articleId;
    const result = this.articleService.likeArticle(
      authReqDto,
      likeArticleReqDto,
    );
    return result;
  }

  @Post(":articleId/comments")
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create article article" })
  @ApiResponse({ status: 201, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  createArticleComment(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
    @Body() createArticleCommentReqDto: CreateArticleCommentReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    createArticleCommentReqDto.articleId = articleId;
    const result = this.articleService.createArticleComment(
      authReqDto,
      createArticleCommentReqDto,
    );
    return result;
  }

  @Get(":articleId/comments")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all article comment" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  getAllArticleComment(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
    @Query() query: PaginationQueryReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    const cursorReqDto = new CursorReqDto(query.cursor, query.limit);
    const createArticleCommentDto = new GetAllArticleCommentReqDto({
      articleId,
      cursor: cursorReqDto,
    });
    const result = this.articleService.getAllArticleComment(
      authReqDto,
      createArticleCommentDto,
    );
    return result;
  }

  @Get(":articleId/comments")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get one article comment" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  getArticleComment(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    const getArticleCommentReqDto = new GetArticleCommentReqDto({
      articleId,
    });
    const result = this.articleService.getArticleComment(
      authReqDto,
      getArticleCommentReqDto,
    );
    return result;
  }

  @Patch(":articleId/comments/:commentId")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update article comment" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  updateArticleComment(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
    @Param("commentId", ParseUUIDPipe) commentId: string,
    @Body() updateArticleCommentReqDto: UpdateArticleCommentReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    updateArticleCommentReqDto.articleId = articleId;
    updateArticleCommentReqDto.commentId = commentId;
    const result = this.articleService.updateArticleComment(
      authReqDto,
      updateArticleCommentReqDto,
    );
    return result;
  }

  @Delete(":articleId/comments/:commentId")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete article comment" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  deleteArticleComment(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    const deleteArticleCommentReqDtoDto = new DeleteArticleCommentReqDtoDto({
      articleId,
      commentId,
    });
    const result = this.articleService.deleteArticleComment(
      authReqDto,
      deleteArticleCommentReqDtoDto,
    );
    return result;
  }
}
