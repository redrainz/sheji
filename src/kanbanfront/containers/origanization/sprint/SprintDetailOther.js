/**
 * Created by chenzl on 2017/11/9.
 * Feature:看板管理界面的另外布局
 */
/*eslint-disable*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Layout,
  Menu,
  Button,
  Icon,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  message,
  Popover,
  Tree,
  Select,
  Radio,
  Progress,
  Switch,
  Tabs,
  Dropdown,
  Table,
  Pagination,
} from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import Routes from '../../../common/RouteMap';
import PageHeader, {
  PageHeadStyle,
} from '../../../components/common/PageHeader';
import SprintPlanModel from '../../../components/sprintDetails/SprintPlanModel';
import EditDetail from '../../../components/sprintDetails/EditDetail';
import DetailHeader from '../../../components/sprintDetails/DetailHeader';
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
let kanbanName = '';

const styles = {
  tableitem: {
    width: '120px',
    height: '20px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: '12px',
    color: 'rgba(0,0,0,0.65)',
  },
};

@observer
class SprintDetailOther extends Component {
  constructor(props) {
    super(props);
    let id = parseInt(this.props.location.pathname.split('/')[4]);
    this.state = {
      kanbans: [],
      id: id,
      description: '',
      type: 'story',
      issues: this.props.issues,
      lists: this.props.lists,
      sprintBaseData: [],
      sprintIssuesData: [],
      disStatus: '规划中',
      switchChecked: false,
      descriptionVisible: false,
      planVisible: false,
      mark: false,
      issueTypeFilter: 'All',
      statusFilter: 'All',
      showMenu: false,
    };
  }

  componentDidMount() {
    this.init();
  }
  formIssuePriority = data => {
    let issuePriority;
    if (data.issuePriority == 1) {
      issuePriority = '低,#5095fe';
    } else if (data.issuePriority == 2) {
      issuePriority = '中,#F9D252';
    } else if (data.issuePriority == 3) {
      issuePriority = '高,#fe5050';
    } else {
      issuePriority = '-';
    }
    return issuePriority;
  };
  formBaseData = value => {
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
        data.issue[j].issueId = '#' + value.issue[j].issueId;
        data.issue[j].startTime = this.formDate(value.issue[j].startTime);
        data.issue[j].deadline = this.formDate(value.issue[j].deadline);
        data.storyPoint += data.issue[j].storyPoint;
        data.workload += data.issue[j].workload;
        if (value.issue[j].issueType == 'story') {
          data.storyIssues++;
          if (value.issue[j].status == 'done') data.endStory += 1;
        } else if (value.issue[j].issueType == 'task') {
          data.taskIssues++;
          if (value.issue[j].status == 'done') data.endTask += 1;
        } else if (value.issue[j].issueType == 'bug') {
          data.bugIssues++;
          if (value.issue[j].status == 'done') data.endBug += 1;
        }
      }
    return data;
  };
  formIssuesData = (value, kanbans) => {
    let issuePriority;
    let priorityColor;
    let status;
    let issuesData = [];
    for (let i = 0; i < value.length; i++) {
      issuePriority = this.formIssuePriority(value[i]);
      issuesData.push({
        key: value[i].id,
        issueId: value[i].issueId,
        issueType: value[i].issueType,
        description: value[i].description,
        creationDate: value[i].creationDate,
        creater: '-',
        status: value[i].status,
        issuePriority: issuePriority,
        owner: value[i].owner,
        kanbanName: value[i].kanbanName,
      });
    }
    console.log(value);
    console.log(issuesData);
    return issuesData;
  };
  formDate = date => {
    let temp = new Date(date);
    return (
      temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate()
    );
  };
  showIssueByType = () => {
    // let issues=[];
    // this.state.lists.map((item,index)=>{
    //   if(item.issueType=e.)
    //   issues.push(item)
    // })
  };
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
        });
      }
      SprintStore.getSprintById(id).then(data => {
        SprintStore.setSprintData(data);
        if (data) {
          let switchChecked;
          let disStatus;
          switch (data.status) {
            case 'doing': {
              switchChecked = true;
              disStatus = '进行中';
              break;
            }
            case 'done': {
              switchChecked = false;
              disStatus = '已结束';
              break;
            }
            default: {
              switchChecked = false;
              disStatus = '规划中';
              break;
            }
          }
          const temp = this.formBaseData(data);
          let issuesData = this.formIssuesData(data['issue'], kanbans);
          this.setState({
            type: 'story',
            id: id,
            sprintBaseData: data,
            description: data.description,
            issues: issuesData,
            lists: issuesData,
            switchChecked: switchChecked,
            disStatus: disStatus,
            kanbans: kanbans,
            mark: true,
            trId: 0,
          });
        }
      });
    });
  };
  toKanban = () => {
    this.linkToChange(`/kanbanFront/kanbanMange/${this.state.id}`);
  };
  toKanbanDetail = id => {
    this.linkToChange(`/kanbanFront/kanban/${id}`);
  };
  kanbanDetail = e => {
    let id = e.target.id;
    this.toKanbanDetail(id);
  };
  linkToChange = url => {
    const { history } = this.props;
    history.push(url);
  };

  edit = () => {
    this.setState({
      descriptionVisible: true,
    });
  };
  saveFormRef = form => {
    this.form = form;
  };
  handleOk = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        SprintStore.updateSprintById(this.state.id, {
          description: values.description,
        }).then(data => {
          if (data)
            this.setState({
              descriptionVisible: false,
              description: values.description,
            });
          else message.error('网络异常');
        });
      }
    });
  };
  handleCancel = () => {
    this.setState({
      descriptionVisible: false,
    });
  };

  showSprintPlanModal = () => {
    this.setState({
      planVisible: true,
    });
  };
  hideSprintPlanModal = () => {
    this.init();
    this.setState({
      planVisible: false,
    });
  };

  onSwitchChange = () => {
    let disStatus = '';
    let checked = !this.state.switchChecked;
    let switchChecked = false;
    this.setState({
      showMenu: !this.state.showMenu,
    });
    let status = '';
    if (checked) {
      disStatus = '进行中';
      switchChecked = true;
      status = 'doing';
    } else {
      disStatus = '已结束';
      switchChecked = false;
      status = 'done';
    }
    SprintStore.updateSprintById(this.state.id, { status: status }).then(
      data => {
        if (data)
          this.setState({
            disStatus: disStatus,
            switchChecked: switchChecked,
          });
        else message.error('网络故障');
      },
    );
  };
  changeIssuesTypeFilter = e => {
    this.setState({
      issueTypeFilter: e.target.value,
    });
  };
  changeStatusFilter = e => {
    this.setState({
      statusFilter: e.target.value,
    });
  };
  getDiffSprintData = e => {
    let issueTypeFilter = this.state.issueTypeFilter;
    // let statusFilter = this.state.statusFilter;
    if (e.target.name == 'issueTypeFilter') {
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
    if (issueTypeFilter == 'All') {
      for (i = 0; i < list.length; i++) {
        filterList.push(list[i]);
      }
    } else if (issueTypeFilter == 'story') {
      for (i = 0; i < list.length; i++) {
        if (list[i].issueType == 'story') {
          filterList.push(list[i]);
        }
      }
    } else if (issueTypeFilter == 'task') {
      for (i = 0; i < list.length; i++) {
        if (list[i].issueType == 'task') {
          filterList.push(list[i]);
        }
      }
    } else if (issueTypeFilter) {
      for (i = 0; i < list.length; i++) {
        if (list[i].issueType == 'bug') {
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
  };
  hideRight = () => {
    this.setState({
      showMenu: false,
    });
    SprintStore.closeCreateTaskShow();
    SprintStore.closeRight();
  };
  //设定选中
  styleTest = id => {
    if (this.state.trId !== 0) {
      document.getElementsByClassName(
        `ant-table-row ${this.state.trId} ant-table-row-level-0`,
      )[0].style.backgroundColor =
        '#fff';
    }
    this.setState({
      trId: id,
    });
    document.getElementsByClassName(
      `ant-table-row ${id} ant-table-row-level-0`,
    )[0].style.backgroundColor =
      '#f0f4fd';
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'issueId',
      sorter: (a, b) =>
        parseInt(a.issueId.replace('#', '')) -
        parseInt(b.issueId.replace('#', '')),
    },
    {
      title: '描述',
      dataIndex: 'description',

      sorter: (a, b) => {},
      render: (text, record) => (
        <div style={styles.tableitem} title={text}>
          {text}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: (a, b) => {},
      render: (text, record) => (
        <div
          style={{
            ...styles.tableitem,
            ...{
              height: '25px',
              background: '#4CAF50',
              color: 'white',
              lineHeight: '25px',
            },
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'issuePriority',

      sorter: (a, b) => {},
      render: (text, record) => (
        <div sstyle={styles.tableitem}>
          {text == '-' ? (
            <div style={{ width: '100%' }}>{text}</div>
          ) : (
            <div
              style={{
                marginLeft: '10px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  background: text.split(',')[1],
                  width: '12px',
                  height: '12px',
                  marginRight: '8px',
                  borderRadius: '50%',
                }}
              />
              {/* <FontAwesome
                name="circle-thin"
                style={{
                  fontSize: '12px',
                  color: text.split(',')[1],
                  paddingRight: '4px',
                  display: 'inline-block',
                  transform: 'scale(0.8)',
                }}
              /> */}
              {text.split(',')[0]}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'issueType',
    },
    {
      title: '看板',
      dataIndex: 'kanbanName',
      // width: '15%',
      sorter: (a, b) => {},
      render: (text, record) => (
        <div style={styles.tableitem}>
          {text ? (text.length > 10 ? text.substring(0, 10) : text) : '-'}
        </div>
      ),
    },
    {
      title: '创建者',
      dataIndex: 'creater',

      sorter: (a, b) => {},
      render: (text, record) => (
        <div style={styles.tableitem}>
          {text ? (text.length > 10 ? text.substring(0, 10) : text) : '-'}
        </div>
      ),
    },
    {
      title: '认领人',
      dataIndex: 'owner',

      sorter: (a, b) => {},
      render: (text, record) => (
        <div style={styles.tableitem}>
          {text ? (text.length > 10 ? text.substring(0, 10) : text) : '-'}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'creationDate',
      // width: '16%',
      sorter: (a, b) => Date.parse(a.creationDate) - Date.parse(b.creationDate),
    },
  ];
  goBack() {
    history.go(-1);
  }
  render() {
    console.log(this.props);
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3d menu item</Menu.Item>
      </Menu>
    );
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection,
    };
    if (this.state.mark) {
      return (
        <div
          style={{ backgroundColor: 'white' }}
          className="kanbanOther"
          onClick={this.hideRight}
        >
          <DetailHeader handleClick={this.goBack.bind(this)} />
          <div className="topStyle">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '10px',
                marginLeft: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  color: 'rgba(0,0,0,0.87)',
                  fontWeight: 'bold',
                  width: '280px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                title={this.state.sprintBaseData.name}
              >
                冲刺名称：
                {this.state.sprintBaseData.name}
              </div>
              <div
                style={{
                  color: 'rgba(0,0,0,0.65)',
                  marginTop: '10px',
                }}
              >
                <div>
                  时间：从{this.state.sprintBaseData.startTime} 到{' '}
                  {this.state.sprintBaseData.endTime}
                </div>
                <div
                  style={{
                    overflow: 'hidden',
                    width: '280px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                  title={this.state.description}
                >
                  描述：{this.state.description}
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                  }}
                >
                  <i className="material-icons" style={{ marginRight: '8px' }}>
                    assignment_ind
                  </i>
                  用户故事：
                  <div>
                    {this.state.sprintBaseData.endStory} /
                    {this.state.sprintBaseData.storyIssues -
                      this.state.sprintBaseData.endStory}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '30px',
                    fontSize: '14px',
                  }}
                >
                  <i className="material-icons" style={{ marginRight: '8px' }}>
                    assignment
                  </i>
                  任务：
                  <div>
                    {this.state.sprintBaseData.endTask}/
                    {this.state.sprintBaseData.taskIssues -
                      this.state.sprintBaseData.endTask}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '30px',
                    fontSize: '14px',
                  }}
                >
                  <i className="material-icons" style={{ marginRight: '8px' }}>
                    bug_report
                  </i>
                  缺陷：
                  <div>
                    {this.state.sprintBaseData.endBug}/
                    {this.state.sprintBaseData.bugIssues -
                      this.state.sprintBaseData.endBug}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '30px',
                    fontSize: '14px',
                  }}
                >
                  <i className="material-icons" style={{ marginRight: '8px' }}>
                    slow_motion_video
                  </i>
                  故事点：
                  <div>{this.state.sprintBaseData.storyPoint}P</div>
                </div>
                <div
                  style={{
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '30px',
                    fontSize: '14px',
                  }}
                >
                  <i className="material-icons" style={{ marginRight: '8px' }}>
                    timer
                  </i>
                  工作量：
                  <div>
                    {this.state.sprintBaseData.workload}
                    {' H'}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, visibility: 'hidden' }} />
            <div style={{ margin: '63px 25px 0 0', textAlign: 'right' }}>
              <div
                style={{
                  color: 'rgba(0,0,0,0.65)',
                }}
              >
                操作
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.87)',
                    marginRight: '8px',
                  }}
                >
                  {/* {this.state.disStatus} */}
                  {this.state.switchChecked ? '开启' : '关闭'}
                </div>
                <Icon
                  type="caret-down"
                  style={{ cursor: 'pointer' }}
                  onClick={e => {
                    e.stopPropagation();
                    this.setState({
                      showMenu: !this.state.showMenu,
                    });
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    display: this.state.showMenu ? 'block' : 'none',
                    zIndex: 10,
                    top: '100%',
                    background: 'white',
                    textAlign: 'center',
                    width: '100%',
                    border: '1px solid #eee',
                    cursor: 'pointer',
                    boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
                  }}
                  onClick={this.onSwitchChange}
                >
                  {this.state.switchChecked ? '关闭' : '开启'}
                </div>
              </div>
            </div>

            {/* <div style={{ marginRight: '30px' }}>
              <Switch
                checkedChildren={'开启'}
                unCheckedChildren={'关闭'}
                checked={this.state.switchChecked}
                onChange={this.onSwitchChange}
              />
            </div> */}
            <div
              style={{
                height: '94px',
                margin: '18px 0 0 41px',
                padding: '0 40px',
                borderLeft: '1px solid rgba(0,0,0,0.65)',
              }}
            >
              <Progress
                width="90px"
                type="circle"
                style={{ fontSize: '21px' }}
                percent={
                  this.state.sprintBaseData.storyIssues == 0 ||
                  !this.state.sprintBaseData.storyIssues
                    ? 0
                    : (
                        this.state.sprintBaseData.endStory *
                        1000 /
                        this.state.sprintBaseData.storyIssues /
                        10
                      ).toFixed(0)
                }
              />
            </div>
          </div>
          <div
            style={{
              display: 'none',
              // width: '60%',
              margin: '20px 100px 0 100px',
              border: '1px solid #D3D3D3',
              borderTop: '5px solid #3F51B5',
              fontSize: '0',
            }}
          >
            <div
              style={{
                height: '120px',
                flex: 1,
                fontSize: '12px',
                color: 'rgba(0,0,0,0.65)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '20px',
                }}
              >
                <i className="material-icons" style={{ marginRight: '8px' }}>
                  recent_actors
                </i>
                用户故事
              </div>
              <div style={{ margin: '2px 0 8px 0' }}>
                <span
                  style={{
                    fontSize: '36px',
                    color: 'rgba(0,0,0,0.87)',
                    lineHeight: '43px',
                  }}
                >
                  {this.state.sprintBaseData.storyIssues}
                </span>{' '}
                个
              </div>
              <div>
                已完成 {this.state.sprintBaseData.endStory} | 未完成{' '}
                {this.state.sprintBaseData.storyIssues -
                  this.state.sprintBaseData.endStory}
              </div>
            </div>
            <div
              style={{ width: '1px', background: '#D3D3D3', margin: '12px 0' }}
            />
            <div
              style={{
                height: '120px',
                flex: 1,
                fontSize: '12px',
                color: 'rgba(0,0,0,0.65)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '20px',
                }}
              >
                <i className="material-icons" style={{ marginRight: '8px' }}>
                  recent_actors
                </i>
                任务
              </div>
              <div style={{ margin: '2px 0 8px 0' }}>
                <span
                  style={{
                    fontSize: '36px',
                    color: 'rgba(0,0,0,0.87)',
                    lineHeight: '43px',
                  }}
                >
                  {this.state.sprintBaseData.taskIssues}
                </span>{' '}
                个
              </div>
              <div>
                已完成 {this.state.sprintBaseData.endTask} | 未完成{' '}
                {this.state.sprintBaseData.taskIssues -
                  this.state.sprintBaseData.endTask}
              </div>
            </div>
            <div
              style={{ width: '1px', background: '#D3D3D3', margin: '12px 0' }}
            />
            <div
              style={{
                height: '120px',
                flex: 1,
                fontSize: '12px',
                color: 'rgba(0,0,0,0.65)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '20px',
                }}
              >
                <i className="material-icons" style={{ marginRight: '8px' }}>
                  bug_report
                </i>
                缺陷
              </div>
              <div style={{ margin: '2px 0 8px 0' }}>
                <span
                  style={{
                    fontSize: '36px',
                    color: 'rgba(0,0,0,0.87)',
                    lineHeight: '43px',
                  }}
                >
                  {this.state.sprintBaseData.bugIssues}
                </span>{' '}
                个
              </div>
              <div>
                已完成 {this.state.sprintBaseData.endBug} | 未完成{' '}
                {this.state.sprintBaseData.bugIssues -
                  this.state.sprintBaseData.endBug}
              </div>
            </div>
            <div
              style={{ width: '1px', background: '#D3D3D3', margin: '12px 0' }}
            />
            <div
              style={{
                height: '120px',
                flex: 1,
                fontSize: '12px',
                color: 'rgba(0,0,0,0.65)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '20px',
                }}
              >
                <i className="material-icons" style={{ marginRight: '8px' }}>
                  center_focus_weak
                </i>
                故事点
              </div>
              <div style={{ margin: '2px 0 8px 0' }}>
                <span
                  style={{
                    fontSize: '36px',
                    color: 'rgba(0,0,0,0.87)',
                    lineHeight: '43px',
                  }}
                >
                  {this.state.sprintBaseData.storyPoint}
                </span>{' '}
                P
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '20px',
                }}
              >
                <i
                  className="material-icons"
                  style={{ color: '#979797', marginRight: '8px' }}
                >
                  error_outline
                </i>查看定义规则
              </div>
            </div>
            <div
              style={{ width: '1px', background: '#D3D3D3', margin: '12px 0' }}
            />
            <div
              style={{
                height: '120px',
                flex: 1,
                fontSize: '12px',
                color: 'rgba(0,0,0,0.65)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '20px',
                }}
              >
                <i className="material-icons" style={{ marginRight: '8px' }}>
                  recent_actors
                </i>
                任务规模
              </div>
              <div style={{ margin: '2px 0 8px 0' }}>
                <span
                  style={{
                    fontSize: '36px',
                    color: 'rgba(0,0,0,0.87)',
                    lineHeight: '43px',
                  }}
                >
                  {this.state.sprintBaseData.workload}
                </span>{' '}
                h
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i
                  className="material-icons"
                  style={{ color: '#979797', marginRight: '8px' }}
                >
                  error_outline
                </i>查看定义规则
              </div>
            </div>
          </div>
          <div
            className="sprintTable"
            style={{
              width: '100%',
              background: '#ffffff',
              marginTop: '30px',
            }}
          >
            <Tabs
              defaultActiveKey="1"
              onChange={this.callback}
              animated={{ inkBar: false, tabPane: true }}
            >
              <TabPane tab="用户故事与任务" key="1">
                <div style={{ padding: '0 24px' }}>
                  <div className="tableTopStyle">
                    <div
                      style={{
                        lineHeight: ' 40px',
                        verticalAlign: 'middle',
                        display: 'inline-block',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '13px',
                        }}
                      >
                        <i
                          className="material-icons"
                          style={{ color: '#3f51b5', marginRight: '6px' }}
                        >
                          playlist_add
                        </i>
                        <div
                          style={{
                            color: '#3f51b5',
                            margin: '0 20px 0 0',
                            cursor: 'pointer',
                          }}
                          onClick={this.showSprintPlanModal}
                        >
                          用户故事
                        </div>
                        <i
                          className="material-icons"
                          style={{ color: '#3f51b5', marginRight: '6px' }}
                        >
                          playlist_add
                        </i>
                        <div
                          style={{
                            display: 'inline-block',
                            cursor: 'pointer',
                            color: '#3f51b5',
                          }}
                          onClick={e => {
                            SprintStore.setCreateTaskShow();
                            e.stopPropagation();
                          }}
                        >
                          添加task
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginRight: '20px',
                        lineHeight: '40px',

                        verticalAlign: 'top',
                        float: 'right',
                        display: 'inline-block',
                      }}
                    >
                      <span>
                        <RadioGroup
                          name="issueTypeFilter"
                          defaultValue="All"
                          size="default"
                          style={{ marginRight: '10px' }}
                          onChange={this.getDiffSprintData}
                        >
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
                        <Input
                          placeholder="支持@指派人，#搜索标签"
                          style={{ width: 200, marginRight: '10px' }}
                          prefix={<Icon type="search" />}
                        />
                      </span>
                    </div>
                  </div>
                  <div className="tableStyle">
                    <Table
                      columns={this.columns}
                      onRowClick={(record, index, e) => {
                        SprintStore.setCurrentId(record.key);
                        e.stopPropagation();
                        e.preventDefault();
                        SprintStore.setRightShow();
                        this.styleTest(record.key);
                      }}
                      rowKey={record => record.id}
                      rowClassName={(record, index) => record.key}
                      className="table"
                      dataSource={this.state.issues}
                      pagination={true}
                      size="small"
                    />
                  </div>
                  <div
                    style={{
                      display: SprintStore.rightShow ? 'block' : 'none',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <EditDetail id={SprintStore.currentId} init={this.init} />
                  </div>
                  <div
                    style={{
                      display: SprintStore.createTaskShow ? 'block' : 'none',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <CreatTask init={this.init} />
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
                        <div
                          style={{
                            paddingLeft: '6px',
                            paddingTop: '12px',
                            fontSize: '24px',
                            flex: 1,
                          }}
                        >
                          <lable onClick={this.toKanban}>看板管理</lable>
                        </div>
                        <div style={{ paddingRight: '6px' }}>
                          <div style={{ lineHeight: '45px' }}>
                            {/*<span style={{marginRight:"4px"}}>最近使用的看板</span>*/}
                            <span>
                              {' '}
                              <Dropdown overlay={menu}>
                                <Button style={{ marginLeft: 8 }}>
                                  Owner by anyone
                                  <Icon type="down" />
                                </Button>
                              </Dropdown>
                            </span>
                            <span>
                              {' '}
                              <Dropdown overlay={menu}>
                                <Button style={{ marginLeft: 8 }}>
                                  last opened
                                  <Icon type="down" />
                                </Button>
                              </Dropdown>
                            </span>
                            <span
                              style={{ marginLeft: '8px', fontSize: '20px' }}
                            >
                              <Icon type="bars" />
                            </span>
                            <span
                              style={{
                                marginLeft: '8px',
                                marginRight: '10px',
                                fontSize: '20px',
                              }}
                            >
                              <Icon type="credit-card" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rightCont">
                      {this.state.kanbans.map((item, i) => (
                        <Card
                          className="cardStyle"
                          id={item.id}
                          style={{
                            width: 160,
                            height: 200,
                            paddingBottom: '10px',
                            verticalAlign: 'top',
                          }}
                          bodyStyle={{ padding: '8px' }}
                          onClick={this.kanbanDetail}
                        >
                          <div className="custom-image">
                            <img
                              src={kanbanIcon}
                              id={item.id}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div id={item.id} className="custom-card">
                            {item.name.length > 10
                              ? item.name.substring(0, 10)
                              : item.name}
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
          <EditDescription
            ref={this.saveFormRef}
            id={this.state.id}
            description={this.state.sprintBaseData.description}
            visible={this.state.descriptionVisible}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
          />
          <SprintPlanModel
            id={this.state.id}
            visible={this.state.planVisible}
            onCancel={this.hideSprintPlanModal}
          />
        </div>
      );
    } else {
      return <div />;
    }
  }
}
export default SprintDetailOther;
