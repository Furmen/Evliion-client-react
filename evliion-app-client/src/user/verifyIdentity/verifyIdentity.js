import React, { Component } from "react";
import "./verifyIdentity.css";
import { Form, Typography, Button, Select } from "antd";
import { CountryDropdown } from 'react-country-region-selector'
import { CLAIM_USER } from '../../constants';

const FormItem = Form.Item;
const { Title } = Typography;
const uuidv4 = require("uuid/v4");

var types = ['Document-Passport', 'Identification Document', 'Driving Licence'];

class VerifyIdentity extends Component {
  state = {
    country: "",
    type: ""
  };

  isFormInvalid() {
    return !(this.state.type !== "" && this.state.country !== "");
  }

  selectCountry (val) {
    this.setState({ country: val });
  }

  selectType = value => {
    this.setState({type: value});
  }

  sendAPIRequest = () => {
    //let currentUser = JSON.parse(sessionStorage.getItem(CLAIM_USER));
    // const verifyData = {
    //   user_id: currentUser.id,
    //   country: this.state.country,
    //   type: this.state.passport.value
    // }
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
              <FormItem 
                label="Type">
                  <Select
                    size="large"
                    onChange={this.selectType}>
                      {types.map(e => (
                        <Select.Option value={e} key={uuidv4()}>
                          {e}
                        </Select.Option>
                      ))}
                  </Select>
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
}
export default VerifyIdentity;
