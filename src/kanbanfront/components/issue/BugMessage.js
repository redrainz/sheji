/**
 * Created by chenzl on 2017/10/20.
 * Feature:展示BUG添加/编辑信息
 */
/*eslint-disable*/
import React,{Component} from 'react'
import {Form, Row, Col, Button, Select, Input, DatePicker, Upload, Icon, message, InputNumber,AutoComplete } from 'antd';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import {withRouter} from 'react-router-dom';
import {observer} from 'mobx-react';
import SimplemdeEditor from "./SimplemdeEditor";
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const {MonthPicker, RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@observer
class BugMessage extends Component{
  constructor(props){
    super(props);
    this.state={
      isSubmit: false,
      editorValue:'',
      val:''
    }
  }
  // 选择自动补全的值
  selectValue=(value)=>{
    // const start=value.indexOf('#');
    const end=value.indexOf(',');
    this.setState({
      val:value.slice(6,end)
    });
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
      if(data.parentId){
        data.parentId=this.props.id
      }else {
        data.parentId=this.state.val
      }
      if(data.acception===undefined){
        data.acception=this.state.editorValue;
      }
      if(data.deadline===''||data.deadline===null||data.deadline===undefined){
        data.deadline=-28800000;
      }else {
        data.deadline=data.deadline.valueOf();
      }
      if (!err) {
        if (data.authorizedGrantTypes) {
          data.authorizedGrantTypes = data.authorizedGrantTypes.join(',');
          this.setState({submitting: true});
        }
        IssueManageStore.createIssue(data).then(data => {
          if (data) {
            message.success('添加成功', 0.1)
            this.linkToChange(`/kanbanfront/issueManage`);
          }
        }).catch(error => {
          message.error('网络异常',0.1);
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
      if(data.parentId){
        data.parentId=this.state.val
      }else {
        data.parentId=this.props.id
      }
      if(data.acception===undefined){
        data.acception=this.state.editorValue;
      }
      if(data.deadline===''||data.deadline===null||data.deadline===undefined){
        data.deadline=-28800000;
      }else {
        data.deadline=data.deadline.valueOf();
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
  render(){
    const {getFieldDecorator} = this.props.form;
    const sprintArr=this.props.sprintArr;
    const typeArr=this.props.typeArr;
    const storyArr=this.props.storyArr;
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
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 3},
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
              {/*// BUG 类型*/}
              <Row>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('projectId', {initialValue: 1})
                    (<Input style={{display: 'none'}}/>)}
                  </FormItem>
                  <FormItem >
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
                    <FormItem label={HAP.languageChange('issue.BugType')} {...workLoad}>
                      {getFieldDecorator('bugType')
                      (<Select onChange={this.ChangeBugType}>
                        <Option value="1">错误代码</Option>
                        <Option value="2">界面优化</Option>
                        <Option value="3">设置缺陷</Option>
                        <Option value="4">配置相关</Option>
                        <Option value="5">安装部署</Option>
                        <Option value="6">安全相关</Option>
                        <Option value="7">性能问题</Option>
                        <Option value="8">标准规范</Option>
                        <Option value="9">测试脚本</Option>
                        <Option value="10">其他</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.assigneeId')} {...workLoad}>
                      {getFieldDecorator('assigneeId')
                      (<Select onChange={this.ChangeParticipant}>
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
                    <FormItem label={HAP.languageChange('issue.SeverityLevel')} {...workLoad}>
                      {getFieldDecorator('seriousLevel')
                      (<Select onChange={this.ChangeSeverityLevel}>
                        <Option value="1">非常严重</Option>
                        <Option value="2">一般</Option>
                        <Option value="3">严重</Option>
                        <Option value="4">不严重</Option>
                        <Option value="5">非常不严重</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.RelatedNeeds')} {...workLoad}>
                      {getFieldDecorator('parentId',{initialValue:this.props.id})
                      (<AutoComplete
                        style={{width: '100%'}}
                        dataSource={storyArr}
                        onSelect={this.selectValue}
                        placeholder="输入需求编号，关键字搜索"
                        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.Task')} {...workLoad}>
                      {getFieldDecorator('relateTask')
                      (<Input placeholder="输入任务编号，关键字搜索"/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.Iteration')} {...workLoad}>
                      {getFieldDecorator('sprintId')
                      (<Select style={{width:'100%'}}>
                        {sprintArr}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.SolveTime')} {...workLoad}>
                      {getFieldDecorator('deadline')
                      (<DatePicker style={{width: '100%'}}/>)}
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
export default Form.create({})(withRouter(BugMessage));
