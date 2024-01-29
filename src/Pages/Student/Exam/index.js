import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faQuestionCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useContext } from 'react';

import { ContextProvider } from '../../../components/Povider';
import styles from './Exam.module.scss';
import QuitButton from '../../../components/QuitButton';

function Exam() {
    const [modal, setModal] = useState(false);
    const [exam, setExam] = useState({});
    const [listQuestion, setListQuestion] = useState([]);
    const [listImplementation, setListImplementation] = useState([]);
    localStorage.setItem(`time`, JSON.stringify(exam.time * 60));

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('https://exam-vavn.onrender.com/exam/get-exam/' + localStorage.getItem('exam_id'), options)
            .then((res) => res.json())
            .then((res) => setExam(res));

        fetch('https://exam-vavn.onrender.com/question/get_questions/' + localStorage.getItem('exam_id'), options)
            .then((res) => res.json())
            .then((res) => setListQuestion(res));

        fetch(
            'https://exam-vavn.onrender.com/implementation/get-by-exam-and-student/' +
                localStorage.getItem('exam_id') +
                '/' +
                JSON.parse(localStorage.getItem('id')),
            options,
        )
            .then((res) => res.json())
            .then((res) => setListImplementation(res));
    }, []);

    const handleOpenModal = () => {
        setModal(true);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.wrapperInner}>
                <QuitButton path={'/student/classroom'} />
                <div className={styles.examName}>{exam.name}</div>
                <div className={styles.title}>Lịch sử làm bài</div>
                <div className={styles.historyList}>
                    {listImplementation.map((item, index) => (
                        <Link
                            onClick={() => localStorage.setItem('implementation_id', item.id)}
                            key={index}
                            to="/student/test/history"
                            className={styles.historyItem}
                        >
                            <div className={styles.left}>
                                <div className={styles.number}>{index + 1}</div>
                                <div className={styles.time}>{item.date}</div>
                            </div>
                            <div className={styles.right}>
                                <div className={styles.text}>Điểm: </div>
                                <div className={styles.score}>{item.score}</div>
                            </div>
                        </Link>
                    ))}
                </div>
                <button onClick={handleOpenModal} className={styles.startBtn}>
                    Bắt đầu thi
                </button>
            </div>
            {modal && (
                <div onClick={() => setModal(false)} className={styles.modal}>
                    <div onClick={(e) => e.stopPropagation()} className={styles.modalWrapper}>
                        <FontAwesomeIcon onClick={() => setModal(false)} className={styles.iconClose} icon={faTimes} />
                        <div className={styles.titleExam}>{exam.name}</div>
                        <div className={styles.info}>
                            <div className={styles.infoLeft}>
                                <FontAwesomeIcon className={styles.infoIcon} icon={faClock} />
                                Thời gian làm bài
                            </div>
                            <div className={styles.infoRight}>{exam.time} phút</div>
                        </div>
                        <div className={styles.info}>
                            <div className={styles.infoLeft}>
                                <FontAwesomeIcon className={styles.infoIcon} icon={faQuestionCircle} />
                                Số lượng câu hỏi
                            </div>
                            <div className={styles.infoRight}>{listQuestion.length}</div>
                        </div>

                        <Link to="/student/test/take-test" className={styles.btnStart}>
                            Bắt đầu thi
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Exam;
