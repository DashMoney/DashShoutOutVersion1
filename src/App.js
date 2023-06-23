import React from "react";
import LocalForage from "localforage";

import Image from "react-bootstrap/Image";

import DashBkgd from "./Images/dash_digital-cash_logo_2018_rgb_for_screens.png";

import TopNav from "./Components/TopNav/TopNav";
import BottomNav from "./Components/BottomNav/BottomNav";
import LoginBottomNav from "./Components/BottomNav/LoginBottomNav";

import LandingPage from "./Components/Pages/LandingPage";
import MessagesPage from "./Components/Pages/MessagesPage";

import Footer from "./Components/Footer";

import LoginSignupModal from "./Components/TopNav/LoginSignupModal";
import LogoutModal from "./Components/TopNav/LogoutModal";

import NewMessageModal from "./Components/BottomNav/BottomNavModalFolder/NewMessageModal";
import TopUpIdentityModal from "./Components/BottomNav/BottomNavModalFolder/TopUpModal";



import "./App.css";

const Dash = require("dash");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isLoading: false,
      isLoadingRefresh: false,
      isLoadingEveryone: false, 
      isLoadingForyou: false, 

      mode: "dark",
      presentModal: "",
      isModalShowing: false,
      whichNetwork: "testnet",

      mnemonic: "",
      identity: "",
      identityInfo: "", 

      uniqueName: "",
      messagePriorToSubmit: "",

      dsoEveryoneMessages: [],
      dsoForyouFirstPartMessages: [],
      dsoForyouMessages: [],

      addedMsgsPriorToConf: [],

      skipSynchronizationBeforeHeight: 883000,
      mostRecentBlockHeight: 898000,

      expandedTopNav: false,

      presentGroupChatModal: "",
      selectedGroupChat: "",
      isGroupChatModalShowing: false,
    };
  }

  closeExpandedNavs = () => {
    this.setState({
      expandedTopNav: false,
    });
  };

  toggleExpandedNav = (selectedNav) => {
    if (this.state.expandedTopNav) {
      this.setState({
        expandedTopNav: false,
      });
    } else {
      this.setState({
        expandedTopNav: true,
      });
    }
  };

  hideModal = () => {
    this.setState({
      isModalShowing: false,
    });
  };

  showModal = (modalName) => {
    this.setState({
      presentModal: modalName,
      isModalShowing: true,
    });
  };

  handleMode = () => {
    if (this.state.mode === "primary")
      this.setState({
        mode: "dark",
      });
    else {
      this.setState({
        mode: "primary",
      });
    }
  };

  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
      mnemonic: "",
      identity: "",
      uniqueName: "",
      identityInfo: "",
      dsoEveryoneMessages: [],
      dsoForyouMessages: [],
      isLoading: false,
      isLoadingRefresh: false,
      isLoadingEveryone: false,
      isLoadingForyou: false,
    });
  };

  updateCreditsAfterTopUp = (identInfo) => {
    this.setState({
      identityInfo: identInfo,
      isLoadingRefresh: false,
    });
  };

  triggerTopUpLoading = () => {
    this.setState({
      isLoadingRefresh: true,
    });
  };

  handleLoginwithMnem = (theMnemonic) => {
    
    this.setState(
      {
        isLoggedIn: true,
        isLoading: true,
        isLoadingEveryone: true,
        isLoadingForyou: true,
        identity: "Retrieving Identity",
        mnemonic: theMnemonic,
      },
      () => this.checkPlatformOnlyLogin(theMnemonic) 
    );
  };

  componentDidMount() {
      LocalForage.config({
        name: 'dashmoney-platform-login'
    });
  
    LocalForage.keys().then((keys) => {
      this.setState({
        LocalForageKeys: keys,
      });
      // An array of all the key names.
        console.log(keys);
    }).catch(function(err) {
        console.log(err);
    });
    
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DSOContract: {
          contractId: "8QeDPnw1TCwxXuPwQe9ov16JEWKXARdAs6sJjsXfZbca", // Your contract ID
        },
      },
    };

    let client = new Dash.Client(clientOpts);

    const getMostRecentBlockHeight = async () => {
      const status = await client.getDAPIClient().core.getStatus();

      return status;
    };

    getMostRecentBlockHeight()
      .then((d) => {
        let blockHeight = d.chain.blocksCount;
        console.log("Most Recent Block Height:\n", blockHeight);
        this.setState({
          mostRecentBlockHeight: blockHeight - 9,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());

        const getDocuments = async () => {
          return client.platform.documents.get("DSOContract.dsomessage5", {
            limit: 60,
            where: [["timeStamp", ">=", 2546075019551 - Date.now()]],
            orderBy: [["timeStamp", "asc"]],
          });
        };

        getDocuments()
          .then((d) => {
            let docArray = [];
            console.log("Free Grab of DSO Docs")
            for (const n of d) {
              //console.log("Document:\n", n.toJSON());
              docArray = [...docArray, n.toJSON()];
            }
            this.setState(
              {
                dsoEveryoneMessages: docArray,
              }
            );
          })
          .catch((e) => console.error("Something went wrong:\n", e))
          
          .finally(() => client.disconnect());
  }

  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

checkPlatformOnlyLogin = (theMnemonic) => {
  const clientOpts = {
    network: this.state.whichNetwork,
    wallet: {
      mnemonic: theMnemonic, 
      offlineMode: true,  
    },
  };
  
  const client = new Dash.Client(clientOpts);

  let walletIdToTry;

  const createWallet = async () => {
    const account = await client.getWalletAccount();
  
    walletIdToTry = account.walletId;
    console.log('walletIdToTry:', walletIdToTry);

    //This is where I see if the localForageIncludes the key or not.
    return this.state.LocalForageKeys.includes(walletIdToTry);
  
  };
  
  createWallet().then((isKeyAvail)=>{

    console.log(`LocalForage Test -> ${isKeyAvail}`);

    if(isKeyAvail){
      console.log('This here is a login skip!!');

      LocalForage.getItem(walletIdToTry).then((val)=> {

      console.log('Value Retrieved', val);

     if(val !== null || typeof val.identity !== 'string' || val.identity==='' || val.name === '' || typeof val.name !== 'string' ){
        this.setState(
          {
            identity: val.identity,
            uniqueName: val.name,
            walletIdToTry: walletIdToTry,
            isLoading: false,
          },() => this.handleGetDocsandGetIdInfo());
        }else{
          this.getIdentitywithMnem(theMnemonic);
        }
         
      }
    
      ).catch((err)=> {
        console.error("Something went wrong getting from localForage:\n", err);
      });

    }else{
      this.getIdentitywithMnem(theMnemonic);
    }

  })
    .catch((e) => console.error('Something went wrong:\n', e))
    .finally(() => client.disconnect());

}

  getIdentitywithMnem = (theMnemonic) => {

    const client = new Dash.Client({
      network: this.state.whichNetwork,
      
      wallet: {
        mnemonic: theMnemonic,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight,
        },
      },
    });
    
    let walletIdToTry;

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      //console.log(account);

       walletIdToTry = account.walletId;
      console.log(walletIdToTry);

      return account.identities.getIdentityIds();
    };

    retrieveIdentityIds()
      .then((d) => {
        console.log("Mnemonic identities:\n", d);
        if (d.length === 0) {
          this.setState({
            isLoading: false,
            identity: "No Identity",
          });
        } else {            
          this.setState(
            {
              walletIdToTry: walletIdToTry,
              identity: d[0],
            },
            () => this.getNamefromIdentity(d[0])
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong getting IdentityIds:\n", e);
        this.setState({
          isLoading: false,
          identity: "No Identity",
        });
      })
      .finally(() => client.disconnect());
    
    }

  /********************************************/

  getNamefromIdentity = (theIdentity) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
    });

    const retrieveNameByRecord = async () => {
      // Retrieve by a name's identity ID
      return client.platform.names.resolveByRecord(
        "dashUniqueIdentityId",
        theIdentity // Your identity ID
      );
    };

    retrieveNameByRecord()
      .then((d) => {
        let nameRetrieved = d[0].toJSON();
        console.log("Name retrieved:\n", nameRetrieved);

                  //CREATE AN OBJECT AND PUT IT IN THERE!!!
    let lfObject = {
      identity: theIdentity,
      name: nameRetrieved.label,
    }
LocalForage.setItem(this.state.walletIdToTry, lfObject).then((d)=> {
  //return LocalForage.getItem(walletId);
  console.log('Return from LF setitem:', d);
}).catch((err) =>{console.error("Something went wrong setting to localForage:\n", err);
});
        this.setState(
          {
            uniqueName: nameRetrieved.label,
            isLoading: false,
          },
          () => this.handleGetDocsandGetIdInfo()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        console.log("There is no dashUniqueIdentityId to retrieve");
        this.setState({
          isLoading: false,
          uniqueName: "Er",
        });
      })
      .finally(() => client.disconnect());
  };
 

  handleGetDocsandGetIdInfo = () => {
    //console.log(`Identity: ${this.state.identity}`);
    console.log("Getting Documents and IdentityInfo");

    if (!this.state.isLoadingEveryone && !this.state.isLoadingForyou) {

      this.setState(
        {
          isLoadingRefresh: true,
        }
        ,() => this.getDSOEveryoneDocs()
      );
    } else {
      this.setState({
        isLoadingEveryone: true,
        isLoadingForyou: true,
      }
      ,()=>this.getDSOEveryoneDocs()); 
    }

  };

  /********************************************/

  getDSOEveryoneDocs = () => {

    if(this.state.dsoEveryoneMessages.length ===0 || this.state.dsoForyouMessages.length !== 0 ){
      console.log("Calling dsoEveryoneDocs");
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DSOContract: {
          contractId: "8QeDPnw1TCwxXuPwQe9ov16JEWKXARdAs6sJjsXfZbca", // Your contract ID
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    //DSOEveryone Query
    const getDocuments = async () => {
      return client.platform.documents.get("DSOContract.dsomessage5", {
        limit: 60,
        where: [["timeStamp", ">=", 2546075019551 - Date.now()]],
        orderBy: [["timeStamp", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
          // console.log("Document:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        if(this.state.addedMsgsPriorToConf.length !== 0 ){
          docArray= [...this.state.addedMsgsPriorToConf, ...docArray]
        }
        this.setState(
          {
            dsoEveryoneMessages: docArray,
            isLoadingEveryone: false,
          },
          () => this.getDSOForyouTaggedDocs()
        );
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
    }else{
      this.setState({
        isLoadingEveryone:false,
      });
      this.getDSOForyouTaggedDocs()
    }
  };

  /********************************************/
  //Below Begins the 2 Queries of ForYou

  getDSOForyouTaggedDocs = () => {
    console.log("Calling dsoForYouTaggedDocs");
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DSOContract: {
          contractId: "8QeDPnw1TCwxXuPwQe9ov16JEWKXARdAs6sJjsXfZbca", // Your contract ID
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DSOContract.dsomessage5", {
        limit: 60,
        where: [
          ["tagged", "==", this.state.uniqueName.toLowerCase()], 
          ["timeStamp", ">=", 2546075019551 - Date.now()],
        ],
        orderBy: [["timeStamp", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
          docArray = [...docArray, n.toJSON()];
        }
        this.setState(
          {
            dsoForyouFirstPartMessages: docArray,
          },
          () => this.getDSOForyouAuthorDocs()
        );
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };
  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  getDSOForyouAuthorDocs = () => {
    console.log("Calling dsoForYouAuthorDocs");
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DSOContract: {
          contractId: "8QeDPnw1TCwxXuPwQe9ov16JEWKXARdAs6sJjsXfZbca", // Your contract ID
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DSOContract.dsomessage5", {
        limit: 60,
        where: [
          ["author", "==", this.state.uniqueName],
          ["timeStamp", ">=", 2546075019551 - Date.now()],
        ],
        orderBy: [["timeStamp", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
          //console.log("Document:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }
        this.combineAndRemoveDuplicateMessages(docArray);
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  combineAndRemoveDuplicateMessages = (arrayOfMessages) => {
    let combinedForYouSet = new Set([
      ...this.state.dsoForyouFirstPartMessages, //Now loads all at once
      ...arrayOfMessages,
    ]); //This removes duplicates.. Suppose to

    let combinedForYouArray = [...combinedForYouSet]; //Not Sure if this did anything
    let sortedForYou = combinedForYouArray.sort(function (a, b) {
      return a.timeStamp - b.timeStamp;
    });

if(this.state.addedMsgsPriorToConf.length !== 0 ){
  sortedForYou = [...this.state.addedMsgsPriorToConf, ...sortedForYou]
}

    this.setState(
      {
        dsoForyouMessages: sortedForYou,
        isLoadingForyou: false,
        isLoadingRefresh: false,
      },
      () => this.getIdentityInfo()
    );

  };

  /********************************************/

  getIdentityInfo = () => {
    console.log("Called get id info");

    const client = new Dash.Client({ network: this.state.whichNetwork });

    const retrieveIdentity = async () => {
      return client.platform.identities.get(this.state.identity); // Your identity ID
    };

    retrieveIdentity()
      .then((d) => {
        console.log("Identity retrieved:\n", d.toJSON());

        this.setState({
          identityInfo: d.toJSON(),

          
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);

      })
      .finally(() => client.disconnect());
  };

  //   DOCUMENT CREATION 
  //#######################################################################
  

  submitDSODocument = (addedMessage) => {

    console.log(addedMessage);
    this.addSentMessage(addedMessage);

    

    const clientOpts = {
      network: "testnet",
      wallet: {
        mnemonic: this.state.mnemonic,

        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight, 
        },
      },
      apps: {
        DSOContract: {
          contractId: "8QeDPnw1TCwxXuPwQe9ov16JEWKXARdAs6sJjsXfZbca", // Your contract ID
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const submitNoteDocument = async () => {
      const { platform } = client;
      const identity = await platform.identities.get(this.state.identity); // Your identity ID

      let docProperties = {};

      if (addedMessage.tagged === "No Tag") {
        docProperties = {
          timeStamp: addedMessage.timeStamp,
          author: addedMessage.author, 
          message: addedMessage.message,
        };
      } else {
        docProperties = {
          timeStamp: addedMessage.timeStamp,
          author: addedMessage.author, 
          message: addedMessage.message,
          tagged: addedMessage.tagged, 
        };
      }

      // Create the note document
      const dsoDocument = await platform.documents.create(
        "DSOContract.dsomessage5", 
        identity,
        docProperties
      );


      //This below disconnects the document sending..***

      // this.setState({
      //   isLoadingRefresh:false,

      // }); 

      // return dsoDocument;

       //This is to disconnect the Document Creation***

      const documentBatch = {
        create: [dsoDocument], 
      };

      // Sign and submit the document(s)
      return platform.documents.broadcast(documentBatch, identity);
    };

    submitNoteDocument()
      .then((d) => {
        let submittedDoc = d.toJSON();

        
        if(this.state.addedMsgsPriorToConf.length === 1 || this.state.addedMsgsPriorToConf === 0){
          this.setState(
            {
              addedMsgsPriorToConf: [],
              isLoadingRefresh: false,
            }
          );
        }else{
          this.setState(
            {
              addedMsgsPriorToConf: this.state.addedMsgsPriorToConf.slice(0,-1),
              isLoadingRefresh: false,
            }
          );
        }
        
        console.log(submittedDoc);
      })
      .catch((e) => {
        
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  addSentMessage = (msgToAdd) => {
    this.setState({
      addedMsgsPriorToConf: [msgToAdd, ...this.state.addedMsgsPriorToConf],
      // This ^^ will save until doc is returned.
      dsoEveryoneMessages: [
        msgToAdd,
        ...this.state.dsoEveryoneMessages,
      ],
      dsoForyouMessages: [
        msgToAdd,
        ...this.state.dsoForyouMessages,
      ],
    });
  };

  render() {
 

    this.state.mode === "primary"
      ? (document.body.style.backgroundColor = "rgb(280,280,280)")
      : (document.body.style.backgroundColor = "rgb(20,20,20)");

    this.state.mode === "primary"
      ? (document.body.style.color = "black")
      : (document.body.style.color = "white");

    return (
      <>
        <TopNav
          handleMode={this.handleMode}
          mode={this.state.mode}
          showModal={this.showModal}
          whichNetwork={this.state.whichNetwork}
          isLoggedIn={this.state.isLoggedIn}
          toggleExpandedNav={this.toggleExpandedNav}
          expandedTopNav={this.state.expandedTopNav}
        />
        <Image fluid="true" id="dash-bkgd" src={DashBkgd} alt="Dash Logo" />

        {!this.state.isLoggedIn ? (
          <>
            <LandingPage />
            <LoginBottomNav mode={this.state.mode} showModal={this.showModal} />
            <Footer />
          </>
        ) : (
          <>
            <MessagesPage
              isLoading={this.state.isLoading}
              isLoadingRefresh={this.state.isLoadingRefresh}
              isLoadingEveryone={this.state.isLoadingEveryone}
              isLoadingForyou={this.state.isLoadingForyou}
              identity={this.state.identity}
              identityInfo={this.state.identityInfo}
              uniqueName={this.state.uniqueName}
              dsoEveryoneMessages={this.state.dsoEveryoneMessages}
              dsoForyouMessages={this.state.dsoForyouMessages}
              mode={this.state.mode}
              showModal={this.showModal}
            />

            {!this.state.isLoading &&
            this.state.identity !== "No Identity" &&
            this.state.uniqueName !== "Er" ? (
              <BottomNav
                isLoadingRefresh={this.state.isLoadingRefresh}
                closeExpandedNavs={this.closeExpandedNavs}
                handleGetDocsandGetIdInfo={this.handleGetDocsandGetIdInfo}
                
                mode={this.state.mode}
                showModal={this.showModal}
              />
            ) : (
              <></>
            )}
          </>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "LoginSignupModal" ? (
          <LoginSignupModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleLoginwithMnem={this.handleLoginwithMnem}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "LogoutModal" ? (
          <LogoutModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleLogout={this.handleLogout}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "NewMessageModal" ? (
          <NewMessageModal
            uniqueName={this.state.uniqueName}
            submitDSODocument={this.submitDSODocument}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "TopUpIdentityModal" ? (
          <TopUpIdentityModal
            triggerTopUpLoading={this.triggerTopUpLoading}
            updateCreditsAfterTopUp={this.updateCreditsAfterTopUp}
            mnemonic={this.state.mnemonic}
            whichNetwork={this.state.whichNetwork}
            skipSynchronizationBeforeHeight={
              this.state.skipSynchronizationBeforeHeight
            }
            identity={this.state.identity}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default App;
