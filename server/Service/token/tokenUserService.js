require("dotenv").config();
const jwt = require("jsonwebtoken");
const { TokenUserModel } = require("../../model/model");

const startsWith = (str, prefix) => str.slice(0, prefix.length) === prefix;

class TokenVendorService {
  async generateTokens(payload) {
    try {
      if (!process.env.JWT_ACCESS_KEY || !process.env.JWT_REFRASH_KEY) {
        throw new Error("Секретные ключи JWT не определены");
      }

      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRASH_KEY, {
        expiresIn: "30d",
      });

      await TokenUserModel.create({
        token: refreshToken,
        userId: payload.userId,
      });

      return { accessToken, refreshToken };
    } catch (e) {
      throw new Error("Ошибка генерации токенов: " + e.message);
    }
  }

  validateAccessToken(token) {
    try {
      const tokenData = startsWith(token, "Bearer ")
        ? token.split(" ")[1]
        : token;
      const userData = jwt.verify(tokenData, process.env.JWT_ACCESS_KEY);
      return userData;
    } catch (e) {
      throw new Error("Ошибка валидации токена: " + e.message);
    }
  }

  validateRefreshToken(token) {
    try {
      const tokenData = startsWith(token, "Bearer ")
        ? token.split(" ")[1]
        : token;
      const userData = jwt.verify(tokenData, process.env.JWT_REFRASH_KEY);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenUserModel.findOne({ where: { userId } });

    if (tokenData) {
      tokenData.token = refreshToken;
      return tokenData.save();
    }
    const token = await TokenUserModel.create({
      userId: userId,
      token: refreshToken,
    });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await TokenUserModel.destroy({
      where: { token: refreshToken },
    });
    return tokenData;
  }

  async findOne(refreshToken) {
    const tokenData = await TokenUserModel.findOne({where:{token: refreshToken}});
    return tokenData;
  }
}

module.exports = new TokenVendorService();
