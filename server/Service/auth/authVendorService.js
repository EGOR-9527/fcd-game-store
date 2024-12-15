const { UserBase, Vendor, TokenVendorModel } = require("../../model/model"); // Добавлен импорт TokenVendorModel
const bcrypt = require("bcrypt");
const TokenService = require("../token/tokenVendorService");
const uuid = require("uuid");
const ApiError = require("../../exceptions/api-error");

class AuthVendorService {
  async registration(email, password, name) {
    // Изменено на name вместо nick
    try {
      const existingVendor = await Vendor.findOne({ where: { email } }); // Проверка на существующего продавца

      if (existingVendor) {
        throw ApiError.BadRequest(
          `Продавец с почтовым адресом ${email} уже существует`
        );
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const vendorId = uuid.v4();

      const newVendor = await Vendor.create({
        id: vendorId,
        name,
        email,
        password: hashPassword,
      });

      const tokens = await TokenService.generateTokens({
        userId: newVendor.id,
        email,
      });

      return {
        vendor: {
          id: newVendor.id,
          email: newVendor.email,
          name: newVendor.name,
        },
        tokens,
      };
    } catch (e) {
      throw new Error("Ошибка: " + e.message);
    }
  }

  async login(email, password) {
    try {
      const vendor = await Vendor.findOne({ where: { email } }); // Изменено на findOne

      if (!vendor) {
        throw ApiError.BadRequest("Продавец с таким email не был найден");
      }

      const isMatch = await bcrypt.compare(password, vendor.password);

      if (!isMatch) {
        throw ApiError.BadRequest("Неверный пароль");
      }

      const refreshToken = await TokenService.findOne({
        where: { userId: vendor.id },
      });
      await TokenService.saveToken(vendor.id, refreshToken.token);
      return { vendor, refreshToken };
    } catch (e) {
      console.error("Ошибка: " + e.message);
      throw e;
    }
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
    const ID = await TokenVendorModel.findOne({
      where: { token: refreshToken },
    });
    const vendorData = await Vendor.findOne({ where: { id: ID.userId } });
    const tokens = TokenService.generateTokens({
      userId: vendorData.id,
      email: vendorData.email,
    });
    await TokenService.saveToken(vendorData.id, tokens.refreshToken);
    return {
      ...tokens,
      vendor: vendorData,
    };
  }
}

module.exports = new AuthVendorService();
