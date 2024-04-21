import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { MongoDBErrorHandler } from '@shared/mongodb/mongodb-error-handler';
import { MethodLogger } from '@shared/loggers/method-logger.decorator';
import {
  AUTH_CODE_USAGE,
  ERROR_CODE,
  ERROR_SOURCE,
  IAuthVerifyDto,
  IUnitedHttpException,
} from '@shared/types/gdk';
import { User, UserDocument } from './user.schema';
import {
  ICreateUserDto,
  IUpdateUserAuthDto,
  IUpdateUserDto,
  IUpdateUserSignedInDto,
  IUserFullUpdateDto,
} from './user.type';

@Injectable()
export class UserService {
  // * Methods are order by C-R-U-D, with comment divider

  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {}

  // * === [ C ] CREATE ===========

  @MethodLogger()
  public async create(
    dto: ICreateUserDto,
    session?: ClientSession,
  ): Promise<UserDocument> {
    try {
      const newData: UserDocument = await new this.UserModel({
        ...dto,
      }).save({ session: session });
      return newData;
    } catch (error) {
      console.log(error);
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }

  // * === [ R ] READ =============

  @MethodLogger()
  public async getById(id: string): Promise<UserDocument> {
    try {
      const data: UserDocument = await this.UserModel.findById(id);
      return data;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }

  @MethodLogger()
  public async getByEmail(email: string): Promise<UserDocument> {
    try {
      const data: UserDocument = await this.UserModel.findOne({
        email: email,
      });
      return data;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }

  @MethodLogger()
  public async listAll(): Promise<UserDocument[]> {
    try {
      const list: UserDocument[] = await this.UserModel.find();
      return list;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }

  // * === [ U ] UPDATE ============

  @MethodLogger()
  public async updateById(
    id: string,
    dto:
      | IUserFullUpdateDto
      | IUpdateUserAuthDto
      | IUpdateUserDto
      | IUpdateUserSignedInDto,
    session?: ClientSession,
  ): Promise<UserDocument> {
    try {
      const data: UserDocument = await this.UserModel.findByIdAndUpdate(
        id,
        {
          ...dto,
          updatedAt: Date.now(),
        },
        { session: session, new: true },
      );
      return data;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }

  @MethodLogger()
  public async verifyAuthState(dto: IAuthVerifyDto): Promise<boolean> {
    try {
      // * STEP 1. Find Exact User
      const user = await this.UserModel.findOne({
        authId: dto.uid,
        email: dto.email,
      });
      if (user === null) {
        this.throwError(ERROR_CODE.USER_NOT_FOUND, 'User not found', 404);
      }
      // * STEP 2. Verify Auth State
      const current = new Date().getTime();
      const isNotExpired = user.authCodeExpiredAt >= current;
      const isMatched = user.authCode === dto.code;
      const isUsageSame = user.authCodeUsage === dto.usage;
      // * STEP 3. Resolve According to Usage
      if (isMatched && isNotExpired && isUsageSame) {
        // * Update User Accordingly
        const dto = this.resolveAuthUsageForUserDto(user.authCodeUsage);
        await this.updateById(`${user._id}`, dto);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }

  // * === [ D ] DELETE ============

  @MethodLogger()
  public async deleteById(
    id: string,
    session?: ClientSession,
  ): Promise<UserDocument> {
    try {
      const data = await this.UserModel.findByIdAndDelete(id, {
        session: session,
      });
      return data;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }

  @MethodLogger()
  public async deleteByAuthId(
    authId: string,
    session?: ClientSession,
  ): Promise<UserDocument> {
    try {
      const data = await this.UserModel.findOneAndDelete(
        {
          authId: authId,
        },
        {
          session: session,
        },
      );
      return data;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }

  @MethodLogger()
  public async disableById(
    id: string,
    session?: ClientSession,
  ): Promise<UserDocument> {
    try {
      const data: UserDocument = await this.UserModel.findByIdAndUpdate(
        id,
        {
          isActive: false,
        },
        { session: session, new: true },
      );
      return data;
    } catch (error) {
      return Promise.reject(MongoDBErrorHandler(error));
    }
  }

  private resolveAuthUsageForUserDto(
    usage: AUTH_CODE_USAGE,
  ): IUpdateUserAuthDto {
    const dto: IUpdateUserAuthDto = {
      authCode: '',
      authCodeExpiredAt: 0,
      authCodeUsage: AUTH_CODE_USAGE.NOT_SET,
      isEmailVerified: false,
    };
    if (usage === AUTH_CODE_USAGE.SIGN_UP_VERIFY) {
      dto.isEmailVerified = true;
    }
    return dto;
  }

  private throwError(code: ERROR_CODE, msg: string, statusCode?: number): void {
    const errorObj: IUnitedHttpException = {
      source: ERROR_SOURCE.MONGODB,
      errorCode: code || ERROR_CODE.UNKNOWN,
      statusCode: statusCode || 500,
      message: msg,
      errorMeta: {},
      disableAutoLog: true,
    };
    throw errorObj;
  }
}
