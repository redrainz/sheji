/*eslint-disable*/
import React, { Component } from 'react';
import { Icon,Tooltip } from 'antd';
// import '../../assets/css/userStoryMap-card.css';

const styles = {
  toolbarContainer: {
    // width: '',
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    // padding: '10px',
    borderBottom: '1px solid #D3D3D3',

    background: 'white',
  },
  slider: {
    width: '200px',
  },
  icon: {
    cursor: 'pointer',
    marginRight: '12px',
    fontSize: '14px',
  },
};
class EditKanbanHeader extends Component {

  render() {

    let editSwimLane;
    if(this.props.isCreatingSwimLane){
      editSwimLane =(
        <Tooltip title="退出绘制" placement="top">
          <i className="material-icons" onClick={ this.props.handleOnChangeModel } style={{
            cursor: 'pointer',
            display: 'inline-block',
            fontSize: 14,
            lineHeight: '30px',
            float: 'right',
            marginRight: 11,
            color:'#3F51B5',
            opacity: 1,
          }}>border_color</i>
        </Tooltip>
      );
    }else{
      editSwimLane =(
        <Tooltip title="绘制泳道" placement="top">
          <i className="material-icons" onClick={ this.props.handleOnChangeModel } style={{
            cursor: 'pointer',
            display: 'inline-block',
            fontSize: 14,
            lineHeight: '30px',
            float: 'right',
            marginRight: 11,
          }}>border_color</i>
        </Tooltip>
      );
    }

    return (
      <div>
        <div style={styles.toolbarContainer}>
          <div
            style={{
              marginLeft: '20px',
              fontSize: '18px',
              wordBreak: 'keep-all',
              color: 'rgba(0, 0, 0, 0.87)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth:105,
            }}
            title={this.props.kanbanName}
          >
            {this.props.kanbanName}
          </div>
          <div style={{backgroundColor: 'rgba(210, 216, 249, 0.45)',
            fontSize: 12,
            borderRadius: 4,
            position: 'relative',
            color: 'rgb(243, 6, 94)',
            marginLeft: 5,
            height: 15,
            marginTop: 7
          }}>
            {this.props.kanbanName!=null?(<span style={{position: 'relative', top: -5}}>绘制看板</span>):('')}
          </div>
        </div>

        <div style={{height: 30,borderBottom:'1px solid rgb(215,215,215)',userSelect:'none'}}>

          <Tooltip placement="top" title='使用看板'>
            <i className="material-icons" onClick={ this.props.toUseKanbanPage } style={{
              cursor: 'pointer',
              display: 'inline-block',
              fontSize: 18,
              lineHeight: '30px',
              float: 'right',
              marginRight: 25,
            }}>launch</i>
          </Tooltip>

          <Tooltip title="保存" placement="top">
            <i className="material-icons" onClick={ this.props.handleOnSave } style={{
              cursor: 'pointer',
              display: 'inline-block',
              fontSize: 18,
              lineHeight: '30px',
              float: 'right',
              marginRight: 11
            }}>save</i>
          </Tooltip>

          <Tooltip title="恢复" placement="top">
            <i className="material-icons" id="recover" onClick={ this.props.handleOnRecover } style={{
              cursor: 'pointer',
              display: 'inline-block',
              fontSize: 18,
              lineHeight: '30px',
              float: 'right',
              marginRight: 11
            }}>redo</i>
          </Tooltip>

          <Tooltip title="撤销" placement="top">
            <i className="material-icons" id="revocate" onClick={ this.props.handleOnRevocate } style={{
              cursor: 'pointer',
              display: 'inline-block',
              fontSize: 18,
              lineHeight: '30px',
              float: 'right',
              marginRight: 11
            }}>undo</i>
          </Tooltip>

          <Tooltip title="减少列高" placement="top">
            <i className="material-icons" onClick={ this.props.handleOnReduceHeight } style={{
              cursor: 'pointer',
              display: 'inline-block',
              fontSize: 20,
              lineHeight: '30px',
              float: 'right',
              marginRight: 11
            }}>arrow_upward</i>
          </Tooltip>

          <Tooltip title="增加列高" placement="top">
            <i className="material-icons" onClick={ this.props.handleOnAddHeight } style={{
              cursor: 'pointer',
              display: 'inline-block',
              fontSize: 20,
              lineHeight: '30px',
              float: 'right',
              marginRight: 11
            }}>arrow_downward</i>
          </Tooltip>

          {editSwimLane}

          <Tooltip title="新添一列" placement="top">
            <i className="material-icons" onClick={ this.props.handleOnAddColumn } style={{
              cursor: 'pointer',
              display: 'inline-block',
              fontSize: 22,
              lineHeight: '30px',
              float: 'right',
              marginRight: 11
            }}>add</i>
          </Tooltip>

        </div>
      </div>

    );
  }
}

EditKanbanHeader.propTypes = {};

export default EditKanbanHeader;
