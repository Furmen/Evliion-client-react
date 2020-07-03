import React, { Component } from "react";
import { Typography, Select, Button, Input, message, Form } from "antd";
import "./Inventory.css";
import {addInventory} from '../util/APIUtils'
import { MAP_API_V3_KEY, CLAIM_USER } from '../constants';

const FormItem = Form.Item;
const { Title } = Typography;
const uuidv4 = require("uuid/v4");
var that;
var inventoryIndex = -1;
var categories = ["Fruits", "Vegetables", "Grocery"];

class Inventory extends Component {
  _isMounted = false;
  categories = [];
  state = {
    buttonDisabled: true,
    buttonLoading: false,
    category: "",
    name: "",
    available: 0,
    rate: 0,
  };

  constructor(props) {
    super(props);
    that = props;
    inventoryIndex = props.location.state.inventory_index;
  }

  handleCategoryChange = value => {
    this.setState({
      category: value,
      buttonDisabled: value === "" || this.state.name === "" || this.state.rate <= 0 || this.state.available <= 0
    });
  };

  sendAPIRequest = () => {
    this.setState({buttonLoading: true});
    let currentUser = JSON.parse(sessionStorage.getItem(CLAIM_USER));

    const inventoryData = {
      user_id: currentUser.id,
      name: this.state.name.value,
      category: this.state.category,
      rate: this.state.rate.value,
      available: this.state.available.value,
      inventory_index: inventoryIndex
    }

    that.history.push('/inventory', { inventoryData });

    addInventory(inventoryData)
      .then(res => message.info(res.message), 
      this.setState({buttonLoading: false}));
  };

  backToTheList = () => {
    that.history.push('/inventory');
  }

  isEditMode() {
    return that.location.state && that.location.state.inventoryEdit;
  }

  componentDidMount() {
    this._isMounted = true;

    if(this.isEditMode()) {
      setTimeout(() => {
        if (this._isMounted) {
        let inventoryEdit = that.location.state.inventoryEdit;
        
        this.setState({
          name: {
            errorMsg: null,
            validateStatus: "success",
            value: inventoryEdit.name
          },
          category: inventoryEdit.category,
          rate: {
            errorMsg: null,
            validateStatus: "success",
            value: inventoryEdit.rate
          },
          available: {
            errorMsg: null,
            validateStatus: "success",
            value: inventoryEdit.available
          }
        });

        this.setState({ state: this.state });
      }
     }, 0);
    }
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

  selectCategory = value => {
    this.setState({category: value});
  }

  isFormInvalid() {
    return !(this.state.name.validateStatus === 'success' &&
        this.state.rate.validateStatus === 'success' &&
        this.state.available.validateStatus === 'success' &&
        this.state.category !== "");
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="new-addinventory-container">
        {/* <div> */}
          <Title level={3}>{this.isEditMode() ? "Edit Inventory" : "Add Inventory"}</Title>
          <br />
          <br />
          <Form onSubmit={this.handleSubmit} className="signup-form">
              <FormItem 
                label="Product Name"
                hasFeedback
                validateStatus={this.state.name.validateStatus}
                help={this.state.name.errorMsg}>
                <Input 
                  size="large"
                  name="name"
                  autoComplete="off"
                  placeholder="Product name"
                  value={this.state.name.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateName)} />
              </FormItem>
              <FormItem 
                label="Category">
                  <Select
                    defaultValue={this.isEditMode() ? that.location.state.inventoryEdit.category : "Category"}
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
                label="Available Quantity"
                hasFeedback
                validateStatus={this.state.available.validateStatus}
                help={this.state.available.errorMsg}>
                <Input 
                  size="large"
                  name="available"
                  autoComplete="off"
                  placeholder="Available quantity"
                  value={this.state.available.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateAvailable)} />
              </FormItem>
              <FormItem 
                label="Rate Per Unit"
                hasFeedback
                validateStatus={this.state.rate.validateStatus}
                help={this.state.rate.errorMsg}>
                <Input 
                  size="large"
                  name="rate"
                  type="number"
                  autoComplete="off"
                  placeholder="Rate per unit"
                  value={this.state.rate.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateRate)} />
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
        {/* </div> */}
      </div>
    );
  }

  validateName = (value) => {
    if(!value || value.length === 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Product Name is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }

  validateAvailable = (value) => {
    if(!value || value.length === 0 || value <= 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Available Quantity is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }

  validateRate = (value) => {
    if(!value || value.length === 0 || value <= 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Rate Per Unit is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }

}
export default Inventory;
