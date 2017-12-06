/**
 * Created by chenzl on 2017/9/7.
 * Issue详情
 */
/*eslint-disable*/
import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import {Table, Button, Tooltip, Icon, message,Menu,Dropdown, Row, Col, Form, Select, Input,Spin, Upload, DatePicker,Collapse,InputNumber} from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
const Option = Select.Option;
const {TextArea} = Input;
const Panel = Collapse.Panel;
const dateFormat = 'YYYY-MM-DD';

@observer
class IssueDetail extends Component{
  constructor(props){
    super(props);
    this.state={
      // Issue:this.props.Issue,I
    }
  }
  onChangeStatus=()=>{
    const id = this.props.id;
    this.props.form.validateFieldsAndScroll((err, data) => {
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
      if(data.deadline!=undefined){
        data.deadline=data.deadline.valueOf();
      }else {
        data.deadline=-28800000
      }
      if (!err) {
        IssueManageStore.updateIssueById(
          {...data, objectVersionNumber: this.props.Issue.objectVersionNumber}, id).then(data => {
          if (data) {
            message.success('修改成功',0.1);
            this.props.localIssueData();
          }
        }).catch((error) => {
          // message.error('网络出错，修改失败',0.1);
        });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.Issue !== this.props.Issue) {
      window.console.log(this.props.Issue);
      this.setState({
        Issue: nextProps.Issue
      });
    }
  }
  // 时间格式转换
  formDate(data){
    let temp=new Date(data);
    return temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
  }
  render(){
    // 获取当前路径
    const menu = (
      <Menu >
        <Menu.Item key="1">
          <a onClick={this.props.createSubCard}>创建子卡</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a onClick={this.props.AssociationBug} >关联BUG</a>
        </Menu.Item>
      </Menu>
    );
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const {getFieldDecorator} = this.props.form;
    const Issue=this.props.Issue;
    const issueTypeArr=this.props.issueTypeArr;
    const sprintArr=this.props.sprintArr;
    const typeStyle=this.props.typeStyle;
    const startTime=this.formDate(Issue.startTime);
    const endTime=this.formDate(Issue.endTime);
    const deadline=this.formDate(Issue.deadline);
    return(
      <div className="text-editor">
        <div style={typeStyle.detailStyle}>
          <div style={{background: '#F7F7F7', height: 40, lineHeight: 3,position:'absolute',zIndex:'103',width:'100%'}}>
            {/*<span>{HAP.languageChange('issue.detail')}</span>*/}
            <span style={{marginRight:30 ,marginLeft:10,lineHeight:'35px'}}>#{Issue.issueId}</span>
            <span>{Issue.issueType}</span>
            <a style={{float:'right',lineHeight: '35px', marginLeft: '30px', marginRight: '30px'}}>
              <Dropdown overlay={menu} trigger={['click']}>
                <Icon type="caret-down" style={{fontSize: 12,color:'#8489ff'}} />
              </Dropdown>
            </a>
            <a style={{float: 'right', 'display': 'block',lineHeight: '35px'}}
               onClick={this.props.editChange.bind()}>
              {'编辑'}
            </a>
            <a style={{float: 'left', 'display': 'block',lineHeight: '35px',marginRight:'10px',marginLeft:'10px'}}
               onClick={this.props.displayDetail.bind()}>
              <Icon type="double-right" />
            </a>
          </div>
          <div style={{marginTop:'40px'}}>
            <h3 style={{marginBottom:'20px',marginLeft:10}}>{Issue?Issue.description:''}</h3>
            <p style={{fontSize:'12px'}}><span style={{marginRight:'30px',marginLeft:10}}>宝洁</span>
              <span>创建于:{Issue.creationDate}</span>
            </p>
          </div>
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="基本信息" key="1">
              <Form layout="horizontal">
                <Row gutter={8}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label='状态'>
                      {getFieldDecorator('status', {initialValue:Issue.status})
                      (<Select onChange={this.onChangeStatus} style={{width:'100px'}}>
                        <Option value="todo">规划中</Option>
                        <Option value="doing">开发中</Option>
                        <Option value="done">已完成</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label='指派人'>
                      {getFieldDecorator('assigneeId', {initialValue: Issue ? Issue.assigneeId : "",})
                      (<Select style={{width:'100px'}} onChange={this.onChangeStatus}>
                        <Option value="1">陈造龙</Option>
                        <Option value="2">钱秋梅</Option>
                        <Option value="3">张宇</Option>
                        <Option value="4">陈真</Option>
                        <Option value="5">柯希权</Option>
                        <Option value="6">PO</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{'display':this.props.displayStory}}>
                    <FormItem {...formItemLayout} label="故事点">
                      {getFieldDecorator('storyPoint', {initialValue: Issue?Issue.storyPoint:'',})
                      (<InputNumber onChange={this.onChangeStatus} className="inputNum"/>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="优先级">
                      {getFieldDecorator('issuePriority', {initialValue:Issue?Issue.issuePriority:''})
                      (<Select style={{width: 100}} onChange={this.onChangeStatus}>
                        <Option value="1">低</Option>
                        <Option value="2">中</Option>
                        <Option value="3">高</Option>
                        <Option value="4">非常高</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{'display':this.props.hiddenStyle}}>
                    <FormItem {...formItemLayout} label="开始时间">
                      {getFieldDecorator('startTime', {initialValue:moment(startTime,dateFormat)})
                      (<DatePicker style={{width: 100}}
                                   onChange={this.onChangeStatus}/>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{'display':this.props.hiddenStyle}}>
                    <FormItem {...formItemLayout} label="截止时间">
                      {getFieldDecorator('endTime',{initialValue:moment(endTime,dateFormat)})
                      (<DatePicker
                        style={{width:100}} onChange={this.onChangeStatus}/>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{'display':this.props.hiddenStyle}}>
                    <FormItem {...formItemLayout} label="迭代">
                      {getFieldDecorator('sprintId', {initialValue:Issue.sprintId})
                      (<Select style={{width: 100}} onChange={this.onChangeStatus}>
                        {sprintArr}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="标签">
                      {getFieldDecorator('label', {initialValue:Issue.label})
                      (<Select style={{width: 100}} onChange={this.onChangeStatus}>
                        {issueTypeArr}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{'display':this.props.displayBug}}>
                    <FormItem {...formItemLayout} label="严重级别">
                      {getFieldDecorator('seriousLevel', {initialValue: Issue.seriousLevel,})
                      (<Select onChange={this.onChangeStatus}>
                        <Option value="1">非常严重</Option>
                        <Option value="2">一般</Option>
                        <Option value="3">严重</Option>
                        <Option value="4">不严重</Option>
                        <Option value="5">非常不严重</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{'display':this.props.displayBug}}>
                    <FormItem label={HAP.languageChange('issue.BugType')} {...formItemLayout}>
                      {getFieldDecorator('bugType',{initialValue:Issue.bugType})
                      (<Select onChange={this.onChangeStatus}>
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
                  <Col span={8} style={{'display':this.props.displayBug}}>
                    <FormItem label={HAP.languageChange('issue.SolveTime')} {...formItemLayout}>
                      {getFieldDecorator('deadline',{initialValue:moment(deadline,dateFormat)})
                      (<DatePicker style={{width: '100%'}} onChange={this.onChangeStatus}/>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{'display':this.props.displayTask}}>
                    <FormItem label={HAP.languageChange('issue.workload')} {...formItemLayout}>
                      {getFieldDecorator('workload',{initialValue:Issue.workload})
                      (<InputNumber onChange={this.onChangeStatus} className="inputNum"/>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{'display':this.props.displayTask}}>
                    <FormItem {...formItemLayout} label="父级需求">
                      {getFieldDecorator('parentId', {initialValue:Issue.parentId,})
                      (<Input className="parentIdStyle"/>)
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Panel>
            <Panel header="内容" key="2">
              <Row>
                <Col>
                  <h4 style={{marginBottom: '10px'}}>故事内容</h4>
                  <p>{Issue.content}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 style={{marginBottom: '10px'}}>验收标准</h4>
                 <p>{Issue.acception}</p>
                </Col>
              </Row>
            </Panel>
            <Panel header="动态" key="3">
              <p>操作记录(1)|评论(0)</p>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}
export default Form.create({})(withRouter(IssueDetail));
