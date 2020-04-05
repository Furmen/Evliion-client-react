import React, { Component } from "react";
import { Typography, Select, Button, message } from "antd";
import "./Vehicle.css";
import {addVehicle} from '../../util/APIUtils'

const { Title } = Typography;
const uuidv4 = require("uuid/v4");
var that;
var vehicleIndex = -1;

class Vehicle extends Component {
  _isMounted = false;

  state = {
    buttonDisabled: true,
    buttonLoading: false,
    make: "",
    model: "",
    twoWheeler: true
  };

  constructor(props) {
    super(props);
    this.makes = ["Mahindra Electric", "Renault", "Hyundai", "Honda", "Ather"];
    this.models = ["Kona", "E2", "Kwid"];
    that = props;
    vehicleIndex = props.location.state.vehicle_index;
  }

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
    this.setState({buttonLoading: true});

    const vehicleData = {
      user_id: 1234, // TODO use real user ID
      make: this.state.make,
      model: this.state.model,
      vehicle_type: this.state.twoWheeler ? "Two Wheeler" : "Four Wheeler",
      vehicle_index: vehicleIndex
    }

    that.history.push('/', { vehicleData });

    addVehicle(vehicleData)
      .then(res => message.info(res.message), 
      this.setState({buttonLoading: false}));
  };

  backToTheList = () => {
    that.history.push('/');
  }

  isEditMode() {
    return that.location.state && that.location.state.vehicleEdit;
  }

  componentDidMount() {
    this._isMounted = true;

    if(this.isEditMode()) {
      setTimeout(() => {
        if (this._isMounted) {
        let carEdit = that.location.state.vehicleEdit;
        this.setState({
          make: carEdit.make,
          model: carEdit.model,
          twoWheeler: carEdit.vehicle_type === "Two Wheeler",
          buttonDisabled: carEdit.make === "" || carEdit.model === ""
        });

        this.setState({ state: this.state });
      }
     }, 0);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="new-addvehicle-container">
        {/* <div> */}
          <Title level={3}>{this.isEditMode() ? "Edit Vehicle" : "Add Vehicle"}</Title>
          <br />
          <br />
          <Button.Group size="large">
            <Button onClick={this.toggleTwoWheeler} type={this.state.twoWheeler ? "primary" : "secondary"}>Two Wheeler</Button>
            <Button onClick={this.toggleTwoWheeler} type={this.state.twoWheeler ? "secondary" : "primary"}>Four Wheeler</Button>
          </Button.Group>
          <br />
          <br />
          <br />
          <Title level={4}>Vehicle Make and Model</Title>
          <br />
          <Select
            defaultValue={this.isEditMode() ? that.location.state.vehicleEdit.make : "Make"}
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
            defaultValue={this.isEditMode() ? that.location.state.vehicleEdit.model : "Model"}
            size="large"
            onChange={this.handleSelectChange}>
            {this.models.map(e => (
              <Select.Option value={e} key={uuidv4()}>
                {e}
              </Select.Option>
            ))}
          </Select>
          <br />
          <br />
          <div className="ctr-aligment">
            <a id="backToList" onClick={this.backToTheList}>
              Back to List
            </a>
            <Button
              id="btnAddVechicle"
              type="primary"
              disabled={this.state.buttonDisabled}
              loading={this.state.buttonLoading}
              onClick={this.sendAPIRequest}
              size="large">
              Save
            </Button>
          </div>
        {/* </div> */}
      </div>
    );
  }
}

export default Vehicle;
