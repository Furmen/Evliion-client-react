import React, { Component } from "react";
import { Modal, Form, Input, Typography, Button, Select, message, notification } from "antd";
import "./store.css";
import { addStore } from '../util/APIUtils'
import { MAP_API_V3_KEY, CLAIM_USER } from '../constants';
import GoogleMapViewStore from "./mapStore";
import { searchCoordenates } from "../util/APIUtils";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'

const FormItem = Form.Item;
const { Title } = Typography;
const uuidv4 = require("uuid/v4");
var that;
var storeIndex = -1;
var latitude;
var longitude;
var coordenates = [];
var categories = ['Grocery', 'Bakery', 'Medical', 'Fruits', 'Vegetables'];

class AddEditStore extends Component {
  _isMounted = false;

  state = {
    buttonDisabled: true,
    buttonLoading: false,
    name: "",
    city: "",
    state: "",
    country: "",
    address: "",
    additional: "",
    zipcode: "",
    category: "",
    subCategory: "",
    latitude: 0,
    longitude: 0,
    isVisible: false
  };

  constructor(props) {
    super(props);
    that = props;
    storeIndex = props.location.state.store_index;
    let ctxComponent = this;
    setTimeout(function () {
      if(ctxComponent.isEditMode()) {
        let carStore = that.location.state.storeEdit;
        ctxComponent.selectRegion (carStore.state);
      }
    }, 500);
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;        
    const inputValue = target.value;

    this.setState({
        [inputName] : {
            value: inputValue,
            ...validationFun(inputValue)
        }
    });
  }

  handleInputWithoutValidationChange(event) {
    const target = event.target;
    const inputName = target.name;        
    const inputValue = target.value;
    this.setState({ [inputName] : inputValue });
  }

  selectCategory = value => {
    this.setState({category: value});
  }

  selectCountry (val) {
    this.setState({ country: val });
  }

  selectRegion (val) {
    this.setState({ state: val });
  }

  searchCoordenatesByAddress(address) {
    var response = searchCoordenates(address)
    if(response && response.results && response.results.length > 0) {
      let $data = response.results[0];
      coordenates = [];
      coordenates.push({
        latitude: $data.geometry.location.lat,
        longitude: $data.geometry.location.lng
      });
    }
  }
  
  sendAPIRequest = () => {
    this.setState({buttonLoading: true});
    
    let currentUser = JSON.parse(sessionStorage.getItem(CLAIM_USER));
    const storeData = {
      user_id: currentUser.id, // TODO use real user ID
      name: this.state.name.value,
      city: this.state.city.value,
      address: this.state.address.value,
      additional: this.state.additional,
      zipcode: this.state.zipcode.value,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      category: this.state.category,
      subCategory: this.state.subCategory,
      state: this.state.state,
      country: this.state.country,
      store_index: storeIndex
    }

    addStore(this.toAPIJsonFormat(storeData))
      .then(res => 
        message.info(res.message), 
        this.setState({buttonLoading: false}),
        that.history.push('/store', { storeData })
      );
  };

  toAPIJsonFormat(storeData) {
    return {
      address:{
        city: storeData.city,
        country: storeData.country,
        lattitude: parseFloat(storeData.latitude),
        line1: storeData.address,
        line2: storeData.additional, 
        longitude: parseFloat(storeData.longitude),
        state: storeData.state,
        zipCode: storeData.zipcode
      },
      category: storeData.category,
      name: storeData.name, 
      subCategory: storeData.subCategory
    };
  }

  getCoordinate(event, source) {
    var finalAddress = this.state.address.value + ' ';
    finalAddress += this.state.city.value + ' '
    finalAddress += this.state.state.value + ' ';
    finalAddress += this.state.country.value;
    this.searchCoordenatesByAddress(finalAddress);
  }

  captureCoordenates() {
    this.setState({ isVisible: true });
  }

