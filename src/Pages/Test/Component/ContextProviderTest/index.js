import { createContext } from 'react';

export const ContextTest = createContext();

function ContextProviderTest({ children }) {
    const a = 1;

    return <ContextTest.Provider value={{ a }}>{children}</ContextTest.Provider>;
}

export default ContextProviderTest;
