import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './Register.module.scss';

function Register() {
    const navigate = useNavigate();

    //https://www.npmjs.com/package/react-toastify
    const notify = (content) =>
        toast.error(content, {
            position: 'top-right',
            theme: 'colored',
        });

    const [user, setUser] = useState({
        name: '',
        email: '',
        role_id: null,
        password: '',
    });

    const handleSetUser = (e) => {
        setUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.name.trim() === '') {
            notify('Vui lòng nhập tên');
            return;
        }

        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (user.email.trim() === '') {
            notify('Vui lòng nhập email');
            return;
        }

        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (regex.test(user.email) === false) {
            notify('Email chưa đúng định dạng');
            return;
        }

        if (user.role_id < 1 || user.role_id > 2) {
            notify('Vui lòng chọn vai trò');
            return;
        }

        if (user.password.trim() === '') {
            notify('Vui lòng nhập mật khẩu');
            return;
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        };
        fetch('https://exam-vavn.onrender.com/auth/register', options)
            .then((res) => res.json())
            .then((res) => {
                if (res.id !== 0) {
                    localStorage.setItem('is_register', 'true');
                    navigate('/auth/login');
                } else {
                    notify('Email đã tồn tại!');
                }
            });
    };

    return (
        <div className={styles.wrapper}>
            <ToastContainer />
            <div className={styles.formWrapper}>
                <div className={styles.title}>Đăng ký</div>
                <form method="" action="" className={styles.form}>
                    <div className={styles.formGroup}>
                        <input
                            onChange={(e) => handleSetUser(e)}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Họ và tên"
                            value={user.name}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            onChange={(e) => handleSetUser(e)}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            required
                            value={user.email}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <div className={styles.option}>
                            <input
                                onChange={(e) => handleSetUser(e)}
                                className={styles.radio}
                                type="radio"
                                value={2}
                                name="role_id"
                                id="role"
                                required
                            />
                            Học sinh
                            <input
                                onChange={(e) => handleSetUser(e)}
                                className={styles.radio}
                                type="radio"
                                value={1}
                                name="role_id"
                                id="role"
                                required
                            />
                            Giáo viên
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            onChange={(e) => handleSetUser(e)}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Mật khẩu"
                            required
                        />
                    </div>
                    <button onClick={handleSubmit} type="submit" className={styles.submitBtn}>
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
