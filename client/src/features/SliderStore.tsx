import { makeAutoObservable } from 'mobx';

class SliderStore {
    currentIndex = 0;
    widths = Array(5).fill(0); // Предполагаем, что у вас 5 изображений

    constructor() {
        makeAutoObservable(this);
    }

    incrementWidth(index) {
        if (this.widths[index] < 100) {
            this.widths[index] += 1;
        }
    }

    resetWidths() {
        this.widths = Array(5).fill(0);
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.widths.length; // Переход к следующему изображению
    }
}

export const sliderStore = new SliderStore();