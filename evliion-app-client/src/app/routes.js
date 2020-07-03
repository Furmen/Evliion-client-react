import React from "react";
import { Route, Switch } from "react-router-dom";
import Vehicle from "../vehicle/Vehicle";
import Store from "../store/listStore";
import AddEditStore from "../store/store";
import ListVehicle from "../vehicle/ListVehicle";
import GoogleMapView from "../EV/GoogleMapView/GoogleMapView";
import Profile from "../profile/Profile";
import NewPoll from "../EV/NewPoll";
import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import VerifyMobile from "../user/verifyMobile/verify_mobile";
import NotFound from "../common/NotFound";
import PrivateRoute from "../common/PrivateRoute";
import Welcome from "./Welcome/Welcome";
import { MAP_API_V3_KEY, ACCESS_TOKEN } from '../constants';
import ListInventory from "../inventory/ListInventory";
import Inventory from "../inventory/Inventory";
import { getAllStores } from '../util/APIUtils'
import { currentLocation } from '../util/Helpers'

var storesArr = [];

getAllStores().then(res => {
    res.content.forEach(store => {
        storesArr.push([
        {
            name: store.name,
            lat: store.address.lattitude,
            lng: store.address.longitude,
            id: store.id,
            address: store.address.line1,
            zipcode: store.address.zipCode,
            subCategory: store.subCategory,
            category: store.category
          }
      ]);
    });
    return storesArr;
});

const routes = props => {
  return (
    <Switch>
      <Route
        path="/map"
        render={props => (
          <GoogleMapView
            googleMapURL={MAP_API_V3_KEY}
            loadingElement={<div style={{ height: "100vh" }}></div>}
            containerElement={
              <div style={{ height: "100vh", width: "100vw" }}></div>
            }
            mapElement={<div style={{ height: "100vh" }}></div>}
            storesArr={storesArr}
            currentPosition={currentLocation()}
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
          !sessionStorage.getItem(ACCESS_TOKEN) ? (
            <Login />
          ) : (
            <Welcome />
          )
        }
      />
      <Route path="/login" component={Login}></Route>
      <Route path="/inventory" component={ListInventory}></Route>
      <Route path="/addinventory" component={Inventory}></Route>
      <Route path="/editinventory" component={Inventory}></Route>
      <Route path="/listvehicle" component={ListVehicle}></Route>
      <Route path="/vehicle" component={Vehicle}></Route>
      <Route path="/store" component={Store}></Route>
      <Route path="/addstore" component={AddEditStore}></Route>
      <Route path="/editstore" component={AddEditStore}></Route>
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