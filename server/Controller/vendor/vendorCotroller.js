const ApiError = require("../../exceptions/api-error");
const vendorService = require("../../Service/vendor/vendorService");
const fs = require("fs");
const path = require("path");

class VendorController {
  async allProducts(req, res, next) {
    try {
      const { id } = req.params;
      console.log("id", id);
      const products = await vendorService.allProducts(id);
      console.log("products", products);

      // Формируем массив с относительными путями к изображениям
      const productsWithImages = products.map((product) => {
        const imgPath = path.join("../../uploads", path.basename(product.img)); // Используйте basename для получения имени файла
        console.log("imgPath: " + imgPath);
        return {
          ...product,
          img: imgPath, // Возвращаем относительный путь
        };
      });
      console.log(productsWithImages);
      res.json(productsWithImages); // Отправляем ответ с продуктами
    } catch (e) {
      console.error(e);
      return next(ApiError.InternalServerError(e.message));
    }
  }

  async addProduct(req, res, next) {
    const { vendorId, name, description, keygame, price, category } = req.body;
    const img = req.file.buffer; // Получаем файл из req.file

    if (!img) {
      return res.status(400).json({ message: "Файл не загружен" });
    }

    // Путь к файлу уже доступен в img.path
    const imgPath = img.path; // Используем путь к файлу, который уже был сохранен multer

    try {
      // Здесь вы можете использовать imgPath для добавления продукта
      await vendorService.addProduct(
        vendorId,
        imgPath,
        name,
        description,
        keygame,
        price,
        category
      );
      return res.status(201).json({ message: "Продукт успешно добавлен" });
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }
}

module.exports = new VendorController();
