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
import {
  Select,
  Button,
  InputNumber,
  Input,
  Collapse,
  DatePicker,
  Form,
  Row,
  Col,
  message,
  Tag,
  Tabs,
} from 'antd';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import '../../assets/css/userStoryMap-card.css';
import OneComment from '../userStoryMap/OneComment';
import KanbanStore from '../../stores/origanization/kanban/KanbanStore'

const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const {TextArea} = Input;
const TabPane = Tabs.TabPane;

const commitdata = [
  {
    username: '看板',
    content: '“所属计划：”由“[空值]”改为“开发”',
  },
  {
    username: '看板',
    content: '“所属计划：”由“[空值]”改为“开发”',
  },
];
const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}

const styles = {
  items: {
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: '6px',
  },
  item: {
    flex: 1,
    // marginLeft: '10px',
  },
  select: {
    // width: '100px',
    // flex: 5,
    width: '130px',
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    paddingLeft: '-10px',
    // padding: '0 -10px',
    // transform: 'scaleY(0.9)',
  },
};
const size = 'small';

@observer
class CreateCard extends Component {
  constructor() {
    super();
    this.state = {
      storyDetailDatas: {},
      formType:'story',
      kanbanName:"——"
    }
  }

  prevent = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }
  createTask = (e) => {
    e.preventDefault();
    // 校验表单
    this.props.form.validateFieldsAndScroll((err, data) => {
      if(!err) {
        console.log(data)
        data.kanbanId=this.state.kanbanId
        data.sprintId=this.state.sprintId
        data.projectId="1"
        data.status=this.state.status
        data.issueType="task"
        console.log(data)
        IssueManageStore.createIssue(data).then(data => {
          if (data) {
                this.props.init();
                message.success('添加成功', 1.5);
                this.props.form.resetFields();// 清空
          }
        })
      }
  })
  }
  cancel=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    SprintStore.closeCreateTaskShow();
  }
  selectParent=((key,option)=>{
    let data=SprintStore.getSprintData;
    data["issue"].map((item,index)=>{
      if(item.id==key) {
        let status;
        console.log(item.status)
        if (item.status == "sprint backlog") {
          status = "sprint backlog"
        } else {
          status = "pre todo"
        }
        this.setState({
          kanbanName: item.kanbanName,
          status: status,
          kanbanId: item.kanbanId,
          sprintId: item.sprintId
        })
      }
    })
  })
  render() {
    let data=SprintStore.getSprintData;
    const name=data["name"]
    let items=[];
    console.log(data)
    data["issue"].map((item,index)=>{
      if(item["issueType"]=="story"){
        items.push(<Option key={item.id} value={`${item.id}`}>{item.description}</Option>)
    }
    })
    const {getFieldDecorator} = this.props.form;
    const {storyDetailDatas} = this.state;
    console.log({...storyDetailDatas});
    console.log(storyDetailDatas.endTime);

    return (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 500,
          width: '448px',
          background: '#fafafa',
          borderLeft: '1px solid #ddd',
          height: 'calc(100% - 48px)',
        }}
        onClick={this.prevent}
      >
        <div
          style={{
            width: '100%',
            height: 'calc(100% - 70px)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              borderBottom: '1px solid #ddd',
            }}
          >
            添加Task
            <Button type="primary" size = 'small' htmlType="submit" onClick={this.createTask} style={{position:'absolute',right:78}}>确定</Button>
            <Button size='small' htmlType="reset" style={{position:'absolute',right:23}} onClick={this.cancel} >取消</Button>
          </div>
          <Form>
            <div
              style={{
                display: 'inline',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                top: 5,
                ...{width: '100%'},
              }}
            >
              <div style={{
                display: 'inline',
                marginLeft: 26,
                width: 41,
                bottom: -16,
                position: 'relative'
              }}>描述：
              </div>
              <FormItem style={{marginBottom:'none'}}>
                {getFieldDecorator('description',{
                  rules: [{ required: true, message: '请输入描述!' },],
                })
                (<TextArea
                  style={{
                    width: '74%',
                    resize: 'none',
                    position:'relative',
                    bottom:5,
                    left:77
                  }}
                  // ref={instance => {
                  //   this.getTextArea(instance, 'description');
                  // }}
                  placeholder="请输入描述"
                  autosize={{minRows: 2, maxRows: 10}}
                  onPressEnter={value => {
                    this.ChangeIssue(value, 'description');
                  }}
                />)}
              </FormItem>
            </div>
            <div style={{margin: '-10px 10px 0 10px'}}>
              <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                <Panel
                  header="基本信息"
                  key="1"
                  style={{background: '#fafafa'}}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      flexFlow: 'row wrap',
                    }}
                  >
                    <div style={styles.items}>
                      {/*<div style={styles.item}>状态：</div>*/}
                      <FormItem label='状态' style={{display:'inherit',marginBottom:0}}>
                      <div style={styles.select}>
                        <Tag color="#108ee9" style={{color: 'white',marginLeft:27,width:104,textAlign:'center'}}>
                          {this.state.status}
                        </Tag>
                      </div>
                      </FormItem>
                    </div>
                    <div style={styles.items}>
                      {/*<div style={styles.item}>负责人：</div>*/}
                      <FormItem label='负责人' style={{display:'inherit',marginBottom:0}}>
                        {getFieldDecorator('acception')
                        (<Select
                          size={size}
                          disabled={false}
                          style={{top:5,marginLeft:27,width:104}}
                        >
                          <Option value="陈造龙">陈造龙</Option>
                          <Option value="钱秋梅">钱秋梅</Option>
                          <Option value="张宇">张宇</Option>
                          <Option value="陈真">陈真</Option>
                          <Option value="柯希权">柯希权</Option>
                          <Option value="PO">PO</Option>
                        </Select>)}
                      </FormItem>
                    </div>
                    <div style={styles.items}>
                      <div style={styles.item}>迭代：</div>
                      <div style={styles.select}>
                        {name?name:"——"}
                      </div>
                    </div>
                    <div style={styles.items}>
                      {/*<div style={styles.item}>优先级：</div>*/}
                      <FormItem label='优先级' style={{display:'inherit',marginBottom:0}}>
                        {getFieldDecorator('issuePriority')
                        (<Select
                          size={size}
                          style={{top:5,marginLeft:27,width:104}}
                          defaultValue={"2"}
                        >
                          <Option value="1">
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <i
                                className="material-icons"
                                style={{
                                  color: '#5095fe',
                                  fontSize: '9px',
                                  marginRight: '3px',
                                }}
                              >
                                panorama_fish_eye
                              </i>
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
                              <i
                                className="material-icons"
                                style={{
                                  color: '#ff9f11',
                                  fontSize: '9px',
                                  marginRight: '3px',
                                }}
                              >
                                panorama_fish_eye
                              </i>
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
                              <i
                                className="material-icons"
                                style={{
                                  color: '#fe5050',
                                  fontSize: '9px',
                                  marginRight: '3px',
                                }}
                              >
                                panorama_fish_eye
                              </i>
                              高
                            </div>
                          </Option>
                        </Select>)}
                      </FormItem>
                    </div>
                    <div style={styles.items}>
                      <div style={styles.item}>看板：</div>
                      <div style={styles.select}>
                        {this.state.kanbanName}
                      </div>
                    </div>
                    <div style={styles.items}>
                      {/*<div style={styles.item}>故事点：</div>*/}
                      <FormItem label='工作量' style={{display:'inherit',marginBottom:0}}>
                        {getFieldDecorator('workload')
                        (<InputNumber
                          size={size}
                          style={{marginLeft:27,width:104}}
                        />)}
                      </FormItem>
                    </div>
                    <div style={styles.items}>
                      <FormItem label='父级需求' style={{display:'inherit',marginBottom:0}}>
                        {getFieldDecorator('parentId',{
                          rules: [{ required: true, message: '父级为必选项!' },],
                        })
                        (<Select
                          size={size}
                          style={{top:5,marginLeft:27,width:104}}
                          onSelect={this.selectParent}
                          >
                          {items}
                        </Select>)}
                         </FormItem>
                    </div>
                    {/*<div style={styles.items}>*/}
                      {/*/!*<div style={styles.item}>需求来源：</div>*!/*/}
                      {/*<FormItem label='需求来源' style={{display:'inherit',marginBottom:0}}>*/}
                        {/*{getFieldDecorator('demandSource')*/}
                        {/*(<Select*/}
                          {/*size={size}*/}
                          {/*style={{top:5,marginLeft:15,width:104}}*/}

                        {/*>*/}
                          {/*<Option value="1">客户</Option>*/}
                          {/*<Option value="2">用户</Option>*/}
                          {/*<Option value="3">产品经理</Option>*/}
                          {/*<Option value="4">市场</Option>*/}
                          {/*<Option value="5">客服</Option>*/}
                          {/*<Option value="6">竞争对手</Option>*/}
                          {/*<Option value="7">开发人员</Option>*/}
                          {/*<Option value="8">测试人员</Option>*/}
                          {/*<Option value="9">bug</Option>*/}
                          {/*<Option value="10">其他</Option>*/}
                        {/*</Select>)}*/}
                      {/*</FormItem>*/}
                    {/*</div>*/}
                    {/*<div style={styles.items}>*/}
                      {/*/!*<div style={styles.item}>需求类型：</div>*!/*/}
                      {/*<FormItem label='需求类型' style={{display:'inherit',marginBottom:0}}>*/}
                        {/*{getFieldDecorator('demandType')*/}
                        {/*(<Select*/}
                          {/*size={size}*/}
                          {/*style={{top:5,marginLeft:15,width:104}}*/}
                          {/*labelInValue*/}
                        {/*>*/}
                          {/*<Option value="1">新需求</Option>*/}
                          {/*<Option value="2">变更</Option>*/}
                        {/*</Select>)}*/}
                      {/*</FormItem>*/}
                    {/*</div>*/}
                    <div
                      style={{
                        ...styles.items,
                        ...{width: '100%'},
                      }}
                    >
                      <FormItem label='标签' style={{display:'inherit',marginBottom:0}}>
                        {getFieldDecorator('labels')
                        (<Select
                          size={size}
                          mode="multiple"
                          style={{top:5,marginLeft:38,width:298}}
                          placeholder="请选择标签"
                        >
                          {children}
                        </Select>)}
                      </FormItem>
                    </div>
                  </div>
                </Panel>
                <Panel header="内容" key="2" style={{background: '#fafafa'}}>
                  <FormItem  style={{marginBottom:'none'}}>
                    {getFieldDecorator('content')
                    (<TextArea
                      style={{margin: '10px', width: '94%', resize: 'none'}}
                      placeholder="请输入描述"
                      autosize={{minRows: 2, maxRows: 10}}
                    />)}
                  </FormItem>
                </Panel>
              </Collapse>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create({})(withRouter(CreateCard));
