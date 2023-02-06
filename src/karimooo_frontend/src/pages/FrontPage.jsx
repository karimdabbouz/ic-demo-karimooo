import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

import CompleteProfile from '../components/CompleteProfile';



const FrontPage = ({callbackExplicitLogin, isLoggedIn, loggedInUser}) => {

    const [showProfileCompleted, setShowProfileCompleted] = useState(false);

    return (
        <>
            <div className="container-fluid above-the-fold">
                <div className="row p-lg-5 p-md-2">
                    <div className="col">
                        <div className="row">
                            <div className="col-lg-7 col-xl-7">
                                <h6>Part I: The Internet Computer</h6>
                                <h1 style={{fontWeight: "900"}}>This website is served from a blockchain</h1>
                                <h2>Why you as a user (or as an entrepreneur) should care</h2>
                                <br></br>
                                <p>You’ve probably heard of blockchains, but have you used one yet? Most people haven’t. If they're not looking for an investment, people usually won’t bother installing and setting up a wallet just to be able to use an app and they certainly won’t pay any fees just to try out a new service.</p>
                                <p>The website you’re using right now is built on top of technology that removes many downsides of typical blockchain services. Most importantly, it lowers the entry barrier to Web3 considerably. Strictly speaking, you’re already using Web3 as you read this text. Let’s see what’s going on here and try it out!</p>
                            </div>
                            <div className="col-lg col-xl">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row p-lg-5 p-md-2">
                    <div className="col">
                        <div className="row">

                            <div className="col-lg-6 col-xl-6">
                                <h2>This frontend is code on a blockchain</h2>
                                <br></br>
                                <p>Typically, when you visit a website, the data is sent from a server to your browser where code is executed and the page is rendered. The majority of websites and apps we use (including their backends) are hosted on servers provided by one of three large companies: Amazon (AWS), Google, and Microsoft (Azure) with Amazon being the largest of the three. It's practically impossible for you not to use technology running on Amazon infrastructure.</p>
                                <p>What you're seeing here is a frontend application served by a so-called canister from the Internet Computer blockchain. A canister is a bundle of WebAssembly code hosted and executed via the Internet Computer Protocol (ICP). A canister can – but doesn’t need to be – the equivalent of smart contracts on other blockchains like Ethereum or Solana. Therefore, a canister can do much more than typical smart contracts. In this case, it serves a React application to your browser.</p>
                                <p>The key difference between this website and typical web services is that your browser isn’t connected to one single server provided by „big tech“ but to a network of independently run machines which together form the <a target="_blank" href="https://internetcomputer.org/">Internet Computer</a>. The reason why people call it Internet Computer is that that’s what it is: a distributed compute platform on top of the internet. It means that this website runs as long as the canister has enough "fuel" (is being paid for) and it cannot be stopped or removed except if the network decides to remove it. Such a decision could be made in theory, but only if a majority of users decide so via voting through the <a target="_blank" href="https://internetcomputer.org/nns">Internet Computer’s NNS</a>.</p>
                            </div>

                            <div className="col-lg-6 col-xl-6 my-auto">
                                <div className="container mt-5 mb-5">
                                    <div className="row mx-auto">
                                        <div className="col">
                                            <img src="network_sketch.svg" className="img-fluid"></img>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row p-lg-5 p-md-2">
                    <div className="col">
                        <div className="row">

                            <div className="col-lg-6 col-xl-6">
                                <h2>We don't need email and password to connect to Web3</h2>
                                <br></br>
                                <p>Think about the number of websites you have signed up to throughout your life. Are you able to name them all? Probably not. There are just too many and most, if not all of them, asked you for a combination of email address and password. Internally, online services use these to map data to user accounts so that you see what you’re supposed to see instead of another user's profile for example. email (or usernames) and passwords are so ubiquitous that we don’t question if they’re actually a good way to sign up online. They’re not. In fact, storing email addresses and passwords is an inherent security risk.</p>
                                <p>Using email addresses for user identification also defeats one of the central promises of Web3: data ownership. Signing up via email means that all data generated within an app is tied to an account defined by your email address (or a username). The data itself resides on the server where the app is being hosted and the only way to get your hands on it and eventually take it with you is if the service’s developers allow you to by providing a download link. But even then, this doesn’t mean that your data comes in a compatible format for other services. Although easy transferability is a core attribute of everything digital, we still design and build apps today that keep users from even considering to take their data with them and use it in other apps.</p>
                                <p>Services on the Internet Computer don't need email and passwords to sign up users. Instead, they either use a wallet or a blockchain-based authentication framework called <a target="_blank" href="https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity">Internet Identity</a>. In both cases, users are represented internally by a unique string of characters called a Principal. Developers can use the Principal to grant users full ownership of their data in a way that it becomes easy to transfer. The data still resides on remote servers – in this case on the Internet Computer – but users can plug it into other blockchain services with one click and without having to download or format the data. This is known as tokenization where a token is given to the user as a reference to some data. Most NFTs for instance are a reference to digital art using a specific token standard agreed to by the developer community. By using this token standard developers can easily build services that allow users to transfer their data to it (or parts thereof). In the case of NFTs representing digital art, the most prominent example of such services are marketplaces where users can trade their NFTs.</p>
                            </div>

                            <div className="col-lg-6 col-xl-6 my-auto">
                                <div className="container mt-5 mb-5">
                                    <div className="row mx-auto">
                                        <div className="col">
                                            <img src="NFT_sketch.svg" className="img-fluid"></img>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row p-lg-5 p-md-2">
                    <div className="col">
                        <div className="row">

                            <div className="col-lg-6 col-xl-6">
                                <h2>Let's connect to a Web3 service!</h2>
                                <br></br>
                                <p>You can see your current Principal here: <strong>{loggedInUser}</strong>. This is you right now visiting this website. It is possible to make calls to Web3 apps on the Internet Computer as an anonymous user, but as a developer, I wouldn't be able to distinguish you from other users.</p>
                                <p>By clicking on the button, you will be taken to a new page that will walk you through creating a new identity on the blockchain. All you need is a device with a fingerprint sensor or FaceID to authenticate with. A <a target="_blank" href="https://www.yubico.com/">Yubikey</a> will do it as well*. This replaces the need for a password. You can of course create as many identities as you like and none of the biometric information is linked to your Internet Identity or to you as an individual. Also, your Principal in one app is different than your Principal in another app which means that I can’t know what other apps you have been using. Hackers often cross-reference data breaches by comparing email addresses. This is impossible with Internet Identity. Go ahead and try it out by clicking the "connect" button</p>
                                <p>Internet Identity is one example of where the Internet Computer blockchain makes things much easier than other chains like Ethereum. Since every canister on the Internet Computer can be reached through a browser, it is possible to register with Web3 services without having to install a wallet at all. Also, apps on the Internet Computer don’t require users to pay fees. That way, onboarding users to blockchain services becomes even easier than signing people up with classical web services.</p>
                                {(isLoggedIn == true) ?
                                    <p><strong>You should now see a different Principal which is longer than the one for anonymous users. It means that you're now connected to this app and can make non-anonymous calls to the blockchain.</strong></p> :
                                    <></>
                                }
                                <br></br>
                                *there are ways to connect without a device which I might cover later
                            </div>

                            <div className="col-lg-6 col-xl-6 my-auto">
                                <div className="container mt-5 mb-5">
                                    <div className="row w-50 mx-auto">
                                        <div className="col p-2 text-center pulsate">
                                            <h3><strong>This is you: </strong><span className="">{loggedInUser}</span></h3>
                                        </div>
                                    </div>
                                    <div className="row w-50 mx-auto mt-5">
                                        <div className="col">
                                            <Button onClick={callbackExplicitLogin} className="w-100 btn btn-dark btn-lg">Connect</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {(isLoggedIn == true) ?
                <>
                    <div className="container-fluid mt-5 mb-5" style={{backgroundColor: "yellow"}}>
                        <div className="row text-center p-5">
                            <h1><strong>Onboarding users in Web3 is extremly easy. Users are faster to sign up and try an app when they don't need to give away personal information.</strong></h1>
                        </div>
                    </div>
        
                    <div className="container-fluid">
                        <div className="row p-lg-5 p-md-2">
                            <div className="col">
                                <div className="row">
        
                                    <div className="col my-auto">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col">
                                                    <h1>Turning user registration upside down</h1>
                                                    <br></br>
                                                    <p>Have you noticed that you’re now a "registered" user without having given away any information at all? Services on the Internet Computer make registration processes much more frictionless. Once you have set up your Internet Identity, you can sign up to (almost) any app with the touch of your finger. And after having connected to this app, all I see as a developer is a public delegation key which makes you completely pseudonymous while still allowing me to build systems that offer the same experience as classical web services.</p>
                                                    <p>Think about the amount of information you’re used to giving away prior to using web apps: You need to register with a username or email address, choose a password (and remember it!), then you have to click on a confirmation link in an email. Also, many websites will subscribe you to their newsletter right away or ask you for further personal information claiming they need it to „optimize your experience“.</p>
                                                    <p>That's not a clever way to do business unless your service absolutely needs certain data to work. But even then I would advise keeping the entry barrier as low as possible which means: Give before you take. Blockchain services offer great ways to achieve this using tokens and they allow developers to build apps where users own their data and can hop on and off whenever they want in a very secure way.</p>
                                                    <p>Now, let’s say that your service absolutely needs your users to set up a rough profile with a username and a profile image and that you want to incentivize this. How do you do this without having collected email addresses when signing them up? Go ahead and fill in the information below. Then check your newly created profile and have a look at your reward!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
        
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <div className="container-fluid">
                        <div className="row" style={{height: "100px"}}></div>
                    </div>
            
                    <CompleteProfile
                    loggedInUser={loggedInUser}
                    callbackSetShowProfileCompleted={setShowProfileCompleted}
                    />
        
                    <div className="container-fluid">
                        <div className="row" style={{height: "200px"}}></div>
                    </div>
                </> :
                <></>
            }

            <Modal show={showProfileCompleted}>
                <Modal.Body>
                    <h5>Success! Your profile has been created. Check <Link to={`/profile/:${loggedInUser}`}>it out!</Link></h5>
                </Modal.Body>
            </Modal>
        </>
    )
  };

export default FrontPage;