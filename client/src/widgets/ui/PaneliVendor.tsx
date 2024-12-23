// src/components/PaneliVendor.tsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { productStore } from '../../features/ProductStore.ts'; // Убедитесь, что путь правильный
import style from "../../style/paneliVendor.module.css";
import { AddProduct } from "../../features/AddProduct.tsx";
import { api } from "../../shared/api.ts"

export const PaneliVendor: React.FC = observer(() => {
    const { products, fetchProducts, deleteProduct, displayedItems, totalPages, currentPage, setCurrentPage } = productStore;

    useEffect(() => {
        const id = localStorage.getItem("dataUser ");
        if (id) {
            const parsedData = JSON.parse(id);
            fetchProducts(parsedData.userId);
        } else {
            console.error("Данные пользователя не найдены в localStorage.");
        }
    }, [fetchProducts]);

    const handleDeleteProduct = (productId: string) => {
        api.deleteProduct(productId)
            .then(() => {
                deleteProduct(productId);
            })
            .catch(err => console.error(err));
    };

    return (
        <div className={style.tableVendor}>
            <div className={style.headerVendor}>
                <input
                    type="text"
                    placeholder="Поиск игры..."
                    className={style.searchInput}
                    value={productStore.searchTerm}
                    onChange={(e) => productStore.searchTerm = e.target.value}
                />
                <div className={style.containerCategories}>
                    <div className={style.categoryTitle} onClick={() => productStore.setOpen(!productStore.open)}>
                        {productStore.selectedCategory}
                    </div>
                    {productStore.open && (
                        <div className={style.blockCategories}>
                            <div className={style.categories} onClick={() => productStore.selectedCategory = 'Все'}>Все</div>
                            {['Экшен', 'Приключения', 'Ролевые', 'Стратегии', 'Спорт'].map((category, index) => (
                                <div key={index} className={style.categories} onClick={() => productStore.selectedCategory = category}>
                                    {category}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={() => productStore.openAddProduct = !productStore.openAddProduct} className={style.addButton}>Добавить игру</button>
            </div>

            <div className={style.headerNameColumn}>
                <div className={style.column}>
                    <h1>Игра</h1>
                </div>
                <div className={style.column}><h1>Категория</h1></div>
                <div className={style.column} onClick={() => productStore.sortKey = 'количество'}>
                    <h1>Количество купленных</h1>
                </div>
                <div className={style.column} onClick={() => productStore.sortKey = 'стоимость'}>
                    <h1>Стоимость</h1>
                </div>
            </div>

            {productStore.openAddProduct ? <AddProduct /> : null}
            {
                products.length === 0 ? (
                    <div className={style.noProducts}>
                        <h2>Нет товаров</h2>
                    </div>
                ) : (
                    displayedItems.map((item, index) => (
                        <div key={index} className={style.rowVendor}>
                            <div className={style.tovar}>
                                <img src={`http://localhost:7000/api/uploads/${item.img}`} alt={item.name} className={style.gameImage} />
                                <p>{item.name}</p>
                            </div>
                            <div className={style.column}>{item.category}</div>
                            <div className={style.column}>{item.purchased}</div>
                            <div className={style.column}>{item.price}</div>
                            <div className={style.column}>
                                <button onClick={() => handleDeleteProduct(item.id)}>❌</button>
                            </div>
                        </div>
                    ))
                )
            }

            <div className={style.footer}>
                <button className={style.footerButton} onClick={() => productStore.currentPage > 0 && (productStore.currentPage -= 1)} disabled={productStore.currentPage === 0}>Назад</button>
                <button className={style.footerButton} onClick={() => productStore.currentPage < totalPages - 1 && (productStore.currentPage += 1)} disabled={productStore.currentPage === totalPages - 1}>Вперед</button>
            </div>
        </div>
    );
});