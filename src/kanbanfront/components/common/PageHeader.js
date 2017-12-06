import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Icon, Tooltip } from 'antd';

export const PageHeadStyle = {
  leftBtn: {
    marginTop: '10px',
    marginLeft: '30px',
    lineHeight: '24px',
    height: '28px',
    color: 'rgb(59, 120, 231)',
    float: 'left',
  },
  leftBtn2: {
    marginTop: '10px',
    marginLeft: '15px',
    lineHeight: '24px',
    height: '28px',
    color: 'rgb(59, 120, 231)',
    float: 'left',
  },
  rightBtn: {
    marginTop: '10px',
    marginRight: '20px',
    lineHeight: '24px',
    height: '28px',
    color: 'rgb(59, 120, 231)',
    float: 'right',
  },
  backIcon: {
    color: 'rgb(59, 120, 231)',
  },
  inputLine: {
    marginTop: '10px',
    marginLeft: '25px',
    lineHeight: '24px',
    height: '28px',
    color: 'rgb(59, 120, 231)',
    float: 'left',
    borderStyle: 'hidden hidden inset',
    textAlign: 'center',
    width: '80px',
  },
  leftBtnSearch: {
    marginTop: '10px',
    lineHeight: '24px',
    height: '28px',
    color: 'rgb(59, 120, 231)',
    float: 'left',
  },
};

class PageHeader extends Component {
  onBackBtnClick() {
    this.linkToChange(this.props.backPath);
  }

  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };
  render() {
    const { title, backPath, children } = this.props;
    let titleStyle = PageHeadStyle.title;
    let backBtn = '';
    if (backPath) {
      backBtn = (<div>
        <Tooltip
          title={HAP.languageChange('return')}
          placement="bottom"
          getTooltipContainer={that => that}
        >
          <a
            role="none"
            onClick={() => {
              this.onBackBtnClick();
            }}
            className="back-btn small-tooltip"
          ><Icon type="arrow-left" /></a>
        </Tooltip>
      </div>
      );
      const titleStyleTemp = Object.assign({}, titleStyle, { paddingLeft: '5px' });
      titleStyle = titleStyleTemp;
    }
    return (
      <div className="page-head">
        {backBtn}
        <h1>{title}</h1>
        {children}
      </div>
    );
  }
}

PageHeader.propTypes = {
  backPath: PropTypes.string,
};

export default withRouter(PageHeader);
