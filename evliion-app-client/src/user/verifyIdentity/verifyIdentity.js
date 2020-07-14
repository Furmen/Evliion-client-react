import React, { Component } from "react";
import "./verifyIdentity.css";
import { Form, Input, Typography, Button } from "antd";
import { CountryDropdown } from 'react-country-region-selector'
import { CLAIM_USER } from '../../constants';

const FormItem = Form.Item;
const { Title } = Typography;
const uuidv4 = require("uuid/v4");

class VerifyIdentity extends Component {
  state = {
    country: "",
    passport: "",
    identificationCard: "",
    driverLicence: ""
  };

  constructor(props) {
    super(props);
  }

  isFormInvalid() {
    return !(this.state.passport.validateStatus === 'success' &&
        this.state.identificationCard.validateStatus === 'success' &&
        this.state.driverLicence.validateStatus === 'success' &&
        this.state.country !== "");
  }

  selectCountry (val) {
    this.setState({ country: val });
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

  sendAPIRequest = () => {
    let currentUser = JSON.parse(sessionStorage.getItem(CLAIM_USER));
    const verifyData = {
      user_id: currentUser.id,
      country: this.state.country,
      passport: this.state.passport.value,
      identificationCard: this.state.identificationCard.value,
      driverLicence: this.state.driverLicence.value
    }
  };

  render() {
    return (
      <div className="new-addvehicle-container">
          <Title level={3}>Verify Identity</Title>
          <br />
          <Form onSubmit={this.handleSubmit} className="signup-form">
              <FormItem 
                label="Country">
                <CountryDropdown
                  className="ant-input ant-input-lg"
                  value={this.state.country}
                  onChange={(val) => this.selectCountry(val)} />
              </FormItem>
              <br /><br />
              <Title level={3}>Type</Title>
              <br />
              <FormItem 
                label="Passport"
                hasFeedback
                validateStatus={this.state.passport.validateStatus}
                help={this.state.passport.errorMsg}>
                <Input 
                  size="large"
                  name="passport"
                  autoComplete="off"
                  placeholder="Passport"
                  value={this.state.passport.value} 
                  onChange={(event) => this.handleInputChange(event, this.validatePassport)} />
              </FormItem>
              <FormItem 
                label="Identification card"
                hasFeedback
                validateStatus={this.state.identificationCard.validateStatus}
                help={this.state.identificationCard.errorMsg}>
                <Input 
                  size="large"
                  name="identificationCard"
                  autoComplete="off"
                  placeholder="Identification card"
                  value={this.state.identificationCard.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateIdentificationCard)} />
              </FormItem>
              <FormItem 
                label="Driver's licence"
                hasFeedback
                validateStatus={this.state.driverLicence.validateStatus}
                help={this.state.driverLicence.errorMsg}>
                <Input 
                  size="large"
                  name="driverLicence"
                  autoComplete="off"
                  placeholder="Driver's Licence"
                  value={this.state.driverLicence.value} 
                  onChange={(event) => this.handleInputChange(event, this.validateDriverLicence)} />
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
      </div>
    );
  }

    validatePassport = (value) => {
    if(!value || value.length === 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Passport is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }

  validateIdentificationCard = (value) => {
    if(!value || value.length === 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Identification Card is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }

  validateDriverLicence = (value) => {
    if(!value || value.length === 0) {
        return {
            validateStatus: 'error',
            errorMsg: "Driver's Licence is required"
        }
    } else {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };            
    }
  }
}
export default VerifyIdentity;
