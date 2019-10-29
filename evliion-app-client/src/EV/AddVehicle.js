import React, { Component } from "react";
import { Typography, Select, Button, message } from "antd";
import axios from "axios";
import "./AddVehicle.css";
const { Title } = Typography;

const uuidv4 = require("uuid/v4");
// const axios = require('axios');

class AddVehicle extends Component {
  constructor(props) {
    super(props);

    this.makes = ["Mahindra Electric", "Renault", "Hyundai", "Honda", "Ather"];
    this.models = ["Kona", "E2", "Kwid"];

    this.handleMakeChange = this.handleMakeChange.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.sendAPIRequest = this.sendAPIRequest.bind(this);
    this.toggleTwoWheeler = this.toggleTwoWheeler.bind(this);
  }

  state = {
    buttonDisabled: true,
    make: "",
    model: "",
    twoWheeler: true
  };

//   handleSelectChange = (value = {});

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
    console.log(this.state.make, this.state.model);
    axios
      .post("https://localhost:8080/api/v1/vehicle", {
        user_id: 1234, // TODO use actual user ID
        make: this.state.make,
        model: this.state.model,
        vehicle_type: this.state.twoWheeler ? "Two Wheeler" : "Four Wheeler"
      })
      .then(res => message.info(res.data.message));
  };

  render() {
    return (
      <div className="new-addvehicle-container">
        <div>
          <Title level={2}>Vehicle Make and Model</Title>
          <br />
          <br />
          <Button.Group size="large">
            <Button onClick={this.toggleTwoWheeler}>Two Wheeler</Button>
            <Button onClick={this.toggleTwoWheeler}>Four Wheeler</Button>
          </Button.Group>
          <br />
          <br />
          <Select
            defaultValue="Make"
            size="large"
            onChange={this.handleMakeChange}
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
            onChange={this.handleModelChange}
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
