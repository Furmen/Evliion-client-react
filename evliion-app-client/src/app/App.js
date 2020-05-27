import React, { Component } from "react";
import "./App.css";
import { withRouter } from "react-router-dom";
import Routes from './routes'
import { getCurrentUser } from "../util/APIUtils";
import { ACCESS_TOKEN, CLAIM_USER } from "../constants";
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
      isLoading: false
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3,
    });

    this.checkStateOfLogin();  
  }

  checkStateOfLogin() {
    let that = this;

    var interval = setInterval(function() {
      if(localStorage.getItem(ACCESS_TOKEN)) {
        that.handleLogin();
        clearInterval(interval);
      }
    }, 100);
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true,
    });

    getCurrentUser()
      .then(response => {
        localStorage.setItem(CLAIM_USER, JSON.stringify(response));
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
    localStorage.removeItem(CLAIM_USER);

    this.setState({
      currentUser: null,
      isAuthenticated: false,
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: "Evliion App",
      description: description,
    });

    this.checkStateOfLogin();
  }

  handleLogin() {
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  checkItemMenu(key, arrayClassList) {
    let isActiveItem = false;
    for (let index = 0; index < arrayClassList.length; index++) {
      if(arrayClassList[index].indexOf(key.replace("/", "")) !== -1)
        isActiveItem = true;
    }

    return isActiveItem;
  }

  checkItemMenuState() {
    var menuItems = document.getElementsByClassName("ant-menu-item");
    for (let index = 0; index < menuItems.length; index++) {
      const menuItem = menuItems[index];
      let searcherKeyMenu = this.props.location.pathname === "/" ? "homeLink" : this.props.location.pathname;

      if(this.checkItemMenu(searcherKeyMenu, menuItem.children[0].classList)) {
        menuItem.children[0].style.color = "#1DA57A";
        menuItem.style.borderBottom = "2px solid #1DA57A";
      } else {
        menuItem.children[0].style.color = "black";
        menuItem.style.borderBottom = "0px";
      }
    }
  }

  render() {
    this.checkItemMenuState();

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
          <div className="container"
            style={{ marginTop: 0, 
                     marginBottom: 0, 
                     marginLeft: "auto", 
                     marginRight: "auto", 
                     padding: 0, 
                     width: "100vw",
                     height: "100%" }}>
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
