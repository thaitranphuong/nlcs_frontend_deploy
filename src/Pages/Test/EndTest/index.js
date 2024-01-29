import Icon from '@mdi/react';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import {
    mdiAccountOutline,
    mdiCheckCircleOutline,
    mdiClockTimeThreeOutline,
    mdiCloseCircleOutline,
    mdiHelpCircleOutline,
    mdiMenuRight,
} from '@mdi/js';

import { ContextTest } from '../Component/ContextProviderTest';
import styles from './EndTest.module.scss';
import QuitButton from '../../../components/QuitButton';

function EndTest() {
    const [implementation, setImplementation] = useState({ answers: [] });
    let numberOfTrueChoices = 0;
    let pointOfExam = 0;

    localStorage.removeItem('time');
    if (!localStorage.getItem('student_id')) {
        localStorage.setItem('student_id', localStorage.getItem('id'));
    }

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

    implementation.answers.map((item) => {
        if (item.question.correct === item.choice) {
            numberOfTrueChoices++;
        }
        pointOfExam += item.question.score;
    });

    return (
        <div className={styles.wrapper}>
            <QuitButton path={'/student/exam'} />
            <div className={styles.wrapperInner}>
                <div className={styles.head}>
                    <div className={styles.message}>Bài làm của bạn đã được gửi đi</div>
                    <div className={styles.yourScore}>
                        <div className={styles.text}>Điểm của bạn: </div>
                        <div className={styles.score}>
                            {implementation.score}/{pointOfExam}
                        </div>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.nameExam}>{implementation.exam_name}</div>
                    <div className={styles.infoList}>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLeft}>
                                <Icon className={styles.iconName} path={mdiAccountOutline} size={1} />
                                <div className={styles.text}>Thí sinh</div>
                            </div>
                            <div className={styles.infoRight}>
                                <div className={styles.name}>{implementation.student_name}</div>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLeft}>
                                <Icon className={styles.iconTime} path={mdiClockTimeThreeOutline} size={1} />
                                <div className={styles.text}>Ngày làm bài</div>
                            </div>
                            <div className={styles.infoRight}>
                                <div className={styles.time}>{implementation.date}</div>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLeft}>
                                <Icon className={styles.iconTrue} path={mdiCheckCircleOutline} size={1} />
                                <div className={styles.text}>Số câu trắc nghiệm đúng</div>
                            </div>
                            <div className={styles.infoRight}>
                                <div className={styles.numberTrue}>{numberOfTrueChoices}</div>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLeft}>
                                <Icon className={styles.iconFalse} path={mdiCloseCircleOutline} size={1} />
                                <div className={styles.text}>Số câu trắc nghiệm sai</div>
                            </div>
                            <div className={styles.infoRight}>
                                <div className={styles.numberFalse}>
                                    {implementation.answers.length - numberOfTrueChoices}
                                </div>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLeft}>
                                <Icon className={styles.iconTotal} path={mdiHelpCircleOutline} size={1} />
                                <div className={styles.text}>Tổng số câu hỏi trong đề</div>
                            </div>
                            <div className={styles.infoRight}>
                                <div className={styles.total}>{implementation.answers.length}</div>
                            </div>
                        </div>
                    </div>
                    <Link to="/student/test/history" className={styles.returnBtn}>
                        Xem đáp án
                        <Icon path={mdiMenuRight} size={1.5} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default EndTest;
