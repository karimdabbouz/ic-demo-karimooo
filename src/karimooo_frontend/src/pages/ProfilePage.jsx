import * as React from 'react';
import { useState, useEffect } from "react";
import { Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Principal } from '@dfinity/principal';

import { AuthClient } from "@dfinity/auth-client";
import { createActor } from '../../../declarations/karimooo_backend';
import { karimooo_backend } from "../../../declarations/karimooo_backend";

import DisplayNFT from "../components/DisplayNFT";
import LoadingAnimation from "../components/LoadingAnimation";



const ProfilePage = ({isLoggedIn, loggedInUser}) => {

    const { userURLParam } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [profileData, setProfileData] = useState({"username": "", "profileImage": [], "hasDonatedData": false});
    const [profileImageURL, setProfileImageURL] = useState("");
    const [candidURL, setCandidURL] = useState("");
    const [tokenIndex, setTokenIndex] = useState();
    const [hasNft, setHasNft] = useState(false);
    const [loading, setLoading] = useState(false);
    const [onChainNFT, setOnChainNFT] = useState();

    console.log(`isLoggedIn: ${isLoggedIn}`);
    console.log(`hasDonatedData: ${profileData.hasDonatedData}`);
    console.log(`username: ${profileData.username}`);
    console.log(`profileImage - LENGTH: ${profileData.profileImage.length}`);


    useEffect(() => {
        getProfileData();
        checkForNFT();
    }, [loggedInUser]);


    // Gets profile data for this user
    const getProfileData = async () => {
        const response = await karimooo_backend.getProfile(Principal.fromText(userURLParam.slice(1)));
        const uint8 = new Uint8Array(response[0].profileImage[0]);
        const blob = new Blob([uint8], {type: "image/png"});
        const url = URL.createObjectURL(blob);
        setProfileImageURL(url);
        setProfileData(response[0]);
    };


    // Checks if user has already minted an NFT | if so: returns imageID and gets url of on-chain NFT
    const checkForNFT = async () => {
        const response = await karimooo_backend.getNFTImageID(Principal.fromText(userURLParam.slice(1)));
        setTokenIndex(Number(response));
        if (response.length == 0) {
            setHasNft(false);
        } else {
            setHasNft(true);
            const tokenID = computeTokenIdentifier("t72s3-jiaaa-aaaai-abtbq-cai", tokenIndex);
            setOnChainNFT(`https://t72s3-jiaaa-aaaai-abtbq-cai.raw.ic0.app/?tokenid=${tokenID}`);
        };
    };


    // Mint NFT
    const mintNFT = async () => {
        setLoading(true);
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        const myActor = createActor("ppi2t-cyaaa-aaaak-qbrsa-cai", {agentOptions: {identity}});
        await myActor.mintReward()
            .then(_ => setLoading(false))
            .then(response => console.log(response))
            .then(_ => setShowModal(true))
            .then(_ => checkForNFT())
            .catch(error => setLoading(false));
    };


    // /////////////
    // HELPER FUNCTIONS
    // /////////////

    // Helper function
    const to32bits = num => {
        let b = new ArrayBuffer(4);
        new DataView(b).setUint32(0, num);
        return Array.from(new Uint8Array(b));
    };

    // Computes tokenIdentifier from NFT canister principal and tokenIndex (starting at 0)
    const computeTokenIdentifier = (principal, index) => {
        const padding = Buffer("\x0Atid");
        const array = new Uint8Array([
            ...padding,
            ...Principal.fromText(principal).toUint8Array(),
            ...to32bits(index)
        ]);
        console.log(`tokenIdentifier: ${Principal.fromUint8Array(array).toText()}`);
        return Principal.fromUint8Array(array).toText();
    };


    return (
        <>
            <div className="container-fluid" style={{marginTop: "80px"}}>
                <div className="row p-5">
                    <h5>Welcome to Your Profile</h5>
                </div>
                <div className="row p-lg-5 p-md-2">
                    <div className="col">
                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-md-2">
                                {(profileData.hasDonatedData == false) ?
                                    <img src="default_profile_img.png" className="img-fluid profile-image" style={{borderRadius: "50%", border: "4px solid black"}}></img> :
                                    <img src={profileImageURL} className="img-fluid profile-image" style={{borderRadius: "50%", border: "4px solid black"}}></img>
                                }
                            </div>
                            <div className="col-xl-2 col-lg-10 col-md-2">
                                <h1><strong>{profileData.username}</strong></h1>
                                <h5>({userURLParam.slice(1)})</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr style={{borderTop: "dashed 5px"}}></hr>

            <div className="container-fluid">
                <div className="row p-lg-5 p-md-2">
                    <div className="col">
                        <div className="row">

                            <div className="col-lg-6 col-xl-6 ">
                                <h2>Reward your best customers using blockchain tech</h2>
                                <br></br>
                                <p>One major benefit of tokenization is that you can build rewards into your services anytime you feel a certain step in the customer value chain causes too much friction. What’s the difference compared with perks in normal web services you might ask? First of all, you can reward users without having to ask for any personal data like email or physical addresses. You could build an app that rewards users with an NFT just for connecting and trying it out. I personally have made it a habit to sign up with any new interesting Web3 app as early as possible just in case they might decide to drop some rewards for their first "users" (retention then becomes your biggest challenge, but that has always been the case). Secondly, tokens can have inherent value even outside of your application since they are freely tradeable on marketplaces. That way, you can build systems where users have skin in the game by holding your tokens. They now want your product to succeed because that will give them a double advantage: the product itself is getting better while their tokens are (most likely) increasing in value.</p>
                                <p>The rest is a matter of creativity. It's technically possible to also reflect user roles with tokens where a premium user holds a „premium NFT“ in her wallet, while basic users don’t. Again these can be traded or even rented out to other users who can then use the advantages attached to them.</p>
                            </div>


                            {(loggedInUser == userURLParam.slice(1) && isLoggedIn == true && profileData.hasDonatedData == false && hasNft == false && loading == false) ?
                                <div className="col-lg-6 col-xl-6 my-auto">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="container" style={{backgroundColor: "yellow"}}>
                                                    <div className="row text-center p-2">
                                                        <h1><strong>Please fill in your full profile information to be able to mint your NFT</strong></h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                (loggedInUser == userURLParam.slice(1) && isLoggedIn == true && profileData.hasDonatedData == true && hasNft == false && loading == false) ?
                                <div className="col-lg-6 col-xl-6 my-auto">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="container" style={{backgroundColor: "yellow"}}>
                                                    <div className="row text-center p-2">
                                                        <h1><strong>Thanks for filling in your profile information! You can now collect your reward:</strong></h1>
                                                    </div>
                                                    <div className="row p-2">
                                                        <div className="col text-center">
                                                            <Button onClick={mintNFT} className="btn btn-dark btn-lg">Mint NFT</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                (loggedInUser == userURLParam.slice(1) && isLoggedIn == true && profileData.hasDonatedData == true && hasNft == false && loading == true) ?
                                <div className="col-lg-6 col-xl-6 my-auto">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="container">
                                                    <div className="row text-center p-2">
                                                        <LoadingAnimation></LoadingAnimation>
                                                        <strong>minting your NFT...</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                (loggedInUser == userURLParam.slice(1) && isLoggedIn == true && profileData.hasDonatedData == true && hasNft == true && loading == false) ?
                                <DisplayNFT onChainNFT={onChainNFT}></DisplayNFT> :
                                (loggedInUser == userURLParam.slice(1) && isLoggedIn == false) ?
                                <div className="col-lg-6 col-xl-6 my-auto">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="container" style={{backgroundColor: "yellow"}}>
                                                    <div className="row text-center p-2">
                                                        <h1><strong>Please connect to be able to mint your NFT</strong></h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                <div className="col-lg-6 col-xl-6 my-auto">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                <div className="container" style={{backgroundColor: "yellow"}}>
                                                    <div className="row text-center p-2">
                                                        <h1><strong>Please connect and fill in your full profile information to be able to mint your NFT</strong></h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row" style={{height: "100px"}}></div>
            </div>

            <div className="container-fluid">
                <div className="row p-lg-5 p-md-2">
                    <div className="col">
                        <div className="row">

                            <div className="col-lg-6 col-xl-6">
                                <h2>Call any canister on the Internet Computer through your browser</h2>
                                <br></br>
                                <p>Just like smart contracts on Ethereum, canisters can (and usually do) expose public functions. You can call these functions through a frontend application and make it nice to look at, but you can also call any public function via the Candid UI. This is possible because – again – canisters on the Internet Computer blockchain serve HTTP which means that you can interact with them through your web browser.</p>
                                <p>This frontend application interacts with two backend canisters. Once you know the canister ID of a service on the Internet Computer, you can append it to the URL <a target="_blank" href="https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=">https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=</a> where you can inspect and use all public functions of that canister. The backend canister where your username and profile image are stored at has the canister ID <strong>ppi2t-cyaaa-aaaak-qbrsa-cai</strong>. The NFT canister has the ID <strong>t72s3-jiaaa-aaaai-abtbq-cai</strong>. Paste them into the form and see what other functions the backend canister exposes. You should be able to have it show you a list of all users that have previously connected and filled in their profile information. Can you spot your Principal among them?</p>
                                <p>Also note that the NFT canister has a function called "http_request". This allows developers to serve assets like images, video or other media from the blockchain directly to your web browser. And storage on the Internet Computer is cheap! For the first time ever, it is possible to store NFTs on-chain. This allows for many exciting new features, some of which I might explain in another part.</p>
                            </div>

                            <div className="col-lg-6 col-xl-6 my-auto">
                                <div className="container mt-5 mb-5">
                                    <div className="row w-75 mx-auto">
                                        <div className="col">
                                            <form>
                                                <div className="row">
                                                    <div className="col">
                                                        <label><strong>Canister ID</strong></label>
                                                    </div>
                                                    <div className="col">
                                                        <input type="text" onChange={e => setCandidURL(e.target.value)} className="w-100"></input>
                                                    </div>
                                                </div>
                                                {(candidURL != "") ?
                                                    <div className="row mt-5">
                                                        <div className="col">
                                                            <a target="_blank" href={`https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=${candidURL}`}><h6>{`https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=${candidURL}`}</h6></a>
                                                        </div>
                                                    </div> :
                                                    <></>
                                                }
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid" style={{backgroundColor: "yellow"}}>
                <div className="row p-lg-5 p-md-2 pt-2">
                    <div className="col">
                        <div className="row">

                            <div className="col my-auto">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <h1 style={{fontWeight: "bold"}} className="pt-2">Part I: Summary</h1>
                                            <br></br>
                                            <p style={{fontWeight: "bold"}}>The Internet Computer blockchain removes many downsides of other blockchains like slow transactions, fees, or the need for installing wallets. Companies need to remove friction, especially when they’re taking new products to market. I feel this is the first time that we can build blockchain-based services that are as – if not more – user-friendly than classical web services. Furthermore, tokenization allows us to integrate rewards into products that give customers „skin in the game“. In the next part, I will show how we can further integrate web2 and Web3 using a very exciting feature of the Internet Computer.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row" style={{height: "200px"}}></div>
            </div>



            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body className="text-center">
                    {/* <img src="cool.webp"></img> */}
                    <strong>Success! You just minted an NFT on the Internet Computer blockchain!</strong>
                </Modal.Body>
            </Modal>
        </>
    )
};


export default ProfilePage;