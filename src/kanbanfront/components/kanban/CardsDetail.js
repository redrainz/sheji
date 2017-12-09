/**
 * Created by chenzl on 2017/9/7.
 * Issue详情
 */
/*eslint-disable*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import {
  Table,
  Button,
  Tooltip,
  Icon,
  message,
  Row,
  Col,
  Form,
  Select,
  Input,
  Spin,
  Upload,
  DatePicker,
  Collapse,
  InputNumber
} from 'antd';

const FormItem = Form.Item;
import moment from 'moment';

const Option = Select.Option;
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore'
import KanbanStore from '../../stores/origanization/kanban/KanbanStore'

const {TextArea} = Input;
const {MonthPicker, RangePicker} = DatePicker;
const Panel = Collapse.Panel;
const dateFormat = 'YYYY/MM/DD';
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
  // 描述样式
  desStyle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    wordBreak: 'break-all',
    display: 'block',
    textOverflow: 'ellipsis',
    width: '100px'
  },
  detailStyle: {
    border: '4px solid #f7f7f7',
    borderBottom: 'none',
    borderLeft: 'none',
    height: '93vh',
    boxShadow: '-2px 0px 5px #dedede',
    overflow: 'auto'
  }
}


class CardsDetail extends Component {
  constructor(props) {
    super(props);
    this.inputValue = ''
  }

  state = {
    Issue: {},
    mark: true,
  }

  localIssueData() {

    IssueManageStore.localIssueModel();
  }

  // 路由跳转设置
  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  // 新建Issue
  createIssue = (id) => {
    this.linkToChange(`${this.props.match.url}/create`);
  }
  // 新建子卡
  createSubCard = () => {
    this.props.history.push(`${this.props.match.url}/create`)
  }
  // 点击刷新页面
  loadIssues = () => {
    this.localIssueData();
  }

  // 删除
  handleDelete = (e) => {
    const {id} = this.state;
    IssueManageStore.deleteIssueById(id).then(data => {
      message.success("删除成功", 0.5);
      this.handleClose();
      this.localIssueData();
    })
  };
  // 根据Id查找Issue详情
  getIssueById = (id) => {
    this.setState({
      displayDetail: 'block',
      colValue: 12,
      colDetail: 12,
    });
    IssueManageStore.getIssueById(id).then(data => {
      if (data) {
        this.setState({
          Issue: data,
          issueId: data.issueId,
          Id: id,
        });
        if (data.issueType === 'Bug') {
          this.setState({
            displayBug: 'block',
            displayTask: 'none',
            displayStory: 'none'
          })
        } else if (data.issueType === 'Task') {
          this.setState({
            displayBug: 'none',
            displayTask: 'block',
            displayStory: 'none'
          })
        } else {
          this.setState({
            displayBug: 'none',
            displayTask: 'none',
            displayStory: 'block'
          })
        }
      }
    }).catch((err) => {
      // message.error(this.localIssueData());
      window.console.log(err)
    });
  }

  // 打开Model
  handleOpen(id) {
    this.setState({open: true, id: id});
  }

  handleClose = () => {
    this.setState({open: false});
  };

  // 根据Issue标号筛选
  filtersByIssueId(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
  }

  // 编辑按钮,更新Issue类型
  // editChange =()=> {
  //   this.linkToChange(`issueManage/updata/${this.state.Id}`);
  // }

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
  onChangeStatus = () => {
    console.log('onchange')
    this.savaUpdata();
  }
// 单一修改数据
  savaUpdata = () => {
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        console.log(data)
        IssueManageStore.updateIssueById(
          {...data, objectVersionNumber: this.state.Issue.objectVersionNumber}, this.state.Issue.id)
          .then((data) => {
            if (data) {
              console.log(this.props.match.params.kanbanId);
              KanbanStore.getCardById(this.props.match.params.kanbanId)
                .then((res) => {
                  this.props.getIssue(res);
                  message.success('修改成功', 1);
                  this.setState({
                    Issue: data,
                    mark: true,
                  })
                })
            }
          }).catch(error => {
          message.error("修改失败!", 0.1);
        });
      }
    });
  };
  // 隐藏详情页面
  displayDetail = () => {
    this.setState({
      displayDetail: 'none',
      colValue: 24,
      colDetail: 0,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== 0) {
      IssueManageStore.getIssueById(nextProps.id)
        .then((res) => {

          this.setState({
            Issue: res
          })
        })
    }
  }

  getCreater = (creater) => {
    if (creater === '1') {
      return '陈造龙'
    } else if (creater === '2') {
      return '钱秋梅'
    } else if (creater === '3') {
      return '张宇'
    } else if (creater === '4') {
      return '陈真'
    } else if (creater === '5') {
      return '柯希权'
    } else if (creater === '6') {
      return '张宝洁'
    }
  }
  handleClick = () => {
    this.setState({
      mark: false
    })
  }
  handleBlur = () => {
    if (!this.state.mark) {
      let data = {
        description: this.inputValue,
        issueId: this.state.Issue.id
      }
      IssueManageStore.updateIssueById(
        {...data, objectVersionNumber: this.state.Issue.objectVersionNumber}, this.state.Issue.id)
        .then((data) => {
          if (data) {
            KanbanStore.getCardById(this.props.match.params.kanbanId)
              .then((res) => {
                console.log('res')
                this.props.getIssue(res)
                message.success('修改成功', 0.1);
                this.setState({
                  Issue: data,
                  mark: true,
                })
              })

          }
        }).catch(error => {
        message.error("修改失败!", 0.1);
      });
    }
  }
  handleChange = (e) => {
    this.inputValue = e.target.value
  }
  prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 10},
      wrapperCol: {span: 14},
    };
    const {getFieldDecorator} = this.props.form;
    const {Issue} = this.state;
    const issueTypeArr = this.props.issueTypeArr;

    return (
      <div style={{backgroundColor: 'white'}} onClick={this.prevent}>
        <div style={typeStyle.detailStyle}>
          <div style={{
            background: '#F7F7F7',
            height: 40,
            lineHeight: 3,
            position: 'absolute',
            zIndex: '103',
            width: '100%'
          }}>
            <span style={{marginRight: 30, marginLeft: 10, lineHeight: '35px'}}>#{Issue.issueId}</span>
            <span>{Issue.issueType}</span>
            <a style={{float: 'right', lineHeight: '35px', marginLeft: '30px', marginRight: '30px'}}
               onClick={this.createSubCard}>{'新建子卡'}</a>
            <hr/>
            {/*<a style={{float: 'left', 'display': 'block',lineHeight: '35px',marginRight:'10px',marginLeft:'10px'}}*/}
            {/*onClick={this.displayDetail}>*/}
            {/*<Icon type="double-right" />*/}
            {/*</a>*/}
          </div>
          <div style={{marginTop: '40px'}}>
            <span>描述:</span>
            <h3 style={{marginBottom: '20px', marginLeft: 10, height: 20, width: '100%'}} onClick={this.handleClick}>
              <span style={{display: this.state.mark ? 'block' : 'none'}}>{Issue ? Issue.description : ''}</span>
              <Input id='input1' style={{display: this.state.mark ? 'none' : 'block', width: 580}}
                     onPressEnter={this.handleBlur} onBlur={this.handleBlur} onChange={this.handleChange}
                     defaultValue={Issue.description}/>
            </h3>
            <p style={{fontSize: '12px'}}><span
              style={{marginRight: '30px', marginLeft: 10}}>{this.getCreater(Issue.acception)}</span>
              <span>创建于:{Issue.creationDate}</span>
            </p>
          </div>
          <Collapse bordered={false} defaultActiveKey={['1']} style={{marginTop: 0}}>
            <Panel header="基本信息" key="1">
              <Form layout="horizontal">
                <Row gutter={8}>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label='状态'>
                      {getFieldDecorator('status', {initialValue: Issue.status == null ? 'todo' : Issue.status})
                      (<Select onBlur={this.onChangeStatus} style={{width: '100px'}} disabled>
                        <Option value="todo">规划中</Option>
                        <Option value="doing">开发中</Option>
                        <Option value="done">已完成</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label='指派人'>
                      {getFieldDecorator('acception', {initialValue: Issue.acception})
                      (<Select style={{width: '100px'}} onBlur={this.onChangeStatus}>
                        <Option value="1">陈造龙</Option>
                        <Option value="2">钱秋梅</Option>
                        <Option value="3">张宇</Option>
                        <Option value="4">陈真</Option>
                        <Option value="5">柯希权</Option>
                        <Option value="6">PO</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="故事点">
                      {getFieldDecorator('storyPoint', {initialValue: Issue != null ? Issue.storyPoint : '',})
                      (<InputNumber style={{width: '100px !important'}} onBlur={this.onChangeStatus}
                                    className="inputNum"/>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="优先级">
                      {getFieldDecorator('issuePriority', {initialValue: Issue != null ? Issue.issuePriority : ''})
                      (<Select style={{width: 100}} onBlur={this.onChangeStatus}>
                        <Option value="1">低</Option>
                        <Option value="2">中</Option>
                        <Option value="3">高</Option>
                        <Option value="4">非常高</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="开始时间">
                      {getFieldDecorator('startTime',)
                      (<DatePicker style={{width: 100}}
                                   onBlur={this.onChangeStatus}/>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="截止时间">
                      {getFieldDecorator('endTime')
                      (<DatePicker
                        showTime
                        format={dateFormat}
                        def
                        style={{width: 100}} onBlur={this.onChangeStatus}/>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="迭代">
                      {getFieldDecorator('sprintId', {initialValue: Issue.sprintId})
                      (<Select style={{width: 100}} onBlur={this.onChangeStatus}>
                        <Option value="1">第一次迭代</Option>
                        <Option value="2">第二次迭代</Option>
                        <Option value="3">第三次迭代</Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                  {/*<Col span={8}>*/}
                  {/*<FormItem {...formItemLayout} label="标签">*/}
                  {/*{getFieldDecorator('label', {initialValue:Issue.label})*/}
                  {/*(<Select style={{width: 100}} onChange={this.props.onChangeStatus}>*/}
                  {/*12312*/}
                  {/*</Select>)}*/}
                  {/*</FormItem>*/}
                  {/*</Col>*/}
                </Row>
              </Form>
            </Panel>
            <Panel header="内容" key="2">
              <Row>
                <Col>
                  <h4 style={{marginBottom: '10px'}}>故事内容</h4>
                  <p>{Issue.content}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 style={{marginBottom: '10px'}}>验收标准</h4>
                  <p style={{marginBottom: '10px'}}>{Issue.acception}</p>
                </Col>
              </Row>
            </Panel>
            <Panel header="动态" key="3">
              <p>操作记录(1)|评论(0)</p>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default Form.create({})(withRouter(CardsDetail));
