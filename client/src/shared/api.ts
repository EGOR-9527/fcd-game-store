import { makeAutoObservable } from 'mobx';
import { AuthResponse } from '../entities/AuthResponse.tsx';
import { ErrorType } from '../entities/ErrorSchema.tsx'; // Убедитесь, что это .ts файл
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

    async register(email: string, password: string, nick: string) {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}registrationUser `, { email, password, nick });
            this.setUser (response.data);
            this.clearError();
        } catch (err) {
            this.handleError(err);
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}loginUser `, { email, password });
            this.setUser (response.data);
            this.clearError();
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