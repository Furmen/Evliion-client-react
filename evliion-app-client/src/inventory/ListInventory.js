import React, { Component } from "../../node_modules/react";
import { Modal, Typography, Button } from "../../node_modules/antd";
import "./ListInventory.css";

const { Title } = Typography;
var that;
var inventories = [];
var sortConfig = {
  key: "name",
  direction: "ascending"
};
var indexForDeleteInventory = -1;

class ListInventory extends Component {
  constructor(props) {
    super(props);
    that = props;

    this.state = {
      isVisible: false,
    };

    //Check if state has values
    if(that.history.location.state) {
      //Delete inventory if is an edit mode
      if(that.history.location.state.inventoryData.inventory_index !== undefined &&
        that.history.location.state.inventoryData.inventory_index !== -1)
        inventories.splice(that.history.location.state.inventoryData.inventory_index, 1);

      //Check availability of the inventory
      if(!this.checkInventoryAvailability(that.history.location.state.inventoryData))
        inventories.push(that.history.location.state.inventoryData);
    }
  }

  sendToNewInventory() {
    that.history.push('/addinventory', { currentUser: that.currentUser })
  }

  checkInventoryAvailability(inventoryDetail) {
    var existInventory = inventories.filter((item, index) => { 
      if(inventoryDetail.name === item.name &&
        inventoryDetail.available === item.available &&
        inventoryDetail.rate === item.rate)
        return item;
    });

    return existInventory.length > 0;
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
      inventories.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return inventories;
  }  

  editInventory(index, inventory) {
    that.history.push('/editinventory', 
      { 
        currentUser: that.currentUser, 
        inventoryEdit: inventory, 
        inventory_index: index 
      })
  }

  deleteInventory(index, inventory) {
    indexForDeleteInventory = index;
    this.setState({ isVisible: true });
  }

  closeModal() {
    this.setState({ isVisible: false });
  }

  deleteInventoryAndCloseModal() {
    inventories.splice(indexForDeleteInventory, 1);
    indexForDeleteInventory = -1;
    this.setState({ isVisible: false });
  }

  render() {
    let table;
    if(inventories.length > 0) {
      this.useSortableData();

      table = <table>
      <thead>
        <tr>
          <th>
          <button
                type="button"
                onClick={() => this.requestSort('id')}
                className={this.getClassNamesFor('id')}>
                Inventory Number
              </button>
          </th>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('name')}
                className={this.getClassNamesFor('name')}>
                Product Name
              </button>
          </th>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('available')}
                className={this.getClassNamesFor('available')}>
                Available Quantity
              </button>
          </th>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('rate')}
                className={this.getClassNamesFor('rate')}>
                Rate per unit
              </button>
          </th>
          <th>
            Actions
          </th>
        </tr>
      </thead>
        <tbody>
        {
          inventories.map((inventory, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{inventory.name}</td>
              <td>{inventory.available}</td>
              <td>{inventory.rate}</td>
              <td>
                <a className="icon-css" title="Edit" onClick={() => this.editInventory(index, inventory)}>
                  <i className="fa fa-edit"></i>
                </a>
                <a className="icon-css" title="Delete" onClick={() => this.deleteInventory(index, inventory)}>
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
            <td>No inventories</td>
          </tr>
        </tbody>
      </table>;
    }

      return (
      <div className="new-addinventory-container">
        <Title level={3}>List of Inventories</Title>
        <br />
        <br />
        {table}
        <br />
        <br />
        <Button
            id="btnNewInventory"
            type="primary"
            onClick={this.sendToNewInventory}
            size="large">
          New Inventory
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
          <label>Do you want to delete the selected inventory?</label>
          <br></br><br></br>
          <div className="btnContainer">
            <Button className="btn-primary" onClick={() => this.deleteInventoryAndCloseModal()}>Yes</Button>
            <Button className="btn-secondary" onClick={() => this.closeModal()}>No</Button>
          </div>
      </Modal>
      </div>
      );
  }
}

export default ListInventory;
