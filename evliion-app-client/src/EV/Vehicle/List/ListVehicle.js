import React, { Component } from "react";
import { Typography, Button } from "antd";
import "./ListVehicle.css";

const { Title } = Typography;
var that;
var vehicles = [];

class ListVehicle extends Component {
  constructor(props) {
    super(props);
    that = props;

    if(that.history.location.state.vehicleData)
      vehicles.push(that.history.location.state.vehicleData);
  }

  sendToNewVehicle() {
    that.history.push('/addvehicle', { currentUser: that.currentUser })
  }

  render() {
    let table;
    if(vehicles.length > 0) {
      table = <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Make</th>
          <th>Model</th>
        </tr>
      </thead>
      {
         vehicles.map((vechicle, index) => (
          <tbody>
              <tr>
                <td>{vechicle.vehicle_type}</td>
                <td>{vechicle.make}</td>
                <td>{vechicle.model}</td>
            </tr>
          </tbody>
         ))
      }
    </table>;
    } else {
      table = <table>
        <thead>
          <tr>
            <th>Advice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>No vehicles</td>
          </tr>
        </tbody>
      </table>;
    }

      return (
        <div className="new-addvehicle-container">
          <Title level={3}>List of Vehicles</Title>
          <br />
          <br />
          {table}
          <br />
          <br />
          <Button
              id="btnNewVechicle"
              type="primary"
              onClick={this.sendToNewVehicle}
              size="large">
            New Vehicle
          </Button>
          <br />
          <br />
        </div>
      );
  }
}

export default ListVehicle;
