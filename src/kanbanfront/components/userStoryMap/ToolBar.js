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
    height: '30px',
    padding: '10px',
    borderBottom: '1px solid rgba(0,0,0,0.26)',
    background: 'white',
  },
  slider: {
    width: '200px',
  },
  icon: {
    cursor: 'pointer',
    margin: '0 10px',
    fontSize: '14px',
  },
};
const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">无</Menu.Item>
    <Menu.Item key="2">卡片个数</Menu.Item>
  </Menu>
);
function handleMenuClick(e) {
  message.info('Click on menu item.');
  console.log('click', e);
}
function handleChange(value) {
  console.log(`selected ${value}`);
  switch (value) {
    case '1':
      UserStoryStore.showStoryNum(false);
      break;
    case '2':
      UserStoryStore.showStoryNum(true);
      break;
  }
}
function checkFull() {
  var isFull =
    document.fullscreenEnabled ||
    window.fullScreen ||
    document.webkitIsFullScreen ||
    document.msFullscreenEnabled;

  //to fix : false || undefined == undefined
  if (isFull === undefined) isFull = false;
  return isFull;
}
class ToolBar extends Component {
  constructor() {
    super();
    this.state = {
      full: false,
    };
    this.requestFullScreen = this.requestFullScreen.bind(this);
    window.onresize = this.checkEsc.bind(this);
  }
  requestFullScreen() {
    let toolbar = document.getElementById('toolbar');
    // toolbar.className='toolbar';
    var de = document.getElementById('userstory');
    // console.log(
    //   document.fullScreen,
    //   document.webkitIsFullScreen,
    //   document.mozFullScreen,
    // );
    if (
      document.webkitIsFullScreen ||
      document.fullScreen ||
      document.mozFullScreen
    ) {
      // console.log('yes');
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    } else {
      if (de.requestFullscreen) {
        de.requestFullscreen();
      } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
      } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
      }
    }
  }
  checkEsc() {
    this.setState({
      full: checkFull(),
    });
  }
  render() {
    // console.log(window.location);
    return (
      <div style={styles.toolbarContainer} id="toolbar">
        <div style={{ flex: 1, visibility: 'hidden' }} />
        {/* <Dropdown overlay={menu} trigger={['click']}>
          <Button
            style={{ marginLeft: '15px' }}
            style={{ marginRight: '20px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              颜色：
              <div
                style={{
                  background: '#b484c0',
                  width: '15px',
                  height: '15px',
                  margin: '0 5px',
                }}
              />
              <div
                style={{
                  background: '#ea6f81',
                  width: '15px',
                  height: '15px',
                  margin: '0 5px',
                }}
              />
              <div
                style={{
                  background: '#fa9d50',
                  width: '15px',
                  height: '15px',
                  margin: '0 5px',
                }}
              />
              <div
                style={{
                  background: '#fff8b5',
                  width: '15px',
                  height: '15px',
                  margin: '0 5px',
                }}
              />
              <div
                style={{
                  background: '#a7cdf3',
                  width: '15px',
                  height: '15px',
                  margin: '0 5px',
                }}
              />
              <Icon style={{ fontSize: '10px' }} type="caret-down" />
            </div>
          </Button>
        </Dropdown> */}
        {/* 统计：
        <Select
          defaultValue="1"
          style={{
            width: 80,
            outline: 'none',
            border: 'none',
            boxShadow: 'none',
            marginRight: '10px',
          }}
          onChange={handleChange}
        >
          <Option value="1">无</Option>
          <Option value="2">卡片个数</Option>
        </Select> */}
        {/* <Icon type="plus-circle" style={styles.icon} /> */}
        {/* <Icon type="plus" style={styles.icon} /> */}
        {/* <Icon type="shrink" style={styles.icon} onClick={this.props.fold} />
        <Icon
          type="arrows-alt"
          style={styles.icon}
          onClick={this.props.unfold}
        /> */}
        <div style={styles.slider}>
          <Slider
            defaultValue={10}
            min={5}
            max={20}
            onChange={this.props.scale}
            tipFormatter={scale => scale / 10}
          />
        </div>
        <i
          className="material-icons"
          style={styles.icon}
          onClick={this.requestFullScreen}
        >
          {this.state.full ? 'fullscreen_exit' : 'fullscreen'}
        </i>
      </div>
    );
  }
}

ToolBar.propTypes = {};

export default ToolBar;
