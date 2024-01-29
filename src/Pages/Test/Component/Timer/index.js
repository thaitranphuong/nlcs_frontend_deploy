import { useState, useEffect } from 'react';
import styles from './Timer.module.scss';

function Timer({ handleSubmit, timeTest }) {
    const [time, setTime] = useState(timeTest);

    useEffect(() => {
        if (!!timeTest) {
            setTime(timeTest);
        }
    }, [timeTest]);

    useEffect(() => {
        if (time === 0) {
            handleSubmit();
        }

        if (!!timeTest) {
            setTimeout(() => {
                localStorage.setItem(`time`, JSON.stringify(time - 1));
                setTime(time - 1);
            }, 1000);
        }
    }, [time]);

    return (
        <div className={styles.wrapper}>
            {!!time && (
                <>
                    0{Math.floor(time / 3600)} : {Math.floor(Math.floor(time % 3600) / 60)} : {time % 60}
                </>
            )}
        </div>
    );
}

export default Timer;
