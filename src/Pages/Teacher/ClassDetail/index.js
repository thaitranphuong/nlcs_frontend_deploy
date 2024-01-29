import Icon from '@mdi/react';
import { mdiFileDocumentOutline, mdiMagnify, mdiTrashCanOutline } from '@mdi/js';
import { useContext, useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ContextProvider } from '../../../components/Povider';
import styles from './ClassDetail.module.scss';
import QuitButton from '../../../components/QuitButton';
import Excel from '../../../components/Excel';

function ClassDetail() {
    const { obj } = useContext(ContextProvider);
    const [classroom, setClassroom] = useState({
        id: '',
        name: '',
        schoolYear: '',
        students_id: [],
        teacher_id: localStorage.getItem('id'),
    });
    const [listStudent, setListStudent] = useState([]);
    const listExcel = [];
    const searchRef = useRef();

    //https://www.npmjs.com/package/react-toastify
    const notify = () =>
        toast.info('Đã xóa học sinh khỏi lớp ❌', {
            position: 'top-center',
            theme: 'colored',
        });

    const render = () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://exam-vavn.onrender.com/classroom/get-class/${localStorage.getItem('class_id')}`, options)
            .then((res) => res.json())
            .then((res) => {
                setClassroom((prev) => ({ ...prev, ...res }));
            });
        fetch(`https://exam-vavn.onrender.com/user/get-students/${localStorage.getItem('class_id')}`, options)
            .then((res) => res.json())
            .then((res) => {
                setListStudent((prev) => [...res]);
            });
    };

    useEffect(() => {
        render();
    }, []);

    const search = (value) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(
            `https://exam-vavn.onrender.com/user/get-students/${localStorage.getItem('class_id')}?name=${value}`,
            options,
        )
            .then((res) => res.json())
            .then((res) => {
                setListStudent(() => [...res]);
            });

        searchRef.current.blur();
    };

    const handleSearch = (e) => {
        if (e.keyCode === 13) {
            search(e.target.value);
        }
    };

    const handleRemove = (id) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(
            `https://exam-vavn.onrender.com/classroom/remove-student?` +
                `class_id=${localStorage.getItem('class_id')}&student_id=${id}`,
            options,
        ).then(() => {
            search(searchRef.current.value);
            notify();
        });
    };

    const handleExportFile = async () => {
        listStudent.forEach((item, index) => {
            listExcel.push({
                'Số thứ tự': index + 1,
                'Họ và tên': item.name,
                'Email ': item.email,
                'Số điện thoại': item.phone,
                'Giới tính': item.gender ? 'Nam' : 'Nữ',
            });
        });
        await Excel.exportExcel([...listExcel], 'Danh sách học sinh', 'Danh sách học sinh');
    };

    return (
        <div className={styles.wrapper}>
            <ToastContainer />
            <QuitButton path={'/teacher/classroom'} />
            <nav className={styles.nav}>
                <div className={styles.searchBar}>
                    <Icon path={mdiMagnify} className={styles.btnSearch} size={1.5} />
                    <input
                        ref={searchRef}
                        onKeyDown={(e) => handleSearch(e)}
                        className={styles.searchInput}
                        placeholder="Tìm theo tên học sinh"
                    ></input>
                </div>
                <button onClick={handleExportFile} className={styles.btnExport}>
                    <Icon className={styles.iconExport} path={mdiFileDocumentOutline} size={1.2} />
                    Xuất danh sách HS
                </button>
            </nav>
            <h3 className={styles.title}>
                {classroom.name} ({classroom.schoolYear})
            </h3>
            <span className={styles.quantity}>(Sĩ số: {classroom.students_id.length})</span>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <td>STT</td>
                        <td>Họ và tên</td>
                        <td>Email</td>
                        <td>Số điện thoại</td>
                        <td>Giới tính</td>
                        <td>Hành động</td>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {listStudent.map((item, index) => (
                        <tr key={index} className={styles.tr}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td>{item.gender === true ? 'Nam' : 'Nữ'}</td>
                            <td>
                                <button onClick={() => handleRemove(item.id)} className={styles.btnDelete}>
                                    <Icon className={styles.iconDelete} path={mdiTrashCanOutline} size={1} />
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClassDetail;
