/**
 * Created by chenzl on 2017/10/12.
 * feature:编辑/查看story详情
 */
/*eslint-disable*/
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
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
  Icon,
} from 'antd';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import '../../assets/css/userStoryMap-card.css';
import OneComment from './OneComment';
const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { TextArea } = Input;
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
    marginTop: '6px',
  },
  item: {
    flex: 1,
    marginLeft: '10px',
  },
  select: {
    // width: '100px',
    // flex: 5,
    width: '104px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    // marginLeft: '-10px',
    // padding: '0 -10px',
    // transform: 'scaleY(0.9)',
  },
};
const size = 'small';
@observer
class EditStory extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      topshow: false,
    };
  }

  //textarea的enter事件
  ChangeIssue = (e, type) => {
    console.log('enter');
    e.preventDefault();
    const storyDetailDatas = IssueManageStore.getStoryData;
    const {
      id,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      position,
      parentId,
    } = UserStoryStore.currentEditData;
    console.log(id);
    let data = {};
    let va = e.target.value;
    data[type] = va;

    UserStoryStore.updateIssueById(id, data)
      .then(data => {
        if (data) {
          //把当前textarea的值存在store中
          // IssueManageStore.setStoryData(data);
          UserStoryStore.updateLocalStory(
            index,
            column,
            taskindex,
            storyindex,
            storygroup,
            position,
            data,
          );
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      })
      .catch(error => {
        console.log(error);
      });
    //在这之下调用后端更改接口
  };
  //拿到textarea
  getTextArea = (instance, type) => {
    if (instance) {
      this[type] = instance;
      // console.log(this[type]);
    }
  };
  //当数据存在store里时，可以根据store数据来动态更改textarea里的值
  componentWillReact() {
    this.changeTextArea('description', IssueManageStore.storyData.description);
    this.changeTextArea('content', IssueManageStore.storyData.content);
  }
  //更改本地textarea内容
  changeTextArea(type, value) {
    ReactDOM.findDOMNode(this[type]).value = value;
  }
  //所有select的响应函数
  onSelectChange = (value, obj) => {
    console.log(value, obj);
    let va;
    const {
      id,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      position,
      parentId,
    } = UserStoryStore.currentEditData;
    va = typeof value === 'object' ? value.label : value;
    let data = {};
    data[obj.type] = va;
    console.log(data);
    IssueManageStore.setStoryData(data);
    UserStoryStore.updateIssueById(id, data)
      .then(data => {
        if (data) {
          UserStoryStore.updateLocalStory(
            index,
            column,
            taskindex,
            storyindex,
            storygroup,
            position,
            data,
          );
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  // saveRef(instance, type) {
  //   if (instance) {
  //     this[type] = instance;
  //     ReactDOM.findDOMNode(this[type]).value = '2';
  //     console.log(this[type]);
  //   }
  // }
  render() {
    const storyDetailDatas = IssueManageStore.getStoryData;
    // console.log({ ...storyDetailDatas });
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
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
          height: 'calc(100% - 112px)',
        }}
        id="editstory"
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
              padding: '10px 10px',
              fontSize: '14px',
              borderBottom: '1px solid #ddd',
            }}
          >
            <span style={{ fontSize: '12px', margin: '0 0 0 10px' }}>
              #{storyDetailDatas.issueId}
            </span>
            <span
              style={{
                fontSize: '12px',
                margin: '0 0 0 10px',
                color: '#3f51b5',
              }}
            >
              [story]
            </span>
            <span style={{ margin: '0 0 0 10px' }}>基本信息</span>
          </div>

          <TextArea
            style={{
              margin: '20px 20px 10px 20px',
              width: '90%',
              resize: 'none',
            }}
            ref={instance => {
              this.getTextArea(instance, 'description');
            }}
            placeholder="请输入描述"
            defaultValue={storyDetailDatas.description}
            autosize={{ minRows: 2, maxRows: 10 }}
            onFocus={() => {
              this.setState({ topshow: true });
            }}
            onBlur={e => {
              this.ChangeIssue(e, 'description');
            }}
            // onPressEnter={value => {
            //   this.ChangeIssue(value, 'description');
            // }}
          />
          {/* <div
            style={{
              ...{ width: '90%', textAlign: 'right', color: '#888' },
              ...{ display: this.state.topshow ? 'block' : 'none' },
            }}
          >
            <Icon
              type="smile"
              style={{
                fontSize: '14px',
                lineHeight: '16px',
                marginRight: '6px',
              }}
            />Enter保存
          </div> */}
          <p>
            <span style={{ margin: '5px 20px' }}>
              宝洁创建于:{storyDetailDatas.creationDate}
            </span>
          </p>

          <div style={{ margin: '-10px 10px 0 10px' }}>
            <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
              <Panel header="属性" key="1" style={{ background: '#fafafa' }}>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    flexFlow: 'row wrap',
                  }}
                >
                  <div style={styles.items}>
                    <div style={styles.item}>状态：</div>
                    <div style={styles.select}>
                      <Tag color="#108ee9" style={{ color: 'white' }}>
                        {storyDetailDatas.status}
                      </Tag>
                    </div>
                  </div>
                  <div style={styles.items}>
                    <div style={styles.item}>负责人：</div>
                    <Select
                      size={size}
                      getPopupContainer={() =>
                        document.getElementById('editstory')
                      }
                      disabled={true}
                      onChange={value => {
                        this.onSelectChange(value, { type: 'assign' });
                      }}
                      style={styles.select}
                    >
                      <Option value="ma">陈造龙</Option>
                      <Option value="aa">钱秋梅</Option>
                      <Option value="3">张宇</Option>
                      <Option value="4">陈真</Option>
                      <Option value="5">柯希权</Option>
                      <Option value="6">PO</Option>
                    </Select>
                  </div>
                  <div style={styles.items}>
                    <div style={styles.item}>迭代：</div>
                    <div
                      style={styles.select}
                      title={
                        storyDetailDatas.sprintName == null
                          ? '-'
                          : storyDetailDatas.sprintName
                      }
                    >
                      {storyDetailDatas.sprintName == null
                        ? '-'
                        : storyDetailDatas.sprintName}
                    </div>
                  </div>
                  <div style={styles.items}>
                    <div style={styles.item}>优先级：</div>
                    <Select
                      getPopupContainer={() =>
                        document.getElementById('editstory')
                      }
                      size={size}
                      style={styles.select}
                      value={
                        storyDetailDatas.issuePriority != null
                          ? storyDetailDatas.issuePriority
                          : '1'
                      }
                      onChange={value => {
                        this.onSelectChange(value, { type: 'issuePriority' });
                      }}
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
                    </Select>
                  </div>
                  <div style={styles.items}>
                    <div style={styles.item}>看板：</div>
                    <div
                      style={styles.select}
                      title={
                        storyDetailDatas.kanbanName == null
                          ? '-'
                          : storyDetailDatas.kanbanName
                      }
                    >
                      {storyDetailDatas.kanbanName == null
                        ? '-'
                        : storyDetailDatas.kanbanName}
                    </div>
                  </div>
                  <div style={styles.items}>
                    <div style={styles.item}>故事点：</div>
                    <InputNumber
                      size={size}
                      style={styles.select}
                      value={storyDetailDatas.storyPoint}
                      disabled="true"
                      //数据更改事件
                      onChange={value => {
                        this.onSelectChange(value, { type: 'storyPoint' });
                      }}
                    />
                  </div>
                  <div style={styles.items}>
                    <div style={styles.item}>需求来源：</div>
                    <Select
                      getPopupContainer={() =>
                        document.getElementById('editstory')
                      }
                      size={size}
                      style={styles.select}
                      labelInValue
                      value={{
                        label:
                          storyDetailDatas.demandSource != null
                            ? storyDetailDatas.demandSource
                            : '客户',
                      }}
                      onChange={value => {
                        this.onSelectChange(value, { type: 'demandSource' });
                      }}
                    >
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
                    </Select>
                  </div>
                  <div style={styles.items}>
                    <div style={styles.item}>需求类型：</div>
                    <Select
                      getPopupContainer={() =>
                        document.getElementById('editstory')
                      }
                      size={size}
                      style={styles.select}
                      labelInValue
                      value={{
                        label:
                          storyDetailDatas.demandType != null
                            ? storyDetailDatas.demandType
                            : '新需求',
                      }}
                      onChange={value => {
                        this.onSelectChange(value, { type: 'demandType' });
                      }}
                    >
                      <Option value="1">新需求</Option>
                      <Option value="2">变更</Option>
                    </Select>
                  </div>
                  <div
                    style={{
                      ...styles.items,
                      ...{ width: '100%', marginTop: '6px' },
                    }}
                  >
                    <div style={styles.item}>标签：</div>
                    <Select
                      getPopupContainer={() =>
                        document.getElementById('editstory')
                      }
                      size={size}
                      mode="multiple"
                      style={{ flex: 4, paddingLeft: '5px' }}
                      placeholder="请选择标签"
                      // onChange={value => {
                      //   this.onSelectChange(value, { type: 'issuePriority' });
                      // }}
                    >
                      {children}
                    </Select>
                  </div>
                </div>
              </Panel>
              <Panel header="内容" key="2" style={{ background: '#fafafa' }}>
                <TextArea
                  style={{ margin: '10px', width: '100%', resize: 'none' }}
                  ref={instance => {
                    this.getTextArea(instance, 'content');
                  }}
                  placeholder="请输入详细描述"
                  defaultValue={storyDetailDatas.content}
                  autosize={{ minRows: 2, maxRows: 10 }}
                  onFocus={() => {
                    this.setState({ show: true });
                  }}
                  onBlur={e => {
                    this.ChangeIssue(e, 'content');
                  }}
                  // onPressEnter={value => {
                  //   this.ChangeIssue(value, 'content');
                  // }}
                  
                />
                {/* <div
                  style={{
                    ...{ width: '100%', textAlign: 'right', color: '#888' },
                    ...{ display: this.state.show ? 'block' : 'none' },
                  }}
                >
                  <Icon
                    type="smile"
                    style={{
                      fontSize: '14px',
                      lineHeight: '16px',
                      marginRight: '6px',
                    }}
                  />Enter保存
                </div> */}
              </Panel>

              <Panel header="动态" key="3" style={{ background: '#fafafa' }}>
                <Tabs type="card">
                  <TabPane
                    tab={<span style={{ fontSize: '12px' }}>操作记录(2)</span>}
                    key="1"
                  >
                    {/* 根据评论数据生成评论 */}
                    {commitdata.map(one => <OneComment data={one} />)}
                  </TabPane>
                  <TabPane
                    tab={<span style={{ fontSize: '12px' }}>评论(0)</span>}
                    key="2"
                  >
                    <p>Content of Tab Pane 2</p>
                    <p>Content of Tab Pane 2</p>
                    <p>Content of Tab Pane 2</p>
                  </TabPane>
                </Tabs>
              </Panel>
            </Collapse>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            height: '80px',
            position: 'absoulte',
            bottom: 0,
            right: 0,
            background: '#eee',
            paddingTop: '15px',
          }}
        >
          <Input
            style={{
              display: 'block',
              width: '80%',
              margin: 'auto',
              height: '40px',
            }}
            placeholder="编写评论（Ctrl+回车提交，还可以@其他人）"
          />
        </div>
      </div>
    );
  }
}
export default Form.create({})(withRouter(EditStory));
