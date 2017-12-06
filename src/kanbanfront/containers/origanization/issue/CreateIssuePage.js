/**
 * Created by chenzl on 2017/9/20.
 * feature：新建issue页面
 */
/*eslint-disable*/
import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Form, Row, Col, Button, Select, Input, DatePicker, Upload, Icon, message } from 'antd';
import PageHeader from '../../../components/common/PageHeader';
import IssueManageStore from '../../../stores/origanization/issue/IssueManageStore';
import SprintStore from '../../../stores/origanization/sprint/SprintStore';
import StoryMessage from '../../../components/issue/StoryMessge';
import TaskMessage from '../../../components/issue/TaskMessage';
import BugMessage from '../../../components/issue/BugMessage';
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class CreateIssuePage extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = {
      sprints:[],
      confirmDirty: false,
      typeValue:'UserStory',
      displayBug: 'none',
      displayTask: 'none',
      displayStory:'block',
      id: this.props.location.pathname.split('/')[4],// 取url中传递的参数父级Id
    };
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
  // 选择类型
  changeType(value) {
    this.setState({
      typeValue:value
    });
    if (value === 'Bug') {
      this.setState({
        displayBug: 'block',
        displayTask: 'none',
        displayStory:'none'
      });
    } else if (value === 'Task') {
      this.setState({
        displayTask: 'block',
        displayBug: 'none',
        displayStory:'none'
      })
    } else {
      this.setState({
        displayStory:'block',
        displayTask: 'none',
        displayBug: 'none'
      })
    }
  }
  render() {
    // 选择类型label
    const children = [];
    // const typeArr=[];
     const projectId=1;
     IssueManageStore.getIssueTypeList(projectId).then(data => {
     if (data) {
     for(let i=0;i<data.length;i++){
       children.push(<Option value={`${data[i].name}`}>
       <span style={{border:'1px solid', background:`${data[i].color}`}}>
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
    const storyArr=[]; // story 数组
    for (let s=0;s<storyData.length;s++){
      if(storyData[s].issueType==='UserStory' ||storyData[s].issueType==='Task' ){
        storyArr.push(`父卡Id:#${storyData[s].id},描述:${storyData[s].description}`);
      }
    }
    /*-------遍历迭代---------*/
    const sprintArr=[];
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

    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
    };
    const workLoad = {
      labelCol: {span: 6},
      wrapperCol: {span: 12},
    };
    return (
      <div className="createIssue">
        <PageHeader title={HAP.languageChange('issue.create')}/>
        <div style={{marginTop: 20}}>
            <Row gutter={8}>
                <Col span={8} offset={4}>
                  <FormItem label={HAP.languageChange('issue.issueType')} {...workLoad}>
                    <Select onChange={this.changeType.bind(this)}style={{width:'100px'}} defaultValue="Story">
                      <Option value="UserStory">Story</Option>
                      <Option value="Task">Task</Option>
                      <Option value="Bug">Bug</Option>
                    </Select>
                  </FormItem>
                </Col>
              {/*// task 类型*/}
              <div style={{'display': this.state.displayTask}}>
                <TaskMessage sprintArr={sprintArr} typeArr={children}
                             storyArr={storyArr}
                             backIssue={this.backIssue}
                             typeValue={this.state.typeValue}
                             id={this.state.id}/>
              </div>
              {/*story类型*/}
              <div style={{'display': this.state.displayStory}}>
                <StoryMessage sprintArr={sprintArr} typeArr={children}
                              storyArr={storyArr}
                              backIssue={this.backIssue}
                              typeValue={this.state.typeValue}/>
              </div>
              {/*// BUG 类型*/}
              <div style={{'display': this.state.displayBug}}>
                <BugMessage sprintArr={sprintArr} typeArr={children}
                            storyArr={storyArr}
                            backIssue={this.backIssue}
                            typeValue={this.state.typeValue}
                            id={this.state.id}/>
              </div>
            </Row>
        </div>
      </div>
    );
  }
}
export default Form.create({})(withRouter(CreateIssuePage));
