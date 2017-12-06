/*eslint-disable*/
import React, {Component} from 'react';
import {
  Tabs, Menu, Dropdown, Button, Icon, Modal, Form, Input, Select,message,Tooltip
} from 'antd';
import {NavLink, withRouter} from 'react-router-dom';
import Routes from '../../../common/RouteMap';
import KanbanManageHeader from "../../../components/kanbanManage/KanbanManageHeader";
import AllKanban from "../../../components/kanbanManage/AllKanban";
import KanbanManageStore from '../../../stores/origanization/managePage/KanbanManageStore';
import SprintStore from '../../../stores/origanization/sprint/SprintStore';
import '../../../assets/css/acss.css';
import '../../../assets/css/kanban-manage.css';
import '../../../assets/font-awesome/css/font-awesome.min.css';
import FontAwesome from 'react-fontawesome';
const TabPane = Tabs.TabPane;
const {TextArea} = Input;
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;
const kanbanIcon=require('../../../assets/image/kanbanManageIcon.png');


const Search = Input.Search;

/*删除两端的空格*/
function trim(str){
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

class KanbanManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      kanban: [],
      blockOrList: 'block',
    }
    this.sourceDataCopy = [];
  }

  componentWillMount() {
    this.fetchKanban();
  }

  fetchKanban = () => {
    let projectId = 1;
    KanbanManageStore.getKanbansByProjectId(projectId).then(response => {
        if (response != null) {
          this.sourceDataCopy = this.deepCopy(response);
          this.setState({
            kanban: response,
          });
        } else {
          message.error("看板数据获取失败");
        }
      }
    );
  }

  /*前往看板使用页面*/
  toKanbanPage=(kanbanId)=>{
    this.props.history.push(`/kanbanFront/kanban/${kanbanId}`);
  }

  handleOnOk=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          visible: false,
        });
        this.createKanban(values.kanbanName);
        document.getElementById("kanbanName").lastChild.value = '';
    }
    });
  }

  handleOnCancel =(e)=>{
    this.setState({
      visible: false,
    });
  }

  showNewKanbanModal=()=>{
    this.setState({
      visible: true,
    });
  }

  createKanban(kanbanName){
    let projectId = 1;
    let newKanban = {
      projectId: projectId,
      name:kanbanName
    };
    if(kanbanName){
      KanbanManageStore.kanbanCreate(newKanban).then(response => {
        this.fetchKanban();
        if (response) {
          message.success("创建成功");

        }else{
          message.error("创建失败");
        }

      });
    }else {
      message.info("名称不能为空！");
    }
  }
  /*深度拷贝函数*/
  deepCopy(obj){
    if (obj instanceof Array) {
      let array = [];
      for (let i=0;i<obj.length;++i) {
        array[i] = this.deepCopy(obj[i]);
      }
      return array;
    } else if (obj instanceof Object) {
      let newObj = {}
      for (let field in obj) {
        newObj[field] = this.deepCopy(obj[field]);
      }
      return newObj;
    } else {
      return obj;
    }
  }

  handleOnSearchChange=(event)=>{
    let kanbanArray = this.deepCopy(this.sourceDataCopy);
    let result = [];
    let target = trim(event.target.value).toLowerCase();
    if(target==""){
      result = kanbanArray;
    }else{
      for(let kanban of kanbanArray){
        if(kanban.name.toLowerCase().indexOf(target)>=0){
          result.push(kanban);
        }
      }
    }
    this.setState({
      kanban:result,
    });
  }
  handleOnTypeChange=(event)=>{
    let type = event.target.getAttribute("data-type");
    this.setState({
      blockOrList:type,
    });
    if(type==="block"){
      message.info('已切换到块级显示',1);
    }else if(type==="list"){
      message.info('已切换到列表显示',1);
    }
  }

  render() {
    let SearchInput = (
      <Input prefix={<i className="material-icons" style={{fontSize:16}}>search</i>} placeholder="根据看板名称查询" size="small"
      style={{marginRight: 20, width: 260,height:28,marginTop:5,fontSize:14}}
        onChange={this.handleOnSearchChange}
        className="searchStyle"/>);
    const headFontStyle = {fontSize: 14, color: 'rgba(0,0,0,0.65)'};

    const { getFieldDecorator } = this.props.form;
    return (
      <div className="kanban-manage">
        <Modal title="新建看板" visible={this.state.visible}
               onOk={this.handleOnOk} onCancel={this.handleOnCancel}>
          <Form onSubmit={this.handleOnOk}>
            <FormItem>
              {getFieldDecorator('kanbanName', {
                rules: [{ required: true, message: '请输入看板名称' }],
              })(
                <div>
                  <p>看板名称</p>
                  <Input/>
                </div>
              )}
            </FormItem>
          </Form>
        </Modal>

        <KanbanManageHeader showNewKanbanModal={this.showNewKanbanModal}/>
        {/*<PageHeader title="看板管理">*/}
          {/*<Button className="header-btn"*/}
                  {/*ghost={true}*/}
                  {/*onClick={this.showNewKanbanModal}*/}
                  {/*style={PageHeadStyle.leftBtn}>*/}
            {/*<i className="material-icons" style={{fontSize:16,top:3,position:'relative'}}>playlist_add</i>*/}
            {/*<span  style={{marginLeft:12,position:'relative'}}>添加看板</span>*/}
          {/*</Button>*/}
        {/*</PageHeader>*/}


        <Tabs defaultActiveKey="1" tabBarExtraContent={SearchInput}>
          <TabPane tab="所有看板" key="1">
            <div style={{ top: -4, position: 'relative' }}>
              <div className="all-kanban" style={{ marginLeft: '1rem',}}>
                <div className="all-kanban-header" style={{height:48,width:'100%'}}>
                  <div className="all-kanban-left" style={headFontStyle}>正在使用的看板</div>
                  <div className="all-kanban-right">
                    <div className="kanban-manage-item" style={{marginRight: 8}}>
                      <Tooltip title="块级显示">
                        <i className="material-icons" data-type="block" onClick={this.handleOnTypeChange} style={{cursor:'pointer',fontSize:16,color:this.state.blockOrList==="block"?'#3F51B5':'unset',}}>dashboard</i>
                      </Tooltip>
                    </div>
                    <div className="kanban-manage-item" style={{ marginRight: 21,position:'relative',}}>
                      <Tooltip title="列表显示">
                        <i className="material-icons" data-type="list" onClick={this.handleOnTypeChange} style={{cursor:'pointer',fontSize:19,position:'relative',top:1,color:this.state.blockOrList==="list"?'#3F51B5':'unset'}}>view_list</i>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <AllKanban blockOrList={this.state.blockOrList} kanbanArray={this.state.kanban} toKanbanPage={this.toKanbanPage} reLoadKanban={this.fetchKanban}/>
              </div>
              <div className="archived-kanban">
                <div></div>
                <div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="看板模板" disabled key="2">Content of Tab Pane 2</TabPane>
        </Tabs>

      </div>
    );
  }
}
export default Form.create()(KanbanManage);
