import { Link } from 'react-router-dom';
import styles from './Home.module.scss';
import logo from '../../../assets/images/logo.png';

function Home(props) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.left}>
                <img className={styles.logo} src={logo} alt="logo" />
                <div className={styles.title}>Hệ thống thi trắc nghiệm trực tuyến</div>
            </div>
            <div className={styles.right}>
                <Link to="/auth/register" className={styles.btnRegister}>
                    Đăng ký
                </Link>
                <Link to="/auth/login" className={styles.btnLogin}>
                    Đăng nhập
                </Link>
            </div>
        </div>
    );
}

export default Home;
