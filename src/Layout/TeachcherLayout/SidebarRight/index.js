import styles from './SidebarRight.module.scss';
import Chatbot from '../../../components/Chatbot';

function SidebarRight() {
    return (
        <div className={styles.wrapper}>
            <Chatbot className={styles.chat} />
        </div>
    );
}

export default SidebarRight;
