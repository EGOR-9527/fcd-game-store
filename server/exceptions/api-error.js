class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status; // Добавляем статус
    this.name = this.constructor.name; // Устанавливаем имя ошибки
  }

  static UnauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static ForbiddenError() {
    return new ApiError(403, "У вас нет доступа");
  }

  static NotFoundError(message) {
    return new ApiError(404, message);
  }

  static InternalServerError(message) {
    return new ApiError(500, message || "Внутренняя ошибка сервера");
  }
}

module.exports = ApiError;
