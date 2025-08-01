import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "src/entities/auth.entity";
import { User } from "src/entities/user.entity";
import { isUniqueConstraintViolationError } from "src/lib/error-assertion";
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  IsNull,
  Repository,
} from "typeorm";
import {
  AuthNotFoundError,
  DuplicateUsernameError,
  UnhandledError,
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

      throw new UnhandledError();
    }
  }

  async saveAuth(auth: DeepPartial<Auth>): Promise<Pick<Auth, "id">> {
    return await this.runQuery(async () => {
      return await this.authRepository.save(auth);
    });
  }

  async updateAuth(criteria: FindOptionsWhere<Auth>, auth: DeepPartial<Auth>) {
    return await this.runQuery(async () => {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        const authRepository = transactionalEntityManager.getRepository(Auth);
        await authRepository.softDelete(criteria);
        await authRepository.save(auth);
      });
    });
  }

  async deleteAuth(criteria: FindOptionsWhere<Auth>, skipDeleted = true) {
    const result = await this.runQuery(async () => {
      return await this.authRepository.softDelete({
        ...criteria,
        ...(skipDeleted
          ? {
              deletedAt: IsNull(),
            }
          : {}),
      });
    });

    if (result.affected === 0) {
      throw new AuthNotFoundError();
    }
  }

  async getOneAuth(criteria: FindOptionsWhere<Auth>) {
    return await this.runQuery(async () => {
      return await this.authRepository.findOne({
        where: criteria,
        relations: {
          user: true,
        },
      });
    });
  }

  async saveUser(user: DeepPartial<User>): Promise<Pick<User, "id">> {
    return await this.runQuery(async () => {
      return await this.userRepository.save(user);
    });
  }

  async getOneUser(criteria: FindOptionsWhere<User>) {
    return await this.runQuery(async () => {
      return await this.userRepository.findOne({
        where: criteria,
      });
    });
  }
}
