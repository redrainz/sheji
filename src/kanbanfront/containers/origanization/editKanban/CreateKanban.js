/**
 * Created by chenzl on 2017/8/31.
 * 创建看板页面
 */
/*eslint-disable*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import PageHeader, {PageHeadStyle} from '../../../components/common/PageHeader';

@observer
class CreateKanban extends Component {

  // 新建看板
  createKanban=()=>{
    this.linkToChange('/kanbanFront/createKanban/editKanban');
  }
  // 页面跳转
  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };
  render() {
    return(
      <div>
        <PageHeader title={'看板管理'}>
          <Button className="header-btn" ghost={true} onClick={ this.createKanban }
                  style={PageHeadStyle.leftBtn}
                  icon="folder-add">{'新建看板'}</Button>
          <Button className="header-btn" ghost={true} onClick={() => {
            this.loadKanbans(this.state.page)
          }} style={PageHeadStyle.leftBtn} icon="reload">{'刷新'}</Button>
        </PageHeader>
      </div>
    );
  }
}
export default CreateKanban;
