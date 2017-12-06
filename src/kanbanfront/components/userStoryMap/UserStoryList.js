/**
 * Created by knight on 2017/9/18.
 * 显示添加Epic下的UserStory列表
 */

/*eslint-disable*/
import { Card, Icon, message } from 'antd';
import React, { Component } from 'react';
import StoryCard from "./StoryCard";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import { observer } from 'mobx-react';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
@observer
class UserStoryList extends Component {
  constructor(props) {
    super(props);
    this.addUserStory = this.addUserStory.bind(this);
    this.deleteUserStory = this.deleteUserStory.bind(this);
    this.initUserStoryCard = this.initUserStoryCard.bind(this);
    this.state = {
      id: this.props.id,
      lists: [],
      parentId: this.props.parentId,
      data: this.props.data,
      releasePlanId: this.props.releasePlanId,
    }
  }
  componentDidMount() {
    this.initUserStoryCard(this.state.data);
  }
  componentWillReceiveProps(nextProps){
    window.console.log(nextProps.data);
    this.initUserStoryCard(nextProps.data);
  }
  initUserStoryCard(data) {
    let list=[];
    const releasePlanId = this.props.releasePlanId;
    for (let item of data) {
      list.push(
        <StoryCard id={item.id} description={item.description} key={item.id} parentId={item.parentId}
                   status={item.status} sprintId={item.sprintId} releasePlanId={releasePlanId}
                   autoFocus={false} initUserStoryCard={this.props.initRelease} delete={this.deleteUserStory}/>)
    }
    this.setState({
      lists: list,
    });
  }
  addUserStory() {
    let values = {
      issueType: 'UserStory',
      description: '',
      projectId: 1,
      status:"todo",
      parentId: this.state.parentId,
      releasePlanId: this.state.releasePlanId,
    };
    UserStoryStore.createIssue(values).then(data => {
      if (data) {
        window.console.log('创建: ', data);
        message.success("创建成功", 0.1,);
        let list=this.state.lists;
        list.push(
          <div key={data.id} style={{marginTop:3,marginLeft:3,marginRight:3,display:'block'}}>
            <StoryCard id={data.id} description={data.description} key={data.id} parentId={data.parentId}
                       status={data.status} sprintId={data.sprintId} releasePlanId={data.releasePlanId}
                       autoFocus={true} initUserStoryCard={this.props.initRelease}delete={this.deleteUserStory}/></div>)
      this.setState({
        lists: list,
      });
      }
    }).catch(error => {
      message.error("创建失败");
    });
  }
  deleteUserStory(id){
    let userStoryList=this.state.lists;
    UserStoryStore.deleteIssueById(id).then(data => {
      for(let i=0;i<userStoryList.length;i++) {
        if (userStoryList[i].key == id)
          userStoryList.splice(i, 1);}
      message.success("删除成功");
      this.setState({
        lists:userStoryList,
      })
    });
  }
  render() {
    const droppableId=`${this.state.releasePlanId},${this.state.id}`;
    return (
      <div className="storyList">
       {this.state.lists}
            {UserStoryStore.getShadowDisplay=='block'
              ?<div className="addStory" >
                <div style={{ width: 130, height: 80, backgroundColor: '#ffffff' }} bodyStyle={{ padding: 0, }}>
                </div>
              </div>
              : <div className="addStory" >
                <Card style={{ width: 130, height: 80, backgroundColor: '#ffffff',cursor:'pointer' }} bodyStyle={{ padding: 0, }}>
                  <a onClick={this.addUserStory}>添加一个UserStory</a>
                </Card>
              </div>}
          </div>
)}
}
export default UserStoryList;
