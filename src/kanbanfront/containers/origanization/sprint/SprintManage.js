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
      // endOpen:false
    };
  }

  componentDidMount() {
    this.init(1);
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
    this.planSprint();
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

  render() {
    let sprintsTemp = this.filterByStatus();
    let switchStatus;
    let sprintArr = [];
    for (let i = 0; i < sprintsTemp.length; i++) {
      if (sprintsTemp[i].oldStatus == 'done') {
        switchStatus = '开启';
      } else if (sprintsTemp[i].oldStatus == 'doing') {
        switchStatus = '关闭';
      } else {
        switchStatus = '开启';
      }
      sprintArr.push(
        <div className="sprintContent">
          <div
            style={{
              flex: '2',
              marginTop: '10px',
              marginLeft: '10px',
              marginBottom: '10px',
              lineHeight: '20px',
            }}
          >
            <p style={{ color: '#0070c0', marginLeft: '7px' }}>
              <span
                style={{
                  marginRight: '10px',
                  fontSize: '13px',
                  color: '#0070c0',
                }}
              >
                <a
                  onClick={this.toDetail.bind(this, sprintsTemp[i].id)}
                  style={{ color: '#0070c0' }}
                >
                  {sprintsTemp[i].name}
                </a>
              </span>
              <span>
                {sprintsTemp[i].oldStatus == 'doing' ? (
                  <FontAwesome
                    name="unlock"
                    style={{ color: '#e44444', fontSize: '13px' }}
                  />
                ) : (
                  <FontAwesome
                    name="lock"
                    style={{ color: '#e44444', fontSize: '13px' }}
                  />
                )}
              </span>
            </p>
            <p className="timeStyle">
              <span class="small-font" style={{ color: '#999999' }}>{`从${
                sprintsTemp[i].startTime
              }到${sprintsTemp[i].endTime}`}</span>
            </p>
            <p style={{ marginTop: '8px', marginLeft: '3px' }}>
              <span
                className="releaseStyle"
                style={{ marginRight: '10px', color: '#999999' }}
              >{`发布计划:${sprintsTemp[i].releasePlaneId}`}</span>
            </p>
          </div>
          <div
            style={{
              flex: '3',
              marginTop: '10px',
              marginBottom: '10px',
              lineHeight: '20px',
            }}
          >
            <p style={{ color: '#5a5555' }} className="desStyle">
              {sprintsTemp[i].description}
            </p>
          </div>
          <div
            style={{
              flex: '3',
              border: '1px solid #e0e0e0',
              margin: '10px 30px 30px 10px',
              borderBottom: 'none',
              borderTop: 'none',
              textAlign: 'center',
              lineHeight: '20px',
            }}
          >
            <p className="finshStyle">
              已完成<span className="numStyle">{sprintsTemp[i].endStory}</span>
              <span style={{ marginRight: '5px' }}>条</span>/<span
                style={{ marginLeft: '5px' }}
              >
                共
              </span>
              <span className="numStyle">{sprintsTemp[i].storyIssue}</span>条
            </p>
            <Progress
              percent={
                sprintsTemp[i].endStory / sprintsTemp[i].storyIssue * 100
                  ? parseInt(
                      sprintsTemp[i].endStory / sprintsTemp[i].storyIssue * 100,
                    )
                  : 0
              }
              showInfo={false}
              style={{ height: '15px' }}
            />
          </div>
          <div style={{ flex: '1.6', marginTop: '23px' }}>
            <Button
              id={sprintsTemp[i].id}
              style={{
                background: '#3b78e7',
                color: '#fff',
                width: '60px',
                height: '20px',
                padding: '0px',
                borderColor: '#0070c0',
                borderRadius: '3px',
              }}
              onClick={this.showSprintPlanModel}
            >
              用户故事
            </Button>
            <a
              style={{ border: 'none', marginLeft: '10px', color: '#0070c0' }}
              onClick={this.editSprint.bind(this, sprintsTemp[i].id)}
            >
              编辑
            </a>
            <a
              style={{ border: 'none', marginLeft: '10px', color: '#0070c0' }}
              onClick={this.switchStatus.bind(
                this,
                sprintsTemp[i].id,
                sprintsTemp[i].oldStatus,
              )}
            >
              {switchStatus}
            </a>
          </div>
        </div>,
      );
    }
    return (
      <div className="sprintStyle">
        <Header handleClick={this.showModel}/>
        <PageHeader style={{ display: 'flex' }}>
          {/* <Button
            style={{
              background: '#0070c0',
              marginTop: '10px',
              color: '#fff',
              borderColor: '#0070c0',
              padding: '0px',
              width: '55px',
              borderRadius: '0px',
            }}
            onClick={this.showModel}
          >
            创建
          </Button> */}
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
                全部({this.state.allCount})
              </Radio.Button>
              <Radio.Button value="doing">
                开启({this.state.openCount})
              </Radio.Button>
              <Radio.Button value="done">
                关闭({this.state.closeCount})
              </Radio.Button>
              <Radio.Button value="todo">
                未开启({this.state.unOpenCount})
              </Radio.Button>
            </Radio.Group>
          </div>
          <Button
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
          </Button>
          <Search
            placeholder="根据冲刺名称查询"
            style={{
              width: 200,
              marginTop: '10px',
              height: '20px',
              transform: ' scale(0.9)',
              disable: 'inline-block',
            }}
            onSearch={value => console.log(value)}
            className="searchStyle"
          />
        </PageHeader>
        <div className="sprintContentStyle">
          <div className="headerStyle">
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
          </div>
          <div className="srollContant">{sprintArr}</div>
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
