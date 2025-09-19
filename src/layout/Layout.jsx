import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./Layout.css"
const Layout = () => {
    const location = useLocation()

    return (
        <>
            {/* <Navbar></Navbar> */}
            {/*Mostrar Navbar en todas menos en "/*/}
            {location.pathname !== "/" && <Navbar></Navbar>}
            <div className="container-section">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </>
    )
}

export default Layout