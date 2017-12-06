/**
 * Created by chenzl on 2017/11/2.
 * feature:创建子卡
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
class CreateCardPage extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    super(props);
    this.state={
      isSubmit: false,
      editorValue:'',
      val:'',
      startTime:-28800000,
      endTime:-28800000,
    }
  }
  componentWillMount(){
    IssueManageStore.localIssueModel();
  }
  // 返回Issue
  backIssue = () => {
    let tempurl = this.props.match.url;
    let url = tempurl.substring(0,tempurl.length-7);
    this.linkToChange(url);
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
      if(data.parentId != null&&data.parentId.length>6){
        let temp = data.parentId.split(',')
        data.parentId = temp[0].substr(6)
      }
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
      data.status = 'pre todo'
      if (!err) {
        if (data.authorizedGrantTypes) {
          data.authorizedGrantTypes = data.authorizedGrantTypes.join(',');
          this.setState({submitting: true});
        }
        data = {
          kanbanId: this.props.match.params.kanbanId,
          positionY: 0,
          positionX: 0,
          ...data,
        };
        IssueManageStore.createIssue(data).then(data => {
          if (data) {
            message.success('添加成功',0.1);
            let tempurl = this.props.match.url;
            let url = tempurl.substring(0,tempurl.length-7);
            console.log(url)
            this.props.history.push(url)
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
      if(data.parentId != null){
        let temp = data.parentId.split(',')
        data.parentId = temp[0].substr(6)
      }
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
      data.status = 'pre todo'
      if (!err) {
        if (data.authorizedGrantTypes) {
          data.authorizedGrantTypes = data.authorizedGrantTypes.join(',');
          this.setState({submitting: true});
        }

        data = {
          kanbanId: this.props.match.params.kanbanId,
          positionY: 0,
          positionX: 0,
          ...data,
        };
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
  render() {
    const {getFieldDecorator} = this.props.form;
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
    console.log(storyData);
    for (let s = 0; s < storyData.length; s++) {
      if (storyData[s].issueType === 'story' || storyData[s].issueType === 'task') {
        storyArr.push(`父卡Id:#${storyData[s].id},描述:${storyData[s].description}`);
      }
    }
    /*-------遍历迭代---------*/
    const sprintArr = [];
    SprintStore.getSprintByProjectId(projectId).then(
      data => {
        if (data != null) {
          for (let p = 0; p < data.length; p++) {
            sprintArr.push(<Option value={`${data[p].id}`}>{data[p].name}</Option>);
          }
        }
      }
    ).catch(e => {
      console.log(e);
    });
    return (
      <div className="createIssue">
        <PageHeader title='新建卡片'/>
        <div>
          <Form
            layout="horizontal"
            className="ant-advanced-search-form"
            onSubmit={this.savaIssueMsg}
          >
            <Row gutter={8}>
              <Row>
                <Col span={8} offset={4}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('projectId', {initialValue: 1})
                    (<Input style={{display: 'none'}}/>)}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('status', {initialValue: 'todo'})
                    (<Input style={{display: 'none'}}/>)}
                  </FormItem>
                  <FormItem label={HAP.languageChange('issue.issueType')} {...workLoad}>
                    {getFieldDecorator('issueType',{initialValue: 'task'})
                    (<Select style={{width:'100px'}} initialValue="task">
                      <Option value="task">task</Option>
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
                    <FormItem label={HAP.languageChange('issue.workload')} {...workLoad}>
                      {getFieldDecorator('workload', {
                        /*   rules: [{ validator: this.checkPrice.bind(this) }],*/
                      })
                      (<div style={{lineHeight:'28px'}}>
                        <InputNumber style={{display:'inline-block',width:'90%', borderRadius:'0px',margin:'0px',height:'28px'}}/>
                        <div style={{height:'28px',border:'1px solid #d9d9d9',textAlign:'center',
                          float:'right',width:'10%',lineHeight:'28px'}}>H</div>
                      </div>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.assigneeId')} {...workLoad}>
                      {getFieldDecorator('assigneeId')
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
                    <FormItem label={HAP.languageChange('issue.ParentDemand')} {...workLoad}>
                      {getFieldDecorator('parentId',{initialValue:this.state.id})
                      (<AutoComplete
                          style={{width: '100%'}}
                          dataSource={storyArr}
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
                      {getFieldDecorator('sprintId')
                      ( <Select style={{width:'100%'}} onSelect={this.getSprintTime}>
                        {sprintArr}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.label')} {...workLoad}>
                      {getFieldDecorator('label')(
                        <Select style={{width:'100%'}}>
                          {typeArr}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} offset={4}>
                    <FormItem label={HAP.languageChange('issue.startTime')}{...workLoad}>
                      {getFieldDecorator('startTime',{initialValue:moment(startTime,dateFormat)})
                      (<DatePicker
                        style={{width: '100%'}}
                        format="YYYY-MM-DD"
                      />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={HAP.languageChange('issue.deadline')} {...workLoad}>
                      {getFieldDecorator('endTime',{initialValue:moment(endTime,dateFormat)})
                      (<DatePicker
                        style={{width: '100%'}}
                        format="YYYY-MM-DD"
                      />)}
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
export default Form.create({})(withRouter(CreateCardPage));

