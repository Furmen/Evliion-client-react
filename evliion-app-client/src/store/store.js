import React, { Component } from "react";
import { Form, Input, Typography, Select, Button, message } from "antd";
import "./store.css";
import { addStore } from '../util/APIUtils'

const FormItem = Form.Item;
const { Title } = Typography;
const uuidv4 = require("uuid/v4");
var that;
var storeIndex = -1;

class AddEditStore extends Component {
  _isMounted = false;

  state = {
    buttonDisabled: true,
    buttonLoading: false,
    name: "",
    address: "",
    mobile_number: "",
    store_type: "",
    lattitud: "",
    longitud: ""
  };

  constructor(props) {
    super(props);
    this.stores_types = ["Charging", "Swapping"];
    that = props;
    storeIndex = props.location.state.store_index;
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

  sendAPIRequest = () => {
    this.setState({buttonLoading: true});

    const storeData = {
      user_id: 1234, // TODO use real user ID
      name: this.state.name.value,
      address: this.state.address.value,
      mobile_number: this.state.mobile_number.value,
      lattitud: this.state.lattitud.value,
      longitud: this.state.longitud.value,
      store_type: this.state.store_type,
      store_index: storeIndex
    }

    that.history.push('/store', { storeData });

    addStore(storeData)
      .then(res => message.info(res.message), 
      this.setState({buttonLoading: false}));
  };

  backToTheList = () => {
    that.history.push('/store');
  }

  isEditMode() {
    return that.location.state && that.location.state.storeEdit;
  }

  isFormInvalid() {
    return !(this.state.name.validateStatus === 'success' &&
        this.state.address.validateStatus === 'success' &&
        this.state.mobile_number.validateStatus === 'success' &&
        this.state.lattitud.validateStatus === 'success' &&
        this.state.longitud.validateStatus === 'success'
    );
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
            address: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.address
            },
            store_type: carStore.store_type,
            mobile_number: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.mobile_number
            },
            lattitud: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.lattitud
            },
            longitud: {
              errorMsg: null,
              validateStatus: "success",
              value: carStore.longitud
            },
            buttonDisabled: false
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
              <FormItem label="Address"
                            hasFeedback
                            validateStatus={this.state.address.validateStatus}
                            help={this.state.address.errorMsg}>
                            <Input 
                                size="large"
                                name="address" 
                                autoComplete="off"
                                placeholder="Store address"
                                value={this.state.address.value}
                                onChange={(event) => this.handleInputChange(event, this.validateAddress)} />
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
                            hasFeedback>
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
              <FormItem 
                            label="Lattitud"
                            hasFeedback
                            validateStatus={this.state.lattitud.validateStatus}
                            help={this.state.lattitud.errorMsg}>
                            <Input 
                                size="large"
                                name="lattitud" 
                                type="text" 
                                autoComplete="off"
                                placeholder="Lattitud"
                                value={this.state.lattitud.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateLattitud)} />    
                        </FormItem>
              <FormItem 
                            label="Longitud"
                            hasFeedback
                            validateStatus={this.state.longitud.validateStatus}
                            help={this.state.longitud.errorMsg}>
                            <Input 
                                size="large"
                                name="longitud" 
                                type="text"
                                autoComplete="off"
                                placeholder="Longitud" 
                                value={this.state.longitud.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateLongitud)} />    
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

  validateLattitud = (value) => {
    if(!value || value.length === 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Lattitud is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }

  validateLongitud = (value) => {
    if(!value || value.length === 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Longitud is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
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