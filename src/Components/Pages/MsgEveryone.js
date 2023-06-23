import React from "react";
//import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";

class MsgEveryone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleNameClick = () => {
    navigator.clipboard.writeText(`@${this.props.message.author}`);
    this.setState({
      copiedName: true,
    });
  };


  getRelativeTimeAgo(messageTime, timeNow){

    let timeOfMessage = 2546075019551 - messageTime;

    let timeDifference = timeNow - timeOfMessage;
  
    if(timeDifference >= 84600000){
      let longFormDate = new Date();
       longFormDate.setTime(timeOfMessage);
      return longFormDate.toLocaleDateString();
    }
    
  
    if(timeDifference < 15000){
      return "Just now"
    }else if(timeDifference <44000){
      return "A few moments ago"
    }else if(timeDifference <90000){
      return "1 minute ago"
    }else if(timeDifference <150000){
      return "2 minutes ago"
    }else if(timeDifference <210000){
      return "3 minutes ago"
    }else if(timeDifference <270000){
      return "4 minutes ago"
    }else if(timeDifference <330000){
      return "5 minutes ago"
    }else if(timeDifference <390000){
      return "6 minutes ago"
    }else if(timeDifference <450000){
      return "7 minutes ago"
    }else if(timeDifference <510000){
      return "8 minutes ago"  
    }else if(timeDifference <570000){
      return "9 minutes ago"  
    }else if(timeDifference <660000){
      return "10 minutes ago"
    }else if(timeDifference <840000){
      return "12 minutes ago"
    }else if(timeDifference <1020000){
      return "15 minutes ago"
    }else if(timeDifference <1140000){
      return "18 minutes ago"
    }else if(timeDifference <1380000){
      return "20 minutes ago"
    }else if(timeDifference <1650000){
      return "25 minutes ago"
    }else if(timeDifference <1950000){
      return "30 minutes ago"
    }else if(timeDifference <2250000){
      return "35 minutes ago"
    }else if(timeDifference <2550000){
      return "40 minutes ago"
    }else if(timeDifference <3000000){
      return "45 minutes ago"
    }else if(timeDifference <5400000){
      return "1 hour ago"
    }else if(timeDifference <9000000){
      return "2 hours ago"
    }else if(timeDifference <12600000){
      return "3 hours ago"
    }else if(timeDifference <18000000){
      return "A few hours ago"
    }else if(timeDifference <43200000){
      return "Several hours ago"
    }else if(timeDifference <84600000){
      return "Less than a day ago"
    }
  }

  render() {
    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";

    } else {
      cardBkg = "dark";
      cardText = "white";

    }

    return (
      <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitle">
            {this.props.uniqueName === this.props.message.author ? (
              <span style={{ color: "#008de4" }}>{this.props.message.author}</span>
            ) : (
              <>
              <span onClick={() => this.handleNameClick()}>
                {this.props.message.author}
              </span>
              <span>
                {this.state.copiedName?<span>✅</span>:<></>}
                </span>
                </>
            )}
            {/* 
          
          <Button variant="outline-primary" 
          onClick={()=> this.handleNameClick()          
          }
          >Copy</Button>
          {this.state.copiedName?<span>☑️🔵☑️</span>:<></>} */}

            <span className="textsmaller text-muted">
              {this.getRelativeTimeAgo(this.props.message.timeStamp, this.props.date)}
            </span>
          </Card.Title>

          <Card.Text>{this.props.message.message}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default MsgEveryone;
