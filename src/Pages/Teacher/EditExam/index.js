import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import { ContextProvider } from '../../../components/Povider';
import styles from './EditExam.module.scss';
import QuitButton from '../../../components/QuitButton';

function EditExam() {
    const redirect = useNavigate();
    const [listRef] = useState([]);
    const [images] = useState([]);
    const [listClassroom, setListClassrom] = useState([]);
    const [exam, setExam] = useState({});
    const [listQuestion, setListQuestion] = useState([]);
    const [listOption, setListOption] = useState([]);
    const listQuestionTemp = [...listQuestion];
    let listOptionTemp = [...listOption];

    useEffect(() => {
        fetch(`https://exam-vavn.onrender.com/exam/get-exam/${localStorage.getItem('exam_id')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setExam(res);
                fetch(
                    `https://exam-vavn.onrender.com/question/get-questions-and-options/${localStorage.getItem(
                        'exam_id',
                    )}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )
                    .then((res) => res.json())
                    .then((res) => {
                        setListQuestion(res);
                        listOptionTemp = [];
                        res.forEach((item) => listOptionTemp.push(...item.options));
                        setListOption([...listOptionTemp]);
                    });
            });

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
    }, []);

    const handleCreateNewQuestion = () => {
        setListQuestion((prev) => [...prev, { exam_id: exam.id }]);
        setListOption((prev) => [
            ...prev,
            { question_id: '', label: 'A' },
            { question_id: '', label: 'B' },
            { question_id: '', label: 'C' },
            { question_id: '', label: 'D' },
        ]);
    };

    const handleOnchangeExam = (e) => {
        setExam((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleOnchangeQuestion = (e, index, isImage = null) => {
        if (!isImage) {
            listQuestionTemp[index] = {
                ...listQuestionTemp[index],
                [e.target.name]: e.target.value,
            };
        } else {
            listQuestionTemp[index] = {
                ...listQuestionTemp[index],
                [e.target.name]: e.target.files[0].name,
            };
            images[index] = e.target.files[0];

            // Xử lý hiển thị ảnh khi chọn file
            const input = e.target;
            const imageContainer = listRef[index];
            // Xóa các hình ảnh cũ trước khi hiển thị hình ảnh mới
            imageContainer.innerHTML = '';
            for (let i = 0; i < input.files.length; i++) {
                const file = input.files[i];
                const reader = new FileReader();

                // Định nghĩa hàm xử lý khi đọc file xong
                reader.onload = function () {
                    // Tạo phần tử img mới
                    const img = document.createElement('img');
                    img.width = 500;
                    img.src = reader.result;
                    imageContainer.appendChild(img);
                };
                // Đọc file dưới dạng URL
                reader.readAsDataURL(file);
            }
        }
        setListQuestion([...listQuestionTemp]);
    };

    const handleOnchangeOption = (e, index) => {
        listOptionTemp[index] = {
            ...listOptionTemp[index],
            content: e.target.value,
        };
        setListOption([...listOptionTemp]);
    };

    const handleChooseCorrect = (correct, index) => {
        listQuestionTemp[index] = {
            ...listQuestionTemp[index],
            correct,
        };
        setListQuestion([...listQuestionTemp]);
    };

    const handleSubmit = () => {
        // Save question images
        const formData = new FormData();
        for (let image of images) {
            formData.append('images', image);
        }
        fetch('https://exam-vavn.onrender.com/question/create-update-image', {
            method: 'POST',
            body: formData,
        });
        // Save exam-question-option
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exam),
        };
        fetch(`https://exam-vavn.onrender.com/exam/create-update`, options)
            .then((res) => res.json())
            .then((res) => {
                listQuestionTemp.forEach((item) => (item.exam_id = res));
                setListQuestion([...listQuestionTemp]);

                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(listQuestion),
                };
                fetch(`https://exam-vavn.onrender.com/question/create-update-list`, options)
                    .then((res) => res.json())
                    .then((res) => {
                        listOption.forEach((item, index) => (item.question_id = res[Math.floor(index / 4)]));
                        setListOption([...listOption]);
                        const options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(listOption),
                        };
                        fetch(`https://exam-vavn.onrender.com/option/create-update-list`, options).then(() => {
                            localStorage.setItem('is_edit_exam', 'true');
                            redirect('/teacher/exam');
                        });
                    });
            });
    };

    return (
        <div className={styles.wrapper}>
            <QuitButton path="/teacher/exam" />
            <div className={styles.header}>
                <input
                    onChange={(e) => handleOnchangeExam(e)}
                    className={styles.nameInput}
                    type="text"
                    name="name"
                    placeholder="Tên đề thi"
                    value={exam.name}
                />
                <Link to="/teacher/exam" className={styles.cancelBtn}>
                    Hủy
                </Link>
                <button onClick={handleSubmit} className={styles.submitBtn}>
                    Lưu
                </button>
            </div>
            <div className={styles.nav}>
                <div className={styles.optionWrapper}>
                    Chọn lớp:
                    <select
                        onChange={(e) => handleOnchangeExam(e)}
                        value={exam.classroom_id}
                        className={styles.option}
                        name="classroom_id"
                    >
                        <option value={''}>-- Chọn lớp --</option>
                        {listClassroom.map((item) => (
                            <option value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.radioWrapper}>
                    <div className={styles.radioLabel}>Công khai:</div>
                    <input
                        onClick={(e) => handleOnchangeExam(e)}
                        className={styles.radio}
                        type="radio"
                        name="visibility"
                        value={true}
                        checked={`${exam.visibility}` === 'true'}
                    />
                    Yes
                    <input
                        onClick={(e) => handleOnchangeExam(e)}
                        className={styles.radio}
                        type="radio"
                        name="visibility"
                        value={false}
                        checked={`${exam.visibility}` === 'false'}
                    />
                    No
                </div>
                <div className={styles.timeWrapper}>
                    Thời gian làm bài:
                    <input
                        onChange={(e) => handleOnchangeExam(e)}
                        className={styles.timeInput}
                        name="time"
                        type="number"
                        placeholder=""
                        value={exam.time}
                    />
                    phút
                </div>
            </div>
            <div className={styles.questionList}>
                {listQuestion.map((item, index) => (
                    <div key={index} className={styles.questionItem}>
                        <div className={styles.head}>
                            <div className={styles.number}>Câu {index + 1}:</div>
                            <div className={styles.point}>
                                Điểm:
                                <input
                                    className={styles.pointInput}
                                    type="number"
                                    value={listQuestion[index].score}
                                    onChange={(e) => handleOnchangeQuestion(e, index)}
                                    placeholder=""
                                    name="score"
                                />
                            </div>
                        </div>
                        <div className={styles.contentQuestion}>
                            <textarea
                                className={styles.txtAreaQuestion}
                                name="content"
                                rows="5"
                                cols="50"
                                placeholder="Nội dung đề thi"
                                value={listQuestion[index].content}
                                onChange={(e) => handleOnchangeQuestion(e, index)}
                            />
                            <input
                                className={styles.inputImg}
                                onChange={(e) => handleOnchangeQuestion(e, index, true)}
                                type="file"
                                name="image"
                            />
                            <div ref={(e) => (listRef[index] = e)}>
                                <img
                                    width={500}
                                    src={
                                        'https://exam-vavn.onrender.com/question/getimage/' + listQuestion[index].image
                                    }
                                    alt="image"
                                />
                            </div>
                        </div>
                        <div className={styles.answerList}>
                            <div className={styles.answerItem}>
                                <div
                                    onClick={() => handleChooseCorrect('A', index)}
                                    className={clsx(styles.answerLabel, {
                                        [styles.active]: listQuestion[index].correct === 'A',
                                    })}
                                >
                                    A
                                </div>
                                <textarea
                                    value={listOption[(index + 1) * 4 - 4].content}
                                    onChange={(e) => handleOnchangeOption(e, (index + 1) * 4 - 4)}
                                    className={styles.txtAreaQuestion}
                                    name="content"
                                    rows="3"
                                    cols="50"
                                    placeholder="Nội dung đáp án"
                                />
                            </div>
                            <div className={styles.answerItem}>
                                <div
                                    onClick={() => handleChooseCorrect('B', index)}
                                    className={clsx(styles.answerLabel, {
                                        [styles.active]: listQuestion[index].correct === 'B',
                                    })}
                                >
                                    B
                                </div>
                                <textarea
                                    value={listOption[(index + 1) * 4 - 3].content}
                                    onChange={(e) => handleOnchangeOption(e, (index + 1) * 4 - 3)}
                                    className={styles.txtAreaQuestion}
                                    name="content"
                                    rows="3"
                                    cols="50"
                                    placeholder="Nội dung đáp án"
                                />
                            </div>
                            <div className={styles.answerItem}>
                                <div
                                    onClick={() => handleChooseCorrect('C', index)}
                                    className={clsx(styles.answerLabel, {
                                        [styles.active]: listQuestion[index].correct === 'C',
                                    })}
                                >
                                    C
                                </div>
                                <textarea
                                    value={listOption[(index + 1) * 4 - 2].content}
                                    onChange={(e) => handleOnchangeOption(e, (index + 1) * 4 - 2)}
                                    className={styles.txtAreaQuestion}
                                    name="content"
                                    rows="3"
                                    cols="50"
                                    placeholder="Nội dung đáp án"
                                />
                            </div>
                            <div className={styles.answerItem}>
                                <div
                                    onClick={() => handleChooseCorrect('D', index)}
                                    className={clsx(styles.answerLabel, {
                                        [styles.active]: listQuestion[index].correct === 'D',
                                    })}
                                >
                                    D
                                </div>
                                <textarea
                                    value={listOption[(index + 1) * 4 - 1].content}
                                    onChange={(e) => handleOnchangeOption(e, (index + 1) * 4 - 1)}
                                    className={styles.txtAreaQuestion}
                                    name="content"
                                    rows="3"
                                    cols="50"
                                    placeholder="Nội dung đáp án"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.bottom}>
                <button onClick={handleCreateNewQuestion} className={styles.btnCreateQuestion}>
                    +
                </button>
            </div>
        </div>
    );
}

export default EditExam;
