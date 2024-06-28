import { PrismaClient } from "@prisma/client";
import { UserLogoutToken, UserLogoutTokenParams } from "../models/user-logout-token";
import { prismaClient } from "../database";

export class UserLogoutTokenRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(params: UserLogoutTokenParams): Promise<UserLogoutToken> {
    const user = await this.prisma.userLogoutToken.create({
      data: params
    });

    return user;
  }

  async findByToken(token: string): Promise<UserLogoutToken | null> {
    const user = await this.prisma.userLogoutToken.findFirst({
      where: {
        token
      }
    });

    return user;
  }
}

export const userLogoutTokenRepository = new UserLogoutTokenRepository(prismaClient);