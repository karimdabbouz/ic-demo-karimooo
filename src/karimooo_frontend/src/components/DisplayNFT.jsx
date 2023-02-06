import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { useState, useEffect } from 'react';

import { Button } from "react-bootstrap";

import { karimooo_backend } from "../../../declarations/karimooo_backend";


const DisplayNFT = ({onChainNFT}) => {

    const [imageURL, setImageURL] = useState();
    

    useEffect(() => {
        loadImageData();
    }, []);


    // Loads image from backend canister
    // (not from NFT canister since it's always the same image anyway and it's faster)
    const loadImageData = async () => {
        const response = await karimooo_backend.getNFTImageData();
        const uint8 = new Uint8Array(response);
        const blob = new Blob([uint8], {type: "image/png"});
        const url = URL.createObjectURL(blob);
        setImageURL(url);
    }

    return (
        <>
            <div className="col-lg-6 col-xl-6 my-auto">
                <div className="container">
                    <div className="row">
                        <div className="col text-center">
                            <div className="container">
                                <img className="img-fluid" src={imageURL}></img>
                            </div>
                            <Button href={onChainNFT} target="_blank" className="btn btn-dark m-2" style={{color: "white"}}>View NFT on-chain</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default DisplayNFT;