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
    marginLeft: '20px',
    marginRight: '28px',
    fontSize: '20px',
    color: '#3F51B5',
  },
};
function scrollSmooth(ele) {
  let clock = setInterval(() => {
    if (ele.scrollTop >= ele.scrollHeight - ele.clientHeight - 10) {
      clearInterval(clock);
    }
    ele.scrollTop += (ele.scrollHeight - ele.clientHeight) / 30;
  }, 10);
}
class Header extends Component {
  newGroup() {}
  render() {
    return (
      <div style={styles.toolbarContainer}>
        <i
          className="material-icons"
          style={styles.icon}
          onClick={this.props.handleClick}
        >
          keyboard_backspace
        </i>
        <div
          style={{
            fontSize: '18px',
            wordBreak: 'keep-all',
            color: 'rgba(0, 0, 0, 0.87)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          冲刺管理
        </div>
      </div>
    );
  }
}

Header.propTypes = {};

export default Header;
