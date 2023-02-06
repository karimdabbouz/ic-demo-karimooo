import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import FrontPage from "./pages/FrontPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import { AuthClient } from "@dfinity/auth-client";



const App = () => {


    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState();

    const II_URL = "https://identity.ic0.app";
    // const II_URL_LOCAL = "http://localhost:8000/?canisterId=rwlgt-iiaaa-aaaaa-aaaaa-cai";


    useEffect(() => {
        checkIfLoggedIn();
        getPrincipal();
    }, [isLoggedIn, loggedInUser]);


    const checkIfLoggedIn = async () => {
        const authClient = await AuthClient.create();
        const response = await authClient.isAuthenticated();
        setIsLoggedIn(response);
    };

    
    const getPrincipal = async () => {
        const authClient = await AuthClient.create();
        const response = await authClient.getIdentity().getPrincipal().toText();
        setLoggedInUser(response);
    };


    // Connects a user via Internet Identity
    const explicitLogin = async () => {
        const authClient = await AuthClient.create();
        await authClient.login({
            onSuccess: async () => {
                getPrincipal();
                checkIfLoggedIn();
            },
            identityProvider: II_URL
        });
    };

  
    return (
        <>
            <Header isLoggedIn={isLoggedIn} loggedInUser={loggedInUser}></Header>
            <ScrollToTop></ScrollToTop>
            <Routes>
                <Route exact path="/" element={<FrontPage callbackExplicitLogin={explicitLogin} isLoggedIn={isLoggedIn} loggedInUser={loggedInUser}/>}></Route>
                <Route exact path="/profile/:userURLParam" element={<ProfilePage isLoggedIn={isLoggedIn} loggedInUser={loggedInUser}></ProfilePage>}></Route>
            </Routes>
            <Footer></Footer>
        </>
    )
};


export default App;