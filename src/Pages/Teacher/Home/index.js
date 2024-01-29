import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import styles from './Home.module.scss';
import Icon from '@mdi/react';
import { mdiFolderOutline, mdiLayersOutline } from '@mdi/js';

function Home() {
    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Màn hình chính</h3>

            <div className={styles.classList}>
                <Link to="/teacher/exam" className={styles.classItem}>
                    <Icon className={styles.icon} path={mdiFolderOutline} size={3.5} />
                    <div className={styles.name}>Đề thi</div>
                </Link>
                <Link to="/teacher/classroom" className={styles.classItem}>
                    <Icon className={styles.icon} path={mdiLayersOutline} size={3.5} />
                    <div className={styles.name}>Quản lý lớp</div>
                </Link>
            </div>
        </div>
    );
}

export default Home;
