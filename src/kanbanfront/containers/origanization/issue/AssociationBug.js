/**
 * Created by chenzl on 2017/11/3.
 * feature:创建BUG卡
 */
/*eslint-disable*/
import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Form, Row, Col, Button, Select, Input, DatePicker, Upload, Icon, message, InputNumber,AutoComplete } from 'antd';
import PageHeader from '../../../components/common/PageHeader';
import IssueManageStore from '../../../stores/origanization/issue/IssueManageStore';
import SprintStore from '../../../stores/origanization/sprint/SprintStore';
import SimplemdeEditor from "../../../components/issue/SimplemdeEditor";
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const dateFormat = 'YYYY-MM-DD';

@observer
class AssociationBug extends Component{
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    super(props);
    this.state={
      isSubmit: false,
      editorValue:'',
      val:'',
      deadline:-28800000,
      id: this.props.location.pathname.split('/')[4],// 取url中传递的参数父级Id
      sprintId: this.props.location.pathname.split('/')[5],// 取url中传递的参数父级Id
    }
  }
  // 返回Issue
  backIssue = () => {
    this.linkToChange('/kanbanfront/issueManage');
  }
  // 路由跳转设置
  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  }
  // 保存Issue并跳转回到Issue管理页面
  savaIssueMsg = (e) => {
    e.preventDefault();
    // 校验表单
    this.props.form.validateFieldsAndScroll((err, data) => {
      if(data.parentId){
        data.parentId=this.state.id
      }else {
        data.parentId=this.state.val
      }
      if(data.acception===undefined){
        data.acception=this.state.editorValue;
      }
      // 判断时间非空
      if(data.deadline!=undefined){
        data.deadline=data.deadline.valueOf();
      }else {
        data.deadline=-28800000
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
      if(data.parentId){
        data.parentId=this.state.val
      }else {
        data.parentId=this.state.id
      }
      if(data.acception===undefined){
        data.acception=this.state.editorValue;
      }
      // 判断时间非空
      if(data.deadline!=undefined){
        data.deadline=data.deadline.valueOf();
      }else {
        data.deadline=-28800000
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
  // 选择自动补全的值
  selectValue=(value)=>{
    // const start=value.indexOf('#');
    const end=value.indexOf(',');
    this.setState({
      val:value.slice(6,end)
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
        deadline:data.endTime,
      });
    })
  }
  // 时间格式转换
  formDate(data){
    let temp=new Date(data);
    return temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const deadline=this.formDate(this.state.deadline);
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
    // 选择类型label
    const typeArr = [];
    const projectId = 1;
    IssueManageStore.getIssueTypeList(projectId).then(data => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          typeArr.push(<Option value={`${data[i].name}`}>
       <span style={{border: '1px solid', background: `${data[i].color}`}}>
         {data[i].name}
       </span>
          </Option>);
        }
      }
    }).catch((err) => {
      // message.error(this.localIssueData());
      window.console.log(err)
    });
    // 查询项目ID为1的所有story/task
    const storyData = IssueManageStore.getIssueData;
    const storyArr = []; // story 数组
    for (let s = 0; s < storyData.length; s++) {
      if (storyData[s].issueType === 'UserStory' || storyData[s].issueType === 'Task') {
        storyArr.push(`父卡Id:#${storyData[s].id},描述:${storyData[s].description}`);
      }
    }
    /*-------遍历迭代---------*/
    const sprintArr = [];
    SprintStore.getSprintByProjectId(projectId).then(
      data => {
        if (data) {
          for (let p = 0; p <= data.length; p++) {
            sprintArr.push(<Option value={`${data[p].id}`}>{data[p].name}</Option>);
          }
        }
      }
    ).catch(e => {
      console.log(e);
    });
    return (
      <div className="createIssue">
        <PageHeader title='关联BUG'/>
        <div>
          <Form
            layout="horizontal"
            className="ant-advanced-search-form"
            onSubmit={this.savaIssueMsg}
          >
            <Row gutter={8}>
              {/*// BUG 类型*/}
              <Row>
                <Col span={8} offset={4}>
                  <FormItem>
                    {getFieldDecorator('projectId', {initialValue: 1})
                    (<Input style={{display: 'none'}}/>)}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('status', {initialValue: 'todo'})
                    (<Input style={{display: 'none'}}/>)}
                  </FormItem>
                  <FormItem label={HAP.languageChange('issue.issueType')} {...workLoad}>
                    {getFieldDecorator('issueType',{initialValue: 'Bug'})
                    (<Select style={{width:'100px'}} defaultValue="Bug">
                      <Option value="Bug">Bug</Option>
                    </Select>)}
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
                      {getFieldDecorator('parentId',{initialValue:this.state.id})
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
                      {getFieldDecorator('sprintId',{initialValue:this.state.sprintId})
                      (<Select style={{width:'100%'}} onSelect={this.getSprintTime}>
                        {sprintArr}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.SolveTime')} {...workLoad}>
                      {getFieldDecorator('deadline',{initialValue:moment(deadline,dateFormat)})
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
export default Form.create({})(withRouter(AssociationBug));

