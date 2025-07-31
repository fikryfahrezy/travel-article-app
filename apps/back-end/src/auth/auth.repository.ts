import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "src/entities/auth.entity";
import { User } from "src/entities/user.entity";
import { isUniqueConstraintViolationError } from "src/lib/error-assertion";
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import {
  DuplicateUsernameError,
  UnhandledError,
  UserNotFoundError,
} from "./auth.exception";

@Injectable()
export class AuthRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async runQuery<
    TCallback extends () => Promise<unknown>,
    TReturn extends Awaited<ReturnType<TCallback>>,
  >(callback: TCallback): Promise<TReturn> {
    try {
      return (await callback()) as TReturn;
    } catch (error) {
      if (isUniqueConstraintViolationError(error, "user_username_unique")) {
        throw new DuplicateUsernameError("Username already exist.");
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new UnhandledError("Unexpected thing happened.");
    }
  }

  async createAuth(auth: DeepPartial<Auth>): Promise<Pick<Auth, "id">> {
    return this.runQuery(async () => {
      const result = await this.authRepository.save(auth);
      return {
        id: result.id,
      };
    });
  }

  async updateAuth({ id, ...newAuth }: DeepPartial<Auth>) {
    return this.runQuery(async () => {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        const authRepository = transactionalEntityManager.getRepository(Auth);
        await authRepository.softDelete({ id: id });
        await authRepository.save(newAuth);
      });
    });
  }

  async deleteAuth(auth: FindOptionsWhere<Auth>) {
    return this.runQuery(async () => {
      return await this.authRepository.softDelete(auth);
    });
  }

  async getOneAuth(authFields: FindOptionsWhere<Auth>) {
    return this.runQuery(async () => {
      return await this.authRepository.findOne({
        where: authFields,
        relations: {
          user: true,
        },
      });
    });
  }

  async insertUser(user: DeepPartial<User>): Promise<Pick<User, "id">> {
    return this.runQuery(async () => {
      const result = await this.userRepository.save(user);
      return {
        id: result.id,
      };
    });
  }

  async getOneUser(userFields: DeepPartial<User>) {
    return this.runQuery(async () => {
      const user = await this.userRepository.findOne({
        where: userFields,
      });

      if (!user) {
        throw new UserNotFoundError(
          `User with ${userFields.username} not found`,
        );
      }

      return user;
    });
  }
}
