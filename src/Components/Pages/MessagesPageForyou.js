import React from "react";
import Badge from "react-bootstrap/Badge";
import MsgForyou from "./MsgForyou";

class MessagespageForyou extends React.Component {
  
  // dsoForyouMessages
  
  render() {
    
    let d = Date.now();

    let messages = this.props.dsoForyouMessages.map(
      (message, index) => {

        return (
          <MsgForyou
          key={index}
          mode={this.props.mode} 
          index={index} 
          message = {message}
          date = {d}
          uniqueName={this.props.uniqueName}
          />
          
        )
    });

    return (
      <>

        <div className="id-line">
        <h5>
          <Badge className="paddingBadge" bg="primary">
            Your Platform Credits
          </Badge>
        </h5>
{this.props.identityInfo !== '' ?
        <h5>
          <Badge className="paddingBadge" bg="primary" pill>
            {this.props.identityInfo.balance}
          </Badge>
        </h5>
        :
        <h5>
          <Badge className="paddingBadge" bg="primary" pill>
            Loading..
          </Badge>
        </h5>      
        }
     </div>

        {/* {this.props.identityInfo !== '' ?
        (<div className="id-line">
        <h5>
          <Badge className="paddingBadge" bg="primary">
            Your Platform Credits
          </Badge>
        </h5>
        
         <p>{this.props.identitiesInfo[0].id}</p> //<- commented out!!!

        <h5>
          <Badge className="paddingBadge" bg="primary" pill>
            {this.props.identityInfo.balance}
          </Badge>
        </h5>
      </div>
      ):(
        <></>
      )
        } */}

        {this.props.dsoForyouMessages.length < 1 ? 
        <p>Greetings, once you send a message or someone tags you in a message, it will show up here.</p> 
        : 
        <></>}
        
        <div id="cardtext" className="footer">
          {messages}
        </div>
      </>
    );
  }
}

export default MessagespageForyou;
