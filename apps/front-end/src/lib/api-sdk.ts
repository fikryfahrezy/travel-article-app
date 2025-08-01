import type {
  AuthResDto,
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
  LoginReqDto,
  LogoutResDto,
  MutationResDto,
  PaginationReqDto,
  ProfileResDto,
  RegisterReqDto,
  Result,
  UpdateArticleCommentReqDto,
  UpdateArticleReqDto,
} from "./api-sdk.types";

export class ApiSDK {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl + "/api";
  }

  async request<TData>(
    ...params: Parameters<typeof fetch>
  ): Promise<Result<TData>> {
    try {
      const response = await fetch(...params);
      if (!response.ok) {
        return {
          success: false,
          error: new Error("Failed to "),
        };
      }

      const responseBody = await response.json();
      return {
        success: true,
        data: responseBody,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: error,
        };
      }

      return {
        success: false,
        error: new Error(String(error)),
      };
    }
  }

  async register(registerReqDto: RegisterReqDto): Promise<Result<AuthResDto>> {
    return await this.request<AuthResDto>(this.baseUrl + "/auth/register", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(registerReqDto),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async login(loginReqDto: LoginReqDto): Promise<Result<AuthResDto>> {
    return await this.request<AuthResDto>(this.baseUrl + "/auth/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(loginReqDto),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async refresh(): Promise<Result<AuthResDto>> {
    return await this.request<AuthResDto>(this.baseUrl + "/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
  }

  async logout(): Promise<Result<LogoutResDto>> {
    return await this.request<LogoutResDto>(this.baseUrl + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  }

  async profile(): Promise<Result<ProfileResDto>> {
    return await this.request<ProfileResDto>(this.baseUrl + "/auth/profile", {
      method: "GET",
      credentials: "include",
    });
  }

  async createArticle(
    createArticleReqDto: CreateArticleReqDto,
  ): Promise<Result<MutationResDto>> {
    return await this.request<MutationResDto>(this.baseUrl + "/articles", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(createArticleReqDto),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAllArticle(
    paginationReqDto: PaginationReqDto,
  ): Promise<Result<GetAllArticleResDto>> {
    const { limit = 10, page = 1 } = paginationReqDto;
    const params = new URLSearchParams({
      limit: String(limit),
      page: String(page),
    });

    return await this.request<GetAllArticleResDto>(
      this.baseUrl + `/articles?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  }

  async getArticle(
    getArticleReqDto: GetArticleReqDto,
  ): Promise<Result<GetArticleResDto>> {
    const { article_id } = getArticleReqDto;
    return await this.request<GetArticleResDto>(
      this.baseUrl + `/articles/${article_id}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  }

  async updateArticle(
    updateArticleReqDto: UpdateArticleReqDto,
  ): Promise<Result<MutationResDto>> {
    const { article_id, ...restDto } = updateArticleReqDto;
    return await this.request<MutationResDto>(
      this.baseUrl + `/articles/${article_id}`,
      {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(restDto),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  async deleteArticle(
    deleteArticleReqDto: DeleteArticleReqDto,
  ): Promise<Result<MutationResDto>> {
    const { article_id } = deleteArticleReqDto;
    return await this.request<MutationResDto>(
      this.baseUrl + `/articles/${article_id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
  }

  async likeArticle(
    likeArticleReqDto: LikeArticleReqDto,
  ): Promise<Result<MutationResDto>> {
    const { article_id, ...restDto } = likeArticleReqDto;
    return await this.request<MutationResDto>(
      this.baseUrl + `/articles/${article_id}/likes`,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(restDto),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  async createArticleComment(
    createArticleCommentReqDto: CreateArticleCommentReqDto,
  ): Promise<Result<MutationResDto>> {
    const { article_id, ...restDto } = createArticleCommentReqDto;
    return await this.request<MutationResDto>(
      this.baseUrl + `/articles/${article_id}`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(restDto),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  async getAllArticleComment(
    getAllArticleCommentReqDto: GetAllArticleCommentReqDto,
  ): Promise<Result<GetAllArticleCommentResDto>> {
    const { article_id, pagination } = getAllArticleCommentReqDto;
    const { limit = 10, page = 1 } = pagination;
    const params = new URLSearchParams({
      limit: String(limit),
      page: String(page),
    });

    return await this.request<GetAllArticleCommentResDto>(
      this.baseUrl + `/articles/${article_id}/likes?${params.toString}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  }

  async getArticleComment(
    getArticleCommentReqDto: GetArticleCommentReqDto,
  ): Promise<Result<GetArticleCommentResDto>> {
    const { article_id, comment_id } = getArticleCommentReqDto;
    return await this.request<GetArticleCommentResDto>(
      this.baseUrl + `/articles/${article_id}/comments/${comment_id}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  }

  async updateArticleComment(
    updateArticleCommentReqDto: UpdateArticleCommentReqDto,
  ): Promise<Result<MutationResDto>> {
    const { article_id, comment_id, ...restDto } = updateArticleCommentReqDto;
    return await this.request<MutationResDto>(
      this.baseUrl + `/articles/${article_id}/comments/${comment_id}`,
      {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(restDto),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  async deleteArticleComment(
    DeleteArticleCommentReqDto: DeleteArticleCommentReqDto,
  ): Promise<Result<MutationResDto>> {
    const { article_id, comment_id } = DeleteArticleCommentReqDto;
    return await this.request<MutationResDto>(
      this.baseUrl + `/articles/${article_id}/comments/${comment_id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
  }
}

export const apiSdk = new ApiSDK(import.meta.env.VITE_API_BASE_URL);
