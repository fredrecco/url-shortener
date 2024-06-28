import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../database";
import { User, UserOp, UserParams } from "../models/user";
import { UserValidation } from "../models/user-validation";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(
    user: UserParams,
    token: string
  ): Promise<{ userToken: UserValidation[] } & User> {
    const createdUser = await this.prisma.user.create({
      data: {
        ...user,
        userToken: {
          create: {
            token
          }
        }
      },
      include: {
        userToken: true
      }
    });

    return createdUser;
  }

  async findByEmail(email: string): Promise<{ userToken: UserValidation[] } & User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email
      },
      include: {
        userToken: true
      }
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id
      }
    });

    return user;
  }

  async findByUserId(id: string): Promise<{ userToken: UserValidation[] } & User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id
      },
      include: {
        userToken: true
      }
    });

    return user;
  }

  async find(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users;
  }

  async delete(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: {
        id
      }
    });

    return user;
  }

  async update(id: string, params: UserOp): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id
      },
      data: params
    });

    return user;
  }

  async findByToken(token: string): Promise<UserValidation | null> {
    const user = await this.prisma.userValidation.findFirst({
      where: {
        token
      }
    });

    return user;
  }

  async deleteToken(token: string): Promise<UserValidation> {
    const userToken = await this.prisma.userValidation.delete({
      where: {
        token
      }
    });

    return userToken;
  }
}

export const userRepository = new UserRepository(prismaClient);
