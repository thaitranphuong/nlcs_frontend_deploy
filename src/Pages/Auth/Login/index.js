import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './Login.module.scss';
import { Link } from 'react-router-dom';
import Home from '../Home';

function Login() {
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const notify = () =>
        toast.success('Tạo tài khoản thành công! 🦄', {
            position: 'top-right',
        });

    const notifyError = () =>
        toast.error('Email hoặc mật khẩu không đúng', {
            position: 'top-right',
            theme: 'colored',
        });

    useEffect(() => {
        if (localStorage.getItem('is_register')) {
            notify();
            localStorage.removeItem('is_register');
        }
    });

    const handleSetUser = (e) => {
        setUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        };
        fetch('https://exam-vavn.onrender.com/auth/login', options)
            .then((res) => res.json())
            .then((res) => {
                if (res.id != 0) {
                    localStorage.setItem('id', JSON.stringify(res.id));
                    localStorage.setItem('role_id', JSON.stringify(res.role_id));
                    if (res.role_id == 1) {
                        window.location.pathname = '/teacher/home';
                    } else {
                        window.location.pathname = '/student/home';
                    }
                } else {
                    notifyError();
                }
            });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.formWrapper}>
                <div className={styles.title}>Đăng nhập</div>
                <form method="" action="" className={styles.form}>
                    <div className={styles.formGroup}>
                        <input
                            onChange={(e) => handleSetUser(e)}
                            value={user.email}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            onChange={(e) => handleSetUser(e)}
                            value={user.password}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Mật khẩu"
                            required
                        />
                    </div>
                    <button onClick={handleSubmit} type="submit" className={styles.submitBtn}>
                        Log in
                    </button>
                    <span className={styles.required}>
                        Chưa có tài khoản?
                        <Link className={styles.link} to="/auth/register">
                            Đăng ký
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
}

export default Login;
