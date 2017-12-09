/**
 * autor：chenzl
 * time:2017/11/16
 * Feature:规划功能
 */
/*eslint-disable*/
import {Modal, Button, Select, Transfer, message} from 'antd';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import SprintStore from '../../stores/origanization/sprint/SprintStore';
import KanbanStore from '../../stores/origanization/kanban/KanbanStore';

const Option = Select.Option;
let data;

class ReleasePlanModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      targetKeys: [],
      selectedKeys: [],
      selectItems: [],
      storyGroup: [],
      cruStoryGroup: [],
      cruReleasePlanId: "",
      visible: this.props.visible,
      kanbanInfo: {},
      releasePlan: [],
      ifKanbanCanChangeReleasePlan: true,
      releasePlanName: '',
      Cards: this.props.Cards,
    }
  }

  componentDidMount() {
    this.getData(this.state.Cards)
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.Cards, nextProps.visible)

  }

  getData = (Cards, visible) => {
    let selectItems = [];
    KanbanStore.getKanbanById(this.props.kanbanId).then((kanban) => {
      if (kanban) {
        KanbanStore.getReleasePlanByProjectId(`1`).then((res) => {
          if (res) {
            res.map((item) => {
              selectItems.push({
                id: item.id,
                name: item.name,
              })
            });
            console.log('res', res);
            console.log('selectItemInRelease', selectItems);
            console.log('kanban', kanban);
            let TargetKeys = [];
            let mockData = [];
            let ifKanbanCanChangeReleasePlan = true;
            if (Cards != null) {
              Cards.map((item) => {
                if (item.releasePlanId != null && item.sprintId == null && item.status === 'pre todo') {
                  TargetKeys.push(item.id)
                  mockData.push({
                    key: item.id,
                    title: item.description,
                    releasePlanId: item.releasePlanId,
                  })
                }
              })
            }
            if (kanban.releasePlanId != null && kanban.releasePlanId !== 0) {
              res.map((item) => {
                let releasePlanName = ''
                if (item.id === kanban.releasePlanId) {
                  releasePlanName = item.name
                  item.issues.map((story) => {
                    if (story.status === 'product backlog' && story.kanbanId === this.props.kanbanId) {
                      mockData.push({
                        key: story.id,
                        title: story.description,
                      });
                    }
                  });
                  this.setState({
                    visible: visible,
                    releasePlanName: releasePlanName,
                    targetKeys: TargetKeys,
                    ifKanbanCanChangeReleasePlan: ifKanbanCanChangeReleasePlan,
                    storyGroup: mockData,
                    kanbanInfo: kanban,
                    selectItems: selectItems,
                    releasePlan: res,
                  })
                }
              })
            } else {
              this.setState({
                visible: visible,
                targetKeys: TargetKeys,
                ifKanbanCanChangeReleasePlan: ifKanbanCanChangeReleasePlan,
                storyGroup: mockData,
                kanbanInfo: kanban,
                selectItems: selectItems,
                releasePlan: res,
              })
            }
          }
        });
      }
    })
  };
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    let moveData = [];
    let cruStoryGroup = JSON.parse(JSON.stringify(this.state.cruStoryGroup));
    console.log('nextTargetKeys', nextTargetKeys);
    if (direction == "right") {
      // nextTargetKeys = [...this.state.targetKeys, ...nextTargetKeys];
      for (let i = 0; i < moveKeys.length; i++) {
        moveData.push({
          id: moveKeys[i],
          kanbanId: Number(this.props.kanbanId),
        })
      }
      if (this.state.kanbanInfo.releasePlanId == null) {
        let releasePlanId = this.state.storyGroup[0].releasePlanId;
        let kanban = JSON.parse(JSON.stringify(this.state.kanbanInfo));
        kanban.releasePlanId = releasePlanId;
        console.log(kanban)
        KanbanStore.updateKanban(kanban.id, kanban).then((kanban) => {
          if (kanban) {
            KanbanStore.MountUpdateIssue(moveData).then((res) => {
                if (res) {
                  console.log('进入')
                  KanbanStore.getCardById(this.props.kanbanId).then((item) => {
                    if (item) {
                      message.success('修改成功', 1.5);
                      this.props.getIssue(item);
                      this.setState({
                        kanbanInfo: kanban,
                        targetKeys: nextTargetKeys,
                      });
                    }
                  })

                }
              }
            )
          }
        })
      } else {
        KanbanStore.MountUpdateIssue(moveData).then((res) => {
            if (res) {
              console.log('进入')
              KanbanStore.getCardById(this.props.kanbanId).then((item) => {
                if (item) {
                  message.success('修改成功', 0.1);
                  this.props.getIssue(item);
                  this.setState({
                    targetKeys: nextTargetKeys,
                  });
                }
              })

            }
          }
        )
      }
    } else if (direction == "left") {
      for (let i = 0; i < moveKeys.length; i++) {
        moveData.push({
          id: moveKeys[i],
          kanbanId: 0,
        })
      }
      KanbanStore.MountUpdateIssue(moveData).then((res) => {
          if (res) {
            console.log('进入');
            KanbanStore.getCardById(this.props.kanbanId).then((item) => {
              if (item) {
                message.success('修改成功', 1.5);
                this.props.getIssue(item);
                this.setState({
                  targetKeys: nextTargetKeys,
                });
              }
            })

          }
        }
      )
    }
  };

  componentDidUpdate() {
    let dom = document.getElementsByClassName("ant-transfer-list");
    // let antTransfer = document.getElementsByClassName('ant-transfer')[0];
    // console.log('antINRelease',antTransfer)
    // if(antTransfer != null){
    //     antTransfer.setAttribute('style','width:500px;');
    // }
    if (dom.length > 0) {
      for (let i = 0; i < dom.length; i++) {
        let span = dom[i].children[0].children[1].children[0];
        console.log(span.childNodes)
        console.log('domWidth', dom[i].style.width);
        dom[i].style.width = dom[i].style.width - 1;
        span.childNodes[1].data = span.childNodes[1].data = '0' ? '' : span.childNodes[1].data[0] === '(' ? span.childNodes[1].data : `(${span.childNodes[1].data})`;
        span.setAttribute('style', 'margin-left:21px;')
      }
    }
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };
  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };
  setSource = (value) => {
    let mockData = [];
    console.log('value', value);
    const {releasePlan} = this.state;
    let releasePlanName = '';
    if (releasePlan) {
      releasePlan.map((item) => {
          if (item.id === value) {
            releasePlanName = item.name;
            item.issues.map((story) => {
              if (story.status === 'product backlog') {
                mockData.push({
                  key: story.id,
                  title: story.description,
                });
              }
            });
            let tempMockData = []
            this.state.storyGroup.map((item) => {
              this.state.targetKeys.map((target) => {
                if (item.key === target) {
                  tempMockData.push(item);
                }
              })
            });
            mockData = [...mockData, ...tempMockData];
            this.setState({
              releasePlanName: releasePlanName,
              storyGroup: mockData,
            })
          }
        }
      )
    }
  };
  renderItem = (item) => {
    let color = '';
    let poriority = '';
    if (item.issuePriority === '1') {
      poriority = '低';
      color = 'rgb(80, 149, 254)';
    } else if (item.issuePriority === '2') {
      poriority = '中';
      color = 'rgb(249, 210, 82)';
    } else if (item.issuePriority === '3') {
      poriority = '高';
      color = 'rgb(254, 80, 80)';
    }
    const customLabel = (
      <div className="custom-item" style={{
        width: 180,
        overflow: 'hidden',
        display: 'inline-block',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        position: 'relative',
        top: 10,
      }}>
        <div
          style={{
            display:'inline-block',
            width: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{item.title}</div>
        <div
          className="issuePoriority"
          style={{
            display: 'inline-block',
            background: color,
            width: 10,
            height: 10,
            marginRight: 8,
            position: 'relative',
            top: '4',
            borderRadius: '50%',
            float: 'right',
            right: 13,
          }}>
          <span style={{
            position: 'relative',
            left: 10,
            top: -4,
          }}>{poriority}</span>
        </div>
      </div>
    );
    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  }

  render() {
    const {onCancel} = this.props;
    const {visible} = this.state;
    return (
      <div>
        <Modal
          title="规划看板"
          visible={visible}
          onCancel={() => this.props.ChangeReleasePlanState(false)}
          closable={true}
          className="sprintPlanStyle"
          footer={null}
          bodyStyle={{width: '540px'}}
        >
          <div style={{marginTop: -20, paddingBottom: "20px"}}>选择发布计划：
            <div style={{display: "inline-block"}}><Select
              // mode="multiple"
              style={{minWidth: "120px"}}
              placeholder="Please select"
              onSelect={this.setSource}
              defaultValue={this.state.kanbanInfo.releasePlanId == null ? `未选择发布计划` : this.state.kanbanInfo.releasePlanId}
            >
              {this.state.selectItems.length > 0 ?
                this.state.selectItems.map((item, index) => {
                  return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                })
                : <Option key={0} value={0}>未发现发布计划</Option>
              }
            </Select></div>
          </div>
          <div style={{
            width: 200,
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>发布计划:{this.state.releasePlanName === '' ? '未选择发布计划' : this.state.releasePlanName}</div>
          <div style={{
            width: 200,
            display: 'inline-block',
            marginLeft: 64,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>看板:{this.state.kanbanInfo.name}</div>
          <Transfer
            dataSource={this.state.storyGroup}
            titles={[[<span style={{left: -137, position: 'absolute'}}>描述</span>, '优先级'],
              [<span style={{left: -137, position: 'absolute'}}>描述</span>, '优先级']]}
            showSearch
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            selectedKeys={this.state.selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            onScroll={this.handleScroll}
            render={this.renderItem}
          />
        </Modal>
      </div>
    );
  }
}

export default ReleasePlanModel;
