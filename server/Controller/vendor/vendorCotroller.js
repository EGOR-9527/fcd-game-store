const ApiError = require("../../exceptions/api-error");
const vendorService = require("../../Service/vendor/vendorService");
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
        const imgPath = path.basename(product.img); // Получаем только имя файла
        return {
          ...product,
          img: imgPath, // Возвращаем только имя файла
        };
      });
      res.json(productsWithImages);
    } catch (e) {
      console.error(e);
      return next(ApiError.InternalServerError(e.message));
    }
  }

  async addProduct(req, res, next) {
    const { vendorId, name, description, keygame, price, category } = req.body;
    const img = req.file; // Получаем файл из req.file
    if (!img) {
      return res.status(400).json({ message: "Файл не загружен" });
    }

    // Путь к файлу уже доступен в img.path
    const imgPath = img.path; // Используем путь к файлу, который уже был сохранен multer

    try {
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

  async deleteProduct(req, res, next) {
    const { id } = req.params;
    console.log(id);
    try {
      const answer = await vendorService.deleteProduct(id);

      if (answer) {
        return res.status(200).json({ message: "Продукт успешно удален" });
      } else {
        return next(ApiError.NotFound("Продукт не найден"));
      }
    } catch (error) {
      console.error(error);
      return next(ApiError.InternalServerError("Ошибка при удалении продукта"));
    }
  }
}

module.exports = new VendorController();
