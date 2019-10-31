import React, { Component } from "react";
import { Typography, Select, Button, message } from "antd";
import axios from "axios";
import "./AddVehicle.css";
import {addVehicle} from '../util/APIUtils'
const { Title } = Typography;

const uuidv4 = require("uuid/v4");
// const axios = require('axios');

class AddVehicle extends Component {
  constructor(props) {
    super(props);

    this.makes = ["Mahindra Electric", "Renault", "Hyundai", "Honda", "Ather"];
    this.models = ["Kona", "E2", "Kwid"];

    // this.handleMakeChange = this.handleMakeChange.bind(this);
    // this.handleModelChange = this.handleModelChange.bind(this);
    // this.sendAPIRequest = this.sendAPIRequest.bind(this);
    // this.toggleTwoWheeler = this.toggleTwoWheeler.bind(this);
  }

  state = {
    buttonDisabled: true,
    buttonLoading: false,
    make: "",
    model: "",
    twoWheeler: true
  };

  handleSelectChange = value => { // TODO refactor?
    if (this.makes.includes(value)) {
      this.handleMakeChange(value);
    } else {
      this.handleModelChange(value);
    }
  }

  handleMakeChange = value => {
    this.setState({
      make: value,
      buttonDisabled: value === "" || this.state.model === ""
    });
  };

  handleModelChange = value => {
    this.setState({
      model: value,
      buttonDisabled: value === "" || this.state.make === ""
    });
  };

  toggleTwoWheeler = () => {
    this.setState({ twoWheeler: !this.state.twoWheeler });
  };

  sendAPIRequest = () => {
    message.info(`Posting ${this.state.make}, ${this.state.model}, ${this.state.twoWheeler ? "Two Wheeler" : "Four Wheeler"}`) // TODO delete; for testing
    this.setState({buttonLoading: true});

    const vehicleData = {
      user_id: 1234, // TODO use real user ID
      make: this.state.make,
      model: this.state.model,
      vehicle_type: this.state.twoWheeler ? "Two Wheeler" : "Four Wheeler"
    }

    addVehicle(vehicleData)
      .then(res => message.info(res.message), this.setState({buttonLoading: false}));
  };

  render() {
    return (
      <div className="new-addvehicle-container">
        <div>
          <Title level={2}>Vehicle Make and Model</Title>
          <br />
          <br />
          <Button.Group size="large">
            <Button onClick={this.toggleTwoWheeler} type={this.state.twoWheeler ? "primary" : "secondary"}>Two Wheeler</Button>
            <Button onClick={this.toggleTwoWheeler} type={this.state.twoWheeler ? "secondary" : "primary"}>Four Wheeler</Button>
          </Button.Group>
          <br />
          <br />
          <Select
            defaultValue="Make"
            size="large"
            onChange={this.handleSelectChange}
          >
            {this.makes.map(e => (
              <Select.Option value={e} key={uuidv4()}>
                {e}
              </Select.Option>
            ))}
          </Select>

          <br />
          <br />
          <Select
            defaultValue="Model"
            size="large"
            onChange={this.handleSelectChange}
          >
            {this.models.map(e => (
              <Select.Option value={e} key={uuidv4()}>
                {e}
              </Select.Option>
            ))}
          </Select>
          <br />
          <br />
          <Button
            type="primary"
            disabled={this.state.buttonDisabled}
            loading={this.state.buttonLoading}
            onClick={this.sendAPIRequest}
            size="large"
          >
            ADD
          </Button>
        </div>
      </div>
    );
  }
}

export default AddVehicle;
