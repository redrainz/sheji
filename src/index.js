import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link
} from 'react-router-dom';
import KANBANFRONTIndex from './kanbanfront/containers/KANBANFRONTIndex';
import KANBANMANAGEIndex from './kanbanfront/containers/origanization/managePage/KANBANMANAGEIndex';
import USERSTORYMAPIndex from './kanbanfront/containers/origanization/userStoryMap/USERSTORYMAPIndex';
import './assets/materialicons.css';
// import Main from './pages/Main.js'; // 引入各容器组件
import App from './App';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
import 'antd/dist/antd.css';
const PageSet = () => (
  <div>
    <div style={{ width: '100%', height: '46px', background: '#3f51b5' }} />
    <div style={{ display: 'flex' }}>
      <div>
        <Menu
          style={{ width: 240 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
          <Menu.Item key="1">
            <Link to="/userStoryMap">用户故事地图</Link>
          </Menu.Item>
          <Menu.Item key="2">看板管理</Menu.Item>

          <Menu.Item key="3">冲刺管理</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
        </Menu>
      </div>
      <div style={{ flex: 1 }}>
        <Router>
          <Switch>
            <Route exact path="/" component={App} />
            {/* {/* <Route path="/kanbanManage" component={KANBANMANAGEIndex} /> */}
            {/* <Route path="/userStoryMap" component={USERSTORYMAPIndex} /> */}

            {/* <Route path='/404' component={ NotFoundPage } /> */}
            {/* 其他重定向到 404 */}
            {/* <Redirect from="*" to="/404" /> */}
          </Switch>
        </Router>
      </div>
    </div>
  </div>
);
ReactDOM.render(<PageSet />, document.getElementById('root'));
