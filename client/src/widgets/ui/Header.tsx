import React from 'react';
import style from "../../style/header.module.css"

export const Header: React.FC = () => {
    return (
        <div className={style.HeaderHome}>
            <input type="text" />
            <button>Найти</button>
            <button className={style.basket}>Корзина</button>
        </div>
    );
};
