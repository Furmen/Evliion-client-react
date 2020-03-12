import React, { Component } from "react";
import "./verify_mobile.css";

import { Modal, Button, Spin } from "antd";
import ReactCodeInput from "react-verification-code-input";
import Countdown from "react-countdown-now";

const TimeFill = () => {
  return <span style={{ margin: 0 }}>Request a new code</span>;
};

const Renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <TimeFill />;
  } else {
    return (
      <span>
        {minutes ? minutes : "00"}:{seconds < 10 ? "0" + seconds : seconds}
      </span>
    );
  }
};

class verify_mobile extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      mobile: this.getMobileNumber(props),
      expiryTime: Date.now() + 18000,
      isDisabled: true,
      isVisible: false,
    };
  }

  //This is executed on completion of verification code input
  onCodeComplete = () => {
    this.setState({ isDisabled: false });
  };

  getMobileNumber(props) {
    return (props.location.state.countrycode.indexOf("+") !== -1 ? props.location.state.countrycode + "" + props.location.state.mobilenumber : 
                                                                  "+" + props.location.state.countrycode + "" + props.location.state.mobilenumber);
  }

  verifyMobile = () => {
    this.setState({ isVisible: true }); //spinner modal is displayed
    //verifying mobile function is executed here
  };

  render() {
    return (
      <div className="body">
          {/* Spinner modal */}
        <Modal
          header={null}
          style={{ width: "10px" }}
          visible={this.state.isVisible}
          closable={false}
          width={100}
          bodyStyle={{
            display: "flex",
            justifyContent: "center",
          }}
          footer={null}
          centered
        >
          <Spin size="large" />
        </Modal>

        <h3 id="screen_name">Verify Phone Number</h3>
        <p id="instruction">Please enter the OTP sent to</p>
        <p id="mobile">{this.state.mobile}</p>
        <ReactCodeInput
          className="verify_input"
          onComplete={this.onCodeComplete}
        />
        <Countdown date={this.state.expiryTime} renderer={Renderer} />
        <Button
          type="primary"
          id="verify_btn"
          onClick={this.verifyMobile}
          disabled={this.state.isDisabled}
          style={{
            backgroundColor: this.state.isDisabled ? "#E6EBE8" : "green",
          }}
        >
          Verify
        </Button>
      </div>
    );
  }
}

export default verify_mobile;
