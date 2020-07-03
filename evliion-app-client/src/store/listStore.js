import React, { Component } from "react";
import { Modal, Typography, Button } from "antd";
import "./listStore.css";
import { getAllStores, deleteStore } from '../util/APIUtils'

const { Title } = Typography;
var that;
var stores = [];
var sortConfig = {
  key: "model",
  direction: "ascending"
};
var indexForDeleteStore = -1;

class ListStore extends Component {
  constructor(props) {
    super(props);
    that = props;

    this.state = {
      isVisible: false,
    };

    stores = [];

    getAllStores().then(res => {
        res.content.forEach(store => {
          stores.push({
            id: store.id,
            name: store.name,
            address: store.address.line1,
            zipcode: store.address.zipCode,
            latitude: store.address.lattitude,
            longitude: store.address.longitude,
            subCategory: store.subCategory,
            category: store.category
          });
        });

        this.requestSort('id');
        this.setState({ state: this.state });
    });

    // if(that.history.location.state) {
    //   let indexToCheck = that.history.location.state.storeData.store_index;
    
    //   if(indexToCheck !== undefined && indexToCheck !== -1)
    //     stores.splice(indexToCheck, 1);
    
    //   if(!this.checkStoreAvailability(that.history.location.state.storeData))
    //     stores.push(that.history.location.state.storeData);
    // }
  }

  sendToNewStore() {
    that.history.push('/addstore', { currentUser: that.currentUser })
  }

  checkStoreAvailability(storeDetail) {
    var existStore = stores.filter((item, index) => { 
      if(storeDetail.name === item.name &&
        storeDetail.address === item.address &&
        storeDetail.zipcode === item.zipcode &&
        storeDetail.latitude === item.latitude &&
        storeDetail.longitude === item.longitude &&
        storeDetail.subCategory === item.subCategory &&
        storeDetail.category === item.category)
        return item;
    });

    return existStore.length > 0;
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
      stores.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return stores;
  }  

  editStore(index, store) {
    that.history.push('/editstore', 
      { 
        currentUser: that.currentUser, 
        storeEdit: store, 
        store_index: index 
      })
  }

  deleteStore(index, store) {
    indexForDeleteStore = store.id;
    this.setState({ isVisible: true });
  }

  closeModal() {
    this.setState({ isVisible: false });
  }

  deleteStoreAndCloseModal() {
    deleteStore(indexForDeleteStore).then(res => {
        indexForDeleteStore = -1;
        this.setState({ isVisible: false });
    });
  }

  render() {
    let table;
    if(stores.length > 0) {
      this.useSortableData();

      table = <table>
      <thead>
        <tr>
          <th>
          <button
                type="button"
                onClick={() => this.requestSort('id')}
                className={this.getClassNamesFor('id')}>
                Id
              </button>
          </th>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('category')}
                className={this.getClassNamesFor('category')}>
                Category
              </button>
          </th>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('name')}
                className={this.getClassNamesFor('name')}>
                Name
              </button>
          </th>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('address')}
                className={this.getClassNamesFor('address')}>
                Address
              </button>
          </th>
          <th>
            <button
                type="button"
                onClick={() => this.requestSort('zipcode')}
                className={this.getClassNamesFor('zipcode')}>
                Zipcode
              </button>
          </th>
          <th>
            Actions
          </th>
        </tr>
      </thead>
        <tbody>
        {
          stores.map((store, index) => (
            <tr key={index}>
              <td>{store.id}</td>
              <td>{store.category}</td>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.zipcode}</td>
              <td>
                <a className="icon-css" title="Edit" onClick={() => this.editStore(index, store)}>
                  <i className="fa fa-edit"></i>
                </a>
                <a className="icon-css" title="Delete" onClick={() => this.deleteStore(index, store)}>
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
            <td>No stores</td>
          </tr>
        </tbody>
      </table>;
    }

      return (
      <div className="new-addvehicle-container">
        <Title level={3}>List of Stores</Title>
        <br />
        <br />
        {table}
        <br />
        <br />
        <Button
            id="btnNewVechicle"
            type="primary"
            onClick={this.sendToNewStore}
            size="large">
          New Store
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
          <label>Do you want to delete the selected store?</label>
          <br></br><br></br>
          <div className="btnContainer">
            <Button className="btn-primary" onClick={() => this.deleteStoreAndCloseModal()}>Yes</Button>
            <Button className="btn-secondary" onClick={() => this.closeModal()}>No</Button>
          </div>
      </Modal>
      </div>
      );
  }
}

export default ListStore;
