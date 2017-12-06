/*eslint-disable*/
import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon, Button  } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
require("../../assets/css/siderMenu.css");

class SiderMenu extends React.Component {
  constructor(props){
    super(props);
    this.handleOnFold = this.handleOnFold.bind(this);
    this.state = {
      collapsed: false,
      titleState: 'none',
    }
  }

  handleOnFold(e){
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
render() {
  let siderMenu = null;
  if(this.state.collapsed){
    siderMenu =
      <div className="sider-menu-content-collapsed">
        <div className="sider-menu-info-collapsed">
          <div className="sider-menu-icon-collapsed"  ><Icon type="menu-unfold" onClick={this.handleOnFold}/></div>
        </div>
        <ul className="sider-menu-ul-collapsed">
          <li><a href="javascript:void(0)" onClick={this.props.onCilckAddColumn}><Icon type="file" style={{fontSize:15,paddingRight:10 }}/></a></li>
          <li><a href="javascript:void(0)" onClick={this.props.onClickAddHeight}><Icon type="plus-square-o" style={{fontSize:15,paddingRight:10 }}/></a></li>
          <li><a href="javascript:void(0)" onClick={this.props.onClickReduceHeight}><Icon type="minus-square-o" style={{fontSize:15,paddingRight:10 }}/></a></li>
          <li><a href="javascript:void(0)"><Icon type="delete" style={{fontSize:15,paddingRight:10 }}/></a></li>
          <li><a href="javascript:void(0)" onClick={this.props.onClickSave}><Icon type="desktop" style={{fontSize:15,paddingRight:10 }} /></a></li>
        </ul>
      </div>
  }else{
    siderMenu =
      <div className="sider-menu-content">
        <div className="sider-menu-info">
          <div className="sider-menu-des"><span>编辑看板</span></div>
          <div className="sider-menu-icon"  ><Icon type="menu-fold" onClick={this.handleOnFold}/></div>
        </div>
        <ul className="sider-menu-ul">
          <li><a href="javascript:void(0)" onClick={this.props.onCilckAddColumn}><Icon type="file" style={{fontSize:15,paddingRight:10 }}/><span>新添一列</span></a></li>
          <li><a href="javascript:void(0)" onClick={this.props.onClickAddHeight}><Icon type="plus-square-o" style={{fontSize:15,paddingRight:10 }}/><span>增加行高</span></a></li>
          <li><a href="javascript:void(0)" onClick={this.props.onClickReduceHeight}><Icon type="minus-square-o" style={{fontSize:15,paddingRight:10 }}/><span>减少行高</span></a></li>
          <li><a href="javascript:void(0)"><Icon type="delete" style={{fontSize:15,paddingRight:10 }}/><span>清空</span></a></li>
          <li><a href="javascript:void(0)" onClick={this.props.onClickSave}><Icon type="desktop" style={{fontSize:15,paddingRight:10 }} /><span>保存</span></a></li>
        </ul>
      </div>
  }
  return (
    siderMenu
);
}
}

export default SiderMenu;
