import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import SidebarRight from './SidebarRight';
import SidebarTop from './SidebarTop';
import SidebarBottom from './SidebarBottom';
import styles from './DefaultLayout.module.scss';

function DefaultLayout({ children }) {
    return (
        <>
            <Header />
            <Sidebar />
            <SidebarRight />
            <SidebarTop />
            <SidebarBottom />
            {children}
            <Footer />
        </>
    );
}

export default DefaultLayout;
