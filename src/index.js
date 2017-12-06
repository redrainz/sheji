import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from 'react-router-dom';
import KANBANFRONTIndex from './kanbanfront/containers/KANBANFRONTIndex';
import './assets/materialicons.css';
// import Main from './pages/Main.js'; // 引入各容器组件
import App from './App';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
import 'antd/dist/antd.css';
const PageSet = () => (
  <Router>
    <Switch>
      <Route path="/" component={App} />
      {/* {/* <Route path="/kanbanManage" component={KANBANMANAGEIndex} /> */}
      {/* <Route path="/userStoryMap" component={USERSTORYMAPIndex} /> */}

      {/* <Route path='/404' component={ NotFoundPage } /> */}
      {/* 其他重定向到 404 */}
      {/* <Redirect from="*" to="/404" /> */}
    </Switch>
  </Router>
);
ReactDOM.render(<PageSet />, document.getElementById('root'));
