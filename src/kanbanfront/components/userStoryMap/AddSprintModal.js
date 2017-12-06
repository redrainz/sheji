/**
 * Created by knight on 2017/10/18.
 * 添加迭代弹窗填写信息
 */
/*eslint-disable*/
import { Modal, Input, Form, DatePicker, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import React, { Component } from 'react';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import IssueManageStore from '../../stores/origanization/issue/IssueManageStore';
import { observer } from 'mobx-react';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
};
@observer
class AddSprintModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      releasePlanId: this.props.releasePlanId,
      description: '',
      startTime: '',
      endTime: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.modalVisible) {
      this.init('1', nextProps);
    } else
      this.setState({
        visible: nextProps.modalVisible,
      });
  }
  formDate(data) {
    let temp = new Date(data);
    return (
      temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate()
    );
  }
  init(projectId, nextProps) {
    UserStoryStore.getSprintByProjectId(projectId)
      .then(data => {
        if (data) {
          let i = 0;
          let sprintData = data[i];
          let startTime = this.formDate(sprintData['startTime']);
          let endTime = this.formDate(
            sprintData['startTime'] + 7 * 24 * 60 * 60 * 1000,
          );
          this.setState({
            description: sprintData['description'],
            startTime: startTime,
            endTime: endTime,
            visible: nextProps.modalVisible,
          });
        } else {
          let time = new Date().getTime();
          let startTime = this.formDate(time);
          let endTime = this.formDate(time + 7 * 24 * 60 * 60 * 1000);
          this.setState({
            description: '请输入迭代名称',
            startTime: startTime,
            endTime: endTime,
            visible: nextProps.modalVisible,
          });
        }
      })
      .catch(e => {
        message.error('网络不稳!');
      });
  }
  handleOk = e => {
    UserStoryStore.setCurrentRelease('0');
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.resetModal();
        let arr = [];
        for (let key in UserStoryStore.selectStorys) {
          if (UserStoryStore.selectStorys[key]) {
            // IssueManageStore.getStoryDataById(key)
            //   .then(data => {
            //     if (data) {
            //       con;
            //       IssueManageStore.updateIssueById(
            //         {
            //           ...data,
            //           ...{ status: 'doing' },
            //         },
            //         key,
            //       )
            //         .then(data => {
            //           if (data) {
            //             console.log(data);
            //             // message.success('修改成功');
            //           }
            //         })
            //         .catch(error => {
            //           console.log(err);
            //           // message.error('修改失败!');
            //         });
            //     }
            //   })
            //   .catch(error => {
            //     console.log(err);
            //     // message.error('修改失败!');
            //   });
            arr.push(key);
          }
        }
        let sprintValue = {
          description: values.sprintName,
          name: values.sprintName,
          projectId: 1,
          issueIdArr: arr,
          status: 'todo',
          releasePlaneId:
            UserStoryStore.ReleasePlanids[UserStoryStore.currentRelease],
          releasePlaneName:
            UserStoryStore.ReleasePlanNames[UserStoryStore.currentRelease],
          startTime: values.rangePicker[0].valueOf(),
          endTime: values.rangePicker[1].valueOf(),
        };
        UserStoryStore.createSprint(sprintValue).then(data => {
          if (data) {
            this.setState({
              visible: false,
            });
            this.linkToChange('/kanbanfront/sprintManage');
          }
        });
      }
    });
  };
  // 路由跳转设置
  linkToChange = url => {
    const { history } = this.props;
    history.push(url);
  };
  handleCancel = e => {
    this.props.resetModal();
    // UserStoryStore.setShadowDisplay('none');
    // UserStoryStore.setCurrentRelease('0');
    this.setState({
      visible: false,
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="添加迭代"
          visible={this.state.visible}
          style={{ top: 200 }}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="迭代名称">
              {getFieldDecorator('sprintName', {
                rules: [{ required: true, message: '输入迭代名称!' }],
              })(
                <Input placeholder={this.state.description} autoFocus={true} />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="时间">
              {getFieldDecorator(
                'rangePicker',
                {
                  initialValue: [
                    moment(this.state.startTime).startOf('day'),
                    moment(this.state.endTime).endOf('day'),
                  ],
                },
                {
                  rules: [{ type: 'array', required: true, message: '选择时间!' }],
                },
              )(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create({})(withRouter(AddSprintModal));
