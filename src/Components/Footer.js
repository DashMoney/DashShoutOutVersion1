import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <div className='footer' id="bodytext">
        <h3>
          Resources
        </h3>
        
        <ul>
        <li>Try out <span></span>
            <a rel="noopener noreferrer" target="_blank" href="https://dashgetmoney.com">
            <b>DashGetMoney.com</b>
            </a> to send and receive Dash just using your name!
          </li>
        <li>DashShoutOut Github Repo - <a rel="noopener noreferrer" target="_blank" href="https://www.dashcentral.org/p/DashMoney-Dapp-Development-June-2023">
            <b>Pending Dash Treasury Proposal - LIVE</b>
            </a></li>
          <li>
            <a rel="noopener noreferrer" target="_blank" href="https://dashplatform.readme.io/">
            Dash Platform Developer Documentation
            </a>
          </li>
          <li><a rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=VoQxHhzWhT0">
          DashMoney - Closing Loops (Video)
            </a></li>
        </ul>
      </div>
    );
  }
}
export default Footer;
