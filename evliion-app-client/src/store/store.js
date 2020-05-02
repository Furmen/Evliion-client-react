import React, { Component } from "react";
import { Modal, Form, Input, Typography, Select, Button, message, notification } from "antd";
import "./store.css";
import { addStore } from '../util/APIUtils'
import { MAP_API_V3_KEY } from '../constants';
import GoogleMapViewStore from "./mapStore";
import { searchCoordenates, searchCountriesAndStates } from "../util/APIUtils";

const FormItem = Form.Item;
const { Title } = Typography;
const uuidv4 = require("uuid/v4");
var that;
var storeIndex = -1;
var latitude;
var longitude;
var coordenates = [];

class AddEditStore extends Component {
  _isMounted = false;
  countries = [];
  states = [];

  state = {
    buttonDisabled: true,
    buttonLoading: false,
    name: "",
    city: "",
    state: "",
    country: "",
    address1: "",
    address2: "",
    mobile_number: "",
    store_type: "",
    latitude1: 0,
    longitude1: 0,
    latitude2: 0,
    longitude2: 0,
    isVisible: false
  };

  constructor(props) {
    super(props);
    this.stores_types = ["Charging", "Swapping"];
    that = props;
    storeIndex = props.location.state.store_index;

    if(this.countries.length === 0 || this.states.length === 0)
      this.getCountriesAndStates();
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

  handleSelectChange = value => {
    this.setState({ store_type: value });
  }

  handleSelectStateChange = value => {
    this.setState({ state: value });
  }

  handleSelectCountryChange = value => {
    this.setState({ country: value });
  }

  getCountriesAndStates() {
    searchCountriesAndStates()
    .then(response => {
      if(response.result && response.result.length > 0) {
        response.result.forEach(country => {
          this.countries.push(country.name);

          if(country.states && country.states.length > 0) {
            country.states.forEach(state => {
              this.states.push(state.name);
            });
          }
        });
      }

      this.setState({ state: this.state });
    });
  }

  searchCoordenatesByAddress(address) {
    searchCoordenates(address)
    .then(response => {
      if(response.results && response.results.length > 0) {
        let $data = response.results[0];

        coordenates.push({
          latitude: $data.geometry.location.lat,
          longitude: $data.geometry.location.lng
        });
      }
    });
  }
  
  sendAPIRequest = () => {
    this.setState({buttonLoading: true});

    const storeData = {
      user_id: 1234, // TODO use real user ID
      name: this.state.name.value,
      city: this.state.city.value,
      address1: this.state.address1.value,
      address2: this.state.address2.value,
      mobile_number: this.state.mobile_number.value,
      latitude1: this.state.latitude1,
      longitude1: this.state.longitude1,
      latitude2: this.state.latitude2,
      longitude2: this.state.longitude2,
      store_type: this.state.store_type,
      state: this.state.state,
      country: this.state.country,
      store_index: storeIndex
    }

    that.history.push('/store', { storeData });

    addStore(storeData)
      .then(res => message.info(res.message), 
      this.setState({buttonLoading: false}));
  };

  getCoordinate(event) {
    this.searchCoordenatesByAddress(event.currentTarget.value);
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
        this.state.country !== "" &&
        this.state.state !== "" &&
        this.state.address1.validateStatus === 'success' &&
        this.state.mobile_number.validateStatus === 'success' &&
        this.state.latitude1 !== 0 &&
        this.state.longitude1 !== 0);
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
            address1: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.address1
            },
            address2: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.address2 ? carStore.address2 : ""
            },
            state: carStore.state,
            country: carStore.country,
            store_type: carStore.store_type,
            mobile_number: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.mobile_number
            },
            latitude1: carStore.latitude1,
            longitude1: carStore.longitude1,
            latitude2: carStore.latitude2 ? carStore.latitude2 : "",
            longitude2: carStore.longitude2 ? carStore.longitude2 : "",
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
    this.state.latitude1 = coordenates[0].latitude;
    this.state.longitude1 = coordenates[0].longitude;

    if(coordenates[1]) {
      this.state.latitude2 = coordenates[1].latitude;
      this.state.longitude2 = coordenates[1].longitude;
    }
  }

  render() {
    return (
      <div className="new-addvehicle-container">
        {/* <div> */}
          <Title level={3}>{this.isEditMode() ? "Edit Store" : "Add Store"}</Title>
          <br />
          <Form onSubmit={this.handleSubmit} className="signup-form">
              <FormItem 
                label="Name"
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
              <FormItem label="Address Line 1"
                hasFeedback
                validateStatus={this.state.address1.validateStatus}
                help={this.state.address1.errorMsg}>
                <Input 
                  size="large"
                  name="address1" 
                  onBlur={(event) => this.getCoordinate(event)}
                  autoComplete="off"
                  placeholder="Address Line 1"
                  value={this.state.address1.value}
                  onChange={(event) => this.handleInputChange(event, this.validateAddress)} />
              </FormItem>
              <FormItem label="Address Line 2"
                hasFeedback
                validateStatus={this.state.address2.validateStatus}
                help={this.state.address2.errorMsg}>
                <Input 
                  size="large"
                  name="address2" 
                  onBlur={(event) => this.getCoordinate(event)}
                  autoComplete="off"
                  placeholder="Address Line 2"
                  value={this.state.address2.value}
                  onChange={(event) => this.handleInputChange(event, this.validateAddress2)} />
              </FormItem>
              <FormItem 
                label="City"
                hasFeedback
                validateStatus={this.state.city.validateStatus}
                help={this.state.city.errorMsg}>
                <Input 
                  size="large"
                  name="city"
                  autoComplete="off"
                  placeholder="City"
                  value={this.state.city.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateCity)} />    
              </FormItem>
              <FormItem 
                label="State"
                hasFeedback
                validateStatus="success"
                help={null}>
                <Select
                      defaultValue={that.location.state.storeEdit ? that.location.state.storeEdit.state : "State"}
                      size="large"
                      onChange={this.handleSelectStateChange}>
                      {this.states.map(e => (
                      <Select.Option value={e} key={uuidv4()}>
                        {e}
                      </Select.Option>
                  ))}
                </Select>
              </FormItem>
              <FormItem 
                label="Country"
                hasFeedback
                validateStatus="success"
                help={null}>
                <Select
                      defaultValue={that.location.state.storeEdit ? that.location.state.storeEdit.country : "Country"}
                      size="large"
                      onChange={this.handleSelectCountryChange}>
                      {this.countries.map(e => (
                    <Select.Option value={e} key={uuidv4()}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
              <FormItem 
                label="Mobile number"
                hasFeedback
                validateStatus={this.state.mobile_number.validateStatus}
                help={this.state.mobile_number.errorMsg}>
                <Input 
                  size="large"
                  name="mobile_number" 
                  type="mobile_number"
                  autoComplete="off"
                  placeholder="Mobile Number" 
                  value={this.state.mobile_number.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateMobileNumber)} />    
              </FormItem>
              <FormItem 
                label="Store Type"
                hasFeedback
                validateStatus="success"
                help={null}>
                <Select
                      defaultValue={that.location.state.storeEdit ? that.location.state.storeEdit.store_type : "Store Type"}
                      size="large"
                      onChange={this.handleSelectChange}>
                      {this.stores_types.map(e => (
                    <Select.Option value={e} key={uuidv4()}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
              <Title level={4}>Coordenates</Title>
              <Button type="primary" 
                htmlType="button" 
                size="default" 
                className="btn-coordenates"
                onClick={() => this.captureCoordenates()}>
                Load coordinates
              </Button>
              <div>
              <FormItem label="Latitude Address Line 1">
                <Input 
                  size="large"
                  disabled={true}
                  name="latitude1" 
                  type="text" 
                  autoComplete="off"
                  placeholder="Latitude"
                  value={this.state.latitude1} />    
              </FormItem>
              <FormItem label="Longitude Address Line 1">
                <Input 
                  size="large"
                  disabled={true}
                  name="longitude1" 
                  type="text"
                  autoComplete="off"
                  placeholder="Longitude " 
                  value={this.state.longitude1} />    
              </FormItem>
              <FormItem label="Latitude Address Line 2">
                <Input 
                  size="large"
                  disabled={true}
                  name="latitude2" 
                  type="text" 
                  autoComplete="off"
                  placeholder="Latitude"
                  value={this.state.latitude2} />
              </FormItem>
              <FormItem label="Longitude Address Line 2">
                <Input 
                  size="large"
                  disabled={true}
                  name="longitude2" 
                  type="text"
                  autoComplete="off"
                  placeholder="Longitude " 
                  value={this.state.longitude2} />
              </FormItem>
              </div>
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

  validateAddress2 = (value) => {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  validateMobileNumber = (mobile_number) => {
    if(isNaN(mobile_number)) {
        return {
            validateStatus: 'error',
            errorMsg: `Mobile Number must have only numbers.`
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