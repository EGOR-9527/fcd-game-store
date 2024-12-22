import { makeAutoObservable } from 'mobx';
import { AuthResponse } from '../entities/AuthResponse.tsx';
import { ErrorType } from '../entities/ErrorSchema.tsx'; // Ensure this is a .ts file
import axios from 'axios';

const API_URL = 'http://localhost:7000/api/';

class RestApi {
    error: ErrorType | null = null;
    user: AuthResponse | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setError(error: ErrorType | null) {
        this.error = error;
    }

    clearError() {
        this.setError(null);
    }

    setUser (user: AuthResponse | null) {
        this.user = user;
    }

    async register(email: string, password: string, type: 'user' | 'vendor', nick?: string, nameCompany?: string) {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}${type}/registration`, { email, password, nick, nameCompany });
            console.log("response.data: ", response.data);
            console.log("response: ", response);
            
            // Сохраняем данные в нужном формате
            const userData = {
                id: response.data.vendor.id, // Предполагается, что id возвращается от сервера
                userId: response.data.vendor.userId, // Предполагается, что userId возвращается от сервера
                token: response.data.tokens.refreshToken, // Предполагается, что refreshToken возвращается от сервера
                createdAt: response.data.createdAt, // Предполагается, что createdAt возвращается от сервера
                updatedAt: response.data.updatedAt, // Предполагается, что updatedAt возвращается от сервера
            };
    
            localStorage.setItem("dataUser ", JSON.stringify(userData)); // Удален лишний пробел
            this.setUser(userData);
            this.clearError();
        } catch (err) {
            this.handleError(err);
        }
    }
    
    async login(email: string, password: string, type: 'user' | 'vendor') {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}${type}/login`, { email, password });
            console.log(response.data.refreshToken);
            
            // Сохраняем данные в нужном формате
            const userData = {
                id: response.data.vendor.id, // Предполагается, что id возвращается от сервера
                userId: response.data.vendor.userId, // Предполагается, что userId возвращается от сервера
                token: response.data.tokens.refreshToken, // Предполагается, что refreshToken возвращается от сервера
                createdAt: response.data.createdAt, // Предполагается, что createdAt возвращается от сервера
                updatedAt: response.data.updatedAt, // Предполагается, что updatedAt возвращается от сервера
            };
    
            localStorage.setItem("dataUser ", JSON.stringify(userData)); // Удален лишний пробел
            this.setUser (userData);
            this.clearError();
        } catch (err) {
            this.handleError(err);
        }
    }

    async addProduct(formData: FormData) {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/vendor/addProduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Убедитесь, что заголовок установлен
                },
            });
            console.log("response.data:" + JSON.stringify(response));
            return response.data; // Возвращаем ответ, если нужно
        } catch (err) {
            this.handleError(err);
        }
    }

    async allProducts(id: string) {

        try {
            console.log("id: " + id);
            const response = await axios.get<AuthResponse>(`${API_URL}/vendor/products/${id}`); // Уберите двоеточие перед id
            console.log("response.data: " + JSON.stringify(response.data))
            return response; // Возвращаем ответ, если нужно
        } catch (err) {
            this.handleError(err);
        }

    }

    async refresh() {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}refresh`, { withCredentials: true });
            this.setUser (response.data);
            this.clearError();
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any): void {
        if (axios.isAxiosError(error)) {
            const errorResponse = error.response?.data;
            const message = errorResponse?.message || "Неизвестная ошибка";
            console.log("message: " + message);
            this.setError({ message });
        } else {
            this.setError({ message: "Неизвестная ошибка" });
        }
    }
}

export const api = new RestApi();