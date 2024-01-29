import { createContext, useState } from 'react';

export const ContextProvider = createContext();

function Provider({ children }) {
    const [theme, setTheme] = useState('theme1');
    const [obj, setObj] = useState({});
    return (
        <div>
            <ContextProvider.Provider value={{ theme, setTheme, obj, setObj }}>{children}</ContextProvider.Provider>
        </div>
    );
}

export default Provider;
