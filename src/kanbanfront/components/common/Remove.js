/**
 * Created by chenzl on 2017/8/2.
 */
import React from 'react';
import { Modal, Icon, Col, Row, Button } from 'antd';
import PropTypes from 'prop-types';

class Remove extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    const { open, handleCancel, handleConfirm } = this.props;
    return (
      <Modal
        visible={open || false}
        width={400}
        onCancel={handleCancel}
        wrapClassName="vertical-center-modal remove"
        footer={<div><Button
          onClick={handleCancel}
        >{HAP.languageChange('取消')}</Button><Button
          type="primary"
          onClick={handleConfirm}
        >{HAP.languageChange('确定')}</Button>
        </div>}
      >
        <Row>
          <Col span={24}>
            <Col span={2}>
              <a style={{ fontSize: 20, color: '#ffc07b' }}>
                <Icon type="question-circle-o" />
              </a>
            </Col>
            <Col span={22}>
              <h2>{HAP.languageChange('确定要删除当前Issue?')}</h2>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col offset={2}>
            <div style={{ marginTop: 10 }}>
              <span>{HAP.languageChange('你的所有子卡将会被一同删除！')}</span>
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}
Remove.propTypes = {
  open: PropTypes.bool,
};
export default Remove;
