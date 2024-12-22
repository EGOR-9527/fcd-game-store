// services/authUser Service.js
const { UserBase, TokenUserModel } = require("../../model/model");
const TokenService = require("../token/tokenUserService");
const bcrypt = require("bcrypt");
const ApiError = require("../../exceptions/api-error");
const uuid = require("uuid");

class AuthUserService {
  async registration(email, password, nick) {
    const existingUser = await UserBase.findOne({ where: { email: email } });

    if (existingUser) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const vendorId = uuid.v4();

    const newUser = await UserBase.create({
      id: vendorId,
      nick,
      email,
      password: hashPassword,
    });

    const token = await TokenService.generateTokens({
      userId: newUser.id,
      email,
    });

    return {
      user: { id: newUser.id, email: newUser.email, nick: newUser.nick },
      token,
    };
  }

  async login(email, password) {
    const user = await UserBase.findOne({ where: { email: email } });
    console.log(email, password);
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.BadRequest("Неверный пароль");
    }

    const tokenData = await TokenUserModel.findOne({
      where: { userId: user.id },
    });

    if (!tokenData) {
      throw ApiError.BadRequest("Токен не найден для данного пользователя");
    }

    const token = tokenData.token;

    return {
      user: { id: user.id, email: user.email, nick: user.nick },
      token,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const validate = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!validate || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const ID = await TokenUserModel.findOne({
      where: { token: refreshToken },
    });
    const userData = await UserBase.findOne({ where: { id: ID.userId } });
    const tokens = TokenService.generateTokens({
      userId: userData.id,
      email: userData.email,
    });
    await TokenService.saveToken(userData.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userData,
    };
  }
}

module.exports = new AuthUserService();
