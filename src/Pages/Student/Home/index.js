import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './Home.module.scss';

function Home() {
    const [listClassroom, setListClassrom] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const listPage = [];
    const [search, setSearch] = useState('');
    const ref = useRef();

    //https://www.npmjs.com/package/react-toastify
    const notify = () =>
        toast.success('Tham gia lớp học thành công! 🦄', {
            position: 'top-right',
            theme: 'colored',
        });

    for (let i = 1; i <= totalPage; i++) {
        listPage.push(i);
    }
    console.log(listPage);
    const render = (page = 1, name = '') => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(
            'https://exam-vavn.onrender.com/classroom/get-classrooms-by-student/' +
                JSON.parse(localStorage.getItem('id')) +
                `?page=${(page - 1) * 6 + 1}&limit=6&name=${name}`,
            options,
        )
            .then((res) => res.json())
            .then((res) => {
                setListClassrom(res.listResult);
                setPage((res.page - 1) / 6 + 1);
                setTotalPage(res.totalPage);
            });
    };

    useEffect(() => {
        render(1);
    }, []);

    const handleJoin = (class_id) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: [],
        };
        fetch(
            `https://exam-vavn.onrender.com/classroom/join-class/${class_id}/${JSON.parse(localStorage.getItem('id'))}`,
            options,
        ).then(() => {
            render(page, search);
            notify();
        });
    };

    const handleChangePage = (pageValue) => {
        if (pageValue >= 1 && pageValue <= totalPage) {
            render(pageValue, search);
        }
    };

    const handleSearch = () => {
        setSearch(ref.current.value);
        render(1, ref.current.value);
    };

    return (
        <div className={styles.wrapper}>
            <ToastContainer position="top-right" theme="colored" />
            <div className={styles.searchBar}>
                <input ref={ref} className={styles.searchInput} placeholder="Tìm lớp học" />
                <FontAwesomeIcon onClick={handleSearch} className={styles.searchIcon} icon={faSearch} />
            </div>

            <h3 className={styles.title}>Danh sách lớp học có sẵn</h3>

            <div className={styles.classList}>
                {listClassroom.map((item, index) => (
                    <div key={index} className={styles.classItem}>
                        <div className={styles.name}>{item.name}</div>
                        <div className={styles.teacher}>({item.schoolYear})</div>
                        <div className={styles.teacher}>GV: {item.teacherName}</div>
                        <button onClick={() => handleJoin(item.id)} className={styles.joinBtn}>
                            Tham gia
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                <div className={styles.pageList}>
                    {totalPage > 0 && (
                        <button
                            onClick={(e) => handleChangePage(e.target.value)}
                            className={clsx(styles.pageItem, { [styles.disabled]: page === 1 })}
                            value={page - 1}
                        >
                            Previous
                        </button>
                    )}
                    {listPage.map((item) => (
                        <button
                            onClick={(e) => handleChangePage(e.target.value)}
                            key={item}
                            className={clsx(styles.pageItem, { [styles.active]: page === item })}
                            value={item}
                        >
                            {item}
                        </button>
                    ))}
                    {totalPage > 0 && (
                        <button
                            onClick={(e) => handleChangePage(e.target.value)}
                            className={clsx(styles.pageItem, { [styles.disabled]: page === totalPage })}
                            value={page + 1}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
