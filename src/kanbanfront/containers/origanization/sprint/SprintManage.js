/**
 * Created by Yu Zhang on 2017/9/26.
 */
/*eslint-disable*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Layout,
  Menu,
  Collapse,
  Button,
  Dropdown,
  Icon,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  message,
  Popover,
  Progress,
  Table,
  Switch,
  Radio,
  Badge,
} from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import Routes from '../../../common/RouteMap';
import PageHeader, {
  PageHeadStyle,
} from '../../../components/common/PageHeader';
import SprintStore from '../../../stores/origanization/sprint/SprintStore';
import CreateSprint from '../../../components/sprintDetails/CreateSprint';
import UpdateSprint from '../../../components/sprintDetails/UpdateSprint';
import SprintPlanModel from '../../../components/sprintDetails/SprintPlanModel';
import Header from '../../../components/sprintDetails/Header';
import '../../../assets/font-awesome/css/font-awesome.min.css';
import FontAwesome from 'react-fontawesome';
import '../../../assets/css/sprint.css';
import { Transfrom } from './Transfrom';
import '../../../assets/css/acss.css';
const confirm = Modal.confirm;
const Search = Input.Search;

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);
const styles = {
  tableitem: {
    maxWidth: '100px',
    height: '20px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: '12px',
    color: 'rgba(0,0,0,0.65)',
  },
};

// const data = [];
// for (let i = 0; i < 3; ++i) {
//   data.push({
//     key: i,
//     name: 'Screem',
//     platform: 'iOS',
//     version: '10.3.4.5654',
//     upgradeNum: 500,
//     creator: 'Jack',
//     createdAt: '2014-12-24 23:12:00',
//   });
// }
@observer
class SprintManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprints: [],
      typeIcon: 'lock',
      visible: false, // 创建模态框
      switchStatus: '开启',
      sptDate: [],
      sprintId: '',
      flag: true,
      updateVisible: false, // 更新的模态框
      releaseData: [],
      planVisible: false, // 规划模态框
      filterStatus: 'all',
      filterSprintDate: [],
      defaultExpandedRowKeys: [],
      // endOpen:false
    };
  }

  componentDidMount() {
    this.init(1);
    window.addEventListener('resize', this.ChangeContent.bind(this));
    if (this.scrollele) {
      let ele = this.scrollele.parentNode.parentNode;
      console.log(ele.getBoundingClientRect());
    }
  }

  init(projectId) {
    SprintStore.getSprintByProjectId(projectId)
      .then(data => {
        if (data) {
          let allCount = 0;
          let openCount = 0;
          let closeCount = 0;
          let unOpenCount = 0;
          data.map((item, index) => {
            switch (item.status) {
              case 'doing': {
                openCount++;
                allCount++;
                break;
              }
              case 'done': {
                closeCount++;
                allCount++;
                break;
              }
              default: {
                allCount++;
                unOpenCount++;
                break;
              }
            }
          });
          this.setState({
            sprints: this.transform(data),
            allCount: allCount,
            openCount: openCount,
            closeCount: closeCount,
            unOpenCount: unOpenCount,
          });
        }
      })
      .catch(e => {
        console.log(e);
        message.error('网络出错!');
      });
  }

  transform(value) {
    let openCount = openCount;
    let closeCount = closeCount;
    let unOpenCount = unOpenCount;
    let data = value;
    for (let i = 0; i < value.length; i++) {
      data[i] = Transfrom(value[i]);
    }
    return data;
  }

  //详情跳转
  toDetail(id) {
    this.linkToChange(`/kanbanFront/sprintManage/sprintDetailOther/${id}`);
  }

  linkToChange = url => {
    const { history } = this.props;
    history.push(url);
  };

  //确认框
  showDeleteConfirm(id, event) {
    event.stopPropagation();
    confirm({
      title: '确定删除此冲刺?',
      content: '删除不可恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.deleteSprintById(id);
      },
      onCancel() {},
    });
  }

  deleteSprintById = () => {
    const id = this.state.sprintId;
    SprintStore.getSprintById(id).then(data => {
      console.log(data);
      if (!data['issue'].length) {
        SprintStore.deleteSprintById(id)
          .then(() => {
            message.success('删除成功');
            this.init(1);
          })
          .catch(e => {
            message.error('网络不稳');
          });
        this.setState({
          updateVisible: false,
          sprintId: 0,
        });
      } else {
        message.error('该冲刺下有用户故事，无法删除！');
      }
    });
  };
  // 选择规划冲刺
  planSprint = () => {
    SprintStore.getReleaseData().then(data => {
      if (data) {
        this.setState({
          releaseData: data,
        });
      }
    });
  };
  // 编辑冲刺
  editSprint = id => {
    // this.planSprint();
    SprintStore.getSprintById(id).then(data => {
      SprintStore.getReleaseData().then(releaseData => {
        if (data && releaseData) {
          this.setState({
            releaseData: releaseData,
            sptDate: data,
            sprintId: id,
            updateVisible: true,
            flag: false,
          });
        }
      });
    });
  };

  // 更新冲刺
  updateSprint = values => {
    let spsData = {
      name: values.name,
      description: values.description,
      startTime: values.startTime.valueOf(),
      endTime: values.endTime.valueOf(),
      projectId: 1,
    };
    SprintStore.updateSprintById(this.state.sprintId, spsData).then(data => {
      this.init(1);
      if (data) {
        message.success('更改成功');
      } else {
        message.error('更新失败');
      }
    });
  };
  // 打开模态框
  showModel = () => {
    this.planSprint();
    this.setState({ visible: true, flag: true });
  };
  // 开始关闭冲刺
  switchStatus = (id, status) => {
    if (status == 'todo') {
      confirm({
        title: '确定开启此冲刺?',
        content: '确定将开启！',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let data = {
            status: 'doing',
          };
          SprintStore.updateSprintById(id, data)
            .then(data => {
              if (data) {
                this.init(1);
                message.success('成功开启冲刺');
              }
            })
            .catch(err => {
              message.error('冲刺开启出错，请检查网络');
            });
        },
        onCancel() {},
      });
    } else if (status == 'doing') {
      confirm({
        title: '确定关闭此冲刺?',
        content: '点击确定即将关闭',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let data = {
            status: 'done',
          };
          SprintStore.updateSprintById(id, data)
            .then(data => {
              if (data) {
                this.init(1);
                message.success('关闭冲刺');
              }
            })
            .catch(err => {
              message.error('冲刺关闭出错，请检查网络');
            });
        },
        onCancel() {},
      });
    } else {
      confirm({
        title: '确定开启此冲刺?',
        content: '点击确定即将开启',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let data = {
            status: 'doing',
          };
          SprintStore.updateSprintById(id, data)
            .then(data => {
              if (data) {
                this.init(1);
                message.success('开启冲刺');
              }
            })
            .catch(err => {
              message.error('冲刺开启出错，请检查网络');
            });
        },
        onCancel() {},
      });
    }
  };

  // 更新
  handleCancel = () => {
    this.setState({
      updateVisible: false,
      // endOpen:false
    });
  };
  // 创建
  handleCancelCst = () => {
    const formSct = this.formSct;
    formSct.resetFields();
    this.setState({
      visible: false,
      // endOpen:false
    });
  };
  // 更新保存冲刺数据
  handleCreate = e => {
    e.preventDefault();
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.updateSprint(values);
      form.resetFields();
      this.setState({ updateVisible: false });
    });
  };
  // 创建保存冲刺数据
  handleCreateCst = e => {
    e.preventDefault();
    const formSct = this.formSct;
    formSct.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        let data = {
          name: values.name,
          description: values.description,
          releasePlanId: values.releasePlanName.split(',')[0],
          startTime: values.startTime.valueOf(),
          endTime: values.endTime.valueOf(),
          projectId: 1,
          status: 'todo',
        };
        if (data) {
          SprintStore.createSprint(data)
            .then(data => {
              this.init(1);
              if (data) {
                message.success('添加成功');
                formSct.resetFields();
                this.setState({ visible: false });
              } else message.error('添加失败');
            })
            .catch(error => {
              if (
                error['response']['data']['message'] ==
                'error.SprintServiceImpl.nameExit'
              )
                message.error('存在同名的冲刺');
            });
        }
      }
    });
  };
  // 更新
  saveFormRef = form => {
    this.form = form;
  };
  // 创建
  saveFormRefCst = formSct => {
    this.formSct = formSct;
  };
  // 按时间排序
  sortByTime = () => {};
  // 打开规划冲刺模态框
  showSprintPlanModel = e => {
    console.log('用户故事');
    this.setState({
      sprintId: e.target.id,
      planVisible: true,
    });
  };
  hideSprintPlanModal = () => {
    this.init(1);
    this.setState({
      planVisible: false,
    });
  };
  // 根据不同状态筛选
  getDiffSprintData = e => {
    this.setState({
      filterStatus: e.target.value,
    });
  };

  filterByStatus = () => {
    const sprints = this.state.sprints;
    let sprintsTemp = [];
    if (this.state.filterStatus == 'all') {
      for (let i = 0; i < sprints.length; i++) {
        sprintsTemp.push(sprints[i]);
      }
    } else if (this.state.filterStatus == 'todo') {
      for (let i = 0; i < sprints.length; i++) {
        if (sprints[i].oldStatus == 'todo') {
          sprintsTemp.push(sprints[i]);
        }
      }
    } else if (this.state.filterStatus == 'doing') {
      for (let j = 0; j < sprints.length; j++) {
        if (sprints[j].oldStatus == 'doing') {
          sprintsTemp.push(sprints[j]);
        }
      }
    } else if (this.state.filterStatus == 'done') {
      for (let a = 0; a < sprints.length; a++) {
        if (sprints[a].oldStatus == 'done') {
          sprintsTemp.push(sprints[a]);
        }
      }
    }
    return sprintsTemp;
  };
  expandedRowRender = data => {
    console.log(data);
    const columns = [
      {
        title: '冲刺',
        width: '15%',
        dataIndex: 'name',
        key: 'name',
        render: (name, resolve) => (
          <div style={{ ...styles.tableitem, ...{ width: '120px' } }}>
            <a
              onClick={this.toDetail.bind(this, resolve.id)}
              style={{ color: '#3F51B5' }}
              title={name}
            >
              {name}
            </a>
          </div>
        ),
      },
      {
        title: '描述',
        width: '25%',
        dataIndex: 'description',
        key: 'description',
        render: description => (
          <div
            title={description}
            style={{
              ...styles.tableitem,
              ...{
                fontSize: '12px',
                maxWidth: '250px',
                Width: '250px',
                minWidth: '250px',
              },
            }}
          >
            {description}
          </div>
        ),
      },
      {
        title: '进度',
        width: '10%',
        dataIndex: 'progress',
        key: 'progress',
        render: progress => (
          <div style={styles.tableitem}>
            {isNaN(parseInt(progress)) ? 0 : parseInt(progress)}%
            {/* <Progress
              percent={parseInt(progress)}
              showInfo={false}
              style={{ height: '15px' }}
            /> */}
          </div>
        ),
      },
      {
        title: '开始日期',
        width: '12%',
        dataIndex: 'startTime',
        key: 'startTime',
        render: startTime => <div style={styles.tableitem}>{startTime}</div>,
      },
      {
        title: '结束日期',
        width: '12%',
        dataIndex: 'endTime',
        key: 'endTime',
        render: endTime => <div style={styles.tableitem}>{endTime}</div>,
      },
      {
        title: '状态',
        width: '10%',
        dataIndex: 'oldStatus2',
        key: 'oldStatus2',
        render: oldStatus2 => <div style={styles.tableitem}>{oldStatus2}</div>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        width: '16%',
        render: (id, recoder) => (
          <div
            style={{
              ...styles.tableitem,
              ...{ display: 'flex', alignItems: 'center' },
            }}
          >
            <i
              title="状态切换"
              className="material-icons"
              style={{
                color: '#3F51B5',
                fontSize: '16px',
                marginRight: '16px',
                cursor: 'pointer',
              }}
              onClick={this.switchStatus.bind(this, id, recoder.oldStatus)}
            >
              {recoder.oldStatus === 'doing' ? 'lock_open' : 'lock_outline'}
            </i>

            <i
              title="编辑"
              className="material-icons"
              style={{
                color: '#3F51B5',
                fontSize: '14px',
                marginRight: '16px',
                cursor: 'pointer',
              }}
              onClick={this.editSprint.bind(this, id)}
            >
              border_color
            </i>
            <i
              id={id}
              title="用户故事"
              className="material-icons"
              style={{
                color: '#3F51B5',
                fontSize: '16px',
                cursor: 'pointer',
              }}
              onClick={this.showSprintPlanModel}
            >
              input
            </i>
          </div>
        ),
      },
    ];
    const children = [
      {
        key: 1,
        name: 'testname',
        description: 'dex',
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={data.children.children}
        pagination={false}
      />
    );
  };
  scroll() {
    console.log('scroll');
  }
  getscroll(instance) {
    if (instance) {
      this.scrollele = instance;
    }
  }

  ChangeContent() {
    if (this.scrollele) {
      this.scrollele.style.height = `${window.innerHeight - 48}px`;
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.ChangeContent.bind(this));
  }
  render() {
    let sprintsTemp = this.filterByStatus();
    console.log(sprintsTemp);
    let switchStatus;
    let sprintArr = [];
    let data = {};
    let lastdata = [];
    sprintsTemp.forEach((one, i) => {
      if (data[one.releasePlanId] == undefined) {
        data[one.releasePlanId] = {
          name: one.releasePlanName,
          children: [],
        };
      }
      data[one.releasePlanId].children.push({
        ...one,
        ...{ key: i },
        ...{ progress: one.endStory / one.storyIssue * 100 },
      });
    });
    let j = 0;
    for (let i in data) {
      lastdata.push({
        key: j,
        name: data[i].name,
        children: { children: data[i].children },
      });
      j++;
    }
    console.log(data, lastdata);
    const columns = [{ title: 'Release名称', dataIndex: 'name', key: 'name' }];
    for (let i = 0; i < sprintsTemp.length; i++) {
      if (sprintsTemp[i].oldStatus == 'done') {
        switchStatus = '开启';
      } else if (sprintsTemp[i].oldStatus == 'doing') {
        switchStatus = '关闭';
      } else {
        switchStatus = '开启';
      }
    }
    return (
      <div
        ref={this.getscroll.bind(this)}        
        className="sprintStyle"
        style={{ height: window.innerHeight - 48 }}
      >
        <Header handleClick={this.showModel} />
        <PageHeader style={{ display: 'flex' }}>

          <div style={{ flex: '1' }} />
          <div
            style={{
              marginTop: '10px',
              transform: ' scale(0.9)',
              disable: 'inline-block',
              fontWeight: 'bold',
            }}
            className="radioStyle"
          >
            <Radio.Group
              value={this.state.filterStatus}
              onChange={this.getDiffSprintData}
            >
              <Radio.Button value="all" style={{ borderRadius: '0px' }}>
                {`全部 (${this.state.allCount})`}
              </Radio.Button>
              <Radio.Button value="doing">
                {`开启 (${this.state.openCount})`}
              </Radio.Button>
              <Radio.Button value="done">
                {`关闭 (${this.state.closeCount})`}
              </Radio.Button>
              <Radio.Button value="todo">
                {`未开启 (${this.state.unOpenCount})`}
              </Radio.Button>
            </Radio.Group>
          </div>
          {/* <Button
            style={{
              float: 'right',
              marginTop: '10px',
              transform: ' scale(0.9)',
              display: 'inline-block',
              borderRadius: '0px',
              fontWeight: 'bold',
            }}
            onClick={this.sortByTime}
          >
            排序<Icon type="arrow-up" />
          </Button> */}
          <Input
            prefix={
              <i
                className="material-icons"
                style={{ marginTop: '9px', color: 'rgba(0, 0, 0, 0.65)' }}
              >
                search
              </i>
            }
            placeholder="根据冲刺名称查询"
            style={{
              width: 200,
              margin: '11px 7px 0 -10px',
              height: '20px',
              transform: ' scale(0.9)',
              disable: 'inline-block',
            }}
            onChange={value => console.log(value)}
            className="searchStyle"
          />
        </PageHeader>
        <div
          className="sprintContentStyle"          
          style={{
            width: '100%',
            overflow: 'auto',
            height: 'calc(100% - 107px)',
            backgroundColor: 'white',
          }}
          onScroll={this.scroll.bind(this)}
        >
          {/* <div className="headerStyle">
            <div style={{ flex: '2' }}>
              <p style={{ marginLeft: '25px' }}>冲刺</p>
            </div>
            <div style={{ flex: '3' }}>
              <p style={{ marginLeft: '5px' }}>描述</p>
            </div>
            <div style={{ flex: '3' }}>
              <p style={{ marginLeft: '15px' }}>进度</p>
            </div>
            <div style={{ flex: '1.3' }}>
              <p>操作</p>
            </div>
          </div> */}
          {/* <div className="srollContant">{sprintArr}</div> */}
          <div className="srollContant">
            {lastdata.length > 0 && (
              <Table
                columns={columns}
                // pagination={false}
                className="components-table-demo-nested"
                defaultExpandAllRows={true}
                // defaultExpandedRowKeys={[0, 1, 2]}
                expandedRowRender={this.expandedRowRender.bind(this)}
                dataSource={lastdata}
              />
            )}
          </div>
        </div>
        <div>
          <CreateSprint
            ref={this.saveFormRefCst}
            // endOpen={this.state.endOpen}
            visible={this.state.visible}
            onCancel={this.handleCancelCst}
            onCreate={this.handleCreateCst}
            releaseData={this.state.releaseData}
          />
        </div>
        <div>
          <UpdateSprint
            ref={this.saveFormRef}
            // endOpen={this.state.endOpen}
            updateVisible={this.state.updateVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            data={this.state.sptDate}
            onDelete={this.deleteSprintById}
            releaseData={this.state.releaseData}
          />
        </div>
        <div>
          <SprintPlanModel
            id={this.state.sprintId}
            visible={this.state.planVisible}
            onCancel={this.hideSprintPlanModal}
          />
        </div>
      </div>
    );
  }
}
export default withRouter(SprintManage);
