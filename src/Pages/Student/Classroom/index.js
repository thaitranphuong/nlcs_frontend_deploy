import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';

import { ContextProvider } from '../../../components/Povider';
import styles from './Classroom.module.scss';
import QuitButton from '../../../components/QuitButton';
import { useEffect, useState } from 'react';

function Classroom() {
    const [classroom, setClassroom] = useState({});
    const [listExam, setListExam] = useState([]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('https://exam-vavn.onrender.com/classroom/get-class/' + localStorage.getItem('class_id'), options)
            .then((res) => res.json())
            .then((res) => setClassroom(res));

        fetch('https://exam-vavn.onrender.com/exam/get-exams-by-classroom/' + localStorage.getItem('class_id'), options)
            .then((res) => res.json())
            .then((res) => setListExam(res));
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.head}>
                <h2 className={styles.subject}>
                    {classroom.name} ({classroom.schoolYear})
                </h2>
                <span className={styles.teacher}>GV: {classroom.teacherName}</span>
            </div>
            <h3 className={styles.title}>Danh sách bài thi</h3>
            <QuitButton path={'/student/joinclass'} />
            <div className={styles.examList}>
                {listExam.map((item, index) => (
                    <Link
                        onClick={() => localStorage.setItem('exam_id', JSON.stringify(item.id))}
                        key={index}
                        to="/student/exam"
                        className={styles.examItem}
                    >
                        <FontAwesomeIcon className={styles.iconExam} icon={faFileSignature} />
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Classroom;
