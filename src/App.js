import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import { Provider } from './components/Povider';

import { privateRoute, publicRoute } from './routes';
import DefaultLayout from './Layout/DefaultLayout';

function App() {
    return (
        <div className="App">
            <Routes>
                {publicRoute.map((route, index) => {
                    const Page = route.component;
                    return <Route path={route.path} element={<Page />} />;
                })}

                {privateRoute.map((route, index) => {
                    let Layout = DefaultLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    const Page = route.component;
                    return (
                        <Route
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </div>
    );
}

export default App;
