import React, { Component } from "react";
import "./Welcome.css";

export default class Welcome extends Component {
  render() {
    return (
      <div>
        <div className="welcome-page">
          <div className="watt-about">
            <div className="watt">WATT</div>
            <div className="description">
              A decentralized electric vehicle charging station solution.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
