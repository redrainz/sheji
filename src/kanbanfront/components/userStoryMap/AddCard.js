/*eslint-disable*/
import { Icon, message } from 'antd';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import { ItemTypes } from './Constants';
import { DropTarget } from 'react-dnd';

const styles = {
  cardstyle: {
    boxShadow: 'none',
  },
  menus: {
    position: 'absolute',
    background: 'rgba(255,255,255,0.7)',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    cursor: 'pointer',
  },
};
const dragTypes = {
  user: ItemTypes.USER,
  activity: ItemTypes.ACTIVITY,
  task: ItemTypes.TASK,
  story: ItemTypes.STORY,
};
const AddCardTarget = {
  drop(props, monitor) {
    // moveKnight(props.x, props.y);
    console.log('drop', props);
    const source = monitor.getItem();
    console.log('从drop中获取drag数据：', source);
    console.log(props.data);
    let {
      id,
      type,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      position,
      parentId,
      preId,
      nextId,
    } = props;
    let data = { ...source.data, ...{ storyMapSequence: position } };
    console.log(data);
    if (type === 'story') {
      type = 'newstory';
    }
    if (
      source.parentId === parentId &&
      source.taskindex === taskindex &&
      source.storygroup === storygroup &&
      source.storyindex === storyindex
    ) {
      //更新服务器数据
      UserStoryStore.updateIssueById(source.id, { storyMapSequence: position });
      //更新本地数据
      UserStoryStore.updateLocalStory(
        index,
        column,
        taskindex,
        storyindex,
        storygroup,
        source.position,
        { storyMapSequence: position },
      );
    } else {
      UserStoryStore.updateIssueById(source.id, {
        parentId: parentId,
        storyColumn: storyindex,
        releasePlanId: UserStoryStore.ReleasePlanData[storygroup].id,
        storyMapSequence: position,
      });
      UserStoryStore.addItem(
        data,
        type,
        index,
        column,
        taskindex,
        storyindex,
        storygroup,
        position,
      );
      UserStoryStore.delItem(
        source.type,
        source.index,
        source.column,
        source.taskindex,
        source.storyindex,
        source.storygroup,
        source.position,
      );
    }
    return props;
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}
let clicked = false;
@observer
class AddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosen: false,
    };
  }
  add() {
    // console.log(clicked);
    let {
      id,
      type,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      position,
      parentId,
      preId,
      nextId,
    } = this.props;
    console.log({
      id: id,
      type: type,
      index: index,
      column: column,
      taskindex: taskindex,
      storyindex: storyindex,
      storygroup: storygroup,
      position: position,
      parentId: parentId,
      preId,
      nextId,
    });
    if (!clicked) {
      clicked = true;
      let flag = true;
      let storyMapSequence = 0;
      let values = {};
      if (type !== 'user' && parentId === null) {
        flag = false;
      }

      if (type === 'user') {
        index--;
        values = {
          issueType: 'user',
          description: '请输入用户',
          preId: null,
          nextId: null,
          projectId: 1,
        };
      } else if (type === 'activity') {
        column--;
        values = {
          issueType: 'activity',
          description: '请输入活动',
          preId: null,
          nextId: null,
          parentId: parentId,
          storyMapSequence: 0,
          projectId: 1,
        };
      } else if (type === 'task') {
        taskindex--;
        values = {
          issueType: 'userTask',
          description: '请输入任务',
          preId: null,
          nextId: null,
          parentId: parentId,
          storyMapSequence: 0,
          projectId: 1,
        };
      } else if (type === 'story') {
        type = 'newstory';
        values = {
          issueType: 'story',
          description: '请输入用户故事',
          status: 'product backlog',
          demandType: '新需求',
          demandSource: '客户',
          issuePriority: 2,
          releasePlanId: UserStoryStore.ReleasePlanData[storygroup].id,
          parentId: parentId,
          storyMapSequence: position,
          storyColumn: storyindex,
          projectId: 1,
        };
      }
      if (flag) {
        UserStoryStore.createIssue(values)
          .then(data => {
            if (data) {
              console.log(data);
              UserStoryStore.addItem(
                data,
                type,
                index,
                column,
                taskindex,
                storyindex,
                storygroup,
                position,
              );

              message.success('创建成功', 1.5);
              clicked = false;
            }
          })
          .catch(error => {
            console.log(error);
            message.error('创建失败');
            clicked = false;
          });
      } else {
        message.error('请先添加父元素');
      }
    }
  }
  render() {
    const { connectDropTarget, isOver } = this.props;
    return this.props.type !== 'user' && this.props.parentId === null ? (
      <div
        role="none"
        className="cardContainer"
        style={{
          ...styles.cardstyle,
          ...this.props.style,
        }}
      />
    ) : (
      connectDropTarget(
        <div
          role="none"
          className="cardContainer"
          style={{
            ...styles.cardstyle,
            ...this.props.style,
            ...{ border: isOver ? '1px dashed #d1d1d1' : '' },
          }}
          onClick={this.add.bind(this)}
        >
          <div className="hoverAddMenu" style={styles.menus}>
            {this.props.description !== '' ? this.props.description : '添加'}
          </div>
        </div>,
      )
    );
  }
}
export default DropTarget(ItemTypes.STORY, AddCardTarget, collect)(AddCard);
