const ApiError = require("../../exceptions/api-error");
const { validationResult } = require("express-validator");
const authService = require("../../Service/auth/authVendorService");

class AuthVendorController {
  async registration(req, res, next) {
    try {
      const { email, password, nick } = req.body;
      console.log(email, password, nick);

      const userData = await authService.registration(email, password, nick);
      console.log("userData: ", userData);
      return res.json(userData);
    } catch (e) {
      console.error(e);
      return next(ApiError.BadRequest("Ошибка при регистрации: " + e.message));
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибки при валидации: ", errors.array())
        );
      }

      const { email, password } = req.body;

      const userData = await authService.login(email, password);
      console.log("userData: ", userData);
      return res.json(userData);
    } catch (e) {
      console.error(e);
      return next(ApiError.BadRequest("Ошибка при входе: " + e.message));
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthVendorController();
