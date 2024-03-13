import React,{ Fragment }  from "react";
import Header from "../components/Header/header";
import Footer from "../components/Footer/footer";
import DiffText from "../components/DiffText/diffText";

const HomePage = () => {
    return (
        <Fragment>
            <Header/>
            <DiffText/>
            <Footer/>
        </Fragment>
    )
}

export default HomePage;