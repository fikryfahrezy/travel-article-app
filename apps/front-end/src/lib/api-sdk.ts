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
  ResponseError,
  Result,
  UpdateArticleCommentReqDto,
  UpdateArticleReqDto,
} from "./api-sdk.types";

class ApiError extends Error {
  errors: string[];
  constructor(name: string, message: string, errors: string[]) {
    super(message);
    this.name = name;
    this.message = message;
    this.errors = errors;
  }
}

class UnauthorizedError extends ApiError {
  constructor(name: string, message: string, errors: string[]) {
    super(name, message, errors);
    this.name = name;
    this.message = message;
  }
}

type FailedRequest = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- excected to return anything
  request: () => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- excected to resolve anything
  resolve: (value: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- excected to resolve anything
  reject: (reason?: any) => void;
};

export class ApiSDK {
  baseUrl: string;
  private isRefreshing = false;
  private failedQueue: FailedRequest[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl + "/api";
  }

  private processFailedQueue(): void {
    this.failedQueue.forEach(({ request, resolve, reject }) => {
      request().then(resolve).catch(reject);
    });
    this.failedQueue = [];
  }

  private async request<TData>(
    url: string,
    options: RequestInit,
  ): Promise<Result<TData>> {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const responseBody = (await response.json()) as TData;
        return {
          success: true,
          data: responseBody,
        };
      }

      const responseBody = (await response.json()) as ResponseError;
      if (response.status === 401) {
        return {
          success: false,
          error: new UnauthorizedError(
            responseBody.name,
            responseBody.message,
            responseBody.errors,
          ),
        };
      }

