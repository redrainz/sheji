/*eslint-disable*/
import React, { Component } from 'react';
import { Icon,message } from 'antd';
import KanbanManageStore from '../../stores/origanization/managePage/KanbanManageStore';

require("../../assets/css/kanban-manage.css");

class CardMenu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showDropMenu:false,
    }
  }
  componentDidUpdate(){
  }
  deleteKanban=(event)=>{
    event.stopPropagation();
    let kanbanId = this.props.kanbanId;
    KanbanManageStore.deleteKanban(kanbanId).then(() => {
          /*调用父级方法刷新数据*/
          message.success("删除成功");
          this.props.reLoadKanban();
        }
    ).catch(() => {
        message.error("删除失败");
    });
  }
  handleOnClick=(e)=>{
    e.stopPropagation();
    if(!this.state.showDropMenu) {
      console.log("hahahha");
      this.setState({
        showDropMenu: true,
      });
    }else{
      this.setState({
        showDropMenu: false,
      });
    }
  }
  handleOnMouseOver=(e)=>{
    this.setState({
      showDropMenu: true,
    });
  }
  handleOnMouseOut=(e)=>{
    this.setState({
      showDropMenu: false,
    });
  }

    // }else if(this.state.showDropMenu==="inline-block"){
    //   this.setState = ({
    //     showDropMenu:'none',
    //   });
    // }
  // handleOnMouseOut=()=>{
  //   this.setState = ({
  //     showDropMenu:'none',
  //   });
  // }
  showKanbanRenameInput=(event)=>{
    event.stopPropagation();
    this.props.showKanbanRenameInput(event);
  }
  render() {
    console.log(this.state.showDropMenu);
    // let ulDisplay = this.state.showDropMenu==="none"?{display:'none'}:{};
    return (
      <div style={{position: 'absolute',right: 8,top:0,width: 55}}>
        <Icon type="ellipsis" onClick={this.handleOnClick} onMouseOver={this.handleOnMouseOver} onMouseOut={this.handleOnMouseOut}
          style={{fontSize:24,cursor:"pointer", color: 'white', right: -14, position: 'relative'}}/>
        <ul className="kanban-manage-card-menu" onMouseOver={this.handleOnMouseOver} onMouseOut={this.handleOnMouseOut} style={{display:this.state.showDropMenu?'inline-block':'none'}}>
          <li onClick={this.showKanbanRenameInput}><a href="javascript:void(0)">重命名</a></li>
          <li onClick={this.deleteKanban}><a href="javascript:void(0)" >删除</a></li>
        </ul>


      </div>
    );
  }
}

export default CardMenu;
