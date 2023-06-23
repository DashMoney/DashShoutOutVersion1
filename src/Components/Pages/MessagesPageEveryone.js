import React from "react";
import MsgEveryone from "./MsgEveryone";


class MessagespageEveryone extends React.Component {
  
 
   

  render() {

    let d = Date.now()

    let messages = this.props.dsoEveryoneMessages.map(
      (message, index) => {  
        return (
          <MsgEveryone
          key={index}
          mode={this.props.mode} 
          index={index} 
          message = {message}
          date = {d}
          uniqueName={this.props.uniqueName}
          />
          
        )
      }
    );

    return (
      <> 
      
        <div id="cardtext" className="footer">
          
              {messages}
            
        </div>
      </>
    );
  }
}

export default MessagespageEveryone;
