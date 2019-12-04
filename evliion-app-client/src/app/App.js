import React, { Component } from "react";
import "./App.css";
import { Route, withRouter, Switch } from "react-router-dom";

import { getCurrentUser } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";

import AddVehicle from "../EV/AddVehicle";
import MapView from "../EV/MapView/MapView";
import GoogleMapView from "../EV/GoogleMapView/GoogleMapView";
import Profile from "../profile/Profile";
import NewPoll from "../EV/NewPoll";
import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import VerifyMobile from "../user/verifyMobile/verify_mobile";
// import Profile from "../user/profile/Profile";
import AppHeader from "../common/AppHeader";
import NotFound from "../common/NotFound";
import LoadingIndicator from "../common/LoadingIndicator";
import PrivateRoute from "../common/PrivateRoute";
import Welcome from "./Welcome";

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
        <Content className="app-content">
          <div
            className="container"
            style={{ margin: 0, padding: 0, width: "100vw" }}
          >
            <Switch>
              <Route
                path="/map"
                render={props => (
                  <GoogleMapView
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                    loadingElement={<div style={{height: "100vh"}}></div>}
                    containerElement={<div style={{height: "100vh",width: "100vw"}}></div>}
                    mapElement={<div style={{height: "100vh"}}></div>}
                  />
                )}
              />
              <Route
                path="/profile"
                render={props => <Profile props={this.state.currentUser} />}
              />
              <Route
                exact
                path="/"
                render={props =>
                  this.state.isAuthenticated ? (
                    <AddVehicle
                      isAuthenticated={this.state.isAuthenticated}
                      currentUser={this.state.currentUser}
                      handleLogout={this.handleLogout}
                      {...props}
                    />
                  ) : (
                    <Welcome />
                  )
                }
              />
              <Route
                path="/login"
                render={props => (
                  <Login onLogin={this.handleLogin} {...props} />
                )}
              ></Route>
              <Route path="/signup" component={Signup}></Route>
              <Route path="/verify-mobile" component={VerifyMobile}></Route>
              <Route
                path="/users/:username"
                render={props => (
                  <Profile
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <PrivateRoute
                authenticated={this.state.isAuthenticated}
                path="/EV/new"
                component={NewPoll}
                handleLogout={this.handleLogout}
              ></PrivateRoute>
              <Route component={NotFound}></Route>
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);
