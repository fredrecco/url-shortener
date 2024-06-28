import { PrismaClient } from "@prisma/client";
import { Url, UrlOp, UrlParams } from "../models/url";
import { prismaClient } from "../database";

export class UrlRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(userId: string, url: UrlParams): Promise<Url> {
    const createdUrl = await this.prisma.url.create({
      data: {
        ...url,
        userId
      },
    });

    return createdUrl;
  }

  async findByShort(userId: string, shortened: string): Promise<Url | null> {
    const url = await this.prisma.url.findFirst({
      where: {
        shortened,
        userId
      },
      select: {
        id: true,
        expanded: true,
        shortened: true,
        createdAt: true,
        updatedAt: true,
        userId: false
      }
    });

    return url;
  }

  async findById(id: string, userId: string): Promise<Url | null> {
    const updatedUrl = await this.prisma.url.findFirst({
      where: {
        id,
        userId
      },
      select: {
        id: true,
        shortened: true,
        expanded: true,
        createdAt: true,
        updatedAt: true,
        userId: false
      }
    });

    return updatedUrl;
  }

  async find(userId: string): Promise<Omit<Url, "id">[]> {
    const urls = await this.prisma.url.findMany({
      where: {
        userId
      },
      select: {
        id: true,
        expanded: true,
        shortened: true,
        createdAt: true,
        updatedAt: true,
        userId: false
      }
    });

    return urls;
  }

  async update(id: string, url: UrlOp, userId: string): Promise<Url> {
    const updatedUrl = await this.prisma.url.update({
      where: {
        id,
        userId
      },
      data: url
    });

    return updatedUrl;
  }

  async delete(id: string, userId: string): Promise<Url> {
    const url = await this.prisma.url.delete({
      where: {
        id,
        userId
      }
    });

    return url;
  }
}

export const urlRepository = new UrlRepository(prismaClient);