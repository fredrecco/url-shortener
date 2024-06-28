import { PrismaClient } from "@prisma/client";
import { UserRecover } from "../models/user-recover";
import { prismaClient } from "../database";

export class UserRecoverRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(token: string): Promise<UserRecover> {
    const user = await this.prisma.userRecover.create({
      data: {
        token,
        used: false
      }
    });

    return user;
  }

  async findByToken(token: string): Promise<UserRecover | null> {
    const user = await this.prisma.userRecover.findFirst({
      where: {
        token
      }
    });

    return user;
  }

  async updateToUsed(token: string): Promise<UserRecover> {
    const user = await this.prisma.userRecover.update({
      where: {
        token
      },
      data: {
        used: true
      }
    });

    return user;
  }

  async delete(id: string): Promise<UserRecover> {
    const user = await this.prisma.userRecover.delete({
      where: {
        id
      }
    });

    return user;
  }
}

export const userRecoverRepository = new UserRecoverRepository(prismaClient);
