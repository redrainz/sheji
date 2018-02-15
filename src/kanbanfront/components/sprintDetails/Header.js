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
function scrollSmooth(ele) {
  let clock = setInterval(() => {
    if (ele.scrollTop >= ele.scrollHeight - ele.clientHeight - 10) {
      clearInterval(clock);
    }
    ele.scrollTop += (ele.scrollHeight - ele.clientHeight) / 30;
  }, 10);
}
class Header extends Component {
  newGroup() {
    // let name = '未命名发布计划';
    // let release = {
    //   name: name,
    //   projectId: 1,
    // };
    // UserStoryStore.createRelease(release)
    //   .then(releaseData => {
    //     if (releaseData) {
    //       console.log(releaseData);
    //       UserStoryStore.addHeight({
    //         ...releaseData,
    //         ...{ issues: [], flag: true },
    //       });
    //       message.success('添加成功');
    //       scrollSmooth(document.getElementById('storyarea'));
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     message.error('添加失败');
    //   });
  }
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
          冲刺管理
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
          onClick={this.props.handleClick}
        >
          <i className="material-icons" style={styles.icon}>
            playlist_add
          </i>
          创建
        </div>
      </div>
    );
  }
}

Header.propTypes = {};

export default Header;
