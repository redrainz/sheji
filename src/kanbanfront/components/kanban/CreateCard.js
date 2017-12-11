/**
 * Created by chenzl on 2017/10/12.
 * feature:编辑/查看story详情
 */
/*eslint-disable*/
import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import SprintStore from '../../stores/origanization/sprint/SprintStore';
import kanbanStore from '../../stores/origanization/kanban/KanbanStore'
import {Select, Button, InputNumber, Input, Form, message} from 'antd';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';

const Option = Select.Option;
const FormItem = Form.Item;
const {TextArea} = Input;
//定义状态卡片颜色
const types = {
  'product backlog': '#108EE9',
  'sprint backlog': '#0C60AA',
  'pre todo': '#523EB3',
  todo: '#FF8040',
  doing: '#F2B43E',
  done: '#00A854',
};
const styles = {
  items: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  item: {
    width: '65px',
  },
  itemContent: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  select: {
    width: '88%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
};
const size = 'small';

@observer
class CreateCard extends Component {
  constructor() {
    super();
    this.state = {
      storyDetailDatas: {},
      formType: 'story',
      kanbanName: '',
      status: 'pre todo',
      parentCard: [],
      parentCardSelection: [],
      releasePlanName: '-',
      sprintName: '-',
      releasePlanId: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.kanbanName) {
      this.setState({
        kanbanName: nextProps.kanbanName
      })
    }
  }

  componentDidMount() {
    let parentCard = []
    let parentCardSelection = []
    kanbanStore.getIssueByProjectId('1').then((res) => {
      if (res) {
        res.map((item) => {
          if (item.kanbanId === Number(this.props.match.params.kanbanId)) {
            if (item.issueType === 'task' || item.issueType === 'story') {
              parentCard.push(item)
              parentCardSelection.push(<Option key={item.id}>{item.id}-{item.description}</Option>)
            }
          }
        });
        this.setState({
          parentCard: parentCard,
          parentCardSelection: parentCardSelection,
        })
      }
    })
  }

  prevent = e => {
    e.stopPropagation();
    e.preventDefault();
  };
  createTask = e => {
    e.preventDefault();
    // 校验表单
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        console.log(data);
        data.kanbanId = Number(this.props.match.params.kanbanId);
        data.sprintId = this.state.sprintId;
        data.projectId = '1';
        data.status = this.state.status;
        data.parentId = this.state.parentId;
        data.releasePlanId = this.state.releasePlanId;
        data.issueType = this.state.formType;
        if (data.issueType === 'story') {
          data.workload = undefined;
        } else if (data.issueType === 'task') {
          data.storyPoint = undefined;
        }
        console.log(data);
        IssueManageStore.createIssue(data).then(data => {
          if (data) {
            kanbanStore.getCardById(this.props.match.params.kanbanId)
              .then((res) => {
                this.props.getIssue(res);
                message.success('添加成功', 1.5);
                this.props.form.resetFields();// 清空
                this.setState({
                  status: 'pre todo',
                  releasePlanName: '-',
                  sprintName: '-',
                });
              })
          }
        });
      }
    });
  };
  cancel = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.resetFields(); // 清空
    this.setState({status: '-'});
  };
  selectParent = (key, option) => {
    let sprintName;
    let status;
    let releasePlanName;
    this.state.parentCard.map((item, index) => {
      if (item.id == key) {
        console.log(item.status);
        if (!item.sprintName) {
          sprintName = '-';
        } else {
          sprintName = item.sprintName;
        }
        if (!item.releasePlanName) {
          releasePlanName = '-';
        } else {
          releasePlanName = item.releasePlanName;
        }
        if (item.kanbanId === Number(this.props.match.params.kanbanId)) {
          status = item.status;
        }
        this.setState({
          status: status,
          sprintName: sprintName,
          sprintId: item.sprintId,
          releasePlanId: item.releasePlanId,
          releasePlanName: releasePlanName,
          parentId: key,
        });
      }
    });
  };
  handleForm = (value) => {
    this.props.form.resetFields();
    if (value === 'story') {
      this.setState({
        formType: 'story'
      })
    } else if (value === 'task') {
      this.setState({
        formType: 'task'
      })
    } else if (value === 'bug') {
      this.setState({
        formType: 'bug'
      })
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 500,
          width: '440px',
          background: 'white',
          borderLeft: '1px solid #ddd',
          height: 'calc(100% - 48px)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={this.prevent}
        id="editstory"
      >
        {/* 侧边栏的header */}
        <div
          style={{
            padding: '10px 10px',
            height: '57px',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #ddd',
          }}
        >
          <span style={{margin: '0 0 0 10px'}}>创建{this.state.formType}</span>
          <span
            style={{
              color: '#3f51b5',
              fontSize: '13px',
              marginLeft: '114px',
              cursor: 'pointer',
            }}
            onClick={this.props.ChangeCreateCardState}
          >
            隐藏信息面板
          </span>
        </div>
        <div
          style={{
            padding: '0 24px 10px 24px',
            flex: 1,
            overflow: 'hidden',
            overflowY: 'auto',
          }}
        >
          <div style={{marginTop: '15px'}}>类型：</div>
          <Select size={size} disabled={false}
                  style={{
                    width: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                  value={this.state.formType}
                  onSelect={this.handleForm}>
            <Option value="story">story</Option>
            <Option value="task">task</Option>
            {/*<Option value="bug">bug</Option>*/}
          </Select>
          <Form>
            <div style={{marginTop: '10px'}}>描述：</div>
            <FormItem>
              {getFieldDecorator('description', {
                rules: [{required: true, message: '请输入描述!'}],
              })(
                <TextArea
                  style={{
                    width: '88%',
                    resize: 'none',
                    borderRadius: 0,
                  }}
                  // ref={instance => {
                  //   this.getTextArea(instance, 'description');
                  // }}
                  placeholder="请输入描述"
                  autosize={{minRows: 3, maxRows: 10}}
                  onPressEnter={value => {
                    this.ChangeIssue(value, 'description');
                  }}
                />,
              )}
            </FormItem>
            <div style={{marginTop: '10px'}}>内容：</div>
            <FormItem>
              {getFieldDecorator('content')(
                <TextArea
                  style={{
                    width: '88%',
                    resize: 'none',
                    borderRadius: 0,
                  }}
                  placeholder="请输入描述"
                  autosize={{minRows: 3, maxRows: 10}}
                />,
              )}
            </FormItem>
            <div style={styles.items}>
              <div style={styles.item}>状态：</div>
              <div title={this.state.status} style={styles.itemContent}>
                {this.state.status != '-' ? (
                  <span
                    style={{
                      padding: '2px 5px',
                      color: 'white',
                      borderRadius: '8px',
                      background: types[this.state.status],
                    }}
                  >
                    {this.state.status}
                  </span>
                ) : (
                  <div style={{display: 'inline-block'}}>
                    {this.state.status}
                  </div>
                )}
              </div>
            </div>
            <div style={styles.items}>
              <div style={styles.item}>发布计划：</div>
              <div title={this.state.releasePlanName} style={styles.itemContent}>
                {this.state.releasePlanName ? this.state.releasePlanName : '-'}
              </div>
            </div>
            <div style={styles.items}>
              <div style={styles.item}>冲刺：</div>
              <div title={this.state.sprintName} style={styles.itemContent}>
                {this.state.sprintName ? this.state.sprintName : '-'}
              </div>
            </div>
            <div style={styles.items}>
              <div style={styles.item}>看板：</div>
              <div title={this.state.kanbanName} style={styles.itemContent}>
                {this.state.kanbanName}
              </div>
            </div>

            <div style={{marginTop: '15px'}}>负责人：</div>
            <FormItem>
              {getFieldDecorator('acception')(
                <Select size={size} disabled={false} style={styles.select}>
                  <Option value="陈造龙">陈造龙</Option>
                  <Option value="钱秋梅">钱秋梅</Option>
                  <Option value="张宇">张宇</Option>
                  <Option value="陈真">陈真</Option>
                  <Option value="柯希权">柯希权</Option>
                  <Option value="PO">PO</Option>
                </Select>,
              )}
            </FormItem>

            <div style={{marginTop: '15px'}}>优先级：</div>
            <FormItem>
              {getFieldDecorator('issuePriority')(
                <Select size={size} style={styles.select}>
                  <Option value="1">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          marginRight: '8px',
                          borderRadius: '50%',
                          background: '#5095fe',
                        }}
                      />
                      低
                    </div>
                  </Option>
                  <Option value="2">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          marginRight: '8px',
                          borderRadius: '50%',
                          background: '#f9d252',
                        }}
                      />
                      中
                    </div>
                  </Option>
                  <Option value="3">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          marginRight: '8px',
                          borderRadius: '50%',
                          background: '#fe5050',
                        }}
                      />
                      高
                    </div>
                  </Option>
                </Select>,
              )}
            </FormItem>
            <div style={{...styles.item, display: this.state.formType === 'story' ? '' : 'none'}}>故事点：</div>
            <FormItem style={{display: this.state.formType === 'story' ? '' : 'none'}}>
              {getFieldDecorator('storyPoint')(
                <div style={{...styles.select, ...{paddingRight: '12px'}}}>
                  <InputNumber
                    min={1}
                    size={size}
                    style={{
                      ...styles.select,
                      ...{borderRadius: 0, height: '27px', marginTop: '1px'},
                    }}
                  />
                </div>,
              )}
            </FormItem>
            <div style={{...styles.item, display: this.state.formType === 'task' ? '' : 'none'}}>工作量：</div>
            <FormItem style={{display: this.state.formType === 'task' ? '' : 'none'}}>
              {getFieldDecorator('workload')(
                <div style={{...styles.select, ...{paddingRight: '12px'}}}>
                  <InputNumber
                    min={1}
                    size={size}
                    style={{
                      ...styles.select,
                      ...{borderRadius: 0, height: '27px', marginTop: '1px'},
                    }}
                  />
                </div>,
              )}
            </FormItem>
            <div style={{display: 'flex', alignItems: 'center'}}>
              父级需求<i
              title="选择父级需求，任务状态会随其改变"
              className="material-icons"
              style={{
                marginLeft: '5px',
                fontSize: '14px',
                color: 'gray',
                cursor: 'pointer',
              }}
            >
              error_outline
            </i>
            </div>
            <FormItem>
              {getFieldDecorator('parentId')(
                <Select
                  size={size}
                  style={styles.select}
                  onSelect={this.selectParent}
                >
                  {this.state.parentCardSelection}
                </Select>,
              )}
            </FormItem>
            <div style={{marginTop: '15px', display: this.state.formType === 'story' ? '' : 'none'}}>需求来源：</div>
            <FormItem style={{display: this.state.formType === 'story' ? '' : 'none'}}>
              {getFieldDecorator('demandSource')(
                <Select size={size} disabled={false} style={styles.select}>
                  <Option value="1">客户</Option>
                  <Option value="2">用户</Option>
                  <Option value="3">产品经理</Option>
                  <Option value="4">市场</Option>
                  <Option value="5">客服</Option>
                  <Option value="6">竞争对手</Option>
                  <Option value="7">开发人员</Option>
                  <Option value="8">测试人员</Option>
                  <Option value="9">bug</Option>
                  <Option value="10">其他</Option>
                </Select>,
              )}
            </FormItem>
            <div style={{marginTop: '15px', display: this.state.formType === 'story' ? '' : 'none'}}>需求类型：</div>
            <FormItem style={{display: this.state.formType === 'story' ? '' : 'none'}}>
              {getFieldDecorator('demandType')(
                <Select size={size} disabled={false} style={styles.select}>
                  <Option value="1">新需求</Option>
                  <Option value="2">变更</Option>
                </Select>,
              )}
            </FormItem>
          </Form>
          <div style={{marginTop: '30px', marginLeft: 'calc(100% - 100px)'}}>
            <Button
              type="primary"
              style={{background: 'white', color: '#3f51b5', border: 'none'}}
              htmlType="submit"
              onClick={this.createTask}
            >
              确定
            </Button>
            <Button
              style={{background: 'white', color: '#3f51b5', border: 'none'}}
              htmlType="reset"
              onClick={this.cancel}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({})(withRouter(CreateCard));
