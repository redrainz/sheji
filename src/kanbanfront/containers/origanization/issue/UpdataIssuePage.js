/**
 * Created by chenzl on 2017/9/27.
 * feature:Issue修改页面
 */
/*eslint-disable*/
import React, {Component} from 'react';
import PageHeader from '../../../components/common/PageHeader';
import IssueManageStore from '../../../stores/origanization/issue/IssueManageStore';
import {Form, Row, Col, Button, Select, Input, DatePicker, Upload, Icon, message, InputNumber} from 'antd';
import {withRouter} from 'react-router-dom';
import StoryDetail from '../../../components/issue/StoryDetail';
import BugDetail from '../../../components/issue/BugDetail';
import TaskDetail from '../../../components/issue/TaskDetail';
import {observer} from 'mobx-react';
const Option = Select.Option;

@observer
class UpdataIssuePage extends Component{
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      confirmDirty: false,
      issueData:'',
      displayBug: 'none',
      displayTask: 'none',
      displayStory:'none',
      id: this.props.location.pathname.split('/')[4],//取url中传递的参数id
      LabelData:'',
    };
  }
  componentDidMount() {
    this.localIssueModel(this.state.id);
    this.getIssueTypeByProjectId();
  }
  localIssueModel(id){
    IssueManageStore.getIssueById(id).then((data)=>{
      if(data.issueType==='Bug'){
        this.setState({
          displayBug: 'block',
          displayTask: 'none',
          displayStory:'none'
        })
      }if(data.issueType === 'Task'){
        this.setState({
          displayBug: 'none',
          displayTask: 'block',
          displayStory:'none'
        })
      }else if(data.issueType==='UserStory'){
        this.setState({
          displayBug: 'none',
          displayTask: 'none',
          displayStory:'block'
        })
      }else {
        this.setState({
          displayBug: 'none',
          displayTask: 'none',
          displayStory:'block'
        })
      }
      this.setState({
        issueData: data,
        issueId: id
      });
    })

  }
  // 选择issue类型
  getIssueTypeByProjectId=()=>{
    const projectId=1;
    IssueManageStore.getIssueTypeList(projectId).then(data => {
      if (data) {
        this.setState({
          LabelData:data,
        });
      }
    }).catch((err) => {
      // message.error(this.localIssueData());
      window.console.log(err)
    });
  }
  render() {
    const {LabelData}=this.state;
    const {issueData} =this.state;
    let labelTypeArr=[];
    for(let i=0;i<LabelData.length;i++){
      labelTypeArr.push(<Option value={`${LabelData[i].name}`}>{LabelData[i].name}</Option>);
    }
    // 查询项目ID为1的所有story/task
    const storyData = IssueManageStore.getIssueData;
    const parentArr=[]; // story 数组
    for (let s=0;s<storyData.length;s++){
      if(storyData[s].issueType==='UserStory' ||storyData[s].issueType==='Task' ){
        parentArr.push(`父卡Id:#${storyData[s].id},描述:${storyData[s].description}`);
      }
    }
    return (
      <div className="createIssue">
        <PageHeader title={HAP.languageChange('issue.updata')}/>
        <div style={{marginTop: 20}}>
          <div style={{'display': this.state.displayTask}}>
            <TaskDetail labelTypeArr={labelTypeArr}
                        issueData={issueData}
                        id={this.state.id}
                        parentArr={parentArr}
            />
          </div>
          {/*story类型*/}
          <div style={{'display': this.state.displayStory}}>
            <StoryDetail labelTypeArr={labelTypeArr}
                         issueData={issueData}
                         id={this.state.id}
                         parentArr={parentArr}
            />
          </div>
          {/*// BUG 类型*/}
          <div style={{'display': this.state.displayBug}}>
            <BugDetail labelTypeArr={labelTypeArr}
                       issueData={issueData}
                       id={this.state.id}
                       parentArr={parentArr}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Form.create({})(withRouter(UpdataIssuePage));
