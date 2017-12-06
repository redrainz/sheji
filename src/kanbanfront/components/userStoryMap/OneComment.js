/*eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class OneComment extends Component {
  render() {
    const { data } = this.props;
    return (
      <div>
        <span>{data.username}</span>
        <span>{data.content}</span>
      </div>
    );
  }
}

OneComment.propTypes = {};

export default OneComment;
