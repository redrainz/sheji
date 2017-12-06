/**
 * Created by chenzl on 2017/10/20.
 * Feature:展示新建/编辑Story显示页面
 */
/*eslint-disable*/
import React,{Component} from 'react'
import {Form, Row, Col, Button, Select, Input, DatePicker, Upload, Icon, message, InputNumber,AutoComplete } from 'antd';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import SprintStore from '../../stores/origanization/sprint/SprintStore';
import {withRouter} from 'react-router-dom';
import {observer} from 'mobx-react';
import moment from 'moment';
import SimplemdeEditor from "./SimplemdeEditor";
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const {MonthPicker, RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@observer
class StoryMessge extends Component{
  constructor(props){
    super(props);
    this.state = {
      isSubmit: false,
      editorValue:'',
      startTime:-28800000,
      endTime:-28800000,
    };
  }
  // 路由跳转设置
  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };
  // 保存Issue并跳转回到Issue管理页面
  savaIssueMsg = (e) => {
    e.preventDefault();
    // 校验表单
    this.props.form.validateFieldsAndScroll((err, data) => {
    if(data.acception===undefined){
      data.acception=this.state.editorValue;
    }
      // 判断时间非空
      if(data.startTime!=undefined){
        data.startTime=data.startTime.valueOf();
      }else {
        data.startTime=-28800000
      }
      if(data.endTime!=undefined){
        data.endTime=data.endTime.valueOf();
      }else {
        data.endTime=-28800000
      }
      if (!err) {
        if (data.authorizedGrantTypes) {
          data.authorizedGrantTypes = data.authorizedGrantTypes.join(',');
          this.setState({submitting: true});
        }
        IssueManageStore.createIssue(data).then(data => {
          if (data) {
            message.success('添加成功',0.1);
            this.linkToChange(`/kanbanfront/issueManage`);
          }
        }).catch(error => {
          this.setState({
            submitting: false,
          });
        });
      }
    });
  }
  // 保存并继续添加
  savaAndAdd = (e) => {
    e.preventDefault();
    // 校验表单
    this.props.form.validateFieldsAndScroll((err, data) => {
      if(data.acception===undefined){
        data.acception=this.state.editorValue;
      }
      // 判断时间非空
      if(data.startTime!=undefined){
        data.startTime=data.startTime.valueOf();
      }else {
        data.startTime=-28800000
      }
      if(data.endTime!=undefined){
        data.endTime=data.endTime.valueOf();
      }else {
        data.endTime=-28800000
      }
      if (!err) {
        if (data.authorizedGrantTypes) {
          data.authorizedGrantTypes = data.authorizedGrantTypes.join(',');
          this.setState({submitting: true});
        }
        IssueManageStore.createIssue(data).then(data => {
          if (data) {
            message.success('添加成功', 0.5)
            this.props.form.resetFields();// 清空
          }
        }).catch(error => {
          this.setState({
            submitting: false,
          });
        });
      }
    });
  }
  // 或者富文本的值
  getEditorValue=(value)=>{
    this.setState({
      editorValue:value,
    });
  }
  // 选择迭代的时间
  getSprintTime=(value)=>{
    const id=value;
    SprintStore.getSprintById(value).then((data)=>{
      this.setState({
        startTime:data.startTime,
        endTime:data.endTime
      });
    })
  }
  // 时间格式转换
  formDate(data){
    let temp=new Date(data);
    return temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
  }
  render(){
    const {getFieldDecorator} = this.props.form;
    const sprintArr=this.props.sprintArr;
    const typeArr=this.props.typeArr;
    const startTime=this.formDate(this.state.startTime);
    const endTime=this.formDate(this.state.endTime);
    const formItemLayout2 = {
      labelCol: {span: 6},
      wrapperCol: {span: 12},
    };
    const workLoad = {
      labelCol: {span: 6},
      wrapperCol: {span: 12},
    };
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 3},
    };
    const buttonItemLayout = {
      wrapperCol: {span: 12, offset: 6},
    };
    return(
      <div className="createIssue">
        <div style={{marginTop: 20}}>
          <Form
            layout="horizontal"
            className="ant-advanced-search-form"
            onSubmit={this.savaIssueMsg}
          >
            <Row gutter={8}>
              {/*story类型*/}
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('projectId', {initialValue: 1})
                    (<Input style={{display: 'none'}}/>)}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('issueType', {initialValue: this.props.typeValue})
                    (<Input style={{display: 'none'}}/>)}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('status', {initialValue: 'todo'})
                    (<Input style={{display: 'none'}}/>)}
                  </FormItem>
                </Col>
              </Row>
              <div>
                <Row>
                  <Col>
                    <FormItem label={HAP.languageChange('issue.description')} {...formItemLayout2}>
                      {getFieldDecorator('description', {
                        rules: [{required: true, message: '请输入Issue描述！'}]
                      })
                      (<TextArea placeholder="输入卡片的描述" style={{minHeight: 20, maxHeight: 50}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormItem label={HAP.languageChange('issue.context')} {...formItemLayout2}>
                      {getFieldDecorator('acception')
                      (
                        <SimplemdeEditor getEditorValue={this.getEditorValue}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.storyPoint')} {...workLoad}>
                      {getFieldDecorator('storyPoint', {
                        /*   rules: [{ validator: this.checkPrice.bind(this) }],*/
                      })
                      (<span>
                        <InputNumber style={{width:'100%'}}/>
                    </span>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.assigneeId')} {...workLoad}>
                      {getFieldDecorator('parentId')
                      (<Select onChange={this.ChangeParticipant} style={{width: '100%'}}>
                        <Option value="1">陈造龙</Option>
                        <Option value="2">钱秋梅</Option>
                        <Option value="3">张宇</Option>
                        <Option value="4">陈真</Option>
                        <Option value="5">柯希权</Option>
                        <Option value="6">PO</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.priority')} {...workLoad}>
                      {getFieldDecorator('issuePriority')
                      (<Select onChange={this.ChangePriority}>
                        <Option value="1">低</Option>
                        <Option value="2">中</Option>
                        <Option value="3">高</Option>
                        <Option value="4">非常高</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.Iteration')} {...workLoad}>
                      {getFieldDecorator('sprintId')
                      (<Select style={{width:'100%'}} onSelect={this.getSprintTime}>
                        {sprintArr}
                      </Select>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.startTime')}{...workLoad}>
                      {getFieldDecorator('startTime',{initialValue:moment(startTime,dateFormat)})
                      (<DatePicker
                        style={{width: '100%'}}
                      />)}</FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.deadline')} {...workLoad}>
                      {getFieldDecorator('endTime',{initialValue:moment(endTime,dateFormat)})
                      (<DatePicker
                        style={{width: '100%'}}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormItem label={HAP.languageChange('issue.label')} {...workLoad}>
                      {getFieldDecorator('label',{initialValue:'Story'})(
                        <Select
                          multiple
                          placeholder="选择想要的标签"
                          style={{width:'34%'}}>
                          {typeArr}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
              <Row>
                <FormItem  {...buttonItemLayout}>
                  <Button type="primary" htmlType="submit"
                          loading={this.state.isSubmit}>{HAP.languageChange('issue.save')}</Button>
                  <a style={{marginLeft: 8, fontSize: 12}} onClick={this.savaAndAdd}>
                    {HAP.languageChange('issue.savaAndAdd')}
                  </a>
                  <Button style={{marginLeft: 8, float: 'right'}} htmlType="reset" onClick={this.props.backIssue}>
                    {HAP.languageChange('issue.back')}
                  </Button>
                </FormItem>
              </Row>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
export default Form.create({})(withRouter(StoryMessge));
