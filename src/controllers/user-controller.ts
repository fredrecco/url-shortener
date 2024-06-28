import { Request } from "express";
import { UserService, userService } from "../services/user-service";
import BadRequest from "../helpers/http-response/errors/BadRequest";
import { ResponseHandler } from "../utils/response-handler";
import { created, ok } from "../helpers/http-response/success";
import { Authorization } from "../middlewares/auth";
import { Admin } from "../middlewares/admin";
import { searchInvalidFields, validateRequiredFields } from "../utils/validate-fields";
import { Recover } from "../middlewares/recover";
import { Logout } from "../middlewares/logout";
import { userRecoverRepository } from "../repositories/user-recover-repository";

export class UserController {
  constructor(private readonly userService: UserService) { }

  @ResponseHandler
  async signup(
    req: Request<unknown, unknown, { name: string, email: string, password: string; }>
  ) {
    const { name, email, password } = req.body;

    const requiredFields = validateRequiredFields(req.body, ["name", "email", "password"]);

    if (requiredFields.length) {
      throw new BadRequest(`[${requiredFields}] ${requiredFields.length > 1 ? "fields" : "field"} is required.`);
    }

    const invalidFields = searchInvalidFields(req.body, ["name", "email", "password"]);

    if (invalidFields.length) {
      throw new BadRequest(`[${invalidFields}] ${invalidFields.length > 1 ? "fields" : "field"} is invalid.`);
    }

    const createdUser = await this.userService.signup({ email, name, password });

    return created({
      user: {
        name: createdUser.name,
        email: createdUser.email
      },
      message: "Please check your inbox for a registration confirmation email."
    });
  }

  @ResponseHandler
  async signin(
    req: Request<unknown, unknown, { email: string, password: string }>
  ) {
    const { email, password } = req.body;

    const requiredFields = validateRequiredFields(req.body, ["email", "password"]);

    if (requiredFields.length) {
      throw new BadRequest(`[${requiredFields}] ${requiredFields.length > 1 ? "fields" : "field"} is required.`);
    }

    const invalidFields = searchInvalidFields(req.body, ["email", "password"]);

    if (invalidFields.length) {
      throw new BadRequest(`[${invalidFields}] ${invalidFields.length > 1 ? "fields" : "field"} is invalid.`);
    }

    const token = await this.userService.signin(email, password);

    return ok({ token });
  }

  @Logout
  @ResponseHandler
  async logoutUser(req: Request) {
    const token = req.token;

    await this.userService.logoutUser(token);

    return created({
      message: "User successfully disconnected."
    });
  }

  @Authorization
  @ResponseHandler
  async getUser(req: Request) {
    const id = req.user.id;

    if (!id) {
      throw new BadRequest("Missing id.");
    }

    const user = await this.userService.getUser(id);

    return ok({
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      verified: user.verified
    });
  }

  @Admin
  @ResponseHandler
  async getUsers(req: Request) {
    const users = await this.userService.getUsers();

    return ok(users);
  }

  @Authorization
  @ResponseHandler
  async updateUser(
    req: Request<unknown, unknown, { name: string }>
  ) {
    const id = req.user.id;
    const name = req.body.name;

    if (!id) {
      throw new BadRequest("Missing id.");
    }

    if (!name) {
      throw new BadRequest("Missing name.");
    }

    const invalidFields = searchInvalidFields(req.body, ["name"]);

    if (invalidFields.length) {
      throw new BadRequest(`[${invalidFields}] ${invalidFields.length > 1 ? "fields" : "field"} is invalid.`);
    }

    const user = {
      name
    };

    const updatedUser = await this.userService.updateUser(id, user);

    return created({
      user: updatedUser,
      message: "Registration updated successfully."
    });
  }

  @Authorization
  @ResponseHandler
  async deleteUser(req: Request) {
    const id = req.user.id;

    if (!id) {
      throw new BadRequest("Missing id.");
    }

    await this.userService.deleteUser(id);

    return created({
      message: "Registration deleted successfully."
    });
  }

  @ResponseHandler
  async validateUser(
    req: Request<{ token: string }, unknown, unknown>
  ) {
    const token = req.params.token;

    if (!token) {
      throw new BadRequest("Missing token.");
    }

    await this.userService.validateUser(token);

    return created({
      message: "Email verified successfully."
    });
  }

  @ResponseHandler
  async recoverUser(req: Request<unknown, unknown, { email: string }>) {
    const { email } = req.body;

    if (!email) {
      throw new BadRequest("Missing email.");
    }

    const result = await this.userService.recoverUser(email);

    return ok({
      message: `A password recovery link was sent to ${result}`
    });
  }

  @Recover
  @ResponseHandler
  async updateUserPassword(req: Request<unknown, unknown, { password: string }>) {
    const id = req.user.id;
    const { password } = req.body;
    const token = req.token;

    if (!id) {
      throw new BadRequest("Missing id.");
    }

    if (!password) {
      throw new BadRequest("Missing password.");
    }

    const invalidFields = searchInvalidFields(req.body, ["password"]);

    if (invalidFields.length) {
      throw new BadRequest(`[${invalidFields}] ${invalidFields.length > 1 ? "fields" : "field"} is invalid.`);
    }

    Promise.all([
      userRecoverRepository.updateToUsed(token),
      this.userService.updateUserPassword(id, password)
    ]);

    return created({
      message: "Password updated successfully."
    });
  }
}

export const userController = new UserController(userService);
