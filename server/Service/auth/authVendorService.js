const { UserBase, Vendor, TokenVendorModel } = require("../../model/model");
const bcrypt = require("bcrypt");
const TokenService = require("../token/tokenVendorService");
const { v4: uuid } = require("uuid"); // Убедитесь, что вы импортируете uuid правильно
const ApiError = require("../../exceptions/api-error");

class AuthVendorService {
  async registration(email, password, nameCompany) {
    try {
      const existingVendor = await Vendor.findOne({ where: { email } });

      if (existingVendor) {
        throw ApiError.BadRequest(
          `Продавец с почтовым адресом ${email} уже существует`
        );
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const vendorId = uuid();

      const newVendor = await Vendor.create({
        userId: vendorId,
        nameCompany,
        email,
        password: hashPassword,
      });

      const tokens = await TokenService.generateTokens({
        userId: newVendor.userId,
        email,
      });

      return {
        vendor: {
          userId: newVendor.userId,
          email: newVendor.email,
          nameCompany: newVendor.nameCompany,
          id: newVendor.id,
        },
        tokens,
        createdAt: newVendor.createdAt,
        updatedAt: newVendor.updatedAt,
      };
    } catch (e) {
      throw new Error("Ошибка: " + e.message);
    }
  }

  async login(email, password) {
    try {
      const vendor = await Vendor.findOne({ where: { email } });
      if (!vendor) {
        throw ApiError.BadRequest("Продавец с таким email не был найден");
      }

      const isMatch = await bcrypt.compare(password, vendor.password);
      if (!isMatch) {
        throw ApiError.BadRequest("Неверный пароль");
      }

      const tokens = await TokenService.generateTokens({
        userId: vendor.userId,
        email,
      });

      await TokenService.saveToken(vendor.userId, tokens.refreshToken);

      return {
        vendor: {
          userId: vendor.userId,
          email: vendor.email,
          nameCompany: vendor.nameCompany,
          id: vendor.id,
        },
        tokens,
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt,
      };
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
    const vendorData = await Vendor.findOne({ where: { userId: ID.userId } });
    const tokens = TokenService.generateTokens({
      userId: vendorData.userId,
      email: vendorData.email,
    });
    await TokenService.saveToken(vendorData.userId, tokens.refreshToken);
    return {
      ...tokens,
      vendor: vendorData,
    };
  }
}

module.exports = new AuthVendorService();
