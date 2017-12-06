/**
 * Created by chenzl on 2017/10/20.
 * Feature:展示Task详情页面
 */
/*eslint-disable*/
import React,{Component} from 'react'
import {Form, Row, Col, Button, Select, Input, DatePicker, Upload, Icon, message, InputNumber,AutoComplete } from 'antd';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import SprintStore from '../../stores/origanization/sprint/SprintStore'
import {withRouter} from 'react-router-dom';
import {observer} from 'mobx-react';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const {MonthPicker, RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@observer
class TaskDetail extends Component{
  constructor(props){
    super(props);
    this.state={
      val:'',
      isSubmit: false,
    }
  }
  // 时间格式转换
  formDate(data){
    let temp=new Date(data);
    return temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
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
      if(data.parentId){
        data.parentId=this.state.val;
      }
      if (!err) {
        this.setState({submitting: true});
        IssueManageStore.updateIssueById(
          {...data, objectVersionNumber: this.props.issueData.objectVersionNumber},
          this.props.id).then(data => {
          if (data) {
            message.success("修改成功");
            this.setState({
              submitting: false,
            });
            this.linkToChange("/kanbanfront/IssueManage");
          }
        }).catch(error => {
          message.info(HAP.languageChange("修改失败!"));
          this.setState({
            submitting: false,
          });
        });
      }
    });
  }
  // 选择自动补全的值
  selectValue=(value)=>{
    // const start=value.indexOf('#');
    const end=value.indexOf(',');
    this.setState({
      val:value.slice(6,end)
    });
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
    // const typeArr=this.props.typeArr;
    const parentArr=this.props.parentArr;
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
    return (
      <div className="createIssue">
        <div style={{marginTop: 20}}>
          <Form
            layout="horizontal"
            className="ant-advanced-search-form"
            onSubmit={this.savaIssueMsg}
          >
            <Row gutter={8}>
              {/*// task 类型*/}
              <div>
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
                      {getFieldDecorator('description',{initialValue: issueData ? issueData.description : '',})
                      (<TextArea placeholder="输入卡片的描述" style={{minHeight: 20, maxHeight: 50}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormItem label={HAP.languageChange('issue.context')} {...formItemLayout2}>
                      {getFieldDecorator('acception',{initialValue: issueData ? issueData.acception : '',})
                      (
                        <TextArea placeholder="输入卡片的验收标准" style={{minHeight: 100, maxHeight: 200}}/>
                      )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.workload')} {...workLoad}>
                      {getFieldDecorator('workload')
                      (<div style={{lineHeight:'28px'}}>
                        <InputNumber style={{display:'inline-block',width:'90%', borderRadius:'0px',margin:'0px',height:'28px'}}/>
                        <div style={{height:'28px',border:'1px solid #d9d9d9',textAlign:'center',
                          float:'right',width:'10%',lineHeight:'28px'}}>H</div>
                      </div>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.assigneeId')} {...workLoad}>
                      {getFieldDecorator('assigneeId',{initialValue:issueData?issueData.assigneeId:''})
                      (<Select style={{width: '100%'}}>
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
                      {getFieldDecorator('issuePriority',{initialValue:issueData?issueData.issuePriority:''})
                      (<Select>
                        <Option value="1">低</Option>
                        <Option value="2">中</Option>
                        <Option value="3">高</Option>
                        <Option value="4">非常高</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.ParentDemand')} {...workLoad}>
                      {getFieldDecorator('parentId',{initialValue:issueData?issueData.parentId:''})
                      (
                        <AutoComplete
                          style={{width: '100%'}}
                          dataSource={parentArr}
                          onSelect={this.selectValue}
                          placeholder="输入需求编号，关键字搜索"
                          filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.Iteration')} {...workLoad}>
                      {getFieldDecorator('sprintId',{initialValue:issueData?issueData.sprintId:''})
                      (<Select style={{width:'100%'}}>
                        {sprintArr}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.Task')} {...workLoad}>
                      {getFieldDecorator('labelId',{initialValue:issueData?issueData.labelId:''})
                      (<Input placeholder="输入任务编号，关键字搜索" style={{width: '100%'}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.startTime')}{...workLoad}>
                      {getFieldDecorator('startTime',{initialValue:moment(startTime,dateFormat)})
                      (<DatePicker
                        placeholder="Start"
                        style={{width: '100%'}}
                      />)}</FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.deadline')} {...workLoad}>
                      {getFieldDecorator('endTime',{initialValue:moment(endTime,dateFormat)})
                      (<DatePicker
                        placeholder="End"
                        style={{width: '100%'}}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormItem label={HAP.languageChange('issue.label')} {...workLoad}>
                      {getFieldDecorator('label',{initialValue:issueData?issueData.label:''})(
                        <Select style={{width:'34%'}}>
                          {labelTypeArr}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
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
export default Form.create({})(withRouter(TaskDetail));
