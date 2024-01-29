import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import { mdiCogOutline, mdiHomeOutline, mdiLayersOutline, mdiFileDocumentOutline } from '@mdi/js';
import { useContext } from 'react';

import { ContextProvider } from '../../../components/Povider';
import styles from './Sidebar.module.scss';
import logo from '../../../assets/images/logo.png';

function Sidebar() {
    const [themeBoard, setThemeBoard] = useState(false);
    const [active, setActive] = useState('/teacher/home');
    const { setTheme } = useContext(ContextProvider);

    useEffect(() => {
        if (window.location.pathname.includes('/teacher/exam')) {
            setActive('/teacher/exam');
        } else if (window.location.pathname.includes('/teacher/classroom')) {
            setActive('/teacher/classroom');
        } else {
            setActive('/teacher/home');
        }
    }, [window.location.pathname]);

    return (
        <>
            <div className={styles.wrapper}>
                <img src={logo} alt="logo" className={styles.logo} />
                <div className={styles.wrapperBtn}>
                    <div className={styles.wrapperBlockBtn}>
                        <Link
                            to="/teacher/home"
                            className={clsx(styles.btn, { [styles.active]: active === '/teacher/home' })}
                        >
                            <Icon path={mdiHomeOutline} size={2} />
                            <div className={styles.tooltip}>Trang chủ</div>
                        </Link>
                        <div className={clsx({ [styles.blockTop]: active === '/teacher/home' })}></div>
                        <div className={clsx({ [styles.blockCenter]: active === '/teacher/home' })}></div>
                        <div className={clsx({ [styles.blockBottom]: active === '/teacher/home' })}></div>
                    </div>
                    <div className={styles.wrapperBlockBtn}>
                        <Link
                            to="/teacher/exam"
                            className={clsx(styles.btn, { [styles.active]: active === '/teacher/exam' })}
                        >
                            <Icon path={mdiFileDocumentOutline} size={2} />
                            <div className={styles.tooltip}>Đề thi</div>
                        </Link>
                        <div className={clsx({ [styles.blockTop]: active === '/teacher/exam' })}></div>
                        <div className={clsx({ [styles.blockCenter]: active === '/teacher/exam' })}></div>
                        <div className={clsx({ [styles.blockBottom]: active === '/teacher/exam' })}></div>
                    </div>
                    <div className={styles.wrapperBlockBtn}>
                        <Link
                            to="/teacher/classroom"
                            className={clsx(styles.btn, { [styles.active]: active === '/teacher/classroom' })}
                        >
                            <Icon path={mdiLayersOutline} size={2} />
                            <div className={styles.tooltip}>Lớp học</div>
                        </Link>
                        <div className={clsx({ [styles.blockTop]: active === '/teacher/classroom' })}></div>
                        <div className={clsx({ [styles.blockCenter]: active === '/teacher/classroom' })}></div>
                        <div className={clsx({ [styles.blockBottom]: active === '/teacher/classroom' })}></div>
                    </div>

                    <div
                        onClick={() => {
                            setThemeBoard(!themeBoard);
                        }}
                        className={clsx(styles.btnSetting)}
                    >
                        <Icon path={mdiCogOutline} size={2} />
                        {themeBoard && (
                            <div className={styles.themeWrapper}>
                                <div className={styles.themeTitle}>Bảng màu</div>
                                <div onClick={() => setTheme('theme1')} className={styles.themeColor1}></div>
                                <div onClick={() => setTheme('theme2')} className={styles.themeColor2}></div>
                                <div onClick={() => setTheme('theme3')} className={styles.themeColor3}></div>
                                <div onClick={() => setTheme('theme4')} className={styles.themeColor4}></div>
                                <div onClick={() => setTheme('theme5')} className={styles.themeColor5}></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
