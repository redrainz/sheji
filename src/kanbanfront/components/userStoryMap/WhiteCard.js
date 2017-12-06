/*eslint-disable*/
import { Icon } from 'antd';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';

const styles = {
  cardstyle: {
    boxShadow: 'none',
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
    background: 'rgba(255,255,255,0.7)',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  menuicon: {
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    color: 'gray',
    width: '30px',
    height: '30px',
    fontSize: '20px',
    lineHeight: '30px',
    boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
  },
};
@observer
export default class WhiteCard extends Component {
  render() {
    return (
      <div
        role="none"
        className="cardContainer"
        style={{ ...styles.cardstyle, ...this.props.style }}
      />
    );
  }
}
