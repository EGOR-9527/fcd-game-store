// src/stores/ProductStore.ts
import { makeAutoObservable } from "mobx";
import { api } from "../shared/api.ts"; // Убедитесь, что путь правильный

export interface GameData {
    id: string;
    name: string;
    description: string;
    keygame: string;
    price: number;
    img: string;
    category: string;
    quantity?: number;
    purchased?: number;
}

class ProductStore {
    products: GameData[] = [];
    currentPage: number = 0;
    itemsPerPage: number = 7;
    selectedCategory: string = 'Все';
    searchTerm: string = '';
    sortKey: string = 'количество';

    constructor() {
        makeAutoObservable(this);
    }

    async fetchProducts(userId: string) {
        try {
            const response = await api.allProducts(userId);
            this.products = response.data || [];
        } catch (error) {
            console.error("Ошибка при загрузке продуктов:", error);
        }
    }

    deleteProduct(productId: string) {
        this.products = this.products.filter(product => product.id !== productId);
    }

    get displayedItems() {
        return this.products
            .filter(item =>
                (this.selectedCategory === 'Все' || item.category === this.selectedCategory) &&
                item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const aValue = this.sortKey === 'количество' && a.quantity ? a.quantity : a.price;
                const bValue = this.sortKey === 'количество' && b.quantity ? b.quantity : b.price;
                return aValue - bValue;
            })
            .slice(this.currentPage * this.itemsPerPage, (this.currentPage + 1) * this.itemsPerPage);
    }

    get totalPages() {
        return Math.ceil(this.products.length / this.itemsPerPage);
    }
}

export const productStore = new ProductStore();