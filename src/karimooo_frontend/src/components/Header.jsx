import * as React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle';


const Header = ({isLoggedIn, loggedInUser}) => {

    return (
        <header>
            <Navbar expand="lg" className="fixed-top p-2" style={{backgroundColor: "yellow"}}>
                <Navbar.Brand><a href="./"><h2>karim.ooo</h2></a></Navbar.Brand>
                {(isLoggedIn == true) ?
                    <>
                        <Navbar.Toggle className="menu-button" aria-controls="basic-navbar-nav"></Navbar.Toggle>
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav>
                                {(isLoggedIn == true) ? <Nav.Link>{loggedInUser}</Nav.Link> : <></>}
                                {(isLoggedIn == true) ? <Link className="nav-link" to={`./profile/:${loggedInUser}`}>My Profile</Link> : <></>}
                            </Nav>
                        </Navbar.Collapse>
                    </> :
                    <></>
                }

            </Navbar>
        </header>
    )
};

export default Header;