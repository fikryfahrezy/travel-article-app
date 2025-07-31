import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "src/entities/auth.entity";
import { User } from "src/entities/user.entity";
import { isUniqueConstraintViolationError } from "src/lib/error-assertion";
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from "typeorm";
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

  async updateAuth({ id, ...newAuth }: DeepPartial<Auth>) {
    return await this.runQuery(async () => {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        const authRepository = transactionalEntityManager.getRepository(Auth);
        await authRepository.softDelete({ id: id });
        await authRepository.save(newAuth);
      });
    });
  }

  async deleteAuth(criteria: FindOptionsWhere<Auth>) {
    const result = await this.runQuery(async () => {
      return await this.authRepository.update(criteria, {
        deletedAt: new Date(),
      });
    });

    if (result.affected === 0) {
      throw new AuthNotFoundError();
    }
  }

  async getOneAuth(authFields: FindOptionsWhere<Auth>) {
    return await this.runQuery(async () => {
      return await this.authRepository.findOne({
        where: authFields,
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

  async getOneUser(userFields: FindOptionsWhere<User>) {
    return await this.runQuery(async () => {
      return await this.userRepository.findOne({
        where: userFields,
      });
    });
  }
}
