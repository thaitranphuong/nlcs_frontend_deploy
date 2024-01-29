import clsx from 'clsx';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiClose } from '@mdi/js';
import { useState, useEffect } from 'react';

import QuitButton from '../../../components/QuitButton';
import styles from './History.module.scss';

function History() {
    const [implementation, setImplementation] = useState({ answers: [] });
    let pointOfExam = 0;

    implementation.answers.map((item) => {
        pointOfExam += item.question.score;
    });

    useEffect(() => {
        fetch('https://exam-vavn.onrender.com/implementation/get-by-id/' + localStorage.getItem('implementation_id'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => setImplementation(res));
    }, []);

    return (
        <div className={styles.wrapper}>
            <QuitButton
                path={window.location.pathname.includes('student') ? '/student/exam' : '/teacher/exam/statistic'}
            />
            <div className={styles.header}>
                <div className={styles.headerLeft}>{implementation.exam_name}</div>
                <div className={styles.headerRight}>
                    Điểm: {implementation.score} / {pointOfExam}
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.top}>
                    <button className={styles.btnTitle}>Trắc nghiệm</button>
                </div>
                <div className={styles.listQuestion}>
                    {implementation.answers.map((item, index) => (
                        <div key={index} className={styles.question}>
                            <div className={styles.bodyQuestion}>
                                <div className={styles.headerWrapper}>
                                    <div className={styles.title}>Câu {index + 1}</div>
                                    <div className={styles.point}>{item.question.score} điểm</div>
                                </div>
                                <div classame={styles.content}>{item.question.content}</div>
                                {item.question.image && (
                                    <img
                                        width={500}
                                        src={'https://exam-vavn.onrender.com/question/getimage/' + item.question.image}
                                        alt=""
                                    />
                                )}
                                <div className={styles.answerList}>
                                    {item.question.options.map((item, index) => (
                                        <div key={index} className={styles.answerItem}>
                                            <strong className={styles.label}>{item.label}. </strong>
                                            {item.content}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.footer}>
                                <div
                                    className={clsx(styles.footerText, {
                                        [styles.true]: item.choice === item.question.correct,
                                    })}
                                >
                                    Đáp án đúng: {item.question.correct}
                                </div>
                                <div className={styles.optionList}>
                                    {item.question.options.map((option, index) => (
                                        <button key={index} className={clsx(styles.optionItem)}>
                                            {item.choice === option.label && (
                                                <>
                                                    {item.choice !== item.question.correct && (
                                                        <Icon className={styles.falseIcon} path={mdiClose} size={1.5} />
                                                    )}
                                                    {item.choice === item.question.correct && (
                                                        <Icon
                                                            className={styles.trueIcon}
                                                            path={mdiCheckCircle}
                                                            size={1.5}
                                                        />
                                                    )}
                                                </>
                                            )}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default History;
