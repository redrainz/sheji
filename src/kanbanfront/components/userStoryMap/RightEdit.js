/*eslint-disable*/
import { Icon, Button, Input } from 'antd';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
const { TextArea } = Input;

@observer
export default class RightEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      default: 'ssss',
    };
  }
  cancel() {
    UserStoryStore.closeright();
  }
  render() {
    return (
      <div
        className="righthinput"
        style={{
          ...{
            position: 'fixed',
            right: 0,
            top: 0,
            padding: '50px',
            zIndex: 50,
            width: '500px',
            height: '100%',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
          },
          ...{ display: this.props.visiable ? 'flex' : 'none' },
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            fontSize: '18px',
          }}
        >
          编辑
        </div>
        <TextArea
          placeholder="Autosize height with minimum and maximum number of lines"
          autosize={{ minRows: 2, maxRows: 6 }}
          defaultValue={this.state.default}
        />
        <div>
          <Button type="primary">确定</Button>
          <Button onClick={this.cancel.bind(this)}>取消</Button>
        </div>
      </div>
    );
  }
}
