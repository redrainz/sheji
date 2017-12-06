/**
 * Created by Yu Zhang on 2017/9/6.
 */
/*eslint-disable*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {
  Layout, Menu, Button, Icon, Modal, Form, Input, Row, Col, Card, message, Popover, Tree, Select,
  Progress,Dropdown
} from 'antd';
import {NavLink, withRouter} from 'react-router-dom';
import Routes from '../../../common/RouteMap';
import PageHeader, {PageHeadStyle} from "../../../components/common/PageHeader";
import KanbanManageStore from '../../../stores/origanization/managePage/KanbanManageStore';
import SprintStore from '../../../stores/origanization/sprint/SprintStore';
import '../../../assets/css/acss.css';
import '../../../assets/font-awesome/css/font-awesome.min.css';
import FontAwesome from 'react-fontawesome';
const {TextArea} = Input;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;

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
      kanbanHiddenId:0
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
    // 选择下来菜单的迭代
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a>第一次迭代</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a>第二次迭代</a>
        </Menu.Item>
        <Menu.Item key="3">
          <a>第三次迭代</a>
        </Menu.Item>
      </Menu>
    );

    //获取的看板数据
    let kanbans = this.state.kanbans;
    //卡片样式
    const cardStyle = {
      style: {
        margin: 10,
        width: '30%',
        height:106,
        float:'left',
        borderRadius: '10px',
        backgroundColor:'#82a6f2',
        position:'relative',
        cursor: 'pointer'
      }
    }
    const kanbanList = kanbans.map((kanban, index) =>
      <div key={kanban.id}  {...cardStyle} onClick={this.toKanban.bind(this,kanban.id)}>

        {
          kanban.name.length>10?
            <Popover placement="rightTop"
                     content={<p style={{
                       width: 160, display: 'block',
                       fontSize: 14, wordBreak: 'break-all', wordWrap: 'break-word',

                     }}>{kanban.name}</p>}>
              <input style={{margin:20,fontSize:18,backgroundColor:'#82a6f2',border:'none',color:'white',max:10,
                position:'absolute',top:'19%',width:'80%'}}
                     onClick={this.selectedInput.bind(this)} defaultValue={kanban.name}
                     onBlur={this.inputBlur.bind(this,kanban.id,kanban.name)}
                     onKeyUp={this.inputKeyUp.bind(this,kanban.id,kanban.name)} />
            </Popover>
            :
            <input style={{margin:20,fontSize:18,backgroundColor:'#82a6f2',border:'none',color:'white',max:10,
              position:'absolute',top:'19%',width:'80%'}}
                   onClick={this.selectedInput.bind(this)} defaultValue={kanban.name}
                   onBlur={this.inputBlur.bind(this,kanban.id,kanban.name)}
                   onKeyUp={this.inputKeyUp.bind(this,kanban.id,kanban.name)} />
        }

        <Icon type={kanban.isCollected?"heart":"heart-o"}
              style={{fontSize: 15, color: 'white', cursor: 'pointer', position:'absolute',top:'10%',right:'5%'}}
              onClick={this.collect.bind(this,kanban)}/>
        <Icon type="delete"
              style={{fontSize: 15, color: 'white', position:'absolute',bottom:'10%',right:'5%', cursor: 'pointer'}}
              onClick={this.showDeleteConfirm.bind(this, kanban.id)}/>
        {/* <Icon type="reorder"
         style={{fontSize: 15, color: 'white', position:'absolute',bottom:'10%',left:'5%', cursor: 'pointer'}}
         onClick={this.hiddenDisplay.bind(this,kanban.id)}
         />*/}
        <FontAwesome name="bar-chart"
                     style={{fontSize: 14,marginRight:6, color: 'white', position:'absolute',
                       bottom:'10%',left:'5%', cursor: 'pointer', zIndex:2}}
                     onMouseOver={this.hiddenDisplay.bind(this,kanban.id)}
                     onMouseOut={()=>{this.setState({kanbanHiddenId:0})}}/>
        <div style={{ width:'100%',height:'100%',borderRadius: '10px',
          backgroundColor:'black',zIndex:1,position:'absolute',opacity:0.7,
          cursor:'default',
          display:this.state.kanbanHiddenId==kanban.id?"inline":"none"}}
             onClick={(e)=>{e.stopPropagation();}}
        >
          <Progress percent={30} style={{ width:'65%',margin:'8px 58px 0px', color:'white'  }}/>
          <center>
            <p style={{color:'white', fontSize:14}}>Story:(20/20)</p>
            <p style={{color:'white', fontSize:14}}>Task:(20/20)</p>
            <p style={{color:'white', fontSize:14}}>Bug:(20/20)</p>
          </center>
        </div>

      </div>
    );
    const aNode=this.state.sprints.map(sprint =><div style={{textIndent:35,width:'97%'}}>
      <a key={sprint.id} style={{fontSize:14,color:this.currentSprint==sprint.id?'red':'#3b78e7'}} onClick={this.KanbanInSprint.bind(this,sprint.id)}>{sprint.name}</a>
      <span style={{color:'#bcbcbc',float:'right'}}>({sprint.status=="doing"?"已开启":"已关闭"})</span>   <br/>
    </div>);
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{height:'80vh'}}>

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
        <div style={{width:'13%',height:'48rem',float:'left',textAlign:'left',border:'2px solid #333744'}} >
          <div style={{borderBottom:'1px solid #e9e9e9',paddingBottom:6,backgroundColor:'#333744',height:'50px',
            textAlign:'center',lineHeight:'40px'}}>
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link">
                <span style={{fontSize:'25px',color:'#fdfef2',marginRight:'20px',textAlign:'center'}}>
                  第一迭代</span>
                <Icon type="down" style={{color:'#fdfef2',fontSize:'25px'}}/>
              </a>
            </Dropdown>
          </div>
          <div style={{color:'#878f95',textAlign:'center'}}>{`2017/11/8-2017/11/10`}</div>
          <div style={{borderBottom:'1px solid #e9e9e9',paddingBottom:6,marginTop:'20px'}}>
            <Progress style={{display: 'list-item',textAlign:'center'}} type="circle" percent={75} />
          </div>
          <div style={{marginTop:'100px',textAlign:'left'}}>
            <li style={{listStyleType:'none',borderBottom:'1px dashed #111',height:"35px"}}>
              <span style={{marginLeft:"30px",fontSize:'20px'}}>Story</span> : <span>10/20</span> </li>
            <li style={{listStyleType:'none',borderBottom:'1px dashed #111',height:"35px"}}>
              <span style={{marginLeft:"30px", fontSize:'20px'}}>Task</span> : <span>10/20</span> </li>
            <li style={{listStyleType:'none',borderBottom:'1px dashed #111',height:"35px"}}>
              <span style={{marginLeft:"30px",fontSize:'20px'}}>BUG</span> : <span>10/20</span> </li>
          </div>
        </div>

        <div style={{ width:'80%',padding: 30,height:'100%',float:'left',
          borderLeft:'1px solid #e9e9e9' }}>
          <PageHeader title="看板管理"/>
          {kanbanList}
          <div style= {{
            margin: 10,
            width: '30%',
            height:106,
            float:'left',
            display:this.state.createDisplay?'flex':'none',
            borderRadius: '10px',
            backgroundColor:'#becf44',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}  onClick={this.showModal} >
            <Icon type="plus" style={{margin:20,fontSize:70,color:'white'}} />
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Form.create({})(KanbanManage));
