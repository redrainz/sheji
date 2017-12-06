/**
 * Created by chenzl on 2017/10/20.
 * Feature:展示新建/编辑Story显示页面
 */
/*eslint-disable*/
import React,{Component} from 'react'
import {Form, Row, Col, Button, Select, Input, DatePicker, Upload, Icon, message, InputNumber,AutoComplete } from 'antd';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import SprintStore from '../../stores/origanization/sprint/SprintStore'
import {withRouter} from 'react-router-dom';
import {observer} from 'mobx-react';
import IssueTextEditor from './IssueTextEditor'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const dateFormat = 'YYYY-MM-DD';

@observer
class StoryDetail extends Component{
  state={
    isSubmit: false,
  }
  // 返回Issue
  backIssue = () => {
    this.linkToChange('/kanbanfront/issueManage');
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
        this.setState({submitting: true});
        IssueManageStore.updateIssueById(
          {...data, objectVersionNumber: this.props.issueData.objectVersionNumber},
          this.props.id).then(data => {
          if (data) {
            message.success("修改成功");
            this.linkToChange("/kanbanfront/IssueManage");
          }
        }).catch(error => {
          message.info(HAP.languageChange("修改失败!"));
        });
      }
    });
  }
  // 时间格式转换
  formDate(data){
    let temp=new Date(data);
    return temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
  }
  render(){
    /*-------遍历迭代---------*/
    const sprintArr=[];
    const projectId=1;
    SprintStore.getSprintByProjectId(projectId).then(
      data=>{
        if (data){
          for (let p=0;p<=data.length;p++){
            sprintArr.push(<Option value={`${data[p].id}`}>{data[p].name}</Option>);
          }
        }
      }
    ).catch(e=>{
      console.log(e);
    });
    const {getFieldDecorator} = this.props.form;
    const labelTypeArr=this.props.labelTypeArr;
    const issueData=this.props.issueData;
    const startTime=this.formDate(issueData.startTime);
    const endTime=this.formDate(issueData.endTime);
    const formItemLayout2 = {
      labelCol: {span: 6},
      wrapperCol: {span: 12},
    };
    const workLoad = {
      labelCol: {span: 6},
      wrapperCol: {span: 12},
    };

    const buttonItemLayout = {
      wrapperCol: {span: 12, offset: 6},
    };
    return(
      <div className="createIssue text-editor">
        <div style={{marginTop: 20}}>
          <Form
            layout="horizontal"
            className="ant-advanced-search-form"
            onSubmit={this.savaIssueMsg}
          >
            <Row gutter={8}>
              {/*story类型*/}
              <Row>
                <Col span={8} offset={4}>
                  <FormItem label={HAP.languageChange('issue.issueType')} {...workLoad}>
                    {getFieldDecorator('issueType', {initialValue: issueData ? issueData.issueType : "Task",})
                    (<Select>
                      <Option value="UserStory">Story</Option>
                      <Option value="Task">Task</Option>
                      <Option value="Bug">Bug</Option>
                    </Select>)}
                  </FormItem>
                </Col>
              </Row>
                <Row>
                  <Col>
                    <FormItem label={HAP.languageChange('issue.description')} {...formItemLayout2}>
                      {getFieldDecorator('description',{initialValue:issueData?issueData.description:'',})
                      (<TextArea placeholder="输入卡片的描述" style={{minHeight: 20, maxHeight: 50}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormItem label={HAP.languageChange('issue.context')} {...formItemLayout2}>
                      {getFieldDecorator('acception',{initialValue:issueData?issueData.acception:''})
                      (
                        <TextArea placeholder="输入卡片的验收标准" style={{minHeight: 100, maxHeight: 200}}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.storyPoint')} {...workLoad}>
                      {getFieldDecorator('storyPoint', {initialValue:issueData?issueData.storyPoint:''})
                      (<span>
                        <InputNumber style={{width:'100%'}}/>
                    </span>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.assigneeId')} {...workLoad}>
                      {getFieldDecorator('parentId',{initialValue:issueData?issueData.assigneeId:''})
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
                      {getFieldDecorator('issuePriority',{initialValue:issueData?issueData.priority:''})
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
                      {getFieldDecorator('sprintId',{initialValue:issueData?issueData.sprintId:''})
                      (<Select style={{width:'100%'}}>
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
                      {getFieldDecorator('label',{initialValue:issueData?issueData.label:'Story'})(
                        <Select style={{width:'34%'}}>
                          {labelTypeArr}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              <Row>
                <FormItem  {...buttonItemLayout}>
                  <Col span={2}>
                    <Button size="default" loading={this.state.isSubmit} type="primary"
                            htmlType="submit"
                            className="login-form-button">
                      {HAP.languageChange("修改")}
                    </Button>
                  </Col>
                  <Button style={{marginLeft: 8, float: 'right'}} htmlType="reset" onClick={this.backIssue}>
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
export default Form.create({})(withRouter(StoryDetail));