  backToTheList = () => {
    that.history.push('/store');
  }

  isEditMode() {
    return that.location.state && that.location.state.storeEdit;
  }

  isFormInvalid() {
    return !(this.state.name.validateStatus === 'success' &&
        this.state.city.validateStatus === 'success' &&
        this.state.address.validateStatus === 'success' &&
        this.state.zipcode.validateStatus === 'success' &&
        this.state.category !== "" &&
        this.state.country !== "" &&
        this.state.state !== "" &&
        this.state.latitude !== 0 &&
        this.state.longitude !== 0);
  }

  componentDidMount() {
    this._isMounted = true;

    if(this.isEditMode()) {
      setTimeout(() => {
        if (this._isMounted) {
          let carStore = that.location.state.storeEdit;
          this.setState({
            user_id: carStore.user_id,
            name: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.name
            },
            city: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.city
            },
            address: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.address
            },
            additional: carStore.additional,
            state: carStore.state,
            country: carStore.country,
            category: carStore.category,
            subCategory: carStore.subCategory,
            zipcode: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.zipcode
            },
            latitude: carStore.latitude,
            longitude: carStore.longitude,
            buttonDisabled: false
          });

          this.setState({ state: this.state });
      }
     }, 0);
    }

    if (!"geolocation" in navigator) {
      notification.info({
        message: 'Evliion App',
        description: "You must activate the geolocation in your browser!",
      }); 
    } else {
      navigator.geolocation.getCurrentPosition(function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  closeModal() {
    this.setState({ isVisible: false });
  }

  saveCoordinates() {
    this.setState({ isVisible: false });
    this.state.latitude = coordenates[0].latitude;
    this.state.longitude = coordenates[0].longitude;
  }

  render() {
    const { country, state } = this.state;
    return (
      <div className="new-addvehicle-container">
        {/* <div> */}
          <Title level={3}>{this.isEditMode() ? "Edit Store" : "Add Store"}</Title>
          <br />
          <Form onSubmit={this.handleSubmit} className="signup-form">
              <FormItem 
                label="Store Name"
                hasFeedback
                validateStatus={this.state.name.validateStatus}
                help={this.state.name.errorMsg}>
                <Input 
                  size="large"
                  name="name"
                  autoComplete="off"
                  placeholder="Store name"
                  value={this.state.name.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateName)} />
              </FormItem>
              <FormItem label="Address"
                hasFeedback
                validateStatus={this.state.address.validateStatus}
                help={this.state.address.errorMsg}>
                <Input 
                  size="large"
                  name="address" 
                  onBlur={(event) => this.getCoordinate(event, 'address')}
                  autoComplete="off"
                  placeholder="Address Line"
                  value={this.state.address.value}
                  onChange={(event) => this.handleInputChange(event, this.validateAddress)} />
              </FormItem>
              <FormItem label="Additional Details">
                <textarea 
                  size="large"
                  className="ant-input ant-input-lg cto--ta"
                  name="additional" 
                  autoComplete="off"
                  placeholder="Additional Details"
                  value={this.state.additional}
                  onChange={(event) => this.handleInputWithoutValidationChange(event)} />
              </FormItem>
              <FormItem 
                label="Country">
                <CountryDropdown
                  className="ant-input ant-input-lg"
                  value={country}
                  onBlur={(event) => this.getCoordinate(event, 'country')}
                  onChange={(val) => this.selectCountry(val)} />
              </FormItem>
              <FormItem 
                label="State">
                <RegionDropdown
                  className="ant-input ant-input-lg"
                  onBlur={(event) => this.getCoordinate(event, 'state')}
                  country={country}
                  value={state}
                  onChange={(val) => this.selectRegion(val)} />
              </FormItem>
              <FormItem
                label="City"
                hasFeedback
                validateStatus={this.state.city.validateStatus}
                help={this.state.city.errorMsg}>
                <Input 
                  size="large"
                  name="city"
                  onBlur={(event) => this.getCoordinate(event, 'city')}
                  autoComplete="off"
                  placeholder="City"
                  value={this.state.city.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateCity)} />    
              </FormItem>
              <FormItem 
                label="Zipcode"
                hasFeedback
                validateStatus={this.state.zipcode.validateStatus}
                help={this.state.zipcode.errorMsg}>
                <Input 
                  size="large"
                  name="zipcode" 
                  type="zipcode"
                  autoComplete="off"
                  placeholder="Zipcode" 
                  value={this.state.zipcode.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateZipCode)} />    
              </FormItem>
              <Title level={4}>Coordenates</Title>
              <Button type="primary" 
                htmlType="button" 
                size="default" 
                className="btn-coordenates"
                onClick={() => this.captureCoordenates()}>
                Load coordinates
              </Button>
              <FormItem label="Latitude">
                <Input 
                  size="large"
                  disabled={true}
                  name="latitude" 
                  type="text" 
                  autoComplete="off"
                  placeholder="Latitude"
                  value={this.state.latitude} />    
              </FormItem>
              <FormItem label="Longitude">
                <Input 
                  size="large"
                  disabled={true}
                  name="longitude" 
                  type="text"
                  autoComplete="off"
                  placeholder="Longitude " 
                  value={this.state.longitude} />
              </FormItem>
              <FormItem 
                label="Category">
                  <Select
                    defaultValue={this.isEditMode() ? that.location.state.storeEdit.category : "Category"}
                    size="large"
                    onChange={this.selectCategory}>
                      {categories.map(e => (
                        <Select.Option value={e} key={uuidv4()}>
                          {e}
                        </Select.Option>
                      ))}
                  </Select>
              </FormItem>
              <FormItem 
                label="Sub Category">
                <Input 
                  size="large"
                  name="subCategory"
                  autoComplete="off"
                  placeholder="Sub Category"
                  value={this.state.subCategory}
                  onChange={(event) => this.handleInputWithoutValidationChange(event)} />
              </FormItem>
              <FormItem>
                <Button type="primary" 
                  htmlType="submit" 
                  size="large" 
                  className="signup-form-button"
                  onClick={this.sendAPIRequest}
                  disabled={this.isFormInvalid()}>
                  Save
                </Button>
              </FormItem>
            </Form>
          <div className="ctr-aligment">
            <a id="backToList" onClick={this.backToTheList}>
              Back to List
            </a>
          </div>
          <Modal
                header={null}
                width={"54vw"}
                visible={this.state.isVisible}
                closable={false}
                bodyStyle={{
                  justifyContent: "center",
                }}
                footer={null}
                centered>
                  <GoogleMapViewStore
                      latitude={latitude}
                      longitude={longitude}
                      coordenates={coordenates}
                      googleMapURL={MAP_API_V3_KEY}
                      loadingElement={<div style={{ height: "50vh" }}></div>}
                      containerElement={
                        <div style={{ height: "50vh", width: "50vw" }}></div>
                      }
                    mapElement={<div style={{ height: "50vh" }}></div>}
                  />
              <div className="btnContainer btnContainer-map">
                <Button className="btn-primary" onClick={() => this.saveCoordinates()}>Ok</Button>
                <Button className="btn-secondary" onClick={() => this.closeModal()}>Cancel</Button>
              </div>
          </Modal>
      </div>
    );
  }

  validateName = (value) => {
    if(!value || value.length === 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Name is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }

  validateCity = (value) => {
    if(!value || value.length === 0) {
        return {
            validateStatus: 'error',
            errorMsg: "City is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }

  validateAddress = (value) => {
    if(!value || value.length === 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Address is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }

  validateZipCode = (zipcode) => {
    if(isNaN(zipcode)) {
        return {
            validateStatus: 'error',
            errorMsg: `Zipcode must have only numbers.`
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }
}

export default AddEditStore;