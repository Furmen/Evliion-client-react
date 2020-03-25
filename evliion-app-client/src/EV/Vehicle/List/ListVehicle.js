import React, { Component } from "react";
import { Typography, Button } from "antd";
import "./ListVehicle.css";

const { Title } = Typography;
var that;
var vehicles = [];
var sortConfig = {
  key: "model",
  direction: "ascending"
};

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

  requestSort(key) {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }

    sortConfig.key = key;
    sortConfig.direction = direction;

    this.setState({ state: this.state });
  }

  getClassNamesFor(key) {
    if (!sortConfig) return;
    return sortConfig.key === key ? sortConfig.direction : undefined;
  }

  useSortableData() {
    if (sortConfig !== null) {
      vehicles.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return vehicles;
  }  

  render() {
    let table;
    if(vehicles.length > 0) {
      this.useSortableData();

      table = <table>
      <thead>
        <tr>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('vehicle_type')}
                className={this.getClassNamesFor('vehicle_type')}>
                Category
              </button>
          </th>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('make')}
                className={this.getClassNamesFor('make')}>
                Make
              </button>
          </th>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('model')}
                className={this.getClassNamesFor('model')}>
                Model
              </button>
          </th>
        </tr>
      </thead>
      {
         vehicles.map((vechicle, index) => (
          <tbody>
              <tr>
                <td key={index}>{vechicle.vehicle_type}</td>
                <td key={index}>{vechicle.make}</td>
                <td key={index}>{vechicle.model}</td>
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
