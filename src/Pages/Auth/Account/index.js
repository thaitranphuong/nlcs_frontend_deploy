import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './Account.module.scss';
import QuitButton from '../../../components/QuitButton';
import avatar from '../../../assets/images/avatar.png';
import teacher_avatar from '../../../assets/images/teacher_avatar.png';

function Account() {
    const [user, setUser] = useState({});

    //https://www.npmjs.com/package/react-toastify
    const notify = () =>
        toast.success('Cập nhật tài khoản thành công!', {
            position: 'top-right',
        });

    const render = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: localStorage.getItem('id'),
        };
        fetch('https://exam-vavn.onrender.com/user/get-user', options)
            .then((res) => res.json())
            .then((res) => {
                setUser(res);
            });
    };

    useEffect(() => {
        render();
    }, []);

    const handleOnchangeUser = (e) => {
        setUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        };
        fetch('https://exam-vavn.onrender.com/auth/update-info', options).then(() => notify());
    };

    return (
        <div className={styles.wrapper}>
            <ToastContainer />
            <QuitButton path={localStorage.getItem('role_id') == 2 ? '/student/home' : '/teacher/home'} />
            <div className={styles.title}>Cài đặt tài khoản</div>
            <div className={styles.content}>
                <div className={styles.head}>
                    <img
                        className={styles.avatar}
                        src={window.location.pathname.includes('student') ? avatar : teacher_avatar}
                        alt="avatar"
                    />
                </div>
                <div method="post" className={styles.body}>
                    <div className={styles.item}>
                        <label className={styles.label}>Họ và tên</label>
                        <input
                            className={styles.input}
                            name="name"
                            value={user.name}
                            onChange={(e) => handleOnchangeUser(e)}
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.label}>Ngày sinh</label>
                        <input
                            className={styles.input}
                            name="birthday"
                            value={user.birthday}
                            onChange={(e) => handleOnchangeUser(e)}
                            type="date"
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.label}>Email</label>
                        <input
                            className={clsx(styles.input, styles.disabled)}
                            name="email"
                            value={user.email}
                            disabled
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.label}>Số điện thoại</label>
                        <input
                            onChange={(e) => handleOnchangeUser(e)}
                            className={styles.input}
                            name="phone"
                            value={user.phone}
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.label}>Giới tính</label>
                        <div className={styles.inputGender}>
                            <div className={styles.radio}>
                                <input
                                    onChange={(e) => handleOnchangeUser(e)}
                                    className={styles.radioCircuit}
                                    name="gender"
                                    value={'true'}
                                    type="radio"
                                    checked={`${user.gender}` === 'true'}
                                />
                                Nam
                            </div>
                            <div className={styles.radio}>
                                <input
                                    onChange={(e) => handleOnchangeUser(e)}
                                    className={styles.radioCircuit}
                                    name="gender"
                                    value={'false'}
                                    type="radio"
                                    checked={`${user.gender}` === 'false'}
                                />
                                Nữ
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={handleSubmit} className={styles.btnUpdate}>
                    Cập nhật
                </button>
            </div>
        </div>
    );
}

export default Account;
