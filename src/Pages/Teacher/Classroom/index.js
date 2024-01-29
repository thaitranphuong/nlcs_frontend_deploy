import Icon from '@mdi/react';
import { mdiDotsHorizontal, mdiMagnify, mdiPencilBoxOutline, mdiPlus, mdiTrashCanOutline } from '@mdi/js';
import { Link, json } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';

import { ContextProvider } from '../../../components/Povider';
import styles from './Classroom.module.scss';
import QuitButton from '../../../components/QuitButton';
import clsx from 'clsx';

function Classroom() {
    const [optionKey, setOptionKey] = useState(null);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [classroom, setClassroom] = useState({
        id: '',
        name: '',
        schoolYear: '',
        teacher_id: localStorage.getItem('id'),
    });
    const [listClassroom, setListClassrom] = useState([]);
    const searchRef = useRef();
    const notify = (key) => {
        if (key === 1) {
            toast.success('Lưu lớp học thành công!', {
                position: 'top-center',
                theme: 'colored',
            });
        }
        if (key === 2) {
            toast.info('Đã xóa lớp học!', {
                position: 'top-center',
                theme: 'colored',
            });
        }
    };

    const handleOpenModalUpdate = (e, index) => {
        e.preventDefault();
        setOptionKey(null);
        setModalUpdate(true);
        setClassroom((prev) => ({
            ...prev,
            id: listClassroom[index].id,
            name: listClassroom[index].name,
            schoolYear: listClassroom[index].schoolYear,
        }));
    };

    const handleOpenModalCreate = () => {
        setModalCreate(true);
    };

    const handleChangeClassroom = (e) => {
        setClassroom((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const render = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: localStorage.getItem('id'),
        };
        fetch('https://exam-vavn.onrender.com/classroom/get-classrooms', options)
            .then((res) => res.json())
            .then((res) => {
                setListClassrom(res);
            });
    };

    useEffect(() => {
        render();
    }, []);

    const handleSubmit = (e, id) => {
        e.preventDefault();
        if (classroom.name.trim() === '') {
            alert('Vui lòng nhập tên');
            return;
        }
        if (classroom.schoolYear.trim() === '') {
            alert('Vui lòng nhập năm học');
            return;
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(classroom),
        };
        fetch('https://exam-vavn.onrender.com/classroom/create', options).then((res) => {
            render();
            setClassroom((prev) => ({
                ...prev,
                id: '',
                name: '',
                schoolYear: '',
                teacher_id: localStorage.getItem('id'),
            }));
        });
        setModalCreate(false);
        setModalUpdate(false);
        notify(1);
    };

    const handleSearch = (e) => {
        if (e.keyCode === 13) {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: localStorage.getItem('id'),
            };
            fetch(`https://exam-vavn.onrender.com/classroom/get-classrooms?name=${e.target.value}`, options)
                .then((res) => res.json())
                .then((res) => {
                    setListClassrom(res);
                });

            searchRef.current.blur();
        }
    };

    const handleDelete = (e, id) => {
        e.preventDefault();
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://exam-vavn.onrender.com/classroom/delete/${id}`, options).then(() => {
            setOptionKey(null);
            render();
            notify(2);
        });
    };

    const handleGoToDetail = (id) => {
        localStorage.setItem('class_id', JSON.stringify(id));
    };

    return (
        <div className={styles.wrapper}>
            <ToastContainer position="top-center" theme="colored" />
            <QuitButton path={'/teacher'} />
            <h3 className={styles.title}>Danh sách lớp</h3>
            <nav className={styles.nav}>
                <div className={styles.searchBar}>
                    <Icon path={mdiMagnify} className={styles.btnSearch} size={1.5} />
                    <input
                        ref={searchRef}
                        onKeyDown={(e) => handleSearch(e)}
                        className={styles.searchInput}
                        placeholder="Tìm kiếm theo tên lớp"
                    ></input>
                </div>
                <button onClick={handleOpenModalCreate} className={styles.btnCreate}>
                    <Icon className={styles.iconCreate} path={mdiPlus} size={1.2} />
                    Tạo lớp học
                </button>
            </nav>
            <div className={styles.listClassroom}>
                {listClassroom.map((item, index) => (
                    <Link
                        onClick={() => handleGoToDetail(item.id)}
                        to="/teacher/classroom/class-detail"
                        key={index}
                        className={styles.classroomItem}
                    >
                        <div className={styles.top}>
                            <div className={styles.name}>{item.name}</div>
                            <Icon
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOptionKey(index);
                                }}
                                className={styles.btnOption}
                                path={mdiDotsHorizontal}
                                size={1.5}
                            />
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOptionKey(null);
                                }}
                                className={clsx(styles.optionBackgorund, {
                                    [styles.activeOption]: optionKey === index,
                                })}
                            ></div>
                            <div className={clsx(styles.modalOption, { [styles.activeOption]: optionKey === index })}>
                                <button onClick={(e) => handleOpenModalUpdate(e, index)} className={styles.btnUpdate}>
                                    <Icon className={styles.iconUpadte} path={mdiPencilBoxOutline} size={1.3} />
                                    Sửa lớp
                                </button>
                                <button onClick={(e) => handleDelete(e, item.id)} className={styles.btnDelete}>
                                    <Icon className={styles.iconDelete} path={mdiTrashCanOutline} size={1.3} />
                                    Xóa lớp
                                </button>
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            <div className={styles.quantity}>Sĩ số: {listClassroom[index].students_id.length}</div>
                            <div className={styles.schoolYear}>Năm học {item.schoolYear}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {modalCreate && (
                <div className={styles.modalWrapper}>
                    <div onClick={() => setModalCreate(false)} className={styles.modalBackground}></div>
                    <form method="" className={styles.modal}>
                        <div className={styles.headModal}>Thêm lớp học</div>
                        <div className={styles.bodyModal}>
                            <label className={styles.label}>Tên lớp</label>
                            <input
                                onChange={(e) => handleChangeClassroom(e)}
                                value={classroom.name}
                                name="name"
                                className={styles.input}
                                placeholder="Nhập tên lớp"
                                required
                            />
                            <label className={styles.label}>Năm học</label>
                            <input
                                onChange={(e) => handleChangeClassroom(e)}
                                value={classroom.schoolYear}
                                name="schoolYear"
                                className={styles.input}
                                placeholder="Ví dụ: 2023 - 2024"
                                required
                            />
                        </div>
                        <div className={styles.fotterModal}>
                            <button onClick={() => setModalCreate(false)} className={styles.btnCancel}>
                                Hủy
                            </button>
                            <button onClick={handleSubmit} className={styles.btnSave}>
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {modalUpdate && (
                <div className={styles.modalWrapper}>
                    <div onClick={() => setModalUpdate(false)} className={styles.modalBackground}></div>
                    <form method="" className={styles.modal}>
                        <div className={styles.headModal}>Cập nhật lớp học</div>
                        <div className={styles.bodyModal}>
                            <label className={styles.label}>Tên lớp</label>
                            <input
                                onChange={(e) => handleChangeClassroom(e)}
                                value={classroom.name}
                                className={styles.input}
                                placeholder="Nhập tên lớp"
                                name="name"
                                required
                            />
                            <label className={styles.label}>Năm học</label>
                            <input
                                onChange={(e) => handleChangeClassroom(e)}
                                value={classroom.schoolYear}
                                className={styles.input}
                                placeholder="Ví dụ: 2023 - 2024"
                                name="schoolYear"
                                required
                            />
                        </div>
                        <div className={styles.fotterModal}>
                            <button onClick={() => setModalUpdate(false)} className={styles.btnCancel}>
                                Hủy
                            </button>
                            <button onClick={handleSubmit} className={styles.btnSave}>
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Classroom;
