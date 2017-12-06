/*eslint-disable*/
import React from 'react';
import KanbanCardStore from '../../stores/origanization/kanban/KanbanCardStore';
import {message} from 'antd';


require('../../assets/css/kanban-card.css');

class KanbanCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDescription: this.props.issueInfo.description,
    }
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }

  /*
   * 处理textarea的失焦事件，更新数据库中的卡片描述信息
   * */
  handleOnBlur(e) {
    const id = e.target.id;
    const description = e.target.value;
    const descriptionPre = e.target.innerHTML;
    KanbanCardStore.setRemoteDescription(id, description).then(returnData => {
      /*如果有返回数据，则判断卡片描述信息是否发生变化*/
      if (returnData) {
        /*如果发生变化则提示更新成功*/
        if (description != descriptionPre) {
          message.success('更新成功', 1.5);
        }
      } else {/*更新失败则提示卡片不存在*/
        message.error('该卡片不存在', 1, this.props.handleReloadKanban);
      }
    });
    this.setState({
      currentDescription: description,
    });
  }

  getBackgroundColor = () => {
    if (this.props.issueInfo.issueType === 'UserStory') {
      return 'rgba(253, 188, 180, 1)'
    }
    else if (this.props.issueInfo.issueType === 'Task') {
      return 'rgba(119, 189, 249, 1)'
    }
  };

  render() {
    return (
      <div className="small-card" id={this.props.issueInfo.issueId}>
        <div className="small-card-box" style={{outline: 'none'}} id={this.props.issueInfo.id}
             onClick={this.props.changeCardsDetail}>
          <div className="small-color-bar"/>
          <div className="small-header">
            <div className="small-lf-header">#{this.props.issueInfo.issueId}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default KanbanCard;
