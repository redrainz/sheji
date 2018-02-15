/**
 * Created by Yu Zhang on 2017/9/20.
 */
/*eslint-disable*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Layout, Menu, Button, Icon, Modal, Form, Input, Row, Col, Card, message, Popover, Table} from 'antd';
import {NavLink, withRouter} from 'react-router-dom';
import Routes from '../../../common/RouteMap';
import PageHeader, {PageHeadStyle} from "../../../components/common/PageHeader";
import LabelManageStore from '../../../stores/origanization/label/LabelManageStore';
import '../../../assets/css/acss.css';
const confirm = Modal.confirm;
@observer
class LabelManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
    }
  }

  componentDidMount() {
    this.findByProjectId();

  }

  //刷新页面
  reLoad() {
    this.findByProjectId();
  }

  findByProjectId() {

    LabelManageStore.findByProjectId(1).then(
      data => {

        this.setState({
          labels: data,
        });
      }
    );

  }

  deleteLabel(id) {
    LabelManageStore.deleteById(id).then(
      () => {
        this.findByProjectId();
      }
    );
  }

  toEdit(id) {

    this.linkToChange(`/kanbanFront/editLabel/${id}`);

  }

  toManage(id) {

    this.linkToChange(`/kanbanFront/issueManage/?typeId=${id}`);

  }

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  }
  //删除确认框
  showDeleteConfirm(id) {
    confirm({
      title: '确定删除此类型?',
      content: '删除不可恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.deleteLabel(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    console.log(this.state.labels);
    let dataSource = [];
    dataSource = this.state.labels;
    const columns = [{
      title: '类型',
      width: 200,
      key: 'name',
        render: (name,label)=>
          <div style={{
            backgroundColor:label.color,
            borderRadius: '20px',
            width:label.name.length*5+30,
            height:'20',
            lineHeight:'20px',
            color:'white',
            textAlign:'center',
            wordBreak: 'break-all',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{label.name}</div>

    },{
        title: '描述',
        width:500,
        dataIndex: 'description',
        key: 'description',

      },{
        title: '查看',
        width:300,
        dataIndex: 'id',
        key: 'look',
        render: id => <a onClick={this.toManage.bind(this,id)}>查看此类型的issue</a>,
      },{
        title: '操作',
        width:250,
        key: 'operation',
        render: (label) =>
          label.projectId!=0?
          <div>
            <Icon type="edit" style={{fontSize:16,marginRight:24,cursor:'pointer'}} onClick={this.toEdit.bind(this,label.id)}/>
            <Icon type="delete" style={{fontSize:16,marginRight:24,cursor:'pointer'}} onClick={this.showDeleteConfirm.bind(this,label.id)} />
          </div>
            :<div/>
          ,
      }
      ]
    return (
      <div>
        <PageHeader title="Label管理">
          <Button className="header-btn"
                  style={PageHeadStyle.leftBtn}
                  ghost={true}
                  onClick={this.toEdit.bind(this, 0)}
          >{'新建Label类型'}</Button>

          <Button className="header-btn" ghost={true}
                  style={PageHeadStyle.leftBtn} icon="reload"
                  onClick={this.reLoad.bind(this)}>{'刷新'}</Button>
        </PageHeader>
        <Table dataSource={dataSource} columns={columns}/>
      </div>
    );
  }
}
export default withRouter(LabelManage);
