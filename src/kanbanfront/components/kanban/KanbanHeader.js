/*eslint-disable*/
import React, {Component} from 'react';
import {Icon, Tooltip, Dropdown, Menu, Badge} from 'antd';
// import '../../assets/css/userStoryMap-card.css';
require('../../assets/css/kanban.css')
const styles = {
  toolbarContainer: {
    // width: '',
    display: 'flex',
    alignItems: 'center',
    height: '58px',
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

class KanbanHeader extends Component {
  state = {
    cardNum: this.props.cardNum
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.cardNum.temp != null) {
      this.setState({
        cardNum: nextProps.cardNum.temp.length,
      })
    }

  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a onClick={this.props.handlePlanState}>从冲刺导入</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a onClick={this.props.handleReleasePlanState}>从发布计划导入</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <div style={styles.toolbarContainer}>
          <div
            title={this.props.kanbanName}
            style={{
              width: 158,
              marginLeft: '20px',
              fontSize: '18px',
              wordBreak: 'keep-all',
              color: 'rgba(0, 0, 0, 0.87)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {this.props.kanbanName}
          </div>
          <div
            style={{
              margin: '0 100px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#3F51B5',
              fontSize: '14px',
            }}
          >
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" id='kanbanDropdown' href="#" style={{color: '#3F51B5'}}>
                <i className="material-icons" style={styles.icon}>
                  move_to_inbox
                </i>
                导入用户故事
              </a>
            </Dropdown>
          </div>
        </div>
        <div style={{height: 30, borderBottom: '1px solid rgb(215,215,215)'}}>
          <Tooltip placement="bottom" title='绘制看板'>
            <i className="material-icons" id='2'
               style={{
                 cursor: 'pointer',
                 display: 'inline-block',
                 fontSize: 14,
                 lineHeight: '30px',
                 float: 'right',
                 marginRight: 25
               }}
               onClick={this.props.handleClick}
            >border_color</i>
          </Tooltip>
          <Tooltip title="卡片暂存区">

            <i className="material-icons"
               style={{
                 cursor: 'pointer',
                 display: 'inline-block',
                 fontSize: 17,
                 lineHeight: '30px',
                 float: 'right',
                 marginRight: 15
               }}
               onClick={this.props.handleTaskColumn}
            >note_add</i>
          </Tooltip>
          <div
            style={{
              background: '#f04134', color: '#fff', 'border-radius': '10px',
              maxWidth: 26,
              minWidth: 20,
              textAlign: 'center',
              transform: 'scale(0.6)',
              position: 'absolute',
              fontSize: '19',
              top: 53,
              right: 48,
              display: this.state.cardNum === 0 ? 'none' : 'block',
            }}>
            {this.state.cardNum}
          </div>
          <Tooltip title="添加卡片">
            <i className="material-icons"
               style={{
                 cursor: 'pointer',
                 display: 'inline-block',
                 fontSize: 16,
                 lineHeight: '30px',
                 float: 'right',
                 marginRight: 15
               }}
               onClick={this.props.handleCreateCard}
            >add_to_photos</i>
          </Tooltip>
        </div>
      </div>

    );
  }
}

KanbanHeader.propTypes = {};

export default KanbanHeader;
