/*eslint-disable*/
import React, { Component } from 'react';
import { Table,Tooltip,message,Input } from 'antd';
import KanbanManageCard from './KanbanManageCard';
import KanbanManageStore from '../../stores/origanization/managePage/KanbanManageStore';

require("../../assets/css/kanban-manage.css");
const kanbanIcon=require('../../assets/image/kanbanManageIcon.png');

/*删除两端的空格*/
function trim(str){
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

class AllKanban extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      kanbanArray:[],
    }
    // this.kanbanArray = ;
  }
  componentWillReceiveProps(nextProps){
    let kanbanArray = this.deepCopy(nextProps.kanbanArray);
    this.setState({
      kanbanArray:kanbanArray,
    });
  }

  componentDidUpdate(){
    // let lastInput = null;
    let allInput = document.getElementsByClassName("all-kanban")[0].getElementsByTagName("input");
    if(allInput!=null){
      for(let item of allInput){
        let kanbanId = item.getAttribute('data-kanbanId');
        let display = item.style.display;
        if(display!='none'){
          item.focus();
        }
      }
    }
    // if(lastInput!=null){
    //   lastInput.focus();
    // }
  }

  toKanbanPage=(kanbanId)=>{
    this.props.toKanbanPage(kanbanId);
  }

  /*深度拷贝函数*/
  deepCopy(obj){
    if (obj instanceof Array) {
      let array = [];
      for (let i=0;i<obj.length;++i) {
        array[i] = this.deepCopy(obj[i]);
      }
      return array;
    } else if (obj instanceof Object) {
      let newObj = {}
      for (let field in obj) {
        newObj[field] = this.deepCopy(obj[field]);
      }
      return newObj;
    } else {
      return obj;
    }
  }
  deleteKanban(kanbanId){
    // event.stopPropagation();
    // let kanbanId = this.props.kanbanId;
    KanbanManageStore.deleteKanban(kanbanId).then(() => {
        /*调用父级方法刷新数据*/
        message.success("删除成功");
        this.props.reLoadKanban();
      }
    ).catch(() => {
      message.error("删除失败");
    });
  }

  toKanbanPage(kanbanId){
    this.props.toKanbanPage(kanbanId);
  }

  showRenameInput=(event)=>{
    let kanbanId = event.target.getAttribute("data-kanbanId");
    this.kanbanId = kanbanId;
    let tempArray = this.deepCopy(this.state.kanbanArray);
    for(let item of tempArray){
      if(item.id==kanbanId){
        item.showInput = true;
      }else{
        item.showInput = false;
      }
    }
    this.setState({
      kanbanArray:tempArray,
    });
  }

  handleOnBlur=(event)=>{
    let oldKanbanName = event.target.previousSibling.innerHTML;
    let newKanbanName = trim(event.target.value);
    let kanbanId = event.target.getAttribute("data-kanbanId");
    this.kanbanId = null;
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
      for(let item of document.getElementsByClassName("kanban-list")){
        let kanbanIdTemp = item.lastChild.getAttribute("data-kanbanId");
        if(kanbanIdTemp==kanbanId){
          item.lastChild.value = oldKanbanName;
        }
      }
    }

    let tempArray = this.deepCopy(this.state.kanbanArray);
    for(let item of tempArray){
      if(item.id==kanbanId){
        item.showInput = false;
      }
    }

    this.setState({
      kanbanArray:tempArray,
    });
  }

  render() {
    let blockOrList = this.props.blockOrList;
    // let kanbanArray = this.deepCopy(this.props.kanbanArray);
    let kanbanList = null;
    if(blockOrList==="block"){
      kanbanList = [];
      for(let item of this.state.kanbanArray){
        kanbanList.push(
          <KanbanManageCard key={item.id} kanban={item} toKanbanPage={this.toKanbanPage} reLoadKanban={this.props.reLoadKanban}/>
        );
      }
    }else if(blockOrList==="list"){

      for(let item of this.state.kanbanArray){
        item["key"]=item.id;
        item["person"]='admin';
        if(item.showInput==null){
          item.showInput=false;
        }
      }

      const columns = [{
        title: '看板名称',
        dataIndex: 'name',
        key: 'name',
        width:'45%',
        render: (text,record) => {
          return (
            <div className="kanban-list" style={{position:'relative',}}>
              <div style={{width:450,cursor:'pointer',color: '#3F51B5',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} onClick={this.toKanbanPage.bind(this,record.id)}>{text}</div>
              <Input defaultValue={text} onBlur={this.handleOnBlur} onPressEnter={this.handleOnBlur}
                data-kanbanId={record.id} style={{ position: 'absolute',left: 0, width: '60%',display:record.showInput?'inline-block':'none'}}/>
            </div>
          );
        },
      }, {
        title: '创建人',
        dataIndex: 'person',
        key: 'person',
        width:'21%',
      }, {
        title: '最近修改时间',
        dataIndex: 'lastUpdateDate',
        key: 'lastUpdateDate',
        width:'26%',
      },{
        title:'操作',
        dataIndex:'action',
        key:'action',
        width:'8%',
        render: (text, record) => (
          <span>
            <Tooltip title="重命名">
              <i className="material-icons" data-kanbanId={record.id} onClick={this.showRenameInput} style={{fontSize:13, marginRight:15,cursor:'pointer'}}>border_color</i>
            </Tooltip>
            <Tooltip title="删除">
              <i className="material-icons" onClick={this.deleteKanban.bind(this,record.id)}
                 style={{fontSize:17,position:'relative',top:2,cursor:'pointer'}}>delete</i>
            </Tooltip>
            {/*<span className="ant-divider" />*/}
        </span>
        ),
      }];

      kanbanList = (<Table pagination={false} columns={columns} dataSource={this.state.kanbanArray} />);

    }

    return (
      <div style={{paddingLeft:3,paddingTop:3}}>{kanbanList}</div>
    );
  }
}

export default AllKanban;
