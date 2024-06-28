import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { User, UserOp, UserParamsService } from "../models/user";
import { UserRepository, userRepository } from "../repositories/user-repository";
import Unauthorized from "../helpers/http-response/errors/Unauthorized";
import NotFound from "../helpers/http-response/errors/NotFound";
import { sendMail } from "../utils/send-email";
import { getEnv } from "../utils/env";
import { generateToken } from "../utils/generate-token";
import { UserValidation } from "../models/user-validation";
import { userLogoutTokenRepository } from "../repositories/user-logout-token-repository";
import { userRecoverRepository } from "../repositories/user-recover-repository";
import { UserLogoutToken } from "../models/user-logout-token";

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async signup({ email, name, password }: UserParamsService): Promise<User> {
    const emailExists = await this.userRepository.findByEmail(email);

    if (emailExists?.email) {
      throw new Unauthorized("Email is already being used.");
    }

    const token = nanoid(21);

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashPassword,
      createdAt: new Date(),
      verified: false
    };

    const createdUser = await this.userRepository.create(user, token);

    await sendMail({
      from: getEnv("MAIL_USER"),
      to: user.email,
      subject: "Do not answer. Automatic email",
      name: "Verify email",
      message: `${getEnv("BASE_URL") + getEnv("VERIFY_ROUTE")}/${createdUser.userToken[0].token}`,
    });

    return createdUser;
  }

  async signin(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFound("Email not found.");
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new Unauthorized("Incorrect password.");
    }

    if (!user.verified) {
      await sendMail({
        from: getEnv("MAIL_USER"),
        to: user.email,
        subject: "Do not answer. Automatic email",
        name: "Verify email",
        message: `${getEnv("BASE_URL") + getEnv("VERIFY_ROUTE")}/${user.userToken[0].token}`,
      });

      throw new Unauthorized("Your account has not yet been verified. Please check your inbox for a registration confirmation email.");
    }

    const payload = {
      id: user.id,
      email: user.email
    };

    const token = generateToken(payload, getEnv("SECRET"), "1d");

    return token;
  }

  async logoutUser(token: string): Promise<UserLogoutToken> {
    const userLogout = {
      token,
      disconnected: true,
      disconnectedAt: new Date()
    };

    const logout = await userLogoutTokenRepository.create(userLogout);

    return logout;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFound("User not found.");
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<{ userToken: UserValidation[] } & User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFound("User not found.");
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users;
  }

  async updateUser(id: string, params: UserOp): Promise<User> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      throw new NotFound("User not found.");
    }

    const user = await this.userRepository.update(id, params);

    return user;
  }

  async deleteUser(id: string): Promise<User> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      throw new NotFound("User not found.");
    }

    const user = await this.userRepository.delete(id);

    return user;
  }

  async validateUser(token: string): Promise<User> {
    const userToken = await this.userRepository.findByToken(token);

    if (!userToken) {
      throw new Unauthorized("Invalid token.");
    }

    const user = await this.userRepository.findByUserId(userToken.userId);

    if (!user) {
      throw new NotFound("User not found.");
    }

    if (userToken.token && token !== userToken.token) {
      await sendMail({
        from: getEnv("MAIL_USER"),
        to: user.email,
        subject: "Do not answer. Automatic email",
        name: "Verify email",
        message: `${getEnv("BASE_URL") + getEnv("VERIFY_ROUTE")}/${userToken}`,
      });

      throw new Unauthorized("Your account has not yet been verified. Please check your inbox for a registration confirmation email.");
    }

    const [validatedUser] = await Promise.all([
      this.userRepository.update(userToken.userId, { verified: true }),
      this.userRepository.deleteToken(token)
    ]);

    return validatedUser;
  }

  async recoverUser(email: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFound("User not found.");
    }

    const createToken = async (): Promise<string> => {
      const token = generateToken({ id: user.id, email: user.email },  getEnv("SECRET_RECOVER"), "5min");

      const tokenExists = await userRecoverRepository.findByToken(token);

      if (!tokenExists) {
        return (await userRecoverRepository.create(token)).token;
      }

      return createToken();
    }

    const token = await createToken();

    await sendMail({
      from: getEnv("MAIL_USER"),
      to: user.email,
      subject: "Do not answer. Automatic email",
      name: "Recover password",
      message: `${getEnv("BASE_URL") + getEnv("RECOVER_ROUTE")}/${token}`
    });

    return user.email;
  }

  async updateUserPassword(id: string, password: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFound("User not found.");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const updatedUser = await this.userRepository.update(id, {
      password: hashPassword
    });

    return updatedUser;
  }
}

export const userService = new UserService(userRepository);
