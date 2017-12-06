/**
 * Created by chenzl on 2017/10/12.
 * feature:编辑/查看story详情
 */
/*eslint-disable*/
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
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
} from 'antd';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import '../../assets/css/userStoryMap-card.css';
const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD';
@observer
class EditStoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      changeData: {},
    };
  }
  // 编辑按钮,更新Issue类型
  editChange = () => {
    const id = IssueManageStore.getStoryId;
    this.linkToChange(`issueManage/updata/${id}`);
  };
  // 路由跳转设置
  linkToChange = url => {
    const { history } = this.props;
    history.push(url);
  };
  // 更改详情
  onChangeDetail = e => {
    const storyDetailDatas = IssueManageStore.getStoryData;
    console.log(storyDetailDatas);
    const id = IssueManageStore.getStoryId;
    this.props.form.validateFieldsAndScroll((err, data) => {
      window.console.log(data);
      let temp = {};
      for (let key in data) {
        if (data[key] != null) {
          temp[key] = data[key];
        }
      }
      temp;
      if (!err) {
        IssueManageStore.setStoryData(data);
        IssueManageStore.updateIssueById(
          {
            ...storyDetailDatas,
            ...temp,
            objectVersionNumber: storyDetailDatas.objectVersionNumber,
          },
          id,
        )
          .then(data => {
            if (data) {
              console.log(data);
              message.success('修改成功');
            }
          })
          .catch(error => {
            console.log(err);
            message.error('修改失败!');
          });
      }
    });
  };
  ChangeIssue(e) {
    e.preventDefault();
    const storyDetailDatas = IssueManageStore.getStoryData;
    const id = IssueManageStore.getStoryId;
    IssueManageStore.setStoryData({ description: e.target.value });
    IssueManageStore.updateIssueById(
      {
        ...storyDetailDatas,
        ...{ description: e.target.value },
        objectVersionNumber: storyDetailDatas.objectVersionNumber,
      },
      id,
    )
      .then(data => {
        if (data) {
          this.setState({
            click: false,
          });
          console.log(data);
          message.success('修改成功');
        }
      })
      .catch(error => {
        console.log(err);
        message.error('修改失败!');
      });
  }
  getTextArea(textarea) {
    if (textarea) {
      this.textarea = textarea;
      console.log(ReactDOM.findDOMNode(textarea));
    }
  }
  componentWillReact() {
    this.changeTextArea(IssueManageStore.storyData.description);
  }

  changeTextArea(value) {
    ReactDOM.findDOMNode(this.textarea).value = value;
  }
  render() {
    const { displayDetail } = this.props;
    const storyDetailDatas = IssueManageStore.getStoryData;
    console.log(storyDetailDatas.endTime);
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className="storyCardStyle" style={{ display: displayDetail }}>
        <div style={{ background: '#F7F7F7', height: 40, lineHeight: 3 }}>
          <span style={{ marginRight: 30, marginLeft: 10 }}>
            #{storyDetailDatas.issueId}
          </span>
          <span>{storyDetailDatas.issueType}</span>
          {/* <a
            style={{
              float: 'right',
              lineHeight: '35px',
              marginLeft: '30px',
              marginRight: '30px',
            }}
          >
            更多
          </a>
          <a
            style={{ float: 'right', display: 'block', lineHeight: '35px' }}
            onClick={this.editChange.bind()}
          >
            {'编辑'}
          </a> */}
        </div>
        <hr />
        <div>
          {/* <h3 style={{ marginBottom: '20px' }}>
            {storyDetailDatas.description}
          </h3> */}
          {/* <input className="editrelease" onBlur={this.ChangeIssue.bind(this)} /> */}
          <TextArea
            ref={this.getTextArea.bind(this)}
            placeholder="请输入描述"
            defaultValue={storyDetailDatas.description}
            autosize
            onPressEnter={this.ChangeIssue.bind(this)}
          />
          <p>
            <span style={{ marginRight: '30px' }}>宝洁</span>
            <span>创建于:{storyDetailDatas.creationDate}</span>
          </p>
        </div>
        <div>
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="基本信息" key="1">
              <Form layout="horizontal">
                <Row gutter={8}>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="状态">
                      {getFieldDecorator('status', {
                        initialValue: storyDetailDatas.status,
                      })(
                        <Select
                          onBlur={this.onChangeDetail}
                          style={{ width: '100px' }}
                        >
                          <Option value="todo">准备中</Option>
                          <Option value="doing">进行中</Option>
                          <Option value="done">已完成</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="指派人">
                      {getFieldDecorator('assigneeId', {
                        initialValue: '指派人',
                      })(
                        <Select
                          style={{ width: '100px' }}
                          onBlur={this.onChangeDetail}
                        >
                          <Option value="1">陈造龙</Option>
                          <Option value="2">钱秋梅</Option>
                          <Option value="3">张宇</Option>
                          <Option value="4">陈真</Option>
                          <Option value="5">柯希权</Option>
                          <Option value="6">PO</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="故事点">
                      {getFieldDecorator('storyPoint', {
                        initialValue: storyDetailDatas.storyPoint,
                      })(
                        <InputNumber
                          onChange={this.onChangeDetail}
                          // className="inputNum"
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="优先级">
                      {getFieldDecorator('issuePriority', {
                        initialValue: storyDetailDatas.issuePriority,
                      })(
                        <Select
                          style={{ width: 100 }}
                          onBlur={this.onChangeDetail}
                        >
                          <Option value="1">低</Option>
                          <Option value="2">中</Option>
                          <Option value="3">高</Option>
                          <Option value="4">非常高</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="开始时间">
                      {getFieldDecorator('startTime', {
                        initialValue: storyDetailDatas.startTime,
                      })(
                        <DatePicker
                          style={{ width: 100 }}
                          onChange={this.onChangeDetail}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="截止时间">
                      {getFieldDecorator('endTime', {})(
                        <DatePicker
                          format={dateFormat}
                          style={{ width: 100 }}
                          onChange={this.onChangeDetail}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="迭代">
                      {getFieldDecorator('sprintId', {
                        initialValue: storyDetailDatas.sprintId,
                      })(
                        <Select
                          style={{ width: 100 }}
                          onBlur={this.onChangeDetail}
                        >
                          <Option value="1">第一次迭代</Option>
                          <Option value="2">第二次迭代</Option>
                          <Option value="3">第三次迭代</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="标签">
                      {getFieldDecorator('label', {
                        initialValue: storyDetailDatas
                          ? storyDetailDatas.label
                          : '',
                      })(
                        <Select
                          style={{ width: 100 }}
                          onBlur={this.onChangeDetail}
                        >
                          <Option value="1">as</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Panel>
            <Panel header="内容" key="2">
              <Row>
                <Col>
                  <h4 style={{ marginBottom: '10px' }}>故事内容</h4>
                  <p>{storyDetailDatas.content}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 style={{ marginBottom: '10px' }}>验收标准</h4>
                  <p style={{ marginBottom: '10px' }}>
                    {storyDetailDatas.acception}
                  </p>
                </Col>
              </Row>
            </Panel>
            <Panel header="动态" key="3">
              <p>操作记录（1）|评论（0）</p>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}
export default Form.create({})(withRouter(EditStoryCard));
