/**
 * Created by knight on 2017/11/16.
 */
/*eslint-disable*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import {Button, Modal, Form, Input, Row, Col,} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

class EditDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const {description, handleCancel, handleOk, form, visible} = this.props;
    const {getFieldDecorator} = this.props.form;
    // const options = this.state.data.map(data => <Option key={data.name}>{data.name}</Option>);
    return (
      <div className="sprintModalStyle">
        <Modal
          visible={visible}
          title="迭代详情"
          closable={true}
          className="modalTitleStyle"
          footer={<div>
            <Button onClick={handleOk} className="onCreateStyle">确认</Button>
            <Button onClick={handleCancel}>取消</Button>
          </div>
          }
        >
          <Form layout="vertical">
            <FormItem label="迭代描述">
              {getFieldDecorator('description', {initialValue: description}, {
                rules: [{required: true, message: '请输入迭代描述!'}],
              })(<Input type="textarea" rows={3}/>)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create({})(withRouter(EditDescription));
