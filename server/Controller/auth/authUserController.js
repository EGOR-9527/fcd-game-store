const ApiError = require("../../exceptions/api-error");
const { validationResult } = require("express-validator");
const AuthUserService = require("../../Service/auth/authUesrService"); // Исправлено имя файла

class AuthUserController {
  async registration(req, res, next) {
    try {
      const { email, password, nick } = req.body; // Include nick
      console.log(email, password, nick);

      const userData = await AuthUserService.registration(email, password, nick);
      console.log("userData: ", userData);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      console.error(e);
      return next(ApiError.BadRequest(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(errors.array()));
      }

      const { email, password } = req.body;

      const userData = await AuthUserService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      console.log("userData: ", userData);
      return res.json(userData);
    } catch (e) {
      console.error(e);
      return next(ApiError.BadRequest(e.message));
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await AuthUserService.refresh(refreshToken);
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

module.exports = new AuthUserController();