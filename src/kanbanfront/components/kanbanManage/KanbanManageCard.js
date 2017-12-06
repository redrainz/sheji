/*eslint-disable*/
import React, { Component } from 'react';
import { Card,Icon,message,Input } from 'antd';
import CardMenu from './CardMenu';
import KanbanManageStore from '../../stores/origanization/managePage/KanbanManageStore';

require("../../assets/css/kanban-manage.css");
const kanbanIcon=require('../../assets/image/kanbanManageIcon.png');

/*删除两端的空格*/
function trim(str){
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

class KanbanManageCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isMouseHover:false,
      showNameInput:false,
    }
  }
  componentDidUpdate(){
    if(this.state.showNameInput){
      for(let item of document.getElementsByClassName("kanban-name")){
        let kanbanId = item.getAttribute("data-kanbanId");
        if(kanbanId==this.props.kanban.id){
          item.lastChild.focus();
        }
      }
    }
  }

  toKanbanPage=()=>{
    let kanbanId = this.props.kanban.id;
    this.props.toKanbanPage(kanbanId);
  }

  getLastUpdateDate=(lastUpdateDate)=>{
    let date = new Date(this.props.kanban.lastUpdateDate);
    lastUpdateDate["year"] = date.getFullYear();
    lastUpdateDate["month"] = date.getMonth()+1;
    lastUpdateDate["day"] = date.getDay()+1;
  }

  handleOnMouseOver=()=>{
    if(!this.state.isMouseHover){
      this.setState({
        isMouseHover:true,
      });
    }
  }

  handleOnMouseLeave=()=>{
    this.setState({
      isMouseHover:false,
    });
  }

  showKanbanRenameInput=(event)=>{
    // let input = event.target.parentNode.parentNode.parentNode.parentNode.nextSibling.firstChild.lastChild;
    this.setState({
      showNameInput:true,
    });
    // input.focus();
  }

  handleOnBlur=(event)=>{
    let oldKanbanName = event.target.previousSibling.innerHTML;
    let newKanbanName = trim(event.target.value);
    let kanbanId = this.props.kanban.id;
    if(newKanbanName!=""&&oldKanbanName!=newKanbanName){
      let kanban = {
        id:kanbanId,
        name:newKanbanName
      };
      KanbanManageStore.updateKanban(kanban).then(response => {
        if(response!=null){
          message.success("更新成功");
          this.props.reLoadKanban();
        }else{
          message.error("更新失败");
        }
      });
    }else{
      for(let item of document.getElementsByClassName("kanban-name")){
        let kanbanId = item.getAttribute("data-kanbanId");
        if(kanbanId==this.props.kanban.id){
          item.lastChild.value = oldKanbanName;
        }
      }
    }
    this.setState({
      showNameInput:false,
      isMouseHover:false,
    });
  }

  render() {
    let result= null;
    let lastUpdateDate = {};
    this.getLastUpdateDate(lastUpdateDate);

    if(this.state.showNameInput){
      this.state.isMouseHover=true;
    }

    // let cardMenu = (
    //   <Menu onMouseOver={this.handleOnMouseOver}>
    //     <Menu.Item key="0" onMouseOver={this.handleOnMouseOver}>
    //       <a href="http://www.alipay.com/">删除</a>
    //     </Menu.Item>
    //     <Menu.Item key="1" onMouseOver={this.handleOnMouseOver}>
    //       <a href="http://www.taobao.com/">重命名</a>
    //     </Menu.Item>
    //     {/*<Menu.Divider />*/}
    //     {/*<Menu.Item key="3">3rd menu item</Menu.Item>*/}
    //   </Menu>
    // );

    result = (
      <div onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseLeave}
           style={{ width: 185,height:220,float:'left',
             boxShadow: '0 2px 8px 0 rgba(0,0,0,0.20)',
             marginRight:17,marginBottom:17}} bodyStyle={{ padding: "0px"}}>
        <div className="custom-image" onClick={this.toKanbanPage}
             style={{width:185,height:157,textAlign:'center',cursor:'pointer'}}>
          <img src={kanbanIcon} style={{ width: 100, paddingTop: 42}}/>
          {this.state.isMouseHover?(<div className="custom-image-mask" />):([])}
          {this.state.isMouseHover?(
            <CardMenu kanbanId={this.props.kanban.id} showKanbanRenameInput={this.showKanbanRenameInput} reLoadKanban={this.props.reLoadKanban}/>
          ):([])}

        </div>
        <div className="custom-card" style={{width:148,height:63,margin: '0 auto',position: 'relative',}}>
          <div className="kanban-name" style={{marginTop:11}} data-kanbanId={this.props.kanban.id}>
            <div className="kanban-name-text" style={{color:this.state.isMouseHover?'rgba(0,0,0,0.72)':'rgba(0,0,0,0.87)'}}>{this.props.kanban.name}</div>
            <Input defaultValue={this.props.kanban.name}
                   style={{height: 21,top: 0,left: 0, position: 'absolute',display:this.state.showNameInput?'inline-block':'none'}}
                   onBlur={this.handleOnBlur} onPressEnter={this.handleOnBlur}/>
          </div>
          {this.state.isMouseHover?(<div className="kanban-lastupdate" style={{marginTop:-3}}>最近修改：{lastUpdateDate.year}年{lastUpdateDate.month}月{lastUpdateDate.day}日</div>):([])}
        </div>
      </div>
      // <Card onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseLeave}
      //   style={{ width: 185,height:220,float:'left',
      //   boxShadow: '0 2px 8px 0 rgba(0,0,0,0.20)',
      //   marginRight:17,marginBottom:17}} bodyStyle={{ padding: "0px"}}>
      //   <div className="custom-image" onClick={this.toKanbanPage}
      //        style={{width:185,height:157,textAlign:'center',cursor:'pointer'}}>
      //     <img src={kanbanIcon} style={{ width: 100, paddingTop: 42}}/>
      //     {this.state.isMouseHover?(<div className="custom-image-mask" />):([])}
      //     {this.state.isMouseHover?(
      //       <CardMenu kanbanId={this.props.kanban.id} showKanbanRenameInput={this.showKanbanRenameInput} reLoadKanban={this.props.reLoadKanban}/>
      //       ):([])}
      //
      //   </div>
      //   <div className="custom-card" style={{width:148,height:63,margin: '0 auto',position: 'relative',}}>
      //     <div className="kanban-name" data-kanbanId={this.props.kanban.id}>
      //       <div className="kanban-name-text" style={{color:this.state.isMouseHover?'rgba(0,0,0,0.72)':'rgba(0,0,0,0.87)'}}>{this.props.kanban.name}</div>
      //       <Input defaultValue={this.props.kanban.name}
      //         style={{height: 21,top: 0,left: 0, position: 'absolute',display:this.state.showNameInput?'inline-block':'none'}}
      //         onBlur={this.handleOnBlur} onPressEnter={this.handleOnBlur}/>
      //     </div>
      //     {this.state.isMouseHover?(<div className="kanban-lastupdate">最近修改：{lastUpdateDate.year}年{lastUpdateDate.month}月{lastUpdateDate.day}日</div>):([])}
      //   </div>
      // </Card>
    );

    return (result);
  }
}

export default KanbanManageCard;
