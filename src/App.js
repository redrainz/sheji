import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoRouter from './AutoRouter';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from 'react-router-dom';
import { Menu, Icon } from 'antd';
import './kanbanfront/assets/css/main.less';
const SubMenu = Menu.SubMenu;
class App extends Component {
  render() {
    return (
      <div>
        <div style={{ width: '100%', height: '46px', background: '#3f51b5' }} />
        <div style={{ display: 'flex' }}>
          <div id="menu">
            <Menu
              style={{ width: 240 }}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
            >
              <Menu.Item key="1">
                <Link to="/kanbanfront/userStoryMap">用户故事地图</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/kanbanfront/sprintManage">冲刺管理</Link>
              </Menu.Item>

              <Menu.Item key="3">
                <Link to="/kanbanfront/kanbanManage">看板管理</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/kanbanfront/labelManage">Label管理</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div style={{ flex: 1 }}>
            <AutoRouter />
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {};

export default App;
