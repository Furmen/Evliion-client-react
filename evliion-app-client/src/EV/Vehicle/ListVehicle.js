import React, { Component } from "react";
import { Modal, Typography, Button } from "antd";
import "./ListVehicle.css";

const { Title } = Typography;
var that;
var vehicles = [];
var sortConfig = {
  key: "model",
  direction: "ascending"
};
var indexForDeleteCar = -1;

class ListVehicle extends Component {
  constructor(props) {
    super(props);
    that = props;

    this.state = {
      isVisible: false,
    };

    //Check if state has values
    if(that.history.location.state) {
      //Delete vehicle if is an edit mode
      if(that.history.location.state.vehicleData.vehicle_index !== undefined &&
        that.history.location.state.vehicleData.vehicle_index !== -1)
        vehicles.splice(that.history.location.state.vehicleData.vehicle_index, 1);

      //Check availability of the vehicle
      if(!this.checkCarAvailability(that.history.location.state.vehicleData))
        vehicles.push(that.history.location.state.vehicleData);
    }
  }

  sendToNewVehicle() {
    that.history.push('/vehicle', { currentUser: that.currentUser })
  }

  checkCarAvailability(carDetail) {
    var existCar = vehicles.filter((item, index) => { 
      if(carDetail.vehicle_type === item.vehicle_type &&
        carDetail.make === item.make &&
        carDetail.model === item.model)
        return item;
    });

    return existCar.length > 0;
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

  editCar(index, vehicle) {
    that.history.push('/vehicle', 
      { 
        currentUser: that.currentUser, 
        vehicleEdit: vehicle, 
        vehicle_index: index 
      })
  }

  deleteCar(index, vehicle) {
    indexForDeleteCar = index;
    this.setState({ isVisible: true });
  }

  closeModal() {
    this.setState({ isVisible: false });
  }

  deleteCarAndCloseModal() {
    vehicles.splice(indexForDeleteCar, 1);
    indexForDeleteCar = -1;
    this.setState({ isVisible: false });
  }

  render() {
    let table;
    if(vehicles.length > 0) {
      this.useSortableData();

      table = <table>
      <thead>
        <tr>
          <th>
            Car number
          </th>
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
          <th>
            Actions
          </th>
        </tr>
      </thead>
        <tbody>
        {
          vehicles.map((vehicle, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{vehicle.vehicle_type}</td>
              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td>
                <a className="icon-css" title="Edit" onClick={() => this.editCar(index, vehicle)}>
                  <i className="fa fa-edit"></i>
                </a>
                <a className="icon-css" title="Delete" onClick={() => this.deleteCar(index, vehicle)}>
                  <i className="fa fa-trash"></i>
                </a>
              </td>
            </tr>
         ))
        }
        </tbody>
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
        <Modal
            header={null}
            width={250}
            visible={this.state.isVisible}
            closable={false}
            bodyStyle={{
              justifyContent: "center",
            }}
            footer={null}
            centered
          >
          <label>Do you want to delete the selected car?</label>
          <br></br><br></br>
          <div className="btnContainer">
            <Button className="btn-primary" onClick={() => this.deleteCarAndCloseModal()}>Yes</Button>
            <Button className="btn-secondary" onClick={() => this.closeModal()}>No</Button>
          </div>
      </Modal>
      </div>
      );
  }
}

export default ListVehicle;
