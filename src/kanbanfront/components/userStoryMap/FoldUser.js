/*eslint-disable*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

class FoldUser extends Component {
  render() {
    return (
      <div
        style={{
          width: '30px',
          height: '71px',
          fontSize: '12px',
          background: '#f27788',
          margin: '5px',
          padding: '3px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Icon
          type="plus-circle-o"
          style={{ cursor: 'pointer', margin: '5px 0' }}
        />
        <p
          style={{
            writingMode: 'vertical-lr',
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          折叠起来
        </p>
      </div>
    );
  }
}

FoldUser.propTypes = {};

export default FoldUser;
