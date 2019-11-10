import React, { Component } from "react";
import "./Welcome.css";
import { Layout } from "antd";
const { Sider, Content } = Layout;

export default class Welcome extends Component {
  render() {
    return (
      <div>
        <Layout className="welcome-page">
          <Sider className="watt-about">
            <div className="watt">WATT</div>
            <div className="description">
              A decentralized electric vehicle charging station solution.
            </div>
          </Sider>
          <Content>test</Content>
        </Layout>
      </div>
    );
  }
}
