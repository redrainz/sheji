/*eslint-disable*/
import React, { Component } from 'react';
import { Icon  } from 'antd';
require("../../assets/css/kanban-edit.css");

class SiderMenu extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  componentDidUpdate(){
    // let siderMenu = document.getElementsByClassName("kanban-sidermenu")[0];
    // let topHeight = document.getElementsByClassName("ant-menu ant-menu-horizontal ant-menu-light ant-menu-root")[0].offsetHeight;
    // console.log(topHeight);
    // console.log(siderMenu.offsetHeight);
    // siderMenu.style.top = ( window.innerHeight - document.getElementsByClassName("ant-menu ant-menu-horizontal ant-menu-light ant-menu-root")[0].offsetHeight  - siderMenu.offsetHeight)/2 + topHeight + "px";
    this.props.resizeSiderMenu();
  }

  render() {
    let editSwimLane;
    if(this.props.isCreatingSwimLane){
      editSwimLane = <div title="退出绘制"><Icon type="edit" onClick={ this.props.handleOnChangeModel } style={{color:'#39B2A9',opacity: 1}}/></div>;
    }else{
      editSwimLane = <div title="绘制泳道"><Icon type="edit" onClick={ this.props.handleOnChangeModel }/></div>;
    }
    return (
      <div className="kanban-sidermenu">
        <div title="新添一列"><Icon type="plus" onClick={ this.props.handleOnAddColumn }/></div>
        {editSwimLane}
        <div title="增加列高"><Icon type="down-square-o" onClick={ this.props.handleOnAddHeight }/></div>
        <div title="减少列高"><Icon type="up-square-o" onClick={ this.props.handleOnReduceHeight }/></div>
        <div title="撤销"><Icon id="revocate" type="rollback" onClick={ this.props.handleOnRevocate }/></div>
        <div title="恢复"><Icon id="recover" type="reload" onClick={ this.props.handleOnRecover }/></div>
        <div title="保存"><Icon type="save" onClick={this.props.handleOnSave}/></div>
        <div title="使用看板"><Icon type="select" onClick={this.props.toUseKanbanPage}/></div>
      </div>);
  }
}

export default SiderMenu;