      return {
        success: false,
        error: new ApiError(
          responseBody.name,
          responseBody.message,
          responseBody.errors,
        ),
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

  /**
   * The core request method with built-in token refresh logic.
   * It handles fetching, response parsing, and retrying on a 401 Unauthorized error.
   * @param url The URL of the request.
   * @param options The RequestInit options for the fetch call.
   * @param isRetry A flag to indicate if this is a retried request.
   * @param signal An AbortSignal to allow for request cancellation.
   */
  private async autoRefreshRequest<TData>(
    url: string,
    options: RequestInit,
    isRetry = false,
    signal?: AbortSignal,
  ): Promise<Result<TData>> {
    const response = await this.request<TData>(url, {
      ...options,
      signal,
    });
    if (response.success) {
      return response;
    }

    // If the response is not 401 or this is a retry attempt, handle it as a standard error.
    if (!(response.error instanceof UnauthorizedError) || isRetry) {
      return response;
    }

    // The response is 401 Unauthorized and it's not a retry.
    // Handle token refresh logic here.

    // If a refresh is already in progress, queue the current request to await the new token.
    if (this.isRefreshing) {
      return new Promise<Result<TData>>((resolve, reject) => {
        this.failedQueue.push({
          request: () =>
            this.autoRefreshRequest<TData>(url, options, true, signal),
          resolve,
          reject,
        });
      });
    }

    // If no refresh is in progress, start one.
    this.isRefreshing = true;
    const refreshResult = await this.refresh();

    // On successful refresh, process the failed queue and retry the original request.
    if (refreshResult.success) {
      this.isRefreshing = false;
      this.processFailedQueue();
      return this.autoRefreshRequest<TData>(url, options, true, signal); // Retry the original request
    }

    // If the refresh fails, clear the queue and return a failed authentication result.
    this.failedQueue = [];
    this.isRefreshing = false;
    return response;
  }

  async register(
    registerReqDto: RegisterReqDto,
    signal?: AbortSignal,
  ): Promise<Result<AuthResDto>> {
    return await this.request<AuthResDto>(this.baseUrl + "/auth/register", {
      signal,
      method: "POST",
      credentials: "include",
      body: JSON.stringify(registerReqDto),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async login(
    loginReqDto: LoginReqDto,
    signal?: AbortSignal,
  ): Promise<Result<AuthResDto>> {
    return await this.request<AuthResDto>(this.baseUrl + "/auth/login", {
      signal,
      method: "POST",
      credentials: "include",
      body: JSON.stringify(loginReqDto),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async refresh(signal?: AbortSignal): Promise<Result<AuthResDto>> {
    return await this.request<AuthResDto>(this.baseUrl + "/auth/refresh", {
      signal,
      method: "POST",
      credentials: "include",
    });
  }

  async logout(signal?: AbortSignal): Promise<Result<LogoutResDto>> {
    return await this.autoRefreshRequest<LogoutResDto>(
      this.baseUrl + "/auth/logout",
      {
        signal,
        method: "POST",
        credentials: "include",
      },
    );
  }

  async profile(signal?: AbortSignal): Promise<Result<ProfileResDto>> {
    return await this.autoRefreshRequest<ProfileResDto>(
      this.baseUrl + "/auth/profile",
      {
        signal,
        method: "GET",
        credentials: "include",
      },
    );
  }

  async createArticle(
    createArticleReqDto: CreateArticleReqDto,
    signal?: AbortSignal,
  ): Promise<Result<MutationResDto>> {
    return await this.autoRefreshRequest<MutationResDto>(
      this.baseUrl + "/articles",
      {
        signal,
        method: "POST",
        credentials: "include",
        body: JSON.stringify(createArticleReqDto),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  async getAllArticle(
    paginationReqDto: PaginationReqDto,
    signal?: AbortSignal,
  ): Promise<Result<GetAllArticleResDto>> {
    const { limit = 10, page = 1 } = paginationReqDto;
    const params = new URLSearchParams({
      limit: String(limit),
      page: String(page),
    });

    return await this.autoRefreshRequest<GetAllArticleResDto>(
      this.baseUrl + `/articles?${params.toString()}`,
      {
        signal,
        method: "GET",
        credentials: "include",
      },
    );
  }

  async getArticle(
    getArticleReqDto: GetArticleReqDto,
    signal?: AbortSignal,
  ): Promise<Result<GetArticleResDto>> {
    const { slug } = getArticleReqDto;
    return await this.autoRefreshRequest<GetArticleResDto>(
      this.baseUrl + `/articles/${slug}`,
      {
        signal,
        method: "GET",
        credentials: "include",
      },
    );
  }

  async updateArticle(
    updateArticleReqDto: UpdateArticleReqDto,
    signal?: AbortSignal,
  ): Promise<Result<MutationResDto>> {
    const { article_id, ...restDto } = updateArticleReqDto;
    return await this.autoRefreshRequest<MutationResDto>(
      this.baseUrl + `/articles/${article_id}`,
      {
        signal,
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
    signal?: AbortSignal,
  ): Promise<Result<MutationResDto>> {
    const { article_id } = deleteArticleReqDto;
    return await this.autoRefreshRequest<MutationResDto>(
      this.baseUrl + `/articles/${article_id}`,
      {
        signal,
        method: "DELETE",
        credentials: "include",
      },
    );
  }

  async likeArticle(
    likeArticleReqDto: LikeArticleReqDto,
    signal?: AbortSignal,
  ): Promise<Result<MutationResDto>> {
    const { article_id, ...restDto } = likeArticleReqDto;
    return await this.autoRefreshRequest<MutationResDto>(
      this.baseUrl + `/articles/${article_id}/likes`,
      {
        signal,
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
    signal?: AbortSignal,
  ): Promise<Result<MutationResDto>> {
    const { article_id, ...restDto } = createArticleCommentReqDto;
    return await this.autoRefreshRequest<MutationResDto>(
      this.baseUrl + `/articles/${article_id}/comments`,
      {
        signal,
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
    signal?: AbortSignal,
  ): Promise<Result<GetAllArticleCommentResDto>> {
    const { article_id, pagination } = getAllArticleCommentReqDto;
    const { limit = 10, page = 1 } = pagination;
    const params = new URLSearchParams({
      limit: String(limit),
      page: String(page),
    });

    return await this.autoRefreshRequest<GetAllArticleCommentResDto>(
      this.baseUrl + `/articles/${article_id}/comments?${params.toString}`,
      {
        signal,
        method: "GET",
        credentials: "include",
      },
    );
  }

  async getArticleComment(
    getArticleCommentReqDto: GetArticleCommentReqDto,
    signal?: AbortSignal,
  ): Promise<Result<GetArticleCommentResDto>> {
    const { article_id, comment_id } = getArticleCommentReqDto;
    return await this.autoRefreshRequest<GetArticleCommentResDto>(
      this.baseUrl + `/articles/${article_id}/comments/${comment_id}`,
      {
        signal,
        method: "GET",
        credentials: "include",
      },
    );
  }

  async updateArticleComment(
    updateArticleCommentReqDto: UpdateArticleCommentReqDto,
    signal?: AbortSignal,
  ): Promise<Result<MutationResDto>> {
    const { article_id, comment_id, ...restDto } = updateArticleCommentReqDto;
    return await this.autoRefreshRequest<MutationResDto>(
      this.baseUrl + `/articles/${article_id}/comments/${comment_id}`,
      {
        signal,
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
    deleteArticleCommentReqDto: DeleteArticleCommentReqDto,
    signal?: AbortSignal,
  ): Promise<Result<MutationResDto>> {
    const { article_id, comment_id } = deleteArticleCommentReqDto;
    return await this.autoRefreshRequest<MutationResDto>(
      this.baseUrl + `/articles/${article_id}/comments/${comment_id}`,
      {
        signal,
        method: "DELETE",
        credentials: "include",
      },
    );
  }
}

export const apiSdk = new ApiSDK(import.meta.env.VITE_API_BASE_URL);
