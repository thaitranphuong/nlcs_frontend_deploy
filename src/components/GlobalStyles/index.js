import { useContext } from 'react';
import { ContextProvider } from '../Povider';

import './GlobalStyles.css';

function GlobalStyles({ children }) {
    const { theme } = useContext(ContextProvider);
    return <div className={theme}>{children}</div>;
}

export default GlobalStyles;
