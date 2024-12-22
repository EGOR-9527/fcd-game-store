import React, { useEffect, useRef, useState } from 'react';
import style from "../../style/paneliVendor.module.css";
import { AddProduct } from "../../features/AddProduct.tsx"; // Убедитесь, что это правильный импорт
import { api } from "../../shared/api.ts"; // Убедитесь, что это правильный импорт

interface GameData {
    id: string;
    name: string;
    description: string;
    keygame: string;
    price: number;
    img: string;
    category: string; // Добавьте category в интерфейс
    quantity?: number; // Сделайте quantity необязательным
    purchased?: number; // Сделайте purchased необязательным
}

export const PaneliVendor: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('Все');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortKey, setSortKey] = useState<string>('количество'); // По умолчанию сортируем по количеству
    const itemsPerPage: number = 7;
    const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
    const [products, setProducts] = useState<GameData[]>([]); // Загрузка игровых продуктов из API
    const categories = ['Категория1', 'Категория2']; // Пример категорий, замените на ваши данные
    const [IDUSER, setIDUSER] = useState<string | null>(null);

    useEffect(() => {
        console.log(displayedItems)
        const id = localStorage.getItem("dataUser "); // Убедитесь, что ключ без пробела
        if (id) {
            const parsedData = JSON.parse(id);
            setIDUSER(parsedData.userId);
            api.allProducts(parsedData.userId)
                .then(response => {
                    setProducts(response.data || []); // Убедитесь, что вы получаете данные правильно
                    console.log(response.data)
                })
                .catch(err => console.error(err));
        } else {
            console.error("Данные пользователя не найдены в localStorage.");
        }
    }, []); // Пустой массив зависимостей для выполнения только один раз

    const handleOpenAddProduct = () => {
        setOpenAddProduct(!openAddProduct);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const displayedItems = products
        .filter(item =>
            (selectedCategory === 'Все' || item.category === selectedCategory) &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const aValue = sortKey === 'количество' && a.quantity ? a.quantity : a.price;
            const bValue = sortKey === 'количество' && b.quantity ? b.quantity : b.price;
            return aValue - bValue;
        })
        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    console.log("Отображаемые элементы:", displayedItems); // Проверка отображаемых элементов


    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleCategories = () => {
        setOpen(!open);
    };

    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);
        setOpen(false);
    };

    const handleSortChange = (key: string) => {
        setSortKey(key);
    };

    return (
        <div className={style.tableVendor}>
            <div className={style.headerVendor}>
                <input
                    type="text"
                    placeholder="Поиск игры..."
                    className={style.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className={style.containerCategories}>
                    <div className={style.categoryTitle} onClick={handleCategories}>
                        {selectedCategory}
                    </div>
                    {open && (
                        <div className={style.blockCategories}>
                            <div className={style.categories} onClick={() => handleSelectCategory('Все')}>Все</div>
                            {categories.map((category, index) => (
                                <div key={index} className={style.categories} onClick={() => handleSelectCategory(category)}>
                                    {category}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={handleOpenAddProduct} className={style.addButton}>Добавить игру</button>
            </div>

            <div className={style.headerNameColumn}>
                <div className={style.column}>
                    <h1>Игра</h1>
                </div>
                <div className={style.column}><h1>Категория</h1></div>
                <div className={style.column} onClick={() => handleSortChange('количество')}>
                    <h1>Количество</h1>
                </div>
                <div className={style.column} onClick={() => handleSortChange('количество купленных')}>
                    <h1>Количество купленных</h1>
                </div>
                <div className={style.column} onClick={() => handleSortChange('стоимость')}>
                    <h1>Стоимость</h1>
                </div>
            </div>

            {openAddProduct ? <AddProduct /> : null}
            {
                totalItems === 0 ? (
                    <div className={style.noProducts}>
                        <h2>Нет товаров</h2>
                    </div>
                ) : (
                    displayedItems.map((item, index) => {
                        return (
                            <div key={index} className={style.rowVendor}>
                                <div className={style.tovar}>
                                    <img src={`http://localhost:7000/api/${item.img}`} alt={item.name} className={style.gameImage} />
                                    <p>{item.name}</p>
                                </div>
                                <div className={style.column}>{item.category}</div>
                                <div className={style.column}>{item.quantity}</div>
                                <div className={style.column}>{item.purchased}</div>
                                <div className={style.column}>{item.price}</div>
                            </div>
                        );
                    })
                )
            }

            <div className={style.footer}>
                <button className={style.footerButton} onClick={handlePrev} disabled={currentPage === 0}>Назад</button>
                <button className={style.footerButton} onClick={handleNext} disabled={currentPage === totalPages - 1}>Вперед</button>
            </div>
        </div>
    );
};