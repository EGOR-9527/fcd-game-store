const { Product, Vendor, AllProductsVendor } = require("../../model/model");
const ApiError = require("../../exceptions/api-error");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

class VendorService {
  async allProducts(id) {
    const products = await AllProductsVendor.findAll({
      where: { vendorId: id },
    });

    console.log("products: " + products);

    if (!products || products.length === 0) {
      throw ApiError.NotFoundError(
        `Продавец с ID ${id} не найден или у него нет продуктов`
      );
    }

    const allProduct = await Promise.all(
      products.map(async (product) => {
        const productData = await Product.findByPk(product.productId);
        if (!productData) {
          console.error(`Продукт с ID ${product.productId} не найден`); // Логирование
          throw ApiError.NotFoundError(
            `Продукт с ID ${product.productId} не найден`
          );
        }

        const imgPath = path.resolve(
          __dirname,
          "../../uploads",
          `${productData.img}`
        );

        return {
          id: productData.id,
          name: productData.name,
          description: productData.description,
          keygame: productData.keygame,
          price: productData.price,
          img: imgPath,
          category: productData.category,
        };
      })
    );

    return allProduct;
  }

  async addProduct(
    vendorId,
    imgPath,
    name,
    description,
    keygame,
    price,
    category
  ) {
    const vendor = await Vendor.findOne({ where: { userId: vendorId } });
    if (!vendor) {
      throw ApiError.NotFoundError(`Продавец с ID ${vendorId} не найден`);
    }

    const productId = uuid();
    const priceAsNumber = parseFloat(price);
    if (isNaN(priceAsNumber)) {
      throw new Error("Цена должна быть числом");
    }

    // Создание нового продукта
    const newProduct = await Product.create({
      id: productId,
      name,
      description,
      keygame,
      price: priceAsNumber,
      img: imgPath,
      vendorId: vendorId,
      category: category,
    });

    const allProducts = await AllProductsVendor.findAll({
      where: { vendorId: vendorId },
    });

    const existingProduct = allProducts.find(
      (product) => product.productId === newProduct.id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
      await existingProduct.save();
    } else {
      await AllProductsVendor.create({
        productId: newProduct.id,
        vendorId: vendorId,
        quantity: 1,
      });
    }

    return newProduct;
  }

  async deleteProduct(id) {
    // Находим продукт по ID
    const product = await Product.findByPk(id);
    if (!product) {
      return false; // Продукт не найден
    }

    // Находим запись в AllProductsVendor по productId
    const allProducts = await AllProductsVendor.findOne({
      where: { productId: id }, // Используем id продукта для поиска
    });

    if (!allProducts) {
      console.error(
        "Запись в AllProductsVendor не найдена для продукта с ID:",
        id
      );
      return false; // Запись не найдена
    }

    // Получаем путь к изображению
    const imgPath = path.resolve(__dirname, "../../uploads", product.img);

    // Удаляем изображение с диска
    try {
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      } else {
        console.error("Файл не найден:", imgPath);
      }
    } catch (error) {
      console.error("Ошибка при удалении изображения:", error);
      throw new Error("Не удалось удалить изображение");
    }

    // Удаляем продукт из базы данных
    await product.destroy();
    await allProducts.destroy(); // Удаляем запись из AllProductsVendor
    return true; // Успешное удаление
  }
}

module.exports = new VendorService();
