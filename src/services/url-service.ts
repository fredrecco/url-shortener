import { nanoid } from "nanoid";
import { Url, UrlOp } from "../models/url";
import { UrlRepository, urlRepository } from "../repositories/url-repository";
import NotFound from "../helpers/http-response/errors/NotFound";
import Unauthorized from "../helpers/http-response/errors/Unauthorized";

export class UrlService {
  constructor(private readonly urlRepository: UrlRepository) { }

  async createUrl(userId: string, expanded: string): Promise<Url> {
    const generateShort = async (): Promise<string> => {
      const shortened = nanoid(8);

      const url = await this.urlRepository.findByShort(userId, shortened);

      if (!url) {
        return shortened;
      }

      return generateShort();
    };

    const url = {
      expanded,
      shortened: await generateShort(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const createdUrl = await this.urlRepository.create(userId, url);

    return Object.fromEntries(Object.entries(createdUrl).filter((field) => field[0] !== "userId" && field)) as Url;
  }

  async createCustomUrl(userId: string, expanded: string, shortened: string): Promise<Url> {
    const urlExists = await this.urlRepository.findByShort(userId, shortened);

    if (urlExists) {
      throw new Unauthorized("Shortened url already exists.");
    }

    const url = {
      expanded,
      shortened,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const createdUrl = await this.urlRepository.create(userId, url);

    return Object.fromEntries(Object.entries(createdUrl).filter((field) => field[0] !== "userId" && field)) as Url;
  }

  async getUrl(userId: string, shortened: string) {
    const url = await this.urlRepository.findByShort(userId, shortened);

    if (!url) {
      throw new NotFound("Url not found.");
    }

    return url;
  }

  async getUrls(userId: string) {
    const urls = await this.urlRepository.find(userId);

    return urls;
  }

  async updateUrl(id: string, params: UrlOp, userId: string): Promise<Url> {
    const url = await this.urlRepository.findById(id, userId);

    if (!url) {
      throw new NotFound("Url not found.");
    }

    if (params.shortened) {
      const shortenedExists = await this.urlRepository.findByShort(userId, params.shortened);

      if (shortenedExists) {
        throw new Unauthorized("Shortened url already exists.");
      }
    }

    const updatedUrl = await this.urlRepository.update(url.id, { ...params, updatedAt: new Date() }, userId);

    return Object.fromEntries(Object.entries(updatedUrl).filter((field) => field[0] !== "userId" && field)) as Url;
  }

  async deleteUrl(id: string, userId: string): Promise<Url> {
    const url = await this.urlRepository.findById(id, userId);

    if (!url) {
      throw new NotFound("Url not found.");
    }

    const deletedUrl = await this.urlRepository.delete(url.id, userId);

    return Object.fromEntries(Object.entries(deletedUrl).filter((field) => field[0] !== "userId" && field)) as Url;
  }
}

export const urlService = new UrlService(urlRepository);