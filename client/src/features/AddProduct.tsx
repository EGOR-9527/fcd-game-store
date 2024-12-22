import React, { useState } from 'react';
import style from "../style/addProduct.module.css";
import { api } from "../shared/api.ts";

interface AddProductProps {
    onAddProduct: (product: { image: File; name: string; description: string; key: string; price: string; category: string }) => void;
}

export const AddProduct: React.FC<AddProductProps> = ({ onAddProduct }) => {
    const [image, setImage] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [key, setKey] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [category, setCategory] = useState<string>(''); // Состояние для выбранной категории
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // Состояние для управления выпадающим списком

    const categories = ['Экшен', 'Приключения', 'Ролевые', 'Стратегии', 'Спорт']; // Пример категорий

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (image && name && description && key && price && category) {
            await clickAddProduct(image, name, description, key, price, category);
            setImage(null);
            setName('');
            setDescription('');
            setKey('');
            setPrice('');
            setCategory('');
        } else {
            alert("Пожалуйста, заполните все поля.");
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const clickAddProduct = async (img: File, name: string, description: string, key: string, price: string, category: string) => {
        const vendorData = localStorage.getItem('dataUser ');

        if (vendorData) {
            let parsedVendor;
            try {
                parsedVendor = JSON.parse(vendorData);
            } catch (error) {
                console.error("Ошибка при парсинге данных продавца:", error);
                return; // Прерываем выполнение, если данные не корректны
            }

            const userId = parsedVendor.userId;

            const formData = new FormData();
            formData.append('img', img); // Добавляем файл
            formData.append('vendorId', userId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('keygame', key);
            formData.append('price', price); // Убедитесь, что price в нужном формате
            formData.append('category', category); // Добавляем категорию

            try {
                await api.addProduct(formData); // Передаем formData
            } catch (error) {
                console.error("Ошибка при добавлении продукта:", error);
            }
        } else {
            console.error("Данные продавца не найдены в localStorage.");
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectCategory = (category: string) => {
        setCategory(category);
        setIsDropdownOpen(false);
    };

    if (!isVisible) return null;

    return (
        <div className={style.addProduct}>
            <h2 className={style.title}>Добавить игру</h2>
            <button onClick={handleClose} className={style.closeButton}>Закрыть</button>
            <form onSubmit={handleSubmit} className={style.form}>
                <div className={style.formGroup}>
                    <label className={style.label}>Иконка игры:</label>
                    <input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files) {
                                setImage(e.target.files[0]);
                            }
                        }}
                        required
                        className={style.input}
                    />
                </div>
                <div className={style.formGroup}>
                    <label className={style.label}>Название:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Название игры"
                        required
                        className={style.input}
                    />
                </div>
                <div className={style.formGroup}>
                    <label className={style.label}>Описание:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Описание игры"
                        required
                        className={style.textarea}
                    />
                </div>
                <div className={style.formGroup}>
                    <label className={style.label}>Ключ:</label>
                    <input
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Ключ игры"
                        required
                        className={style.input}
                    />
                </div>
                <div className={style.formGroup}>
                    <label className={style.label}>Цена:</label>
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Цена игры"
                        required
                        className={style.input}
                    />
                </div>
                <div className={style.formGroup}>
                    <label className={style.label}>Категория:</label>
                    <div className={style.dropdown}>
                        <button type="button" onClick={toggleDropdown} className={style.dropdownButton}>
                            {category || "Выберите категорию"}
                        </button>
                        {isDropdownOpen && (
                            <div className={style.dropdownMenu}>
                                {categories.map((cat, index) => (
                                    <div key={index} className={style.dropdownItem} onClick={() => selectCategory(cat)}>
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit" className={style.submitButton}>Добавить игру</button>
            </form>
        </div>
    );
};