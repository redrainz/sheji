/**
 * Created by chenzl on 2017/11/9.
 * Feature:看板管理界面的另外布局
 */
/*eslint-disable*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {
  Layout, Menu, Button, Icon, Modal, Form, Input, Row, Col, Card, message, Popover, Tree, Select, Radio,
  Progress, Switch, Tabs, Dropdown, Table, Pagination
} from 'antd';
import {NavLink, withRouter} from 'react-router-dom';
import Routes from '../../../common/RouteMap';
import PageHeader, {PageHeadStyle} from "../../../components/common/PageHeader";
import SprintPlanModel from '../../../components/sprintDetails/SprintPlanModel';
import EditDetail from '../../../components/sprintDetails/EditDetail';
import CreatTask from '../../../components/sprintDetails/CreatTask';
import SprintStore from '../../../stores/origanization/sprint/SprintStore';
import '../../../assets/css/acss.css';
import '../../../assets/font-awesome/css/font-awesome.min.css';
import sprintIcon from '../../../assets/image/sprint.png';
import kanbanIcon from '../../../assets/image/kanban.png';
import FontAwesome from 'react-fontawesome';
import EditDescription from './EditDescription';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let kanbans = [];
let kanbanName = "";

@observer
class SprintDetailOther extends Component {
  constructor(props) {
    super(props);
    let id = parseInt(this.props.location.pathname.split('/')[4]);
    this.state = {
      kanbans: [],
      id: id,
      description: "",
      type:"story",
      issues: this.props.issues,
      lists: this.props.lists,
      sprintBaseData: [],
      sprintIssuesData: [],
      disStatus: "规划中",
      switchChecked: false,
      descriptionVisible: false,
      planVisible: false,
      mark: false,
      issueTypeFilter: "All",
      statusFilter: "All",
    }
  }

  componentDidMount() {
    this.init();
  }
  formIssuePriority=(data)=> {
    let issuePriority;
    if (data.issuePriority == 1) {
      issuePriority = "低,#5095fe";
    } else if (data.issuePriority == 2) {
      issuePriority = "中,#ff9f11";
    } else if (data.issuePriority == 3) {
      issuePriority = "高,#fe5050"
    } else {
      issuePriority = "——"
    }
    return issuePriority;
  }
  formBaseData = (value) => {
    var data = value;
    data.endTime = this.formDate(value.endTime);
    data.startTime = this.formDate(value.startTime);
    data.status = value.status;
    //冲刺的issues信息
    data.storyIssues = 0;
    data.endStory = 0;
    data.taskIssues = 0;
    data.endTask = 0;
    data.bugIssues = 0;
    data.endBug = 0;
    data.storyPoint = 0;
    data.workload = 0;
    data.description = value.description;

    if (value.issue)
      for (let j = 0; j < value.issue.length; j += 1) {
        data.issue[j].issueId = "#" + value.issue[j].issueId;
        data.issue[j].startTime = this.formDate(value.issue[j].startTime);
        data.issue[j].deadline = this.formDate(value.issue[j].deadline);
        data.storyPoint += data.issue[j].storyPoint;
        data.workload += data.issue[j].workload;
        if (value.issue[j].issueType == "story") {
          data.storyIssues++;
          if (value.issue[j].status == "done")
            data.endStory += 1;
        }
        else if (value.issue[j].issueType == "task") {
          data.taskIssues++;
          if (value.issue[j].status == "done")
            data.endTask += 1;
        }
        else if (value.issue[j].issueType == "bug") {
          data.bugIssues++;
          if (value.issue[j].status == "done")
            data.endBug += 1;
        }
      }
    return data;
  }
  formIssuesData = (value, kanbans) => {
    let issuePriority;
    let priorityColor;
    let status;
    let issuesData = [];
    for (let i = 0; i < value.length; i++) {
      issuePriority=this.formIssuePriority(value[i]);
      issuesData.push({
        key: value[i].id,
        issueId: value[i].issueId,
        issueType: value[i].issueType,
        description: value[i].description,
        creationDate: value[i].creationDate,
        creater: "——",
        status: value[i].status,
        issuePriority: issuePriority,
        owner: value[i].owner,
        kanbanName: value[i].kanbanName,
      });
    }
    console.log(value)
    console.log(issuesData)
    return issuesData
  }
  formDate = (date) => {
    let temp = new Date(date);
    return temp.getFullYear() + "-" + (temp.getMonth() + 1) + "-" + temp.getDate();
  }
  showIssueByType=()=>{
    // let issues=[];
    // this.state.lists.map((item,index)=>{
    //   if(item.issueType=e.)
    //   issues.push(item)
    // })
  }
  // componentDidMount(){
  //   this.init();
  // }
  init = () => {
    let id = this.state.id;
    SprintStore.getKanbansBySprintId(id).then(kanbanData => {
      kanbans = [];
      for (let i = 0; i < kanbanData.length; i++) {
        kanbans.push({
            id: kanbanData[i].id,
            name: kanbanData[i].name,
            description: kanbanData[i].description,
          }
        )
      }
      SprintStore.getSprintById(id).then((data)=>{
        SprintStore.setSprintData(data)
      if (data) {
        let switchChecked;
        let disStatus;
        switch (data.status) {
          case "doing": {
            switchChecked = true;
            disStatus = "进行中";
            break;
          }
          case "done": {
            switchChecked = false;
            disStatus = "已结束";
            break;
          }
          default : {
            switchChecked = false;
            disStatus = "规划中";
            break;
          }
        }
        const temp = this.formBaseData(data);
        let issuesData = this.formIssuesData(data["issue"], kanbans);
        this.setState({
          type: "story",
          id: id,
          sprintBaseData: data,
          description: data.description,
          issues: issuesData,
          lists: issuesData,
          switchChecked: switchChecked,
          disStatus: disStatus,
          kanbans: kanbans,
          mark: true,
        })
      }
      })
    })
  }
  toKanban = () => {
    this.linkToChange(`/kanbanFront/kanbanMange/${this.state.id}`);
  }
  toKanbanDetail = (id) => {
    this.linkToChange(`/kanbanFront/kanban/${id}`);
  }
  kanbanDetail = (e) => {
    let id = e.target.id;
    this.toKanbanDetail(id);
  }
  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  }

  edit = () => {
    this.setState({
      descriptionVisible: true
    })
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  handleOk = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        SprintStore.updateSprintById(this.state.id, {description: values.description}).then(data => {
          if (data)
            this.setState({
              descriptionVisible: false,
              description: values.description,
            });
          else
            message.error("网络异常")
        })
      }
    })
  }
  handleCancel = () => {
    this.setState({
      descriptionVisible: false,
    });
  }

  showSprintPlanModal = () => {
    this.setState({
      planVisible: true,
    });
  }
  hideSprintPlanModal = () => {
    this.init();
    this.setState({
      planVisible: false,
    });
  }

  onSwitchChange = (checked) => {
    let disStatus = "";
    let switchChecked = false
    let status = "";
    if (checked) {
      disStatus = "进行中";
      switchChecked = true;
      status = "doing";
    }
    else {
      disStatus = "已结束";
      switchChecked = false;
      status = "done";
    }
    SprintStore.updateSprintById(this.state.id, {status: status}).then(data => {
      if (data)
        this.setState({
          disStatus: disStatus,
          switchChecked: switchChecked,
        })
      else
        message.error("网络故障")
    })
  }
  changeIssuesTypeFilter = (e) => {
    this.setState({
      issueTypeFilter: e.target.value
    })
  }
  changeStatusFilter = (e) => {
    this.setState({
      statusFilter: e.target.value
    })
  }
  getDiffSprintData = (e) => {
    let issueTypeFilter = this.state.issueTypeFilter;
    // let statusFilter = this.state.statusFilter;
    if (e.target.name == "issueTypeFilter") {
      issueTypeFilter = e.target.value;
    }
    // } else if (e.target.name == "statusFilter") {
    //   statusFilter = e.target.value
    // }
    const list = this.state.lists;
    const filterList = [];
    let issuesArr = [];
    let i;
    let m;
    if (issueTypeFilter == "All") {
      for (i = 0; i < list.length; i++) {
        filterList.push(list[i]);
      }
    } else if (issueTypeFilter == "story") {
      for (i = 0; i < list.length; i++) {
        if (list[i].issueType == 'story') {
          filterList.push(list[i]);
        }
      }
    } else if (issueTypeFilter == "task") {
      for (i = 0; i < list.length; i++) {
        if (list[i].issueType == "task") {
          filterList.push(list[i]);
        }
      }
    } else if (issueTypeFilter) {
      for (i = 0; i < list.length; i++) {
        if (list[i].issueType == "bug") {
          filterList.push(list[i]);
        }
      }
    }
    // if (statusFilter == "All") {
      for (m = 0; m < filterList.length; m++) {
        issuesArr.push(filterList[m]);
      }
    // } else if (statusFilter == "todo") {
    //   for (m = 0; m < filterList.length; m++) {
    //     if (filterList[m].status == "规划中") {
    //       issuesArr.push(filterList[m]);
    //     }
    //   }
    // } else if (statusFilter == "doing") {
    //   for (m = 0; m < filterList.length; m++) {
    //     if (filterList[m].status == "进行中") {
    //       issuesArr.push(filterList[m]);
    //     }
    //   }
    // } else if (statusFilter == "done") {
    //   for (m = 0; m < filterList.length; m++) {
    //     if (filterList[m].status == "已完成") {
    //       issuesArr.push(filterList[m]);
    //     }
    //   }
    // }
    this.setState({
      issues: issuesArr,
      issueTypeFilter: issueTypeFilter,
      // statusFilter: statusFilter,
    });
  }
  hideRight=()=>{
    SprintStore.closeCreateTaskShow()
    SprintStore.closeRight()
  }
  columns = [{
  title: '编号',
  dataIndex: 'issueId',
  width: '7%',
  render: (text, record) =><div onClick={(e) => {SprintStore.setCurrentId(record.key);
  e.stopPropagation();e.preventDefault();SprintStore.setRightShow()}}>{text}</div>,
  sorter: (a, b) => parseInt(a.issueId.replace("#", "")) - parseInt(b.issueId.replace("#", "")),
}, {
  title: '描述',
  dataIndex: 'description',
  width: '20%',
  render: (text, record) =>
    <div style={{width: "100%", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
      {text ? text.length > 20 && !text ? text.substring(0, 20) : text : "——"}</div>
}, {
  title: '状态',
  dataIndex: 'status',
  width: '10%',
  render: (text, record) =>
    <div style={{
      backgroundColor: "#ff9e4a",
      color: "#ffffff",
      borderRadius: "8px",
      marginLeft: "-5px",
      textAlign: "center"
    }}>{text}</div>
}, {
  title: '优先级',
  dataIndex: 'issuePriority',
  width: '7%',
  render: (text, record) =>
    <div style={{width: "100%",}}>
      {text=="——"?<div style={{width: "100%",}}>{text}</div>:
        <div style={{width: "100%",}}>
          <FontAwesome name="circle-thin" style={{
            fontSize: "12px",
            color: text.split(',')[1],
            paddingRight: "4px",
            display: "inline-block",
            transform: "scale(0.8)"
          }}/>{text.split(',')[0]}</div>}</div>
}, {
  title: '类型',
  dataIndex: 'issueType',
  width: '6%',
}, {
  title: '看板',
  dataIndex: 'kanbanName',
  width: '15%',
  render: (text, record) =>
    <div style={{width: "100%", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
      {text ? text.length > 10 ? text.substring(0, 10) : text : "——"}</div>
}, {
  title: '创建者',
  dataIndex: 'creater',
  width: '8%',
  render: (text, record) =>
    <div style={{width: "100%", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
      {text ? text.length > 10 ? text.substring(0, 10) : text : "——"}</div>
}, {
  title: '认领人',
  dataIndex: 'owner',
  width: '8%',
  render: (text, record) =>
    <div style={{width: "100%", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
      {text ? text.length > 10 ? text.substring(0, 10) : text : "——"}</div>
}, {
  title: '创建时间',
  dataIndex: 'creationDate',
  width: '16%',
  sorter: (a, b) => Date.parse(a.creationDate) - Date.parse(b.creationDate),
}];

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3d menu item</Menu.Item>
      </Menu>
    );
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection,
    };
    if (this.state.mark) {
      return (
        <div style={{backgroundColor: 'white'}} className="kanbanOther" onClick={this.hideRight}>
          <div className="topStyle">
            <div className="leftCircle">
              <img src={sprintIcon} className="img"/>
            </div>
            <span style={{marginLeft: '20px', marginRight: "40px"}}>
              <span style={{color: '#999999', fontSize: "12px"}}>冲刺名称：</span>
              <span style={{fontSize: '18px', fontWeight: "bold"}}>{this.state.sprintBaseData.name}</span>
            </span>
            <div style={{borderRight: "1px solid #eee", height: "30px", marginTop: "0px"}}></div>
            <span style={{marginLeft: '40px', marginRight: '40px'}}>
              <span style={{color: '#999999', fontSize: "12px"}}>冲刺时间：</span>
              <span style={{color: '#999999', fontSize: '12px'}}>从{this.state.sprintBaseData.startTime}
                到 {this.state.sprintBaseData.endTime}</span>
            </span>
            <div style={{borderRight: "1px solid #eee", height: "30px", marginTop: "0px"}}></div>
            <span style={{marginLeft: '40px', marginRight: '40px'}}>
              <span style={{color: '#999999', fontSize: "12px"}}>状态：</span>
              <span style={{
                display: "inline-block",
                backgroundColor: '#2f5597',
                color: "#ffffff",
                width: "40px",
                fontSize: '12px',
                textAlign: "center",
                borderRadius: "8px"
              }}>{this.state.disStatus}</span>
            </span>
            <div style={{flex: 1, visibility: 'hidden'}}></div>
            <div style={{marginRight: '30px'}}>
              <Switch checkedChildren={'开启'} unCheckedChildren={'关闭'} checked={this.state.switchChecked}
                      onChange={this.onSwitchChange} />
            </div>
          </div>
          <div style={{display: 'flex', marginTop: '10px'}}>
            <div className="leftDivStyle">
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#ffffff',
                display: 'flex',
                paddingTop: "10px"
              }}>
                <div style={{
                  lineHeight: '90px', marginLeft: '10px', paddingLeft: "20px", marginTop: "16px",
                  paddingRight: '2rem'
                }}>
                  <Progress width="90px" type="circle" style={{fontSize:"21px"}}percent={this.state.sprintBaseData.storyIssues == 0||
                  !this.state.sprintBaseData.storyIssues ? 0
                    : (this.state.sprintBaseData.endStory * 1000 / this.state.sprintBaseData.storyIssues / 10).toFixed(2)}/>
                </div>
                <div style={{marginTop: "20px", width: "1px", height: "90px", borderRight: '#d7d7d7 1px  dotted '}}/>
                {/*<div style={{border:'1px solid rgb(225, 233, 239)',width:'2px',height:'100%',marginLeft:'10rem'}}>*/}
                {/*</div>*/}
                <div style={{width: '100%', height: '100%',}}>
                  <Row>
                    <Col span={8} className="colStyle">
                      <div style={{display: 'flex'}}>
                        <div className="iconStyle">
                          <FontAwesome name="vcard-o" className="iconStyle"/>
                        </div>
                        <div className="desStyle">
                          <p style={{color: '#999999', fontFamily: "microsoft yahei", fontSize: "14px"}}>
                            用户故事：<span style={{fontSize: "24px", fontFamily: "microsoft yahei", color: '#00b050'}}>
                        {this.state.sprintBaseData.storyIssues}</span></p>
                          <p style={{color: '#999999'}}><span className="smallFont">
                        已完成 {this.state.sprintBaseData.endStory}
                            | 未完成 {this.state.sprintBaseData.storyIssues - this.state.sprintBaseData.endStory}</span>
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col span={8} className="colStyle">
                      <div style={{display: 'flex'}}>
                        <div className="iconStyle">
                          <FontAwesome name="tasks" className="iconStyle"/>
                        </div>
                        <div className="desStyle">
                          <p style={{color: '#999999', fontFamily: "microsoft yahei", fontSize: "14px"}}>
                            任务：<span style={{fontSize: "24px", fontFamily: "microsoft yahei", color: '#00b050'}}>
                          {this.state.sprintBaseData.taskIssues}</span></p>
                          <p style={{color: '#999999'}}><span
                            className="smallFont">已完成 {this.state.sprintBaseData.endTask}
                            | 未完成 {this.state.sprintBaseData.taskIssues - this.state.sprintBaseData.endTask}</span></p>
                        </div>
                      </div>
                    </Col>
                    <Col span={8} className="colStyle">
                      <div style={{display: 'flex'}}>
                        <div className="iconStyle">
                          <FontAwesome name="bug" className="iconStyle"/>
                        </div>
                        <div className="desStyle">
                          <p style={{color: '#999999', fontFamily: "microsoft yahei", fontSize: "14px"}}>
                            缺陷：<span style={{fontSize: "24px", fontFamily: "microsoft yahei", color: '#00b050'}}>
                          {this.state.sprintBaseData.bugIssues}</span></p>
                          <p style={{color: '#999999'}}><span
                            className="smallFont">已完成 {this.state.sprintBaseData.endBug}
                            | 未完成 {this.state.sprintBaseData.bugIssues - this.state.sprintBaseData.endBug}</span></p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={8} className="colStyle">
                      <div style={{display: 'flex'}}>
                        <div className="iconStyle">
                          <FontAwesome name="tachometer" className="iconStyle"/>
                        </div>
                        <div className="desStyle">
                          <div style={{
                            color: '#999999',
                            position: 'absolute',
                            bottom: '7px',
                            fontFamily: "microsoft yahei",
                            fontSize: "14px",
                          }}>
                            故事点：<span style={{
                            fontSize: "24px",
                            color: '#00b050',
                            fontFamily: "microsoft yahei"
                          }}>{this.state.sprintBaseData.storyPoint}
                            <span
                              style={{fontSize: "14px", color: '#595959', paddingRight: "7px"}}> P</span><FontAwesome
                              name="info-circle" style={{fontSize: "10px", color: "#e44443"}}/></span></div>
                        </div>
                      </div>
                    </Col>
                    <Col span={8} className="colStyle">
                      <div style={{display: 'flex'}}>
                        <div className="iconStyle">
                          <FontAwesome name="calendar" className="iconStyle"/>
                        </div>
                        <div className="desStyle">
                          <p style={{
                            color: '#999999',
                            position: 'absolute',
                            bottom: '7px',
                            fontFamily: "microsoft yahei",
                            fontSize: "14px"
                          }}>
                            任务规模：<span style={{
                            fontSize: "24px",
                            fontFamily: "microsoft yahei",
                            color: '#00b050'
                          }}>{this.state.sprintBaseData.workload}
                            <span
                              style={{fontSize: "14px", color: '#595959', paddingRight: "7px"}}> h</span><FontAwesome
                              name="info-circle" style={{fontSize: "10px", color: "#e44443"}}/></span></p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className="rightDivStyle">
              <div style={{width: '100%', height: '100%', background: '#fff', border: '1px solid #eee'}}>
                <div className="SprintTopStyle">
                  <div style={{paddingLeft: "4px", fontSize: "13px", fontWeight: "bold"}}>冲刺描述</div>
                  <div style={{flex: 1, visibility: 'hidden'}}></div>
                  <Icon type="setting" onClick={this.edit}/>
                </div>
                <div style={{padding: "10px", height: "90%"}}>
               <span style={{fontSize: "12px",}}>
                 {this.state.description}
               </span>
                </div>
              </div>
            </div>
          </div>
          <div className="sprintTable" style={{
            width: '100%',
            height: '80%',
            background: '#ffffff',
            marginTop: '10px',
            border: "1px solid #d9d9d9"
          }}>
            <Tabs defaultActiveKey="1" onChange={this.callback} animated={{inkBar: false, tabPane: true}}>
              <TabPane tab="用户故事与任务" key="1">
                <div style={{border: " 1px solid #eee"}}>
                  <div className="tableTopStyle">
                    <div style={{lineHeight: ' 40px', verticalAlign: "top", display: "inline-block"}}>
                      <Button type="primary" style={{
                        backgroundColor: '#4472c4',
                        marginLeft: '10px',
                        marginRight: '20px',
                        display: "inline-block",
                        marginTop: "6px",
                        height: "28px"
                      }} onClick={this.showSprintPlanModal}>用户故事</Button>
                      <Button type="primary" style={{
                        backgroundColor: '#4472c4',
                        marginLeft: '10px',
                        marginRight: '20px',
                        display: "inline-block",
                        marginTop: "6px",
                        height: "28px"
                      }} onClick={(e)=>{SprintStore.setCreateTaskShow();e.stopPropagation()}} >添加task</Button>
                    </div>
                    <div style={{
                      marginRight: '20px',
                      lineHeight: '40px',
                      verticalAlign: "top",
                      float: "right",
                      display: "inline-block"
                    }}>
                    <span>
                      <RadioGroup name="issueTypeFilter" defaultValue="All" size="default" style={{marginRight: "10px"}}
                                  onChange={this.getDiffSprintData}>
                        <RadioButton value="All">全部</RadioButton>
                        <RadioButton value="story">用户故事</RadioButton>
                        <RadioButton value="task">任务</RadioButton>
                        <RadioButton value="bug">缺陷</RadioButton>
                      </RadioGroup>
                      {/*<RadioGroup name="statusFilter" defaultValue="All" size="default" style={{marginRight: "10px"}}*/}
                                  {/*onChange={this.getDiffSprintData}>*/}
                        {/*<RadioButton value="All">全部</RadioButton>*/}
                        {/*<RadioButton value="todo">规划中</RadioButton>*/}
                        {/*<RadioButton value="doing">进行中</RadioButton>*/}
                        {/*<RadioButton value="done">已完成</RadioButton>*/}
                      {/*</RadioGroup>*/}
                       <Input placeholder="支持@指派人，#搜索标签" style={{width: 200, marginRight: "10px"}}
                              prefix={<Icon type="search"/>}
                       />
                      </span>
                    </div>
                  </div>
                  <div className="tableStyle">
                    <Table columns={this.columns} dataSource={this.state.issues} pagination={true} size="small"/>
                  </div>
                  <div
                    style={{ display: SprintStore.rightShow ? 'block' : 'none' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <EditDetail id={SprintStore.currentId} init={this.init}/>
                  </div>
                  <div
                    style={{ display: SprintStore.createTaskShow ? 'block' : 'none' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <CreatTask  init={this.init}/>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="看板" key="2">
                <div className="kanbanStyle">
                  {/*<div className="kanbanLeft">*/}
                  {/*<PageHeader className="page-head" title="kanban" style={{backgroundColor:'#f4f4f4'}} />*/}
                  {/*<p>最近打开的看板</p>*/}
                  {/*<p>全部看板</p>*/}
                  {/*</div>*/}
                  <div className="kanbanRight">
                    <div className="rightTop">
                      <div className="page-head">
                        <div style={{paddingLeft: "6px", paddingTop: "12px", fontSize: "24px", flex: 1}}>
                          <lable onClick={this.toKanban}>看板管理</lable>
                        </div>
                        <div style={{paddingRight: "6px"}}>
                          <div style={{lineHeight: '45px'}}>
                            {/*<span style={{marginRight:"4px"}}>最近使用的看板</span>*/}
                            <span> <Dropdown overlay={menu}>
                            <Button style={{marginLeft: 8}}>Owner by anyone
                              <Icon type="down"/>
                            </Button>
                          </Dropdown></span>
                            <span> <Dropdown overlay={menu}>
                            <Button style={{marginLeft: 8}}>last opened
                              <Icon type="down"/>
                            </Button>
                          </Dropdown></span>
                            <span style={{marginLeft: '8px', fontSize: '20px'}}><Icon type="bars"/></span>
                            <span style={{marginLeft: '8px', marginRight: '10px', fontSize: '20px'}}><Icon
                              type="credit-card"/></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rightCont">
                      {this.state.kanbans.map((item, i) => (
                        <Card className="cardStyle" id={item.id}
                              style={{width: 160, height: 200, paddingBottom: "10px", verticalAlign: "top"}}
                              bodyStyle={{padding: "8px"}} onClick={this.kanbanDetail}>
                          <div className="custom-image">
                            <img src={kanbanIcon} id={item.id} style={{width: "100%"}}/>
                          </div>
                          <div id={item.id} className="custom-card">
                            {item.name.length > 10 ? item.name.substring(0, 10) : item.name}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabPane>
              {/*<TabPane tab="图表" key="3">*/}
              {/*Content of Tab Pane 3*/}
              {/*</TabPane>*/}
            </Tabs>
          </div>
          <EditDescription ref={this.saveFormRef}
                           id={this.state.id} description={this.state.sprintBaseData.description}
                           visible={this.state.descriptionVisible} handleOk={this.handleOk}
                           handleCancel={this.handleCancel}/>
          <SprintPlanModel
            id={this.state.id}
            visible={this.state.planVisible}
            onCancel={this.hideSprintPlanModal}
          />
        </div>
      )
    }
    else {
      return (<div></div>)
    }
  }
}
export default SprintDetailOther;
