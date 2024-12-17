import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import avatar from "../../img/avatar.jpg";
import blackMyth from "../../img/black-myth.jpg";
import gta from "../../img/gta-6.jpg";
import helldivers from "../../img/helldivers-2.jpg";
import red from "../../img/red.jpg";

import style from "../../style/slider.module.css";
import { sliderStore } from '../../features/SliderStore.tsx'; // Импортируйте ваше хранилище

const IMG = [avatar, blackMyth, gta, helldivers, red];

export const Slider = observer(() => {
    useEffect(() => {
        const loadingInterval = setInterval(() => {
            sliderStore.incrementWidth(sliderStore.currentIndex); // Увеличиваем ширину для текущего изображения
        }, 50); // Обновляем ширину каждые 50 мс

        const changeImageInterval = setTimeout(() => {
            sliderStore.nextImage(); // Переход к следующему изображению
            sliderStore.resetWidths(); // Сбрасываем ширину для всех изображений
        }, 6000); // Каждые 6 секунд

        return () => {
            clearInterval(loadingInterval);
            clearTimeout(changeImageInterval);
        };
    }, [sliderStore.currentIndex]);

    return (
        <div className={style.Slider}>
            <div className={style.bigImgGame}>
                <img src={IMG[sliderStore.currentIndex]} alt="game" />
            </div>

            <div className={style.columnSlidersGame}>
                {IMG.map((slider, index) => {
                    return (
                        <div key={index} className={style.blockImg}>
                            <div style={{ width: `${sliderStore.widths[index]}%` }} className={style.loading}></div>
                            <img src={slider} alt="game" />
                            <h1>Игра</h1>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});