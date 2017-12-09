/*eslint-disable*/
import { Icon, message, Tag } from 'antd';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import { ItemTypes } from './Constants';
import { DragSource, DropTarget } from 'react-dnd';

const styles = {
  cardstyle: {
    cursor: 'move',
  },
  content: {
    cursor: 'pointer',
    maxHeight: '100%',
    overflow: 'hidden',
    color: '#333',
    fontSize: '12px',
    lineHeight: '18px',
    wordBreak: 'break-all !important',
    wordWrap: 'break-word !important',
    userSelect: 'none',
    position: 'relative',
  },
  icon: {
    color: '#00a854',
    top: 'calc(50% - 20px)',
    left: 'calc(50% - 20px)',
    background: 'white',
    borderRadius: '50%',
    fontSize: '40px',
    position: 'absolute',
  },
  menus: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  menuicon: {
    color: '#42485b',
    cursor: 'pointer',
    fontSize: '12px',
  },
};
//拖动开始
const storySource = {
  beginDrag(props) {
    console.log('start', props);
    return props;
  },
  endDrag(props, monitor) {
    console.log('从drag获取drop数据:', monitor.getDropResult());
  },
};
//拖动drop
const storyTarget = {
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
    type = 'dragstory';
    if (source.id !== id) {
      if (
        source.parentId === parentId &&
        source.taskindex === taskindex &&
        source.storygroup === storygroup &&
        source.storyindex === storyindex
      ) {
        console.log('same');
        UserStoryStore.handleDragSameList(
          index,
          column,
          taskindex,
          storyindex,
          storygroup,
          source.position,
          position,
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
    }
    return props;
  },
};
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}
function dropcollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}
@observer
class StoryCard extends Component {
  constructor(props) {
    super(props);
    const data = this.props.data;
    // console.log(data);
    this.state = {
      value: this.props.description,
      disabled: true,
      description: this.props.description,
      status: this.props.status,
      sprintId: this.props.sprintId,
    };
  }

  add() {
    let data = { id: Math.random(), description: '请输入用户故事' };
    const {
      id,
      type,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      position,
      parentId,
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
    });

    let storyMapSequence = 0;
    let values = {};
    values = {
      issueType: 'story',
      description: '请输入用户故事',
      projectId: 1,
      status: 'product backlog',
      demandType: '新需求',
      demandSource: '客户',
      issuePriority: 2,
      parentId: parentId,
      storyColumn: storyindex + 1,
      releasePlanId: UserStoryStore.ReleasePlanData[storygroup].id,
      storyMapSequence: position,
    };
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
        }
      })
      .catch(error => {
        message.error('创建失败');
      });
  }
  del(e) {
    e.stopPropagation();
    const {
      id,
      type,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      position,
      parentId,
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
    });
    UserStoryStore.deleteIssueById(id)
      .then(data => {
        if (data) {
          UserStoryStore.delItem(
            type,
            index,
            column,
            taskindex,
            storyindex,
            storygroup,
            position,
          );
          message.success('删除成功', 1.5);
        }
      })
      .catch(error => {
        console.log(error);
        message.error('删除失败');
      });
  }

  openRight(e) {
    IssueManageStore.setStoryData({ ...this.props.data });
    e.stopPropagation();
    console.log('story');
    UserStoryStore.editItem(this.props);
  }

  componentWillReact() {
    // console.log(UserStoryStore.currentEditData);
    // if (UserStoryStore.currentEditDataUserStoryStore.currentEditData.id === this.props.id) {
    //   let data = IssueManageStore.getStoryData;
    //   console.log(data.description);
    //   this.setState({
    //     status: data.status,
    //   });
    //   if (data.description !== '') {
    //     this.setState({
    //       description: data.description,
    //     });
    //   }
    // }
  }
  focus(e) {
    document.onkeypress = this.checkEnter.bind(this);
    console.log('focus');
  }
  checkEnter(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.handin(e);
    }
  }
  setFocus(e) {
    this.setState({
      disabled: false,
    });
    if (this.edittext) {
      // console.log(this.edittext);
      this.edittext.select();
      this.edittext.focus();
    }
  }
  handin(e) {
    console.log('unfocus');
    const {
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
    console.log(e.target.value);
    this.setState({
      description: e.target.value,
      disabled: true,
    });
    UserStoryStore.updateDescription(id, e.target.value)
      .then(data => {
        if (data) {
          UserStoryStore.updateLocalStory(
            index,
            column,
            taskindex,
            storyindex,
            storygroup,
            position,
            data,
          );
          message.success('更新成功', 1.5);
        }
      })
      .catch(error => {
        console.log(error);
        message.error('更新失败');
      });
  }
  saveref(edittext) {
    if (edittext) {
      this.edittext = edittext;
    }
  }
  oneClick(e) {
    console.log('one');
  }
  render() {
    const sprintData = UserStoryStore.sprintData;
    const data = IssueManageStore.getStoryData;
    // console.log(data.description);
    const {
      connectDragSource,
      isDragging,
      connectDropTarget,
      isOver,
    } = this.props;
    return connectDropTarget(
      connectDragSource(
        <div
          className="cardContainer"
          style={{
            ...styles.cardstyle,
            ...this.props.style,
            ...{
              boxShadow: isOver ? '0 0 0 1px gray' : '',
              visibility: isDragging ? 'hidden' : 'visible',
            },
          }}
        >
          <div style={styles.content}>
            <textarea
              ref={this.saveref.bind(this)}
              onMouseDown={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={this.openRight.bind(this)}
              // onDoubleClick={this.setFocus.bind(this)}
              // onFocus={this.focus.bind(this)}
              readOnly="readonly"
              // onBlur={this.handin.bind(this)}
              // {...(this.state.disabled ? { readOnly: 'readonly' } : '')}
              style={{
                ...{
                  border: 'none',
                  outline: 'none',
                  height: '100%',
                  width: '100%',
                  resize: 'none',
                  lineHeight: '15px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                },
                ...this.props.style,
              }}
              defaultValue={
                this.props.description !== ''
                  ? this.props.description
                  : '请输入描述'
              }
            />
          </div>

          <div
            className="hoverMenu"
            style={{ ...styles.menus, ...this.props.style }}
          >
            {/* <Icon
              className="menu"
              type="edit"
              style={styles.menuicon}
              onClick={this.openRight.bind(this)}
            /> */}
            <Icon
              className="menu"
              type="delete"
              onClick={this.del.bind(this)}
              style={styles.menuicon}
            />
            <Icon
              className="menu"
              type="right"
              style={styles.menuicon}
              onClick={this.add.bind(this)}
            />
          </div>
        </div>,
      ),
    );
  }
}

export default DropTarget(ItemTypes.STORY, storyTarget, dropcollect)(
  DragSource(ItemTypes.STORY, storySource, collect)(StoryCard),
);
