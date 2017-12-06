/**
 * Created by chenzl on 2017/9/5.
 * 管理issue组件
 */
/*eslint-disable*/
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Table, Button, Tooltip, Icon, message, Row, Col, Form, Select, Input, Spin, Upload, DatePicker, Collapse, InputNumber } from 'antd';
import { withRouter } from 'react-router-dom';
import PageHeader, { PageHeadStyle } from '../../../components/common/PageHeader';
import store from 'Store';
import IssueManageStore from '../../../stores/origanization/issue/IssueManageStore';
import SprintStore from '../../../stores/origanization/sprint/SprintStore';
import Remove from '../../../components/common/Remove';
import IssueDetail from '../../../components/issue/IssueDetail';
import '../../../assets/font-awesome/css/font-awesome.min.css';
import FontAwesome from 'react-fontawesome';
import IssueSprint from "../../../components/issue/IssueSprint";
const Option = Select.Option;
const typeStyle = {
  // Epic
  epicStyle: {
    background: '#3781cc',
    borderRadius: '20px',
    width: '40px',
    height: '20',
    lineHeight: '20px',
    color: 'white',
    textAlign: 'center',
    wordBreak: 'break-all',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  // 故事Isue
  storyStyle: {
    background: '#ffd263',
    borderRadius: '20px',
    width: '40px',
    height: '20',
    lineHeight: '20px',
    color: 'white',
    textAlign: 'center',
    wordBreak: 'break-all',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  // 任务Issue样式
  taskStyle: {
    background: '#00bfff',
    color: 'white',
    borderRadius: '20px',
    width: '40px',
    height: '20',
    lineHeight: '20px',
    textAlign: 'center',
    wordBreak: 'break-all',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  otherStyle: {
    background: '#cc2a36',
    borderRadius: '20px',
    width: '40px',
    height: '20',
    lineHeight: '20px',
    color: 'white',
    textAlign: 'center',
    wordBreak: 'break-all',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  detailStyle: {
    border: '4px solid #f7f7f7',
    borderBottom: 'none',
    borderLeft: 'none',
    height: '75vh',
    // boxShadow:'-2px 0px 5px #dedede',
    overflow: 'auto'
  },
  desStyle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    wordBreak: 'break-all',
    display: 'block',
    textOverflow: 'ellipsis',
    width: '600px',
    cursor: 'pointer',
  }
}


@store('IssueManageStore')
@observer
class IssueManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // visible: false,
      Issue: [],
      issueId: '',
      Id: '',
      trId: 0,
      IssueData: [],
      IssueType: [],// Issue类型
      displayBug: 'none',
      displayTask: 'none',
      displayStory: 'none',
      hiddenStyle: 'none',
      dispalayBorder: '0',
      displayPoint: '0',
      displayDetail: 'none',
      issueArr: [],
      flag: true,
      sprintId: '',
      background2: '#49a9ee',// change:#f0f4fd;
      background1: '#49a9ee',// change:#f0f4fd;
    }
  }
  componentWillMount() {
    this.localIssueData();
    this.getIssueTypeByProjectId();
  }
  localIssueData() {
    const loadFlag = IssueManageStore.getLoadFlag;
    window.console.log("状态：" + loadFlag);
    if (loadFlag) {
      IssueManageStore.localIssueModel();
      IssueManageStore.setLoadFlag(true);
      const issueData = IssueManageStore.getIssueData; // 获取Issue数据
      let issueArrs = [];
      for (let i = 0; i < issueData.length; i++) {
        issueArrs.push(issueData[i]);
      }
      this.setState({
        issueArr: issueArrs,
      });
    }
    else {
      IssueManageStore.loadIssueLevelListData();
      IssueManageStore.setLoadFlag(false);
      let levelData = [];
      const data = IssueManageStore.getIssueData;
      if (data)
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].parentId == data[i].id) {
              if (!data[i].children)
                data[i].children = [];
              data[i].children.push(data[j]);
            }
          }
          if (data[i].parentId == null || data[i].parentId == 0)
            levelData.push(data[i]);
        }
      this.setState({
        issueArr: levelData,
      });
    }
    // IssueManageStore.localIssueModel();
    // this.setState({
    //   flag:true
    // });
  }

  // 路由跳转设置
  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  // 新建Issue
  createIssue = (id) => {
    this.linkToChange('issueManage/create');
  }
  // 新建子卡
  createSubCard = () => {
    this.linkToChange(`issueManage/createSub/${this.state.Id}/${this.state.sprintId}`);
  }
  //关联BUG
  AssociationBug = () => {
    this.linkToChange(`issueManage/createBug/${this.state.Id}/${this.state.sprintId}`);
  }
  // 点击刷新页面
  loadIssues = () => {
    this.localIssueData();
  }

  // 删除
  handleDelete = (e) => {
    const { id } = this.state;
    IssueManageStore.deleteIssueById(id).then(data => {
      message.success("删除成功", 0.1);
      this.handleClose();
      if (this.state.flag === true) {
        IssueManageStore.localIssueModel();
      } else {
        IssueManageStore.loadIssueLevelListData();
      }
    })
  };
  // 点击选中事件
  styleTest = (e) => {
    if (this.state.trId !== 0) {
      document.getElementsByClassName(`ant-table-row ${this.state.trId} ant-table-row-level-0`)[0].style.backgroundColor = '#fff';
    }
    this.setState({
      trId: e.id,
    });
    document.getElementsByClassName(`ant-table-row ${e.id} ant-table-row-level-0`)[0].style.backgroundColor = '#f0f4fd';
  }
  // 根据Id查找Issue详情
  queryIssueById = (id) => {
    IssueManageStore.getIssueById(id).then((data) => {
      if (data) {
        if (data.issueType === 'Bug') {
          this.setState({
            displayBug: 'block',
            displayTask: 'none',
            displayStory: 'none',
            hiddenStyle: 'none'
          })
        } else if (data.issueType === 'Task') {
          this.setState({
            displayBug: 'none',
            displayTask: 'block',
            displayStory: 'none',
            hiddenStyle: 'block'
          })
        } else if (data.issueType === 'UserStory') {
          this.setState({
            displayBug: 'none',
            displayTask: 'none',
            displayStory: 'block',
            hiddenStyle: 'block'
          })
        }
        this.setState({
          Issue: data,
          issueId: data.issueId,
          Id: id,
          displayDetail: 'block',
          sprintId: data.sprintId,
        });
      }
    }).catch((err) => {
      console.log(err)
    });
  }

  // 打开Model
  handleOpen(id) {
    this.setState({ open: true, id: id });
  }

  handleClose = () => {
    this.setState({ open: false });
  };
  // 根据Issue标号筛选
  filtersByIssueId(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
  }

  // 编辑按钮,更新Issue类型
  editChange = () => {
    this.linkToChange(`issueManage/updata/${this.state.Id}`);
  }

  // 时间选择
  changeTime(date, dateString) {
    console.log(date, dateString);
  }
  // 选择issue类型
  getIssueTypeByProjectId = () => {
    const projectId = 1;
    IssueManageStore.getIssueTypeList(projectId).then(data => {
      if (data) {
        this.setState({
          IssueType: data,
        });
      }
    }).catch((err) => {
      // message.error(this.localIssueData());
      window.console.log(err)
    });
  }
  // 隐藏详情页面
  displayDetail = (e) => {
    this.setState({
      displayDetail: 'none',
    });
  }
  //显示隐藏
  /*  handleClick=(e)=>{
   if(e.pageX < 750 &&IssueManageStore.getDisplayStatus === 'block'){
   IssueManageStore.setDisplayStatus('none')
   }
   };*/
  // 列表展示数据
  showListTable = () => {
    IssueManageStore.localIssueModel();
    IssueManageStore.setLoadFlag(true);
    const issueData = IssueManageStore.getIssueData; // 获取Issue数据
    let issueArrs = [];
    for (let i = 0; i < issueData.length; i++) {
      issueArrs.push(issueData[i]);
    }
    this.setState({
      issueArr: issueArrs,
      // flag:true
      background1: '#ff4081',//ff4081
      background2: "#49a9ee",
    });
  }
  // 层级展示数据s
  showLevelTable = () => {
    IssueManageStore.loadIssueLevelListData();
    IssueManageStore.setLoadFlag(false);
    let levelData = [];
    const data = IssueManageStore.getIssueData;
    if (data)
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (data[j].parentId == data[i].id) {
            if (!data[i].children)
              data[i].children = [];
            data[i].children.push(data[j]);
          }
        }
        if (data[i].parentId == null || data[i].parentId == 0)
          levelData.push(data[i]);
      }
    this.setState({
      issueArr: levelData,
      flag: false,
      background1: "#49a9ee",//ff4081
      background2: '#ff4081'
    });
  }
  render() {
    /*-------遍历迭代---------*/
    const sprintArr = [];
    const projectId = 1;
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
    let issueArr = [];
    if (this.state.issueArr != null && this.state.issueArr != '' && this.state.issueArr.length != 0) {
      issueArr = this.state.issueArr;
    } else {
      issueArr = IssueManageStore.getIssueData;
    }
    const issueType = this.state.IssueType;
    let issueTypeArr = [];
    for (let i = 0; i < issueType.length; i++) {
      issueTypeArr.push(<Option key={`${issueType[i].name}`} value={`${issueType[i].name}`}>{issueType[i].name}</Option>);
    }
    // 加载等待
    /*    const loading = (
     <div style={{ display: 'inherit', margin: '200px auto', textAlign: 'center' }}>
     <Spin />
     </div>
     );*/
    const columns = [{
      title: HAP.languageChange('issue.issueId'),
      dataIndex: 'issueId',
      key: 'issueId',
      width: '10%',
      sorter: (a, b) => a.issueId - b.issueId,
      render: (text, record) =>
        <span>#{text}</span>
    }, {
      title: HAP.languageChange('issue.description'),
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => <div style={typeStyle.desStyle}>{text}</div>,
      onCellClick: record => { this.queryIssueById(record.id) },
    }, {
      title: HAP.languageChange('issue.issueType'),
      dataIndex: 'issueType',
      key: 'issueType',
      width: '7%',
      render: (text, record) => {
        if (text === "UserStory") {
          return <div>{'Story'}</div>
        }
        else {
          return <div>{text}</div>
        }
      },
    }, {
      title: HAP.languageChange('issue.assigneeId'),
      dataIndex: 'assigneeId',
      key: 'assigneeId',
      width: '7%',
      render: (text, record) => <div>{text}</div>
    }, {
      title: HAP.languageChange('issue.Scale'),
      dataIndex: 'storyPoint',
      key: 'storyPoint',
      width: '7%',
      render: (text, record) => <div>{text}</div>
    }, {
      title: HAP.languageChange('issue.Iteration'),
      dataIndex: 'sprintId',
      key: 'sprintId',
      width: '10%',
      render: (text, record) => <IssueSprint text={text} />
    },
    {
      title: HAP.languageChange('issue.status'),
      dataIndex: 'status',
      key: 'status',
      width: '7%',
      render: (text, record) => {
        if (text === 'done') {
          return <div>{'已完成'}</div>
        } else if (text === 'doing') {
          return <div>{'开发中'}</div>
        } else if (text === 'todo') {
          return <div>{'规划中'}</div>
        } else {
          return <div>{'规划中'}</div>
        }
      }
    },
    {
      title: <div style={{ textAlign: "center" }}>{HAP.languageChange('issue.operate')}</div>,
      className: "operateIcons",
      key: 'action',
      width: '7%',
      render: (text, record) => (
        <div>
          <Tooltip title={'关闭'} placement="bottom"
            getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.id)}>
              <Icon type="delete" />
            </a>
          </Tooltip>
        </div>
      )
    }];
    return (
      <div className="shouIssue">
        <PageHeader title={HAP.languageChange('issue.message')}>
          <Button ghost={true} onClick={this.createIssue}
            style={PageHeadStyle.leftBtn}
          > <FontAwesome name="tasks" style={{ marginRight: 10 }} />{HAP.languageChange('issue.create')}</Button>
          <Button className="header-btn" ghost={true} onClick={this.loadIssues} style={PageHeadStyle.leftBtn}
            icon="reload">{HAP.languageChange('issue.reload')}</Button>
          <div style={{ float: 'right', marginTop: 10, marginRight: 30, fontSize: 20 }} className="aStyle">
            <Tooltip title="列表显示" placement="bottom">
              <a style={{ marginRight: 20, 'color': this.state.background1 }} onClick={this.showListTable}><FontAwesome name="list-ul" /></a></Tooltip>
            <Tooltip title="层级显示" placement="bottom">
              <a onClick={this.showLevelTable} style={{ 'color': this.state.background2 }}><FontAwesome name="list-ol" /></a></Tooltip>
          </div>
        </PageHeader>
        <Remove open={this.state.open} handleCancel={this.handleClose} handleConfirm={this.handleDelete} />
        <div>
          <Col>
            <Table columns={columns} dataSource={issueArr} size="default" rowKey={record => record.id}
              rowClassName={(record, index) => record.id} className="table" onRowClick={this.styleTest}
            />
          </Col>
        </div>
        <div style={{ 'display': this.state.displayDetail, paddingLeft: '0px !important', paddingRight: '0px !important' }} className="IssueDetailStyle">
          <IssueDetail Issue={this.state.Issue}
            id={this.state.Id}
            sprintArr={sprintArr}
            issueTypeArr={issueTypeArr}
            typeStyle={typeStyle}
            createSubCard={this.createSubCard}
            editChange={this.editChange}
            displayDetail={this.displayDetail}
            onChangeStatus={this.onChangeStatus}
            localIssueData={this.localIssueData}
            ref="getChangeType"
            displayBug={this.state.displayBug}
            displayTask={this.state.displayTask}
            displayStory={this.state.displayStory}
            hiddenStyle={this.state.hiddenStyle}
            AssociationBug={this.AssociationBug}
          />
        </div>
      </div>
    );
  }
}
export default Form.create({})(withRouter(IssueManage));
