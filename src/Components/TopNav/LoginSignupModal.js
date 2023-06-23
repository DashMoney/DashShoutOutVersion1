import React from "react";
//import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";

import MnemonicLogin from "./MnemonicLogin";

import "./LoginSignupModal.css";

class LoginSignupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  render() {
    let modalBkg = "";
    let closeButtonColor;
    let modalBackdrop;

    if (this.props.mode === "primary") {
      modalBackdrop = "modal-backdrop-nochange";
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} />;
    } else {
      modalBackdrop = "modal-backdrop-dark";
      modalBkg = "modal-backcolor-dark";
      closeButtonColor = (
        <CloseButton onClick={this.handleCloseClick} variant="white" />
      );
    }

    return (
      <>
        <Modal contentClassName={modalBkg} backdropClassName={modalBackdrop} show={this.props.isModalShowing}>
          <Modal.Header>
            <Modal.Title>Connect Wallet</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <MnemonicLogin
              handleLoginwithMnem={this.props.handleLoginwithMnem}
              closeExpandedNavs={this.props.closeExpandedNavs}
              hideModal={this.props.hideModal}
            />
            {/* <Tabs
              defaultActiveKey="mnemonic"
              id="signinlogin-tab"
              style={{ color: "red" }}
              fill
            >
              <Tab
                tabClassName={tabColor}
                eventKey="mnemonic"
                title="Mnemonic"
              >
                <p></p>
                <MnemonicLogin 
                handleLoginwithMnem={this.props.handleLoginwithMnem}
                toggleExpandedNav={this.props.toggleExpandedNav}
                hideModal={this.props.hideModal} />
              </Tab>

              <Tab tabClassName={tabColor} eventKey="name" title="Browser Extension">
                <p></p>
                <p>This is where the ability to login with browser extension will go. (Currently Unavailable)</p>
                
              </Tab>
            </Tabs> */}

            <p></p>
            {this.state.isError ? (
              <Alert variant="warning">
                Testnet Platform is having difficulties...
              </Alert>
            ) : (
              <></>
            )}

            {this.state.isLoading ? (
              <div id="spinner">
                <p></p>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <></>
            )}

            <p></p>
          </Modal.Body>
          <Modal.Footer>
            {/* <p></p>

            <p>
            <b>If you do not have a wallet,</b> click below and get your wallet and
              name!
            </p>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://dashgetnames.com/"
            >
              <Badge bg="primary" text="light">
                DashGetNames.com
              </Badge>
            </a>
            <p></p> */}
            <p></p>

            <p>
              If you do not have a wallet, go to{" "}<a rel="noopener noreferrer" target="_blank" href="https://dashgetnames.com/">
              <Badge bg="primary" text="light" pill>
                DashGetNames.com
              </Badge>
             </a>
              {" "} and get your wallet and name!
            </p>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default LoginSignupModal;
