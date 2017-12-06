/**
 * Created by Yu Zhang on 2017/9/6.
 */
/*eslint-disable*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {
  Layout, Menu, Button, Icon, Modal, Form, Input, Row, Col, Card, message, Popover, Tree, Select,
  Progress
} from 'antd';
import {NavLink, withRouter} from 'react-router-dom';
import Routes from '../../../common/RouteMap';
import PageHeader, {PageHeadStyle} from "../../../components/common/PageHeader";
import KanbanManageStore from '../../../stores/origanization/managePage/KanbanManageStore';
import SprintStore from '../../../stores/origanization/sprint/SprintStore';
import '../../../assets/css/acss.css';
import '../../../assets/css/kanban-manage.css';
import '../../../assets/font-awesome/css/font-awesome.min.css';
import FontAwesome from 'react-fontawesome';
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
    const options = this.state.data.map(data => <Option key={data.name}>{data.name}</Option>);
    const kanbanList = kanbans.map((kanban, index) =>
     // <div key={kanban.id}  {...cardStyle} onClick={this.toKanban.bind(this,kanban.id)}>
        <Card   key={kanban.id} style={{ width: 142,height:187,paddingBottom:"10px",float:'left',
          marginLeft:20,marginBottom:20,boxShadow: '1px 1px 0 1px #dedede',cursor:'pointer'}}
               bodyStyle={{ padding: "8px"}} className="kanbanCard" onClick={this.toKanban.bind(this,kanban.id)}>
          <Icon type="delete" className="deleteIcon"
          onClick={this.showDeleteConfirm.bind(this,kanban.id)}/>
       {/*   {
            this.state.showMenuId==kanban.id
            ?
              <div style={{ position:'absolute',top:'17%',right:'1%',border:'1px solid'}}>
                <p style={{borderBottom:'1px solid',textAlign:'center'}} onClick={(e)=>{e.stopPropagation()}}>重命名</p>
                <p onClick={this.showDeleteConfirm.bind(this,kanban.id)} style={{textAlign:'center'}}>删除</p>
              </div>
            :<div/>
          }*/}
          <div className="custom-image" >
            < img src={kanbanIcon} key={kanban.id} style={{width:"95%"}}/>
          </div>

         {/* <div className="custom-card">
            <div id={kanban.id}>{kanban.name}</div>
          </div>*/}
          {
            kanban.name.length>10?
              <Popover placement="rightTop"
                       content={<p style={{
                         width: 160, display: 'block',
                         fontSize: 14, wordBreak: 'break-all', wordWrap: 'break-word',

                       }}>{kanban.name}</p>}>
                <input style={{ width:'100%',border:'none'}}

                       onClick={this.selectedInput.bind(this)} defaultValue={kanban.name}
                       onBlur={this.inputBlur.bind(this,kanban.id,kanban.name)}
                       onKeyUp={this.inputKeyUp.bind(this,kanban.id,kanban.name)} />
              </Popover>
              :
              <input style={{border:'none', width:'100%'}}
                     onClick={this.selectedInput.bind(this)} defaultValue={kanban.name}
                     onBlur={this.inputBlur.bind(this,kanban.id,kanban.name)}
                     onKeyUp={this.inputKeyUp.bind(this,kanban.id,kanban.name)} />
          }
        </Card>

    );
      const aNode=this.state.sprints.map(sprint =><div style={{textIndent:'8%',width:'97%'}}>
      <a key={sprint.id} style={{fontSize:12,color:this.currentSprint==sprint.id?'#ff4081':'#82a6f2'}}
         onClick={this.KanbanInSprint.bind(this,sprint.id)}>
        {sprint.status=="doing"? <FontAwesome name="unlock" size="1x" style={{marginRight:15}}/>:
          <FontAwesome name="lock" size="1x" style={{marginRight:15}}/>}<span style={{margin:15}}>{sprint.name}</span></a>

       {/* <div style={{flex:'1',visibility:'hidden'}}></div>
        <span style={{fontSize:12,color:'#bcbcbc',float:'right'}}>({sprint.status=="doing"?"已开启":"已关闭"})</span>*/}   <br/>
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
        <PageHeader title="看板管理"></PageHeader>
        <div style={{width:'20%',height:'100%',float:'left',textAlign:'left'}} >
          <Select
            combobox
            value={this.state.value}
            placeholder='通过名称寻找看板'
            notFoundContent="没找到"
            style={{width:'80%',margin:10}}
            defaultActiveFirstOption={false}
            filterOption={false}
            onChange={this.selectChange.bind(this)}
            onFocus={()=>{this.currentSprint=-1;this.setState({data:[],kanbans:[],createDisplay:false});}}
          >
            {options}
          </Select>
          <br/>
          <div style={{borderBottom:'1px solid #e9e9e9',paddingBottom:6}}>
            <a style={{margin:10,color:this.currentSprint==0?'#ff4081':'#82a6f2'}} onClick={this.openRecently.bind(this)}><FontAwesome name="clock-o" size="1x" style={{marginRight:6}}/>最近打开的看板</a>
          </div>

          <p style={{margin:10}}>迭代看板</p>

          <div style={{borderBottom:'1px solid #e9e9e9',paddingBottom:6}}>
            {aNode}
          </div>
          <p style={{marginTop:10}}>
            <a style={{margin:10,color:this.currentSprint==-2?'#ff4081':'#82a6f2'}} onClick={this.templateClick.bind(this)}>
              <FontAwesome name="heart-o" size="1x" style={{marginRight:6}}/>看板模板</a>
          </p>
        </div>

        <div style={{ width:'80%',padding: 30,height:'100%',float:'left',
          borderLeft:'1px solid #e9e9e9' }}>
          {kanbanList}
          <Card  style={{ width: 142,height:187,paddingBottom:"10px",float:'left',
            marginLeft:20,marginBottom:20,boxShadow: '1px 1px 0 1px #dedede',
           //display:'flex',
            display:this.state.createDisplay?'flex':'none',
            cursor:'pointer'}}  onClick={this.showModal} >
            <Icon type="plus" style={{marginLeft:'23%',marginTop:'23%',fontSize:67,color:'#3b78e7'}} />
            <p style={{textAlign:'right',marginTop:'73%'}}>添加看板</p>
          </Card>
        </div>
      </div>
    );
  }
}
export default withRouter(Form.create({})(KanbanManage));
