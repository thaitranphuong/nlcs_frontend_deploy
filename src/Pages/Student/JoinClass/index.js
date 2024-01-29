import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiLogout, mdiSchool } from '@mdi/js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './JoinClass.module.scss';

function JoinClass() {
    const [listClassroom, setListClassrom] = useState([]);
    const notify = () => {
        toast.success('Rời lớp học thành công!', {
            position: 'top-center',
            theme: 'colored',
        });
    };

    const render = () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(
            `https://exam-vavn.onrender.com/classroom/get-joined-classes-by-student/${JSON.parse(
                localStorage.getItem('id'),
            )}`,
            options,
        )
            .then((res) => res.json())
            .then((res) => {
                setListClassrom(res);
            });
    };

    useEffect(() => render(), []);

    const handleQuitClass = (class_id) => {
        const confirm = window.confirm('Bạn có muốn thoát?');
        if (confirm) {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(
                `https://exam-vavn.onrender.com/classroom/remove-student?class_id=${class_id}&student_id=${JSON.parse(
                    localStorage.getItem('id'),
                )}`,
                options,
            ).then(() => {
                render();
                notify();
            });
        }
    };

    return (
        <>
            <div className={styles.wrapper}>
                <ToastContainer position="top-center" theme="colored" />
                <h3 className={styles.title}>Lớp học đã tham gia</h3>
                <div className={styles.classList}>
                    {listClassroom.map((item, index) => (
                        <div className={styles.classItemWrapper}>
                            <Link
                                onClick={() => localStorage.setItem('class_id', JSON.stringify(item.id))}
                                to="/student/classroom"
                                className={styles.classItem}
                            >
                                <Icon className={styles.classIcon} path={mdiSchool} size={3} />
                                <div className={styles.classInfo}>
                                    <div className={styles.name}>
                                        {item.name} ({item.schoolYear})
                                    </div>
                                    <div className={styles.teacher}>GV: {item.teacherName}</div>
                                </div>
                            </Link>
                            <div onClick={() => handleQuitClass(item.id)} className={styles.classItemRight}>
                                <Icon className={styles.iconQuit} path={mdiLogout} size={1.2} />
                                Rời khỏi
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default JoinClass;
