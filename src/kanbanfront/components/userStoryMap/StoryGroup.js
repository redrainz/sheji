/*eslint-disable*/
import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { observer } from 'mobx-react';
import { Icon, Button, Tooltip, Popover, message } from 'antd';
import Card from './Card';
import AddCard from './AddCard';
import WhiteCard from './WhiteCard';
import StoryList from './StoryList';
import '../../assets/css/userStoryMap-card.css';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';

const styles = {
  line: {
    display: 'flex',
    position: 'relative',
    borderTop: '2px solid #D3D3D3',
    // marginTop: '10px',
  },
};
@observer
export default class StoryGroup extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.fatureLength);
  }
  edit(e) {
    // document.body.onclick = () => {
    //   console.log('close');
    //   UserStoryStore.closeright();
    // };
    let value = e.target.value;
    const { storygroup } = this.props;
    UserStoryStore.updateReleasePlanName(
      e.target.getAttribute('data-id'),
      e.target.value,
    ).then(returnData => {
      /*如果有返回数据，则判断卡片描述信息是否发生变化*/
      if (returnData) {
        if (name != this.props.name) {
          /*如果发生变化则提示更新成功*/
          UserStoryStore.updateLocalReleasePlanName(storygroup, value);
          message.success('更新成功', 1.5);
        }
      } else {
        /*更新失败则提示卡片不存在*/
        message.error('改名失败', 1);
      }
    });
    console.log('edit', e.target.value);
  }
  focus(e) {
    console.log('focus', e.target.value);
  }
  deleteRelease() {
    console.log('deleteRelease');
    const { storygroup } = this.props;
    if (UserStoryStore.ReleasePlanData[storygroup].issues.length === 0) {
      UserStoryStore.deleteReleaseById(
        UserStoryStore.ReleasePlanData[storygroup].id,
      )
        .then(data => {
          if (data) {
            UserStoryStore.deleteRelease(storygroup);
            message.success('删除成功');
          }
        })
        .catch(error => {
          console.log(error);
          message.error('删除失败');
        });
    } else {
      message.error('Release内有卡片时不能删除', 1.5);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { storygroup } = this.props;
    this.input.setAttribute(
      'value',
      UserStoryStore.ReleasePlanData[storygroup].name,
    );
  }

  getinput(instance) {
    if (instance) {
      this.input = instance;
    }
  }
  componentDidMount() {
    //添加Release后直接选定新的Release
    if (
      this.props.storygroup === UserStoryStore.ReleasePlanData.length - 1 &&
      UserStoryStore.ReleasePlanData[this.props.storygroup].flag
    ) {
      if (this.input) {
        this.input.select();
        this.input.focus();
        UserStoryStore.updateLocalReleasePlanFlag(this.props.storygroup);
      }
    }
  }

  render() {
    const {
      data,
      height,
      type,
      index,
      column,
      taskindex,
      storygroup,
      parentId,
    } = this.props;
    let len = 1;
    // let flag = data.some(one => one.length > 0);
    console.log(data);
    if (data) {
      // console.log(data.length);
      //保证新建Release时的宽度
      if (data.length === 0) {
        if (
          UserStoryStore.userStoryData[index].subIssue.length > 0 &&
          UserStoryStore.userStoryData[index].subIssue[column] &&
          UserStoryStore.userStoryData[index].subIssue[column].subIssue.length >
            0 &&
          UserStoryStore.userStoryData[index].subIssue[column].subIssue[
            taskindex
          ] &&
          UserStoryStore.userStoryData[index].subIssue[column].subIssue[
            taskindex
          ].story.length > 0
        ) {
          len = Math.max(
            UserStoryStore.userStoryData[index].subIssue[column].subIssue[
              taskindex
            ].story[0].length,
            1,
          );
          // console.log(len);
        }
      }
    }
    // console.log(storygroup,UserStoryStore.userStoryData,UserStoryStore.ReleasePlanData);
    return (
      <div
        style={{
          ...styles.line,
          ...{
            // borderBottom: this.props.islast ? 'none' : '2px solid #D3D3D3',
          },
        }}
      >
        {this.props.isfirst ? (
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              top: '-12px',
              background: 'white',
              left: 0,
              color: '#3f51b5',
              fontSize: '15px',
              padding: '0 10px',
            }}
          >
            <input
              ref={this.getinput.bind(this)}
              data-id={UserStoryStore.ReleasePlanData[storygroup].id}
              className="editrelease"
              style={{ fontSize: '12px' }}
              onFocus={this.focus.bind(this)}
              onBlur={this.edit.bind(this)}
              title={UserStoryStore.ReleasePlanData[storygroup].name}
              defaultValue={UserStoryStore.ReleasePlanData[storygroup].name}
            />

            <Icon
              type="delete"
              style={{
                fontSize: '12px',
                cursor:
                  UserStoryStore.ReleasePlanData[storygroup].issues.length === 0
                    ? 'pointer'
                    : 'not-allowed',
              }}
              onClick={this.deleteRelease.bind(this)}
            />
          </div>
        ) : null}

        {data.length === 0
          ? Array(len)
              .fill([])
              .map(one => (
                <StoryList
                  type={type}
                  height={height}
                  data={[]}
                  parentId={parentId}
                  key={Math.random()}
                  index={index}
                  column={column}
                  taskindex={taskindex}
                  storygroup={storygroup}
                  storyindex={0}
                  style={this.props.cardStyle}
                />
              ))
          : data.map((one, i) => (
              <StoryList
                type={type}
                height={height}
                data={one}
                parentId={parentId}
                key={Math.random()}
                index={index}
                column={column}
                taskindex={taskindex}
                storygroup={storygroup}
                storyindex={i}
                style={this.props.cardStyle}
              />
            ))}
      </div>
    );
  }
}
