import UsersModel from "../models/users.model.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import mailService from "./mail.service.js";
import tokenService from "./tokens.service.js";
import UserDto from "../dtos/user.dto.js";
import { ApiError } from "../exeptions/api.error.js";

class UserService {
  async registration(email, password) {
    const candidate = await UsersModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`user ${email} is already existing `);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();
    const user = await UsersModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`
    );
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
  async acrivate(activationLink) {
    const user = await UsersModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Link is not correct");
    }
    user.isActivated = true;
    await user.save();
  }
  async login(email, password) {
    const user = await UsersModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("User is not found");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Incorrect password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UsersModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await UsersModel.find();
    return users;
  }
}

export const userService = new UserService();
