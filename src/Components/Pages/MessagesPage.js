import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Nav from "react-bootstrap/Nav";

import MessagespageEveryone from "./MessagesPageEveryone";
import MessagespageForyou from "./MessagesPageForyou";

import "./MessagesPage.css";

class MessagesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      whichTab: "Everyone",
    };
  }

  handleTab = (eventKey) => {
    if (eventKey === "For you")
      this.setState({
        whichTab: "For you",
      });
    else {
      this.setState({
        whichTab: "Everyone",
      });
    }
  };

  render() {
    return (
      <>
        {!this.props.isLoading &&
        this.props.identity !== "No Identity" &&
        this.props.uniqueName !== "Er" ? (
          <>
            <Nav
              fill
              variant="pills"
              defaultActiveKey={this.state.whichTab}
              onSelect={(eventKey) => this.handleTab(eventKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="Everyone">
                  <b>Everyone</b>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="For you">
                  <b>For you</b>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {this.props.isLoadingEveryone && this.state.whichTab === "Everyone" ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <></>
            )}

{this.props.isLoadingForyou && this.state.whichTab === "For you" ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <></>
            )}

          </>


        ) : (
          <></>
        )}



        {this.props.isLoading ? (
          <>
            <p></p>
            <div id="spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </>
        ) : (
          <></>
        )}

        {this.props.isLoadingRefresh ? (
          <>
            <p></p>
            <div id="spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </>
        ) : (
          <></>
        )}


        {this.props.identity === "No Identity" ? (
          <div id="bodytext">
            <p>
              There is no Identity for this Mnemonic, please go the{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://dashgetnames.com/"
              >
                DashGetNames.com
              </a>{" "}
              and register an Identity for your Mnemonic.
            </p>
            <p>Or Testnet Platform maybe having difficulties...</p>
          </div>
        ) : (
          <></>
        )}

 {/* THIS IS THE START OF A SEPARATE SECTION APART FROM EVERYTHING ABOVE */}

        {this.props.uniqueName === "Er" ? (
          <div id="bodytext">
          <p>
            There is no Name for this Identity, please go to{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://dashgetnames.com/"
            >
              DashGetNames.com
            </a>{" "}
            and register an Name for your Identity.
          </p>
          <p>
            Or you may have run into a platform issue, just reload page and try again.
          </p>
          </div>
        ) : (
          <></>
        )}

        <div id="bodytext" className="footer">

          {!this.props.isLoadingEveryone &&
          this.state.whichTab === "Everyone" ? (
            <div className="d-grid gap-2">
              <MessagespageEveryone
                uniqueName={this.props.uniqueName}
                dsoEveryoneMessages={this.props.dsoEveryoneMessages}
                mode={this.props.mode}
              />
            </div>
          ) : (
            <></>
          )}

          {!this.props.isLoadingForyou &&
           this.state.whichTab === "For you" ? (
            <div className="d-grid gap-2">
              <MessagespageForyou
                identityInfo={this.props.identityInfo}
                uniqueName={this.props.uniqueName}
                dsoForyouMessages={this.props.dsoForyouMessages}
                mode={this.props.mode}
              />
            </div>
          ) : (
            <></>
          )}

        </div>
      </>
    );
  }
}

export default MessagesPage;
