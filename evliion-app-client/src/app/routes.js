import React from "react";
import { Route, withRouter, Switch } from "react-router-dom";

import AddVehicle from "../EV/AddVehicle";
import MapView from "../EV/MapView/MapView";
import GoogleMapView from "../EV/GoogleMapView/GoogleMapView";
import Profile from "../profile/Profile";
import NewPoll from "../EV/NewPoll";
import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import VerifyMobile from "../user/verifyMobile/verify_mobile";
import NotFound from "../common/NotFound";
import PrivateRoute from "../common/PrivateRoute";
import Welcome from "./Welcome/Welcome";

const routes = props => {
  return (
    <Switch>
      <Route
        path="/map"
        render={props => (
          <GoogleMapView
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
            loadingElement={<div style={{ height: "100vh" }}></div>}
            containerElement={
              <div style={{ height: "100vh", width: "100vw" }}></div>
            }
            mapElement={<div style={{ height: "100vh" }}></div>}
          />
        )}
      />
      <Route
        path="/profile"
        render={props => <Profile props={props.currentUser} />}
      />
      <Route
        exact
        path="/"
        render={props =>
          props.isAuthenticated ? (
            <AddVehicle
              isAuthenticated={props.isAuthenticated}
              currentUser={props.currentUser}
              handleLogout={props.handleLogout}
              {...props}
            />
          ) : (
            <Welcome />
          )
        }
      />
      <Route
        path="/login"
        render={props => <Login onLogin={props.handleLogin} {...props} />}
      ></Route>
      <Route path="/signup" component={Signup}></Route>
      <Route path="/verify-mobile" component={VerifyMobile}></Route>
      <Route
        path="/users/:username"
        render={props => (
          <Profile
            isAuthenticated={props.isAuthenticated}
            currentUser={props.currentUser}
            {...props}
          />
        )}
      ></Route>
      <PrivateRoute
        authenticated={props.isAuthenticated}
        path="/EV/new"
        component={NewPoll}
        handleLogout={props.handleLogout}
      ></PrivateRoute>
      <Route component={NotFound}></Route>
    </Switch>
  );
};

export default routes;
