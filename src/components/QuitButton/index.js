import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import styles from './QuitButton.module.scss';
function QuitButton({ path }) {
    return (
        <Link to={path} className={styles.goBack}>
            <FontAwesomeIcon className={styles.iconBack} icon={faAngleLeft} />
            Quay lại
        </Link>
    );
}

export default QuitButton;
