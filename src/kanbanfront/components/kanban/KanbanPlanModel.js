/*eslint-disable*/
import {Modal, Button, Select, Transfer, message} from 'antd';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import SprintStore from '../../stores/origanization/sprint/SprintStore';
import KanbanStore from '../../stores/origanization/kanban/KanbanStore';

const Option = Select.Option;
let data;
require('../../assets/css/kanban.css')
class KanbanPlanModel extends Component {
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
      ifKanbanCanChangeSprint: true,
      sprintName:'',
    }
  }
  componentDidMount() {
    this.getData()
  }
  componentDidUpdate(){
    let dom = document.getElementsByClassName("ant-transfer-list");
    if(dom.length>0){
      for(let i=0;i<dom.length;i++){
        let span = dom[i].children[0].children[1].children[0];

        span.childNodes[1].data = span.childNodes[1].data='0'? '' : span.childNodes[1].data[0] === '(' ? span.childNodes[1].data : `(${span.childNodes[1].data})`;
        span.setAttribute('style','margin-left:21px;')
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    })
  }

  getData = () => {
    let selectItems = [];
    let TargetKeys = [];
    KanbanStore.getKanbanById(this.props.kanbanId).then((kanban) => {
      if (kanban) {
        KanbanStore.getSprintByProjectId(`1`).then((res) => {
          if (res) {
            res.map((item) => {
              if(item.status==='doing'){
                selectItems.push({
                  id: item.id,
                  name: item.name,
                  sprintId:item.sprintId,
                  issuePriority:item.issuePriority,
                })
              }
            });

            let mockData = []
            let ifKanbanCanChangeSprint = true
            if (kanban.sprintId != null) {
              if (this.props.Cards != null) {
                this.props.Cards.map((item) => {
                  if (item.sprintId === kanban.sprintId && item.releasePlanId != null &&item.status === 'pre todo') {
                    TargetKeys.push({
                      key: item.id,
                      title: item.description,
                      sprintId: item.sprintId,
                      issuePriority:item.issuePriority,
                    })
                  }
                })
              }
              KanbanStore.getIssueWithoutKanbanIDbySprintId(kanban.sprintId).then((data) => {
                if (data) {
                  data.map((item, index) => {
                    if (item.status === 'sprint backlog' && item.issueType === 'story') {
                      mockData.push({
                        key: item.id,
                        title: item.description,
                        sprintId: item.sprintId,
                        issuePriority:item.issuePriority,
                      });
                    } else {
                      ifKanbanCanChangeSprint = false;
                    }
                  });
                  let sprintName = ''
                  selectItems.map((item)=>{
                    if(item.id === kanban.sprintId){
                      sprintName = item.name;
                    }
                  })
                  this.setState({
                    target:TargetKeys,
                    ifKanbanCanChangeSprint: ifKanbanCanChangeSprint,
                    storyGroup: mockData,
                    kanbanInfo: kanban,
                    selectItems: selectItems,
                    sprintName:sprintName,
                  })
                }
              })
            } else {
              this.setState({
                kanbanInfo: kanban,
                selectItems: selectItems,
              })
            }

          }
        });
      }
    })
  };
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    let moveData = [];
    let cruStoryGroup = JSON.parse(JSON.stringify(this.state.cruStoryGroup))
    if (direction == "right") {
      for (let i = 0; i < moveKeys.length; i++) {
        moveData.push({
          id: moveKeys[i],
          kanbanId: Number(this.props.kanbanId),
        })
      }
      if (this.state.kanbanInfo.sprintId == null) {
        let sprintId = this.state.storyGroup[0].sprintId;
        let kanban = JSON.parse(JSON.stringify(this.state.kanbanInfo))
        kanban.sprintId = sprintId
        KanbanStore.updateKanban(kanban.id, kanban).then((kanban) => {
          if (kanban) {
            KanbanStore.MountUpdateIssue(moveData).then((res) => {
                if (res) {
                  KanbanStore.getCardById(this.props.kanbanId).then((item) => {
                    if (item) {
                      message.success('修改成功', 0.1);
                      this.props.getIssue(item);
                      this.setState({
                        kanbanInfo:kanban,
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
    }
    else if (direction == "left") {
      for (let i = 0; i < moveKeys.length; i++) {
        moveData.push({
          id: moveKeys[i],
          kanbanId: 0,
        })
      }
      let sprintId = this.state.storyGroup[0].sprintId;
      let ifKanbanNeedChangeSprint = true
      KanbanStore.getSprintBySprintId(sprintId).then((sprint) => {
        if (sprint) {
          moveKeys.map((moveKey) => {
            sprint.issue.map((item) => {
              if (item.kanbanId === Number(this.props.kanbanId) && item.id !== moveKey && item.status !== 'sprint backlog') {
                ifKanbanNeedChangeSprint = false
              }
            })
          })
          if (ifKanbanNeedChangeSprint) {
            //更新看板SprintId为null
            let kanban = JSON.parse(JSON.stringify(this.state.kanbanInfo))
            kanban.sprintId = 0;
            KanbanStore.updateKanban(kanban.id, kanban).then((kanban) => {
              if (kanban) {
                KanbanStore.MountUpdateIssue(moveData).then((res) => {
                    if (res) {
                      KanbanStore.getCardById(this.props.kanbanId).then((item) => {
                        if (item) {
                          message.success('修改成功', 0.1);
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
        }
      })
    }
  };
  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  }

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  }
  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  }
  setSource = (value) => {
    let mockData = [];
    KanbanStore.getIssueWithoutKanbanIDbySprintId(value).then((data) => {
      console.log(data)
      if (data) {
        data.map((item, index) => {
          if (item.status === 'sprint backlog') {
            mockData.push({
              key: item.id,
              title: item.description,
              issuePriority:item.issuePriority,
              sprintId: item.sprintId,
            });
          }
        })
        let sprintName = '';
        if(this.state.selectItems != null){
          this.state.selectItems.map((item)=>{
              if(item.id === value){
                name = item.name
              }
          })
        }
        this.setState({
          storyGroup: mockData,
          sprintName:name,
        })
      }
    })
  }
  renderItem=(item)=>{
    const customLabel = (
      <span className="custom-item">
        {item.title}
        <span style={{position:'absolute',right:0,width:'26%',textAlign:'center'}}>{item.issuePriority}</span>
      </span>
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
      <div >
        <Modal
          title="规划看板"
          visible={visible}
          onCancel={() => this.props.ChangePlanState(false)}
          closable={true}
          className="sprintPlanStyle"
          footer={null}
          style = {{width:538}}
        >
          <div style={{ marginTop: -20, paddingBottom: "20px"}}>选择冲刺：
            <div style={{display: "inline-block"}}><Select
              // mode="multiple"
              style={{minWidth: "120px"}}
              placeholder="Please select"
              onSelect={this.setSource}
              defaultValue={this.state.kanbanInfo.sprintId}
            >
              {this.state.selectItems.length > 0 ?
                this.state.selectItems.map((item, index) => {
                  return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                })
                : <Option key={0} value={0}>未发现冲刺</Option>
              }
            </Select></div>
          </div>
          <div style={{width:200,display:'inline-block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>冲刺名称:{this.state.sprintName ===''?'未选择冲刺':this.state.sprintName}</div>
          <div style={{width:200,display:'inline-block',marginLeft:64,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>看板名称:{this.state.kanbanInfo.name}</div>
          <Transfer
            dataSource={this.state.storyGroup}
            titles={[[<span style={{left:-137,position:'absolute'}}>描述</span>,'优先级'],
              [<span style={{left:-137,position:'absolute'}}>描述</span>,'优先级']]}
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

export default KanbanPlanModel;
