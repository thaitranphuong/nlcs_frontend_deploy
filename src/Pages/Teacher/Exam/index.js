import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff, mdiFileCheckOutline, mdiMagnify, mdiPencil, mdiPlus, mdiTrashCan } from '@mdi/js';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ContextProvider } from '../../../components/Povider';
import styles from './Exam.module.scss';
import QuitButton from '../../../components/QuitButton';

function Exam() {
    const [listExam, setListExam] = useState([]);
    const { setObj } = useContext(ContextProvider);
    //https://www.npmjs.com/package/react-toastify
    const notify = () =>
        toast.success('Tạo đề thi thành công ✏️', {
            position: 'top-right',
            theme: 'colored',
        });
    const notifyDelete = () =>
        toast.success('Xóa đề thi thành công ❌', {
            position: 'top-right',
            theme: 'colored',
        });
    const notifyEdit = () =>
        toast.success('Sửa đề thi thành công 🖌️😍', {
            position: 'top-right',
            theme: 'colored',
        });

    const render = () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://exam-vavn.onrender.com/exam/get-exams/${JSON.parse(localStorage.getItem('id'))}`, options)
            .then((res) => res.json())
            .then((res) => {
                setListExam(res);
            });
    };

    useEffect(() => {
        if (localStorage.getItem('is_create_exam')) {
            notify();
            localStorage.removeItem('is_create_exam');
        }
        if (localStorage.getItem('is_edit_exam')) {
            notifyEdit();
            localStorage.removeItem('is_edit_exam');
        }
        render();
    }, []);

    const handleSearch = (e) => {
        if (e.keyCode === 13) {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(
                `https://exam-vavn.onrender.com/exam/get-exams/${JSON.parse(localStorage.getItem('id'))}?name=${
                    e.target.value
                }`,
                options,
            )
                .then((res) => res.json())
                .then((res) => {
                    setListExam(res);
                });
        }
    };

    const handleDelete = (id) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://exam-vavn.onrender.com/exam/delete/${id}`, options).then(() => {
            render();
            notifyDelete();
        });
    };

    return (
        <div className={styles.wrapper}>
            <ToastContainer />
            <QuitButton path={'/teacher/'} />
            <h3 className={styles.title}>Danh sách đề thi</h3>
            <nav className={styles.nav}>
                <div className={styles.searchBar}>
                    <Icon path={mdiMagnify} className={styles.btnSearch} size={1.5} />
                    <input
                        onKeyDown={(e) => handleSearch(e)}
                        className={styles.searchInput}
                        placeholder="Tìm kiếm theo tên đề"
                    ></input>
                </div>
                <Link to="/teacher/exam/create" className={styles.btnCreate}>
                    <Icon className={styles.iconCreate} path={mdiPlus} size={1.2} />
                    Tạo đề thi
                </Link>
            </nav>
            <table className={styles.body}>
                <thead className={styles.row}>
                    <tr>
                        <td className={clsx(styles.columnHead, styles.wide)}>Tên</td>
                        <td className={clsx(styles.columnHead, styles.wide)}>Đã giao cho</td>
                        <td className={styles.columnHead}>Trạng thái</td>
                        <td className={styles.columnHead}>Hành động</td>
                    </tr>
                </thead>
                <tbody>
                    {listExam.map((item, index) => (
                        <tr key={index} className={styles.row}>
                            <td className={clsx(styles.column, styles.wide)}>
                                <Link
                                    onClick={() => localStorage.setItem('exam_id', item.id)}
                                    to="/teacher/exam/statistic"
                                    className={styles.name}
                                >
                                    <Icon className={styles.nameIcon} path={mdiFileCheckOutline} size={1.7} />
                                    {item.name}
                                </Link>
                            </td>
                            <td className={clsx(styles.column, styles.wide)}>{item.classroom_name}</td>
                            <td className={styles.column}>
                                {item.visibility ? (
                                    <Icon className={styles.appearIcon} path={mdiEye} size={1.2} />
                                ) : (
                                    <Icon className={styles.hiddenIcon} path={mdiEyeOff} size={1.2} />
                                )}
                            </td>
                            <td className={styles.column}>
                                <div className={styles.action}>
                                    <Link
                                        onClick={() => localStorage.setItem('exam_id', item.id)}
                                        to="/teacher/exam/edit"
                                        className={styles.btnEdit}
                                    >
                                        <Icon className={styles.updateIcon} path={mdiPencil} size={1.2} />
                                    </Link>
                                    <Icon
                                        onClick={() => handleDelete(item.id)}
                                        className={styles.deleteIcon}
                                        path={mdiTrashCan}
                                        size={1.2}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Exam;
