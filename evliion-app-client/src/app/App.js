import React, { Component } from "react";
import "./App.css";
import { Route, withRouter, Switch } from "react-router-dom";
import Routes from './routes'

import { getCurrentUser } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";

// import Profile from "../user/profile/Profile";
import AppHeader from "../common/AppHeader";

import LoadingIndicator from "../common/LoadingIndicator";


import { Layout, notification } from "antd";
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3,
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true,
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(
    redirectTo = "/",
    notificationType = "success",
    description = "You're successfully logged out."
  ) {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false,
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: "Evliion App",
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: "Evliion App",
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <Layout className="app-container" style={{ width: "100vw" }}>
        <AppHeader
          isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          onLogout={this.handleLogout}
        />
          <div
            className="container"
            style={{ marginTop: 0, marginBottom: 0, marginLeft: "auto", marginRight: "auto", padding: 0, width: "100vw",height: "100%" }}
          >
          {/* routes here */}
          <Routes 
                  currentUser={this.state.currentUser}
                  isAuthenticated={this.state.isAuthenticated} 
                  isLoading={this.state.isLoading}
                  handleLogout={this.handleLogout}
                  handleLogin={this.handleLogin}
          />
          </div>
      </Layout>
    );
  }
}

export default withRouter(App);
