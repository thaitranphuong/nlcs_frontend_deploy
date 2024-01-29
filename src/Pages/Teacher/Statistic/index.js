import Icon from '@mdi/react';
import { mdiFileChartOutline } from '@mdi/js';
import { Bar } from 'react-chartjs-2';
import { Chart as CharJS, BarElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import { useContext, useEffect, useState } from 'react';

import { ContextProvider } from '../../../components/Povider';
import styles from './Statistic.module.scss';
import QuitButton from '../../../components/QuitButton';
import Excel from '../../../components/Excel';
import { Link } from 'react-router-dom';

CharJS.register(BarElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

function Statistic() {
    const [listImplementation, setListImplementation] = useState([]);
    const listScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const listExcel = [];

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://exam-vavn.onrender.com/implementation/get-by-exam/${localStorage.getItem('exam_id')}`, options)
            .then((res) => res.json())
            .then((res) => {
                setListImplementation(res);
            });
    }, []);

    listImplementation.forEach((item, index) => {
        const score = item.score;
        if (score < 1) listScore[0]++;
        else if (score < 2) listScore[1]++;
        else if (score < 3) listScore[2]++;
        else if (score < 4) listScore[3]++;
        else if (score < 5) listScore[4]++;
        else if (score < 6) listScore[5]++;
        else if (score < 7) listScore[6]++;
        else if (score < 8) listScore[7]++;
        else if (score < 9) listScore[8]++;
        else if (score <= 10) listScore[9]++;

        listExcel.push({
            'STT ': index + 1,
            'Họ và tên': item.student_name,
            'Ngày thực hiện': item.date,
            'Điểm ': item.score,
        });
    });

    const data = {
        labels: ['< 1', '< 2', '< 3', '< 4', '< 5', '< 6', '< 7', '< 8', '< 9', '<= 10'],
        datasets: [
            {
                label: 'Số lượng',
                data: [...listScore],
                backgroundColor: '#1e40af',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        plugins: {
            legend: true,
        },
        scales: {
            y: {
                min: 0,
                max: 10,
            },
        },
    };

    const handleExportFile = async () => {
        await Excel.exportExcel([...listExcel], 'Danh sách điểm học sinh', 'Danh sách điểm học sinh');
    };

    return (
        <div className={styles.wrapper}>
            <QuitButton path="/teacher/exam" />
            <h3 className={styles.title}>Bảng điểm</h3>
            <nav className={styles.nav}>
                <div onClick={handleExportFile} className={styles.btnExport}>
                    <Icon className={styles.iconExport} path={mdiFileChartOutline} size={1.2} />
                    Xuất tập tin Excel
                </div>
            </nav>
            <table className={styles.body}>
                <thead className={styles.row}>
                    <tr>
                        <td className={styles.columnHead}>STT</td>
                        <td className={styles.columnHead}>Họ và tên</td>
                        <td className={styles.columnHead}>Ngày thực hiện</td>
                        <td className={styles.columnHead}>Điểm</td>
                        <td className={styles.columnHead}></td>
                    </tr>
                </thead>
                <tbody>
                    {listImplementation.map((item, index) => (
                        <tr className={styles.row}>
                            <td className={styles.column}>{index + 1}</td>
                            <td className={styles.column}>{item.student_name}</td>
                            <td className={styles.column}>{item.date}</td>
                            <td className={styles.column}>{item.score}</td>
                            <td className={styles.column}>
                                <Link
                                    onClick={() => localStorage.setItem('implementation_id', item.id)}
                                    to="/teacher/exam/test/history"
                                >
                                    Xem chi tiết
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3 className={styles.title}>Biểu đồ phổ điểm</h3>
            <div className={styles.chart}>
                <Bar data={data} options={options}></Bar>
            </div>
        </div>
    );
}

export default Statistic;
