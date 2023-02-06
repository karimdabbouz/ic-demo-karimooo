import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';


const Footer = () => {

    return (
        <>
            <div id="footer" className="container-fluid text-center p-2" style={{backgroundColor: "#212729", color: "yellow"}}>
                <a href="https://www.linkedin.com/in/karimdabbouz/" target="_blank">Linkedin</a><br></br>
                <a href="https://github.com/karimdabbouz/ic-demo-karimooo" target="_blank">Code</a>
            </div>
        </>
    )
};

export default Footer;