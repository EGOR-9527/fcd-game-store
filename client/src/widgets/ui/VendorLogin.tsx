import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import { loginVendor } from "../../entities/loginVendor.tsx"; // Ensure this is the correct import
import { useNavigate } from 'react-router-dom';
import { api } from "../../shared/api.ts";
import { pathKeys } from "../../shared/lib/react-router.ts";
import "../../style/login.css";

export const VendorLogin: React.FC = observer(() => {
    const [isLogin, setIsLogin] = useState(true);
    const [dataUser , setDataUser ] = useState<loginVendor>({ email: '', password: '', nameCompany: '' });
    const [registerData, setRegisterData] = useState<loginVendor>({ email: '', password: '', nameCompany: '' });
    const [positiveResponse, setPositiveResponse] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setIsLogin(true);
        resetMessages();
    }

    const handleRegisterClick = () => {
        setIsLogin(false);
        resetMessages();
    }

    const resetMessages = () => {
        setPositiveResponse(null);
        api.clearError(); // Clear error messages when switching
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await api.login(dataUser.email, dataUser.password, 'vendor'); // Pass userType
        if (!api.error) {
            setPositiveResponse("Вход успешен!");
            navigate(pathKeys.homeVendor());
        }
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await api.register(registerData.email, registerData.password, 'vendor', undefined, registerData.nameCompany); // Pass userType and nameCompany
        if (!api.error) {
            setPositiveResponse("Регистрация успешна!");
            navigate(pathKeys.homeVendor());
        }
    }

    const handleChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataUser (prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleChangeRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div>
            <div className={`shadow_left ${isLogin ? "active" : ""}`}></div>

            <div className={`responseRegistr ${positiveResponse ? "active" : ""}`}>
                <h1>{positiveResponse}</h1>
            </div>

            <div className={`error-message ${api.error && api.error.message ? "active" : ""}`}>
                <h1>{api.error ? api.error.message : ""}</h1>
            </div>

            <article className="container">
                <div className="block">
                    <section className="block__item">
                        <h2 className="block-item__title">
                            У вас уже есть аккаунт?
                        </h2>
                        <button className="login block-item__btn" onClick={handleLoginClick}>
                            Войти
                        </button>
                    </section>

                    <section className="block__item">
                        <h2 className="block-item__title">
                            У вас еще нет аккаунта?
                        </h2>
                        <button className="registr block-item__btn" onClick={handleRegisterClick}>
                            Зарегистрироваться
                        </button>
                    </section>
                </div>

                <div className={`form-box ${isLogin ? "" : "active"}`}>
                    {isLogin ? (
                        <form action="#" className="form form_signin" onSubmit={handleLogin}>
                            <h3 className="form__title">Вход</h3>
                            <p>
                                <input type="email" name="email" value={dataUser .email} onChange={handleChangeLogin} placeholder="Email" className="form__input" required />
                            </p>
                            <p>
                                <input type="password" name="password" value={dataUser .password} onChange={handleChangeLogin} placeholder="Пароль" className="form__input" required />
                            </p>
                            <p>
                                <button type="submit" className="form__btn">Войти</button>
                            </p>
                        </form>
                    ) : (
                        <form action="#" className="form form_signup" onSubmit={handleRegister}>
                            <h3 className="form__title">Регистрироваться</h3>
                            <p>
                                <input type="text" name="nameCompany" value={registerData.nameCompany} onChange={handleChangeRegister} placeholder="Название компании" className="form__input" required />
                            </p>
                            <p>
                                <input type="email" name="email" value={registerData.email} onChange={handleChangeRegister} placeholder="Email" className="form__input" required />
                            </p>
                            <p>
                                <input type="password" name="password" value={registerData.password} onChange={handleChangeRegister} placeholder="Пароль" className="form__input" required />
                            </p>
                            <p>
                                <button type="submit" className="form__btn form__btn_signup">Зарегистрироваться</button>
                            </p>
                        </form>
                    )}
                </div>
            </article>
            <div className={`shadow_right ${isLogin ? "" : "active"}`}></div>
        </div>
    );
});