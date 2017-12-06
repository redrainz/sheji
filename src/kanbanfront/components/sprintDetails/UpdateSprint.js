/**
 * Created by chenzl on 2017/11/14.
 * Feature:新建冲刺
 */
/*eslint-disable*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import {Button, Modal, Form, Input, Radio, Row, Col, DatePicker, Select} from 'antd';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class UpdateSprint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      // endOpen: false,
      startTime: -28800000,
      endTime: -28800000,
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     endOpen:false
  //   })
  // }

  // 时间格式转换
  formDate(data) {
    let temp = new Date(data);
    return temp.getFullYear() + "-" + (temp.getMonth() + 1) + "-" + temp.getDate();
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  // handleStartOpenChange = (open) => {
  //   if (!open) {
  //     this.setState({endOpen: true});
  //   }
  // }

  // handleEndOpenChange = (open) => {
  //   this.setState({endOpen: open});
  // }
  // 选择Release
  selectChange(data) {
    if (data == '') {
      this.setState({value: data, data: [], kanbans: [], createDisplay: false});
    } else {
      let temp = [];
      for (let i = 0; i < this.state.kanbansInProject.length; i++) {
        if (this.state.kanbansInProject[i].name.indexOf(data) >= 0)
          temp.push(this.state.kanbansInProject[i]);
      }
      this.setState({value: data, data: temp, kanbans: temp, createDisplay: false});
    }

  }

  render() {
    const {updateVisible, onCancel, onCreate, onDelete, form, data,releaseData} = this.props;
    const {startValue, endValue, endOpen} = this.state;
    const {getFieldDecorator} = this.props.form;
    const startTime = this.formDate(data.startTime);
    const endTime = this.formDate(data.endTime);
    let  releasePlanName;
    const dstartTime = this.formDate(this.state.startTime);
    const dendTime = this.formDate(this.state.endTime);
    releaseData.map((item,index)=>{
      console.log(item)
      if(item.id==data.releasePlanId)
        releasePlanName=item.name;
    })
    console.log(data)
    // const options = this.state.data.map(data => <Option key={data.name}>{data.name}</Option>);
    return (
      <div className="sprintModalStyle">
        <Modal
          visible={updateVisible}
          title="编辑冲刺"
          closable={false}
          className="modalTitleStyle"
          onCancel={onCancel}
          footer={<div>
            <Button onClick={onCreate} className="onCreateStyle">确认</Button>
            <Button onClick={onCancel}>取消</Button>
            <Button onClick={onDelete} style={{float: 'left'}}>删除</Button>
          </div>
          }
        >
          <Form layout="vertical">
            <FormItem label="冲刺名称">
              {getFieldDecorator('name', {initialValue: data.name}, {
                rules: [{required: true, message: '请输入冲刺名称!'}],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="冲刺描述">
              {getFieldDecorator('description', {initialValue: data.description}, {
                rules: [{required: true, message: '请输入冲刺描述!'}],
              })(<TextArea rows={3} style={{resize:"none"}} />)}
            </FormItem>
            <FormItem label="选择发布计划">
              {getFieldDecorator('releasePlanName', {initialValue: releasePlanName})(
                <Input disabled={true}/>
              )}
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="开始时间">
                  {getFieldDecorator('startTime', {initialValue: moment(startTime, dateFormat)}, {
                    rules: [{required: true, message: '请选择开始时间!'}],
                  })(
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      showTime
                      format="YYYY-MM-DD"
                      placeholder="开始时间"
                      onChange={this.onStartChange}
                      // onOpenChange={this.handleStartOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="结束时间" style={{marginLeft: '45px'}}>
                  {getFieldDecorator('endTime', {initialValue: moment(endTime, dateFormat)}, {
                    rules: [{required: true, message: '请选择结束时间!'}],
                  })(
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      showTime
                      format="YYYY-MM-DD"
                      placeholder="结束时间"
                      onChange={this.onEndChange}
                      // open={endOpen}
                      // onOpenChange={this.handleEndOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create({})(withRouter(UpdateSprint));
