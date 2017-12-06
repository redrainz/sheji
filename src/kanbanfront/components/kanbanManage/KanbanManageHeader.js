/*eslint-disable*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Slider, Dropdown, Menu, Button, message, Select } from 'antd';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import '../../assets/css/userStoryMap-card.css';
const Option = Select.Option;

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
class KanbanManageHeader extends Component {

  render() {
    return (
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
          }}
        >
          看板管理
        </div>
        <div
          style={{
            margin: '0 100px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#3F51B5',
            fontSize: '14px',
          }} onClick={this.props.showNewKanbanModal}>
          <i className="material-icons" style={styles.icon}>
            playlist_add
          </i>
          添加看板
        </div>
      </div>
    );
  }
}

KanbanManageHeader.propTypes = {};

export default KanbanManageHeader;
