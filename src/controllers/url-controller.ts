import { Request } from "express";
import { UrlService, urlService } from "../services/url-service";
import { created, ok } from "../helpers/http-response/success";
import { ResponseHandler } from "../utils/response-handler";
import { Authorization } from "../middlewares/auth";
import BadRequest from "../helpers/http-response/errors/BadRequest";
import { searchInvalidFields, validateRequiredFields } from "../utils/validate-fields";

export class UrlController {
  constructor(private readonly urlService: UrlService) { }

  @Authorization
  @ResponseHandler
  async createUrl(req: Request<unknown, unknown, { expanded: string }>) {
    const expanded = req.body.expanded;
    const userId = req.user.id;

    if (!expanded) {
      throw new BadRequest("Missing url.");
    }
    
    const url = await this.urlService.createUrl(userId, expanded);

    return created(url);
  }

  @Authorization
  @ResponseHandler
  async createCustomUrl(req: Request<unknown, unknown, { expanded: string, shortened: string }>) {
    const userId = req.user.id;
    const { expanded, shortened } = req.body;

    const requiredFields = validateRequiredFields(req.body, ["expanded", "shortened"]);

    if (requiredFields.length) {
      throw new BadRequest(`[${requiredFields}] ${requiredFields.length > 1 ? "fields" : "field"} is required.`);
    }

    const invalidFields = searchInvalidFields(req.body, ["expanded", "shortened"]);

    if (invalidFields.length) {
      throw new BadRequest(`[${requiredFields}] ${requiredFields.length > 1 ? "fields" : "field"} is invalid.`);
    }

    const url = await this.urlService.createCustomUrl(userId, expanded, shortened);

    return created(url);
  }

  @Authorization
  @ResponseHandler
  async getUrl(req: Request<{ shortened: string }, unknown, unknown>) {
    const shortened = req.params.shortened;
    const userId = req.user.id;

    if (!shortened) {
      throw new BadRequest("Missing url.");
    }

    const url = await this.urlService.getUrl(userId, shortened);

    return ok(url);
  }

  @Authorization
  @ResponseHandler
  async getUrls(req: Request) {
    const userId = req.user.id;

    if (!userId) {
      throw new BadRequest("Missing id.");
    }

    const urls = await this.urlService.getUrls(userId);

    return ok(urls);
  }

  @Authorization
  @ResponseHandler
  async updateUrl(req: Request<{ id: string }, unknown, { expanded: string, shortened: string, }>) {
    const id = req.params.id;
    const userId = req.user.id;

    const invalidFields = searchInvalidFields(req.body, ["expanded", "shortened"]);

    if (invalidFields.length) {
      throw new BadRequest(`[${invalidFields}] ${invalidFields.length > 1 ? "fields" : "field"} is invalid.`);
    }

    if (!id) {
      throw new BadRequest("Missing id.");
    }

    const updatedUrl = await this.urlService.updateUrl(id, req.body, userId);

    return created({
      url: updatedUrl,
      message: "Url updated successfully."
    });
  }

  @Authorization
  @ResponseHandler
  async deleteUrl(req: Request<{ id: string }, unknown, unknown>) {
    const id = req.params.id;
    const userId = req.user.id;

    if (!id) {
      throw new BadRequest("Missing id.");
    }

    const deletedUrl = await this.urlService.deleteUrl(id, userId);

    return created({
      url: deletedUrl,
      message: "Url successfully deleted."
    });
  }
}

export const urlController = new UrlController(urlService);