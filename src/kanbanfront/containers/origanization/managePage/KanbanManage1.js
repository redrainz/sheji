/*eslint-disable*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {
  Tabs,Layout, Menu, Button, Icon, Modal, Form, Input, Row, Col, Card, message, Popover, Tree, Select,
  Progress
} from 'antd';
import {NavLink, withRouter} from 'react-router-dom';
import Routes from '../../../common/RouteMap';
import PageHeader, {PageHeadStyle} from "../../../components/common/PageHeader";
import AllKanban from "../../../components/kanbanManage/AllKanban"
import KanbanManageStore from '../../../stores/origanization/managePage/KanbanManageStore';
import SprintStore from '../../../stores/origanization/sprint/SprintStore';
import '../../../assets/css/acss.css';
import '../../../assets/css/kanban-manage.css';
import '../../../assets/font-awesome/css/font-awesome.min.css';
import FontAwesome from 'react-fontawesome';
const TabPane = Tabs.TabPane;
const {TextArea} = Input;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;
const kanbanIcon=require('../../../assets/image/kanbanManageIcon.png');
@observer
class KanbanManage extends Component {

  constructor(props) {
    super(props);
    this.create = this.create.bind(this);
    this.loadIssues = this.loadIssues.bind(this);
    this.state = {
      kanbans: [],
      sprints:[],
      data: [],
      kanbansInProject:[],
      value: '',
      createDisplay:false,
      visible: false,
      kanbanHiddenId:0,
      showMenuId:0
    }
  }

  componentWillMount() {
    this.currentSprint=0;
    this.init(this.props.match.params.sprintId);
    this.getSprintByProjectId();
    KanbanManageStore.getKanbansByProjectId(1).then(
      data=>{
        if (data) {
          this.setState({kanbansInProject: data});
        }
        else message.error("获取失败");

      });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          visible: false,
        });
        this.create(values.kanbanName);
        console.log('Received values of form: ', values);
      }
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  //从后台获取看板数据
  init(sprintId) {
    this.currentSprint=sprintId;
    if (sprintId=="0"){
      KanbanManageStore.getKanbanRecentlyByProjectId(1).then(
        data => {
          if (data) {
            this.setState({kanbans: data});
          }
          else message.error("获取失败");
        }
      );
    }
    else {
      this.kanbansBySprintId(sprintId);
    }


  }
//
  kanbansBySprintId(sprintId){

    KanbanManageStore.getKanbansBySprintId(sprintId).then(
      data => {
        if (data) {
          this.setState({kanbans: data});
        }
        else message.error("获取失败");
      }
    );
    SprintStore.getSprintById(sprintId).then(
      data => {
        if (data) {
          if(data.status=="doing")
            this.setState({createDisplay:true});
          else this.setState({createDisplay:false});
        }
        else message.error("获取失败");
      }
    );
  }

  getSprintByProjectId(){
    SprintStore.getSprintByProjectId(1).then(
      data => {
        if (data) {
          this.setState({sprints:data});
        }
        else message.error("获取失败");
      }
    );
  }
  create(kanbanName) {
    let data = {
      projectId: 1,
      sprintId: this.currentSprint,
      name:kanbanName
    };
    if(kanbanName){
      KanbanManageStore.kanbanCreate(data).then(data => {
        this.init(this.currentSprint);
        if (data) {
          message.success("添加成功");

        }
        else message.error("添加失败");

      });
    }
    else message.info("名称不能为空！");


  }

  //刷新界面
  loadIssues() {
    KanbanManageStore.getKanbansByProjectId(1).then(
      data => {
        if (data) {
          this.setState({kanbans: data});
          message.success("获取成功");
        }
        else message.error("获取失败");
      }
    );
  }

  KanbanInSprint(id){
    this.currentSprint=id;
    this.init(id);

  }

  //跳转界面
  toKanban(id) {
    this.linkToChange(`/kanbanFront/kanban/${id}`);

  }

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  }
  //添加模板，删除模板
  collect(kanban,event){
    event.stopPropagation();
    const kanban1={
      id:kanban.id,
      isCollected:!kanban.isCollected
    };
    KanbanManageStore.updateKanban(kanban1) .then(() => {
        this.init(this.currentSprint);
        message.success(kanban1.isCollected?"模板收藏成功":"模板取消成功");
      }
    ).catch(() => {
      message.error(kanban1.isCollected?"模板收藏失败":"模板取消失败");
    });

  }

  selectedInput(event){
    event.stopPropagation();

  }

  inputBlur(id,oldName,e){

    if(oldName==e.target.value)
      return;

    const kanban={
      id:id,
      name:e.target.value
    };
    KanbanManageStore.updateKanban(kanban) .then(() => {
        this.init(this.currentSprint);
        message.success("更新成功");
      }
    ).catch(() => {
      message.error("更新失败");
    });
  }

  inputKeyUp(id,oldName,e){
    if(e.keyCode==13){
      e.target.blur();
      this.inputBlur(id,e);
    }
  }

  //删除数据
  deleteKanban(id) {
    KanbanManageStore.deleteKanban(id)
      .then(() => {
          this.init(this.currentSprint);
          message.success("删除成功");
        }
      ).catch(() => {
      message.error("删除失败");
    });
  }

  //确认框
  showDeleteConfirm(id,event) {
    event.stopPropagation();
    confirm({
      title: '确定删除此看板?',
      content: '删除不可恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.deleteKanban(id);
      },
      onCancel() {
      },
    });
  }

  selectChange(data){
    if(data==''){
      this.setState({value:data,data:[],kanbans:[],createDisplay:false});
    }else {
      let temp =[];
      for(let i=0;i<this.state.kanbansInProject.length;i++){
        if(this.state.kanbansInProject[i].name.indexOf(data)>=0)
          temp.push(this.state.kanbansInProject[i]);
      }
      this.setState({value:data,data:temp,kanbans:temp,createDisplay:false});
    }

  }

  openRecently(){

    KanbanManageStore.getKanbanRecentlyByProjectId(1).then(
      data => {
        if (data) {
          this.currentSprint=0;
          this.setState({createDisplay:false});
          this.setState({kanbans: data});
        }
        else message.error("获取失败");
      }
    );
  }
  divClick(){
    this.props.form.setFieldsValue({div:1});
  }

  templateClick(){
    this.currentSprint=-2;
  }

  hiddenDisplay(id,e){
    e.stopPropagation();
    this.setState({kanbanHiddenId:id});
  }


  render() {
    return (
      <div style={{height:'80vh'}}>
        const { getFieldDecorator } = this.props.form;
        <Modal title="新建看板" visible={this.state.visible}
               onOk={this.handleOk} onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleOk}>
            <p>使用模板</p>
            <div style={{width:'100%',height:200}}>
              <FormItem>
                {getFieldDecorator('div', {
                })(
                  <div onClick={this.divClick.bind(this)} >aaaaaa</div>
                )}
              </FormItem>

            </div>
            <hr style={{margin:10}}/>
            <FormItem>
              {getFieldDecorator('kanbanName', {
                rules: [{ required: true, message: '请输入看板名称!' }],
              })(
                <p>看板名称<Input/></p>
              )}
            </FormItem>

          </Form>
        </Modal>
        <PageHeader title="看板管理">
          <Button className="header-btn"
            ghost={true}
            style={PageHeadStyle.leftBtn} icon="plus-circle-o">
              添加看板
          </Button>
        </PageHeader>
        <Tabs defaultActiveKey="1">
          <TabPane tab="所有看板" key="1">
            <div>
              <PageHeader>
                <Search
                  placeholder="根据迭代名称查询"
                  style={{width: 200, marginTop: '10px', height: '20px', transform: ' scale(0.9)', disable: 'inline-block'}}
                  onSearch={value => console.log(value)}
                  className="searchStyle"
                />
              </PageHeader>
              <div className="all-kanban">
                <AllKanban blockOrList="block" kanbanArray={this.state.kanbans}/>
              </div>
              <div className="archived-kanban">

              </div>
              /****************************/
              {/*<div style={{ width:'80%',padding: 30,height:'100%',float:'left',*/}
                {/*borderLeft:'1px solid #e9e9e9' }}>*/}
                {/*{kanbanList}*/}
                {/*<Card  style={{ width: 142,height:187,paddingBottom:"10px",float:'left',*/}
                  {/*marginLeft:20,marginBottom:20,boxShadow: '1px 1px 0 1px #dedede',*/}
                  {/*//display:'flex',*/}
                  {/*display:this.state.createDisplay?'flex':'none',*/}
                  {/*cursor:'pointer'}}  onClick={this.showModal} >*/}
                  {/*<Icon type="plus" style={{marginLeft:'23%',marginTop:'23%',fontSize:67,color:'#3b78e7'}} />*/}
                  {/*<p style={{textAlign:'right',marginTop:'73%'}}>添加看板</p>*/}
                {/*</Card>*/}
              {/*</div>*/}
            </div>
          </TabPane>
          <TabPane tab="看板模板" key="2">Content of Tab Pane 2</TabPane>
        </Tabs>

      </div>
    );
  }
}
export default withRouter(Form.create({})(KanbanManage));
