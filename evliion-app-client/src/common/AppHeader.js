import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import { ACCESS_TOKEN } from "../constants";
import { Layout, Menu, Icon, Drawer, Button } from 'antd';
import {isMobile} from 'react-device-detect';

const { SubMenu } = Menu;
const Header = Layout.Header;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   

        this.handleMenuClick = this.handleMenuClick.bind(this);

        this.state = {
          visible: false
        }
    }

    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };

    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if(sessionStorage.getItem(ACCESS_TOKEN)) {
          menuItems = [
            <Menu.Item key="/" title="Home"><Link to="/" className="homeLink"><Icon type="home" className="nav-icon" /></Link></Menu.Item>,
            // <Menu.Item key="/EV/new"><Link to="/EV/new" className="new"><img src={pollIcon} alt="poll" className="poll-icon" /></Link></Menu.Item>,
            <Menu.Item key="/map" title="Map"><Link to="/map" className="map"><Icon type="global" className="nav-icon" /></Link></Menu.Item>,
            <Menu.Item key="/store" title="Store"><Link to="/store" className="store addstore editstore"><Icon type="shop" className="nav-icon" /></Link></Menu.Item>,
            <Menu.Item key="/inventory" title="Inventory"><Link to="/inventory" className="inventory addinventory editinventory"><Icon type="solution" className="nav-icon" /></Link></Menu.Item>,
            <Menu.Item key="/verify-identity" title="Verify Identity"><Link to="/verify-identity" className="Verify Identity"><Icon type="user" className="nav-icon" /></Link></Menu.Item>,
            <SubMenu key="/profile/user" title={<IconProfile />} onClick={this.handleMenuClick}>
               <Menu.ItemGroup title={this.props.currentUser ? this.props.currentUser.name : "" }>
                 <Menu.Item key="profile" className="dropdown-item">
                   <Link to={`/users/${this.props.currentUser ? this.props.currentUser.username : ""}`}>Profile</Link>
                 </Menu.Item>
                 <Menu.Item key="complete-identification" className="dropdown-item">
                   <Link to={`/complete-identification`}>Identification</Link>
                 </Menu.Item>
                 <Menu.Item key="logout" className="dropdown-item">
                   Logout
                </Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
          ]; 

          if (!isMobile) {
              return (
                <Header className="app-header">
                <div className="container">
                  <div className="app-title" >
                    <Link to="/">
                    <svg fill="#1890ff" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path  d="M3,22V8H7V22H3M10,22V2H14V22H10M17,22V14H21V22H17Z" />
                    </svg> Evilion
                    </Link>
                  </div>
                  <Menu
                    className="app-menu"
                    mode="horizontal"
                    selectedKeys={[this.props.location.pathname]}
                    style={{ lineHeight: '64px' }} >
                      {menuItems}
                  </Menu>
                </div>
              </Header>
            );
          } else {
            return (
                <Header className="app-header">
                <nav className="menuBar">
                  <div className="menuCon">
                    <Button className="barsMenu" type="primary" onClick={this.showDrawer}>
                      <Icon type="home" className="nav-icon" />
                    </Button>
                    <Drawer
                      title="Evilion"
                      placement="left"
                      closable={false}
                      onClose={this.onClose}
                      visible={this.state.visible}>
                      <Menu
                        className="app-menu"
                        mode="vertical"
                        selectedKeys={[this.props.location.pathname]}
                        style={{ lineHeight: '64px' }} >
                          {menuItems}
                      </Menu>
                    </Drawer>
                  </div>
                </nav>
              </Header>
            );
          }
        } else {
          return (
            <Header className="app-header">
            <div className="container">
              <div className="app-title" >
                <Link to="/">Evilion</Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }}>
              </Menu>
            </div>
          </Header>
        );
        }
    }
}

function IconProfile() {
  return (
    <span>
        <Icon type="user" className="nav-icon" style={{marginRight: 0}} />&nbsp;&nbsp;&nbsp;<Icon type="down" style={{fontSize: 10}} />
    </span>
  );
}

export default withRouter(AppHeader);