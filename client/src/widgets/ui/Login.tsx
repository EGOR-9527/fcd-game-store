import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import { loginUser } from "../../entities/loginUser.tsx";
import { useNavigate } from 'react-router-dom';
import { api } from "../../shared/api.ts";
import { pathKeys } from "../../shared/lib/react-router.ts";
import "../../style/login.css";

export const Login: React.FC = observer(() => {
    const [isLogin, setIsLogin] = useState(true);
    const [dataUser, setDataUser] = useState<loginUser>({ email: '', password: '' });
    const [registerData, setRegisterData] = useState<loginUser>({ email: '', password: '', nick: '' });
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
        api.clearError(); // Сброс ошибки при переключении
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await api.login(dataUser.email, dataUser.password, 'user'); // Pass userType
        if (!api.error) {
            setPositiveResponse("Вход успешен!");
            navigate(pathKeys.home());
        }
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await api.register(registerData.email, registerData.password, 'user', registerData.nick); // Pass userType and nick
        if (!api.error) {
            setPositiveResponse("Регистрация успешна!");
            navigate(pathKeys.home());
        }
    }

    const handleChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataUser(prevState => ({
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
                                <input type="email" name="email" value={dataUser.email} onChange={handleChangeLogin} placeholder="Email" className="form__input" required />
                            </p>
                            <p>
                                <input type="password" name="password" value={dataUser.password} onChange={handleChangeLogin} placeholder="Пароль" className="form__input" required />
                            </p>
                            <p>
                                <button type="submit" className="form__btn">Войти</button>
                            </p>
                        </form>
                    ) : (
                        <form action="#" className="form form_signup" onSubmit={handleRegister}>
                            <h3 className="form__title">Регистрироваться</h3>
                            <p>
                                <input type="text" name="nick" value={registerData.nick} onChange={handleChangeRegister} placeholder="Ник" className="form__input" required />
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
            </article >
            <div className={`shadow_right ${isLogin ? "" : "active"}`}></div>
        </div >
    );
});