const { Product, Vendor, AllProductsVendor } = require("../../model/model");
const ApiError = require("../../exceptions/api-error");
const { v4: uuid } = require("uuid");

const path = require("path");
const fs = require("fs"); // Импортируем модуль fs для проверки существования файлов

class VendorService {
  async allProducts(id) {
    // Получаем все продукты для данного продавца
    const products = await AllProductsVendor.findAll({
      where: { vendorId: id },
    });

    // Проверяем, есть ли продукты
    if (!products || products.length === 0) {
      throw ApiError.NotFoundError(
        `Продавец с ID ${id} не найден или у него нет продуктов`
      );
    }

    // Используем Promise.all для асинхронного получения данных о каждом продукте
    const allProduct = await Promise.all(
      products.map(async (product) => {
        const productData = await Product.findByPk(product.productId); // Используем product.productId
        if (!productData) {
          throw ApiError.NotFoundError(
            `Продукт с ID ${product.productId} не найден`
          );
        }

        // Возвращаем относительный путь к изображению
        const imgPath = path.resolve(
          __dirname,
          "../../uploads",
          `${productData.img}.jpg`
        ); // Получаем абсолютный путь к изображению

        return {
          id: productData.id,
          name: productData.name,
          description: productData.description,
          keygame: productData.keygame,
          price: productData.price,
          img: imgPath, // Возвращаем относительный путь
          category: productData.category, // Возвращаем категорию продукта
        };
      })
    );

    return allProduct; // Возвращаем массив всех продуктов
  }

  async addProduct(vendorId, img, name, description, keygame, price, category) {
    console.log("vendorId: " + vendorId);
    console.log(
      "data: ",
      vendorId,
      name,
      description,
      keygame,
      price,
      img,
      category
    );

    // Находим продавца по ID
    const vendor = await Vendor.findOne({ where: { userId: vendorId } });
    if (!vendor) {
      throw ApiError.NotFoundError(`Продавец с ID ${vendorId} не найден`);
    }

    const productId = uuid(); // Генерируем новый UUID для продукта
    console.log("vendor: ", vendor);

    // Преобразование price в число
    const priceAsNumber = parseFloat(price);
    if (isNaN(priceAsNumber)) {
      throw new Error("Цена должна быть числом");
    }

    // Получаем путь для сохранения изображения
    const imagePath = path.resolve(
      __dirname,
      "../../uploads",
      `${productId}.jpg`
    );

    // Сохраняем изображение на сервере
    try {
      fs.writeFileSync(imagePath, img.buffer); // Используем img.buffer для получения содержимого файла
    } catch (error) {
      console.error("Ошибка при сохранении изображения:", error);
      throw new Error("Не удалось сохранить изображение");
    }

    // Создание нового продукта
    const newProduct = await Product.create({
      id: productId,
      name,
      description,
      keygame,
      price: priceAsNumber, // Используем число
      img: imagePath,
      vendorId: vendorId,
      category: category,
    });

    console.log("newProduct: ", newProduct);

    // Получение всех продуктов продавца
    const allProducts = await AllProductsVendor.findAll({
      where: { vendorId: vendorId },
    });

    // Проверка, существует ли запись о продукте
    const existingProduct = allProducts.find(
      (product) => product.productId === newProduct.id
    );

    if (existingProduct) {
      // Увеличиваем количество на 1, если продукт уже существует
      existingProduct.quantity += 1;
      await existingProduct.save(); // Сохраняем изменения
      console.log(`Количество продукта с ID ${newProduct.id} увеличено на 1.`);
    } else {
      // Сохранение ID нового продукта в модели всех товаров продавца
      await AllProductsVendor.create({
        productId: newProduct.id, // ID нового продукта
        vendorId: vendorId,
        quantity: 1, // Устанавливаем количество на 1
      });
      console.log(`Продукт с ID ${newProduct.id} добавлен с количеством 1.`);
    }

    return newProduct; // Возвращаем созданный продукт
  }
}

module.exports = new VendorService();
