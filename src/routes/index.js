import { Fragment } from 'react';

import StudentHome from '../Pages/Student/Home';
import Classroom from '../Pages/Student/Classroom';
import JoinClass from '../Pages/Student/JoinClass';
import Exam from '../Pages/Student/Exam';
import TakeTest from '../Pages/Test/TakeTest';
import EndTest from '../Pages/Test/EndTest';
import History from '../Pages/Test/History';

import Home from '../Pages/Auth/Home';
import Login from '../Pages/Auth/Login';
import Register from '../Pages/Auth/Register';
import Account from '../Pages/Auth/Account';

import TeacherLayout from '../Layout/TeachcherLayout';
import TeacherHome from '../Pages/Teacher/Home';
import TeacherClassroom from '../Pages/Teacher/Classroom';
import ClassDetail from '../Pages/Teacher/ClassDetail';
import TeacherExam from '../Pages/Teacher/Exam';
import CreateExam from '../Pages/Teacher/CreateExam';
import EditExam from '../Pages/Teacher/EditExam';
import Statistic from '../Pages/Teacher/Statistic';

const publicRoute = [
    { path: '/', component: Home, layout: null },
    { path: '/auth/login', component: Login, layout: null },
    { path: '/auth/register', component: Register, layout: null },
];

const privateRoute = [];

if (JSON.parse(localStorage.getItem('role_id')) === 1) {
    privateRoute.push(
        { path: '/teacher/exam/statistic', component: Statistic, layout: TeacherLayout },
        { path: '/teacher/exam/create', component: CreateExam, layout: TeacherLayout },
        { path: '/teacher/exam/edit', component: EditExam, layout: TeacherLayout },
        { path: '/teacher/exam', component: TeacherExam, layout: TeacherLayout },
        { path: '/teacher/classroom/class-detail', component: ClassDetail, layout: TeacherLayout },
        { path: '/teacher/classroom', component: TeacherClassroom, layout: TeacherLayout },
        { path: '/teacher/', component: TeacherHome, layout: TeacherLayout },
        { path: '/teacher/home', component: TeacherHome, layout: TeacherLayout },
        { path: '/teacher/exam/test/history', component: History, layout: TeacherLayout },
        { path: '/auth/account/teacher', component: Account, layout: TeacherLayout },
    );
}

if (JSON.parse(localStorage.getItem('role_id')) === 2) {
    privateRoute.push(
        { path: '/student/test/history', component: History },
        { path: '/student/test/take-test', component: TakeTest, layout: null },
        { path: '/student/test/end-test', component: EndTest },
        { path: '/student/', component: StudentHome },
        { path: '/student/home', component: StudentHome },
        { path: '/student/exam', component: Exam },
        { path: '/student/joinclass', component: JoinClass },
        { path: '/student/classroom', component: Classroom },
        { path: '/auth/account/student', component: Account },
        //{ path: '/auth/account/:id', component: Account }, //sử dụng useParams của react router dom để lấy id
    );
}

export { publicRoute, privateRoute };
