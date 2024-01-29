import { useContext, useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiClockOutline, mdiFileCheckOutline, mdiFileEditOutline, mdiPowerStandby } from '@mdi/js';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import { ContextProvider } from '../../../components/Povider';
import { ContextTest } from '../Component/ContextProviderTest';
import styles from './TakeTest.module.scss';
import Timer from '../Component/Timer';

function TakeTest() {
    const [modal, setModal] = useState(false);
    const [student, setStudent] = useState({});
    const [exam, setExam] = useState({});
    const [listQuestion, setListQuestion] = useState([]);
    const [implementation, setImplementation] = useState({
        student_id: localStorage.getItem('id'),
        exam_id: localStorage.getItem('exam_id'),
        score: 0,
    });
    const [listAnswer, setListAnswer] = useState([]);
    const [listScore, setListScore] = useState([]);
    const redirect = useNavigate();

    if (!localStorage.getItem('time')) {
        redirect('/student/classroom');
    }

    useEffect(() => {
        fetch('https://exam-vavn.onrender.com/exam/get-exam/' + localStorage.getItem('exam_id'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => setExam(res));

        fetch('https://exam-vavn.onrender.com/user/get-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: localStorage.getItem('id'),
        })
            .then((res) => res.json())
            .then((res) => setStudent(res));

        fetch('https://exam-vavn.onrender.com/question/get-questions-and-options/' + localStorage.getItem('exam_id'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setListQuestion(res);
                setListAnswer(() => {
                    const listAnswerTemp = [];
                    res.forEach((item) => {
                        listAnswerTemp.push({
                            implementation_id: null,
                            question_id: item.id,
                            choice: '',
                        });
                    });
                    return [...listAnswerTemp];
                });
                setListScore(() => {
                    const listScoreTemp = [];
                    res.forEach(() => {
                        listScoreTemp.push(0);
                    });
                    return [...listScoreTemp];
                });
            });
    }, []);

    const handleChooseOption = (index, id_question, choice) => {
        setListAnswer((prev) => {
            const listAnswerTemp = [...prev];
            listAnswerTemp[index].choice = choice;
            return listAnswerTemp;
        });

        if (choice === listQuestion[index].correct) {
            setListScore((prev) => {
                const listScoreTemp = [...prev];
                listScoreTemp[index] = listQuestion[index].score;
                return [...listScoreTemp];
            });
        } else {
            setListScore((prev) => {
                const listScoreTemp = [...prev];
                listScoreTemp[index] = 0;
                return [...listScoreTemp];
            });
        }
    };

    const handleSubmit = () => {
        const score = listScore.reduce((acc, item) => acc + item, 0);
        const implementationSubmit = { ...implementation, score };

        fetch('https://exam-vavn.onrender.com/implementation/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(implementationSubmit),
        })
            .then((res) => res.json())
            .then((res) => {
                localStorage.setItem('implementation_id', res);
                listAnswer.forEach((item) => (item.implementation_id = res));
                fetch('https://exam-vavn.onrender.com/answer/save-answers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(listAnswer),
                }).then(() => (window.location.pathname = '/student/test/end-test'));
            });
    };

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <button onClick={() => setModal(true)} className={styles.left}>
                    <Icon className={styles.iconLeft} path={mdiPowerStandby} size={1.1} />
                    Thoát
                </button>
                <div className={styles.mid}>Thí sinh: {student.name}</div>
                <div className={styles.right}>
                    <div className={styles.time}>
                        <Icon className={styles.timeIcon} path={mdiClockOutline} size={1.3} />
                        <Timer handleSubmit={handleSubmit} timeTest={JSON.parse(localStorage.getItem(`time`))} />
                    </div>
                    <button onClick={() => setModal(true)} className={styles.btnSubmit}>
                        <Icon className={styles.iconSubmit} path={mdiFileEditOutline} size={1} />
                        Nộp bài
                    </button>
                </div>
            </header>
            <nav className={styles.sidebar}>
                <div className={styles.title}>Danh sách câu hỏi</div>
                <div className={styles.orderList}>
                    {listQuestion.map((item, index) => (
                        <button
                            key={index}
                            className={clsx(styles.orderItem, { [styles.active]: listAnswer[index].choice !== '' })}
                        >
                            {index + 1 < 10 && 0}
                            {index + 1}
                        </button>
                    ))}
                </div>
            </nav>
            <body className={styles.body}>
                {listQuestion.map((item, index) => (
                    <div key={index} className={styles.question}>
                        <div className={styles.bodyQuestion}>
                            <div className={styles.titleWrapper}>
                                <div className={styles.title}>Câu {index + 1}:</div>
                                <div className={styles.score}>{item.score} điểm</div>
                            </div>
                            <div className={styles.content}>{item.content}</div>
                            {item.image && (
                                <img
                                    width={500}
                                    src={'https://exam-vavn.onrender.com/question/getimage/' + item.image}
                                    alt=""
                                />
                            )}
                            <div className={styles.answerList}>
                                {item.options.map((item, index) => (
                                    <div key={index} className={styles.answerItem}>
                                        <strong className={styles.label}>{item.label}. </strong>
                                        {item.content}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.footer}>
                            Đáp án của bạn:
                            <div className={styles.optionList}>
                                <button
                                    onClick={() => handleChooseOption(index, item.id, 'A')}
                                    className={clsx(styles.optionItem, {
                                        [styles.active]: listAnswer[index].choice === 'A',
                                    })}
                                >
                                    A
                                </button>
                                <button
                                    onClick={() => handleChooseOption(index, item.id, 'B')}
                                    className={clsx(styles.optionItem, {
                                        [styles.active]: listAnswer[index].choice === 'B',
                                    })}
                                >
                                    B
                                </button>
                                <button
                                    onClick={() => handleChooseOption(index, item.id, 'C')}
                                    className={clsx(styles.optionItem, {
                                        [styles.active]: listAnswer[index].choice === 'C',
                                    })}
                                >
                                    C
                                </button>
                                <button
                                    onClick={() => handleChooseOption(index, item.id, 'D')}
                                    className={clsx(styles.optionItem, {
                                        [styles.active]: listAnswer[index].choice === 'D',
                                    })}
                                >
                                    D
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </body>

            <div className={clsx(styles.modal, { [styles.activeModal]: modal })}>
                <div onClick={() => setModal(false)} className={styles.modalBackground}></div>
                <div className={styles.modalWrapper}>
                    <div className={styles.modalBody}>
                        <div className={styles.modalBodyTop}>
                            <Icon className={styles.modalBodyTopIcon} path={mdiFileCheckOutline} size={1.5} />
                            Bạn có chắc chắn muốn nộp bài ?
                        </div>
                        <div className={styles.modalBodyMiddle}>
                            Thời gian làm bài của bạn còn{' '}
                            <strong className={styles.modalTime}>
                                <Timer handleSubmit={() => {}} timeTest={JSON.parse(localStorage.getItem(`time`))} />
                            </strong>
                        </div>
                        <div className={styles.modalBodyBottom}>
                            Khi xác nhận nhấn nộp bài, bạn sẽ không thể sửa lại bài thi của mình. Hãy chắc chắn bạn đã
                            xem lại tất cả các đáp án. Chúc bạn may mắn 🍀.
                        </div>
                    </div>
                    <div className={styles.modalFooter}>
                        <button onClick={() => setModal(false)} className={styles.modalCancleBtn}>
                            Hủy
                        </button>
                        <button onClick={handleSubmit} className={styles.modalSubmitBtn}>
                            Nộp bài
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TakeTest;
