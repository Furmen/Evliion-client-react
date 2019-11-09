import React, { Component } from "react";
import { Typography, Input } from "antd";
import "./Profile.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    // TODO replace with requests
    name: "Ba",
    email: "santiagogregoryl@gmail.com",
    id: 9503234759,
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
            <h1 className="user-name">{this.state.name}</h1>
            <p>{this.state.email}</p>
            <p>{this.state.id}</p>
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

        <b onClick={this.handleEditClick} className="edit">
          Click Me
        </b>
      </div>
    );
  }
}
