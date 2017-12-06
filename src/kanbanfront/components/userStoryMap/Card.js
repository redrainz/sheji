/*eslint-disable*/
import { Icon, message } from 'antd';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';

const styles = {
  cardstyle: {
    // cursor: 'pointer',
  },
  content: {
    maxHeight: '100%',
    overflow: 'hidden',
    color: '#333',
    fontSize: '12px',
    lineHeight: '18px',
    wordBreak: 'break-all !important',
    wordWrap: 'break-word !important',
    userSelect: 'none',
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
    // width: '10px',
    // height: '10px',
    fontSize: '12px',
    // lineHeight: '30px',
    // boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
  },
};
@observer
export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: this.props.description,
      disabled: true,
    };
  }

  add() {
    const { id, type, index, column, taskindex, parentId } = this.props;
    console.log({
      id: id,
      type: type,
      index: index,
      column: column,
      taskindex: taskindex,
      parentId: parentId,
    });

    let storyMapSequence = 0;
    let values = {};
    let nextId = null;
    if (type === 'user') {
      nextId = UserStoryStore.userStoryData[index + 1]
        ? UserStoryStore.userStoryData[index + 1].id
        : null;
      values = {
        issueType: 'user',
        description: '请输入角色',
        preId: id,
        nextId: nextId,
        projectId: 1,
      };
    } else if (type === 'activity') {
      nextId = UserStoryStore.userStoryData[index].subIssue[column + 1]
        ? UserStoryStore.userStoryData[index].subIssue[column + 1].id
        : null;
      values = {
        issueType: 'activity',
        description: '请输入活动',
        preId: id,
        nextId: nextId,
        parentId: parentId,
        storyMapSequence: column + 1,
        projectId: 1,
      };
    } else if (type === 'task') {
      nextId = UserStoryStore.userStoryData[index].subIssue[column].subIssue[
        taskindex + 1
      ]
        ? UserStoryStore.userStoryData[index].subIssue[column].subIssue[
            taskindex + 1
          ].id
        : null;
      values = {
        issueType: 'userTask',
        description: '请输入任务',
        preId: id,
        nextId: nextId,
        parentId: parentId,
        storyMapSequence: taskindex + 1,
        projectId: 1,
      };
    }
    UserStoryStore.createIssue(values)
      .then(data => {
        if (data) {
          console.log(data);
          // let data = {
          //   id: Math.random(),
          //   preId: null,
          //   nextId: null,
          //   description: '未命名story',
          // };
          UserStoryStore.addItem(data, type, index, column, taskindex);
          UserStoryStore.updateIssueById(id, { nextId: data.id });
          if (nextId != null) {
            UserStoryStore.updateIssueById(nextId, { preId: data.id });
          }
          message.success('创建成功', 1.5);
        }
      })
      .catch(error => {
        console.log(error);
        message.error('创建失败');
      });
  }
  del(e) {
    const {
      id,
      type,
      index,
      column,
      taskindex,
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
      parentId: parentId,
      preId: preId,
      nextId: nextId,
    });
    // UserStoryStore.delItem(type, index, column, taskindex);
    UserStoryStore.deleteIssueById(id)
      .then(data => {
        if (data) {
          UserStoryStore.delItem(type, index, column, taskindex);
          message.success('删除成功', 1.5);
        }
      })
      .catch(error => {
        console.log(error);
        message.error('删除失败');
      });
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
          UserStoryStore.updateLocalIssue(
            {
              id: id,
              type: type,
              index: index,
              column: column,
              taskindex: taskindex,
              parentId: parentId,
              preId: preId,
              nextId: nextId,
            },
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
  render() {
    return (
      <div
        className="cardContainer"
        style={{ ...styles.cardstyle, ...this.props.style }}
      >
        <div style={styles.content}>
          {UserStoryStore.showstorynum ? (
            <span>{this.props.storynum}</span>
          ) : null}
          <textarea
            ref={this.saveref.bind(this)}
            onMouseDown={e => e.stopPropagation()}
            onDoubleClick={this.setFocus.bind(this)}
            onFocus={this.focus.bind(this)}
            onBlur={this.handin.bind(this)}
            {...(this.state.disabled ? { readOnly: 'readonly' } : '')}
            style={{
              ...{
                border: 'none',
                outline: 'none',
                height: '100%',
                width: '100%',
                resize: 'none',
                lineHeight:'15px',
                overflow: 'hidden',
              },
              ...this.props.style,
            }}
            defaultValue={
              this.state.description !== ''
                ? this.state.description
                : '请输入描述'
            }
          />
        </div>
        <div
          className="hoverMenu"
          style={{ ...styles.menus, ...this.props.style }}
        >
          <Icon
            className="menu"
            type="edit"
            style={styles.menuicon}
            onClick={this.setFocus.bind(this)}
          />
          <Icon
            className="menu"
            type="delete"
            onClick={this.del.bind(this)}
            style={styles.menuicon}
          />
          <Icon
            className="menu"
            type={this.props.type === 'story' ? 'down' : 'right'}
            style={styles.menuicon}
            onClick={this.add.bind(this)}
          />
        </div>
      </div>
    );
  }
}
