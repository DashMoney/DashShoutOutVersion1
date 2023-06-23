import React from "react";
import DSOmodified from "../../Images/DSOPreview.png";
import Image from "react-bootstrap/Image";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Figure from 'react-bootstrap/Figure';

import "./LandingPage.css";

class LandingPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      response : {},
      copiedMnemonic: false,
      //I dont think I need this
    }
  }
  render() {
    return (
      <>
      
      <h5 id="title-bar">
          <b>Send and receive messages with other Dash users.</b>
        </h5>
        {/* <h3>
          <Badge bg="primary">Purpose of DashShoutOut</Badge>
        </h3> */}
        <div className="heading-shift">
          <p>
            <b>DashShoutOut is a Dapp or Decentralized Application that showcases Dash Platform's Data Contracts and Names! 
            </b> 
          </p>
          {/* To showcase a simple message board Dapp and an actual implementation of Dash Platform's Data Contracts and Documents with a social aspect. */}
          {/* <ul>
            <li>
              <p>
                 To assist in "Closing the Loop" and building the network effect for the Dash ecosystem, the user network should utilize the Dash Platform. That is what DashShoutOut hopes to achieve and may it be one of many to do so.
              </p>
            </li>
          </ul> */}
        </div>
        

         <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">
         <Image
           fluid  rounded id="dash-landing-page" src={DSOmodified} alt="Dash Wallet with Name" 
         />
         <p></p>
         <Figure.Caption>
           <b>DashShoutOut - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container>
   <p></p>

<div id="bodytext">

        <h3>
          How to Use
          
        </h3>

        <div className="paragraph-shift">
         
            <h6>
              Connect your Wallet at the bottom of your screen, and you can start using DashShoutOut. </h6>

              <h6> The DashShoutOut
              runs entirely in your browser and is purely a front end communicating with the Dash
              Platform.
            </h6>

            <p>
               If you are new to Dash, you will need a Dash Name from <a rel="noopener noreferrer" target="_blank" href="https://dashgetnames.com/">
            <b>DashGetNames.com</b>
             </a> {/*or sign up with <b>DashPay</b>, just download the app on your phone. Signing up for DashPay will provide you with everything you need.*/} (Currently, this is all 
              working on Testnet, so it is not real Dash.)
            </p>
          

        </div>
      </div>
      </>
    );
  }
}

export default LandingPage;
