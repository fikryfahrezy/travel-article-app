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
  Put,
  Query,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UnhandledError } from "src/auth/auth.exception";
import { JwtPayload } from "src/core/jwt.service";
import { Jwt } from "src/decorators/jwt.decorator";
import { UnauthorizedError } from "src/exceptions/api.exception";
import { JwtGuard } from "src/guards/jwt.guard";
import {
  AuthReqDto,
  CreateArticleCommentReqDto,
  CreateArticleReqDto,
  DeleteArticleCommentReqDto,
  DeleteArticleReqDto,
  GetAllArticleCommentReqDto,
  GetAllArticleCommentResDto,
  GetAllArticleResDto,
  GetArticleCommentReqDto,
  GetArticleCommentResDto,
  GetArticleReqDto,
  GetArticleResDto,
  LikeArticleReqDto,
  MutationResDto,
  PaginationReqDto,
  UpdateArticleCommentReqDto,
  UpdateArticleReqDto,
} from "./article.dto";
import {
  ArticleCommentNotFoundError,
  ArticleNotFoundError,
} from "./article.exception";
import { ArticleFilter } from "./article.filter";
import { ArticleService } from "./article.service";

@Controller("articles")
@UseFilters(ArticleFilter)
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create article" })
  @ApiResponse({ status: 201, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard())
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
  @ApiOperation({ summary: "Get all article" })
  @ApiResponse({ status: 200, type: GetAllArticleResDto })
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard(false))
  async getAllArticle(
    @Jwt() jwt: JwtPayload | undefined,
    @Query() paginationReqDto: PaginationReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt ? jwt.sub : "" });
    const result = await this.articleService.getAllArticle(
      authReqDto,
      paginationReqDto,
    );
    return result;
  }

  @Get(":articleIdOrSlug")
  @HttpCode(200)
  @ApiOperation({ summary: "Get one article" })
  @ApiResponse({ status: 200, type: GetArticleResDto })
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 404, type: ArticleNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard(false))
  async getArticle(
    @Jwt() jwt: JwtPayload | undefined,
    @Param("articleIdOrSlug") articleIdOrSlug: string,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt ? jwt.sub : "" });
    const getArticleReqDto = new GetArticleReqDto({ articleIdOrSlug });
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
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 404, type: ArticleNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard())
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
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 404, type: ArticleNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard())
  async deleteArticle(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    const deleteArticleReqDto = new DeleteArticleReqDto({
      articleId,
    });
    const result = await this.articleService.deleteArticle(
      authReqDto,
      deleteArticleReqDto,
    );
    return result;
  }

  @Put(":articleId/likes")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Like / unlike article" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 404, type: ArticleNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard())
  async likeArticle(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
    @Body() likeArticleReqDto: LikeArticleReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    likeArticleReqDto.articleId = articleId;
    const result = await this.articleService.likeArticle(
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
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard())
  async createArticleComment(
    @Jwt() jwt: JwtPayload,
    @Param("articleId", ParseUUIDPipe) articleId: string,
    @Body() createArticleCommentReqDto: CreateArticleCommentReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    createArticleCommentReqDto.articleId = articleId;
    const result = await this.articleService.createArticleComment(
      authReqDto,
      createArticleCommentReqDto,
    );
    return result;
  }

  @Get(":articleId/comments")
  @HttpCode(200)
  @ApiOperation({ summary: "Get all article comment" })
  @ApiResponse({ status: 200, type: GetAllArticleCommentResDto })
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard(false))
  async getAllArticleComment(
    @Param("articleId", ParseUUIDPipe) articleId: string,
    @Query() paginationReqDto: PaginationReqDto,
  ) {
    const createArticleCommentDto = new GetAllArticleCommentReqDto({
      articleId,
      pagination: paginationReqDto,
    });
    const result = await this.articleService.getAllArticleComment(
      createArticleCommentDto,
    );
    return result;
  }

  @Get("comments/:commentId")
  @HttpCode(200)
  @ApiOperation({ summary: "Get one article comment" })
  @ApiResponse({ status: 200, type: GetArticleCommentResDto })
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 404, type: ArticleCommentNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard(false))
  async getArticleComment(
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ) {
    const getArticleCommentReqDto = new GetArticleCommentReqDto({
      commentId,
    });
    const result = await this.articleService.getArticleComment(
      getArticleCommentReqDto,
    );
    return result;
  }

  @Patch("comments/:commentId")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update article comment" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 404, type: ArticleCommentNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard())
  async updateArticleComment(
    @Jwt() jwt: JwtPayload,
    @Param("commentId", ParseUUIDPipe) commentId: string,
    @Body() updateArticleCommentReqDto: UpdateArticleCommentReqDto,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    updateArticleCommentReqDto.commentId = commentId;
    const result = await this.articleService.updateArticleComment(
      authReqDto,
      updateArticleCommentReqDto,
    );
    return result;
  }

  @Delete("comments/:commentId")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete article comment" })
  @ApiResponse({ status: 200, type: MutationResDto })
  @ApiResponse({ status: 401, type: UnauthorizedError })
  @ApiResponse({ status: 404, type: ArticleCommentNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtGuard())
  async deleteArticleComment(
    @Jwt() jwt: JwtPayload,
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ) {
    const authReqDto = new AuthReqDto({ userId: jwt.sub });
    const deleteArticleCommentReqDto = new DeleteArticleCommentReqDto({
      commentId,
    });
    const result = await this.articleService.deleteArticleComment(
      authReqDto,
      deleteArticleCommentReqDto,
    );
    return result;
  }
}
