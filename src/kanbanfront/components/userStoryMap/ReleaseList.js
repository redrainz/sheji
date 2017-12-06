/**
 * Created by knight on 2017/9/20.
 * Release
 */

/*eslint-disable*/
import { message,Icon} from 'antd';
import {observer} from 'mobx-react';
import React,{Component} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Release from "./Release";
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';

const reorder = ( startIndex, endIndex) => {
  const list = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  for(let i=0;i<result.length;i++)
    UserStoryStore.updateStoryMapSequence(result[i].props.id,i);
  return result;
};
const getList = ( result,releaseLists,parentList) => {
  let resultList;
  let userStoryListId = 0;
  let Array = result.droppableId.split(',');
  for (let i = 0; i < parentList.length; i++) {
    if (parentList[i] == Array[1]) {
      userStoryListId = userStoryListId+i ;
      break;
    }
    if (parentList[i] == 0)
      userStoryListId--;
  }
  for (let item of releaseLists) {
    if (item.props.id == Array[0])
      resultList = item.props.data[userStoryListId];
  }
  return resultList;
};
@observer
class ReleaseList extends Component {
  constructor(props) {
    super(props);
    this.initReleaseList = this.initReleaseList.bind(this);
    this.addRelease = this.addRelease.bind(this);
    this.deleteRelease = this.deleteRelease.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.state = {
      id:'',
      releaseLists:[],
      parentList:[],
      data:this.props.data,
    }
  }

  componentDidMount(){
    this.initReleaseList(this.state.data);
  }

  componentWillReceiveProps(nextProps){
    console.log('2')
    this.initReleaseList(nextProps.data);
  }
//根据数据来更新组件
  initReleaseList(data) {
    const Arr = [];
    const parentList = [];
      window.console.log(data);
      for (let item1 of data['Feature']){
        if(item1.length==0)
        {parentList.push('0');}
        else{for(let item of item1) {
          parentList.push(item.id)
        }}}
      let ReleaseListData = data['ReleasePlan'];
      for (let item of ReleaseListData) {
        Arr.push(
          <Release  data={item['issues']} name={item.name} key={item.id} id={item.id}
                    editDisplay={"none"} labelDisplay={"inline-block"} deleteRelease={this.deleteRelease}
                    parentList={parentList} initReleaseList={this.props.initUserStoryMap}/>)
        this.setState({
          releaseLists: Arr,
          parentList:parentList,
        });
      }
  }

  addRelease() {
    let name='';
    let release={
      name:name,
      projectId:1,
    };
    const parentList = [];
    for (let item1 of this.state.data['Feature']){
      if(item1.length==0)
      {parentList.push('0');}
      else{for(let item of item1) {
        parentList.push(item.id)
      }}}
    let Arr=this.state.releaseLists;
    UserStoryStore.createRelease(release).then(releaseData=>{
      if(releaseData){
        Arr.push(
          <Release  data={[]} name={releaseData.name} key={releaseData.id} id={releaseData.id}
                    editDisplay={"inline-block"} labelDisplay={"none"} deleteRelease={this.deleteRelease}
                    parentList={parentList} initReleaseList={this.props.initUserStoryMap}/>)
        this.setState({
          releaseLists: Arr,
        });
        message.success("添加成功");
      }
    }).catch((err) => {
      message.error("添加失败");
    })

  }
  deleteRelease(id) {
    let releaseLists=this.state.releaseLists;
    UserStoryStore.deleteReleaseById(id).then(data => {
      for(let i=0;i<releaseLists.length;i++) {
        if (releaseLists[i].key == id)
          releaseLists.splice(i, 1);}
      message.success("删除成功");
     this.setState({
      releaseLists:releaseLists,
    })
    });
  }
  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    else {
      console.log(result)
      let startList=getList(result.source,this.state.releaseLists,this.state.parentList);
      let endList=getList(result.destination,this.state.releaseLists,this.state.parentList);
      console.log(startList);
      console.log(endList);
      let list=startList[result.source.index];
      endList.splice(result.destination.index, 0,list);
      console.log(endList);
      let arr = result.destination.droppableId.split(',');
      for(let i=0;i<endList.length;i++)
      {console.log(endList[i].id)
      console.log(endList[i])
        UserStoryStore.updateMoveCard(endList[i].id,i,arr[1]);
      }
      this.props.initUserStoryMap();
    }
  }

  render(){
    return (
      <div style={{ display:'block',paddingBottom:20}}>
        {this.state.releaseLists}
        <div style={{position:'relative',display:'inline-block',width:'100%',height:28,marginLeft:'35px'}}>
          <a style={{color:'#8489ff',fontSize:12,cursor:'pointer',paddingLeft: 8,}} onClick={this.addRelease} >
            添加releasePlan</a>
          <hr style={{position:'absolute',top:14,border:'0.5px dashed #e2e2e2',width:'100%',marginLeft:'30px'}}/>
        </div>
      </div>
    )}
}
export default ReleaseList;

