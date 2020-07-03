import React, { Component } from "react";
import { Input } from "antd";
import {CLAIM_USER} from '../constants';
import "./Profile.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    name: sessionStorage.getItem(CLAIM_USER).name,
    email: sessionStorage.getItem(CLAIM_USER).email,
    id: sessionStorage.getItem(CLAIM_USER).id,
    isEditing: false
  };

  handleEditClick = () => {
    this.setState({ isEditing: !this.state.isEditing });
  };

  render() {
    return (
      <div>
        {!this.state.isEditing ? (
          <div>
            <div class="user-info">
              <h1 className="user-name">{this.state.name}</h1>
              <div>{this.state.email}</div>
              <div>{this.state.id}</div>
            </div>
            <div className="edit-information">
              <b onClick={this.handleEditClick} className="edit">
                EDIT
              </b>
              <b onClick={this.handleEditClick} className="edit">
                LOGOUT
              </b>
            </div>
          </div>
        ) : (
          <div class="edit-information">
            <Input
              defaultValue={this.state.name}
              style={{ width: this.state.name.length * 10 + 50 }}
            />
            <br />
            <br />
            <Input defaultValue={this.state.email} style={{ width: 50 }} />
          </div>
        )}
      </div>
    );
  }
}
