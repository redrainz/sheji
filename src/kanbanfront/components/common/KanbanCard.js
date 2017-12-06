/*eslint-disable*/
import React from 'react';
import KanbanCardStore from '../../stores/origanization/kanban/KanbanCardStore';
import {message, Icon} from 'antd';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

require('../../assets/css/kanban-card.css');

class KanbanCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDescription: this.props.issueInfo.description,
      issueInfo: this.props.issueInfo,
      CardsChildDisplayStatus: 'none'
    }
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps',nextProps.issueInfo)
    this.setState({
      issueInfo: nextProps.issueInfo,
    })
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
    if (this.state.issueInfo.issueType === 'story') {
      return 'rgba(253, 188, 180, 1)'
    }
    else if (this.state.issueInfo.issueType === 'task') {
      return 'rgba(119, 189, 249, 1)'
    }
  };

  changeCardsChildDisplayStatus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      CardsChildDisplayStatus: 'block'
    })
  };

  componentWillReceiveProps(nextProps) {
      this.setState({
        issueInfo: nextProps.issueInfo
      })
  }
  handleClick = () => {
    this.props.linktoChange(`createSubCard/${this.props.issueInfo.id}`)
  };
  disableTaskChild=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      CardsChildDisplayStatus:'none',
    })
  }
  getColor=(type)=>{
    if(type==='story'){
      return '#3F51B5'
    }if(type==='task'){
      return '#009688'
    }
  }
  render() {
    return (
      <div className="card" id={this.state.issueInfo.issueId} onClick={this.testPrevent}>
        <div className="card-box" style={{outline: 'none'}}>
          <div className="card-desc"
               id={this.state.issueInfo.id}
               onClick={this.props.changeCardsDetail}
               style={{
                 transformOrigin: '69 8.5 0',
                 textOverflow:'ellipsis',
                 whiteSpace:'nowrap',
                 overflow:'hidden'
               }}>
            <span id={this.state.issueInfo.id}>
            {this.state.issueInfo.description}
            </span>
          </div>
          <div className="color-bar" style={{backgroundColor:this.getColor(this.state.issueInfo.issueType)}}/>
          <div className="kanbanCard-header">
            <div className="lf-header">
              {this.state.issueInfo.parentId != null ? `#${this.state.issueInfo.parentId}-${this.state.issueInfo.issueId}`
                : `#${this.state.issueInfo.issueId}`}
            </div>
            {/*<div className="rt-header-box" style={{backgroundColor: this.getBackgroundColor()}}>*/}
              {/*&nbsp;{this.state.issueInfo.issueType}&nbsp;*/}
            {/*</div>*/}
          </div>
          <div id={this.state.issueInfo.acception} className="lf-label">{this.state.issueInfo.acception}</div>
          <div className="mid-label" style={{display:this.state.issueInfo.columnId == null || this.state.issueInfo.subIssue.length === 0 ? 'none':''}} onClick={this.changeCardsChildDisplayStatus}>
            <Icon type="bars" style={{
            fontSize: 13,
            position: 'relative',
            top: 1
          }}/>{}/{this.state.issueInfo.subIssue.length}
          </div>
          <div className="rt-label">{this.state.issueInfo.storyPoint}</div>
        </div>
        <div className="card-child" style={{display: this.state.CardsChildDisplayStatus}}
             onClick={this.handleCardChildClick}>
          <Icon type="close" style={{position: 'absolute',left:0,color:'white'}} onClick={this.disableTaskChild}/>
          <span id='1' style={{top: 6, fontSize: 12, color: 'white', position: 'relative', cursor: 'pointer',}}
                onClick={this.handleClick}><Icon type='plus' style={{position: 'relative', top: 1}}/>添加子卡</span>
          <hr style={{marginTop: 12, color: 'white', opacity: '1.0'}}/>
          <Droppable droppableId={`${this.state.issueInfo.columnId},0,0,0,CardChild,${this.state.issueInfo.id}`}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef}
                   style={{...snapshot.isDraggingOver, height: '100%', width: '100%', overflow: 'auto'}}
              >
                {this.props.getSubCards(this.state.issueInfo.subIssue)}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    );
  }
}

export default KanbanCard;
