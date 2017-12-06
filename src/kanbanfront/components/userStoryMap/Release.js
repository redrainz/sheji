/**
 * Created by knight on 2017/9/20.
 * Release
 */

/*eslint-disable*/
import { Collapse,Menu,Dropdown,message,Card,Icon,Input} from 'antd';
import React,{Component} from 'react';
import {observer} from 'mobx-react';
import '../../assets/font-awesome/css/font-awesome.min.css';
import FontAwesome from 'react-fontawesome';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import UserStoryList from './UserStoryList';
import AddSprintModal from './AddSprintModal';

@observer
class Release extends Component {

  constructor(props) {
    super(props);
    this.initRelease = this.initRelease.bind(this);
    this.pressEnter = this.pressEnter.bind(this);
    this.deleteRelease = this.deleteRelease.bind(this);
    this.updateName = this.updateName.bind(this);
    this.edit = this.edit.bind(this);
    this.addSprint = this.addSprint.bind(this);
    this.changeShow = this.changeShow.bind(this);
    this.state = {
      id:this.props.id,
      Lists:[],
      name:this.props.name,
      parentList:this.props.parentList,
      userStoryData:this.props.data,
      iconType:"angle-down",
      editDisplay:this.props.editDisplay,
      labelDisplay:this.props.labelDisplay,
      sprintState:true,
      modalVisible:false,
    }
  }

  componentWillMount(){
    UserStoryStore.setShadowDisplay('none');
    this.initRelease(this.state.userStoryData,this.state.parentList);
  }
  componentDidMount(){
    this.myText.focus();
    for(let i=0;i<document.getElementsByClassName("releaseName").length;i++) {
      console.log(document.getElementsByClassName("releaseName")[i])
      console.log(document.getElementsByClassName("releaseName")[i].getBoundingClientRect())
      document.getElementsByClassName("releaseName")[i].style.left = document.getElementsByClassName("releaseName")[i].getBoundingClientRect().x + "px";
      document.getElementsByClassName("releaseName")[i].style.top = document.getElementsByClassName("releaseName")[i].getBoundingClientRect().y + "px";
      document.getElementsByClassName("releaseName")[i].style.position="fixed" ;
    }
    document.getElementById("userStoryMap").style.paddingLeft = document.getElementById("mapMenu").getBoundingClientRect().width+5+ "px";
  }

  componentWillReceiveProps(nextProps){
    this.initRelease(nextProps.data,nextProps.parentList);
  }

  componentDidUpdate(){
    this.myText.focus();
    console.log(this.myText)
    // this.myText.select();
  }

  initRelease(Data,parentList) {
  const list = [];
    let num=0;
    for(let count=0;count<parentList.length;count++) {
      if(parentList[count]!=0){
      list.push(
        <UserStoryList releasePlanId={this.state.id} id={parentList[count]} data={Data[num]}
                       parentId={parentList[count]} key={parentList[count]}
                       initRelease={this.props.initReleaseList}/>)
        num++;
      }
      else{list.push(
        <div id="container" style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <div style={{marginLeft:3,marginRight:3,marginTop:3,}} >
          <Card bordered={false} noHovering={true} style={{width: 130, height:80 , backgroundColor:'#ffffff'}}
                bodyStyle={{ padding: 0,}}>
          </Card>
        </div>
        </div>)
      }
    }
    this.setState({
      Lists: list,
    });
}

  edit(){
    let  editDisplay="block";
    let  labelDisplay="none";
    this.setState({
      editDisplay:editDisplay,
      labelDisplay:labelDisplay,
    });
  }
  resetModal=()=>{
    this.setState({modalVisible:false})
  }
  addSprint=()=>{
    if(this.state.id==UserStoryStore.getCurrentRelease||UserStoryStore.getCurrentRelease==0) {
      UserStoryStore.setShadowDisplay('block');
      let list = [];
      UserStoryStore.setIssueIdArr(list);
      UserStoryStore.setCurrentRelease(this.state.id);
      this.setState({
        sprintState: false,
        modalVisible: false,
      });
    }
    else
      message.success("请先退出当前迭代选择")
  }
  cancelSprint=()=>{
    UserStoryStore.setShadowDisplay('none');
    UserStoryStore.setCurrentRelease('0');
    this.setState({
      sprintState:true,
      modalVisible:false,
    });
  }
  createSprint=()=>{
  UserStoryStore.setShadowDisplay('none');
  UserStoryStore.setCurrentRelease('0');
  this.setState({
    sprintState:true,
    modalVisible:true,
  });
  }
  publicRelease(e){
    message.success("调用发布Release");
    e.stopPropagation();
  }
  deleteRelease(e) {
    this.props.deleteRelease(this.state.id);
  }
  updateName(e) {
    const id = e.target.id;
    let name = e.target.value;
    this.setState({
      editDisplay:"none",
      labelDisplay:"block",
      name:name,
    })
    UserStoryStore.updateReleasePlanName(id,name).then(returnData => {
      /*如果有返回数据，则判断卡片描述信息是否发生变化*/
      if(returnData){
        if(name!=this.props.name) {
          /*如果发生变化则提示更新成功*/
          message.success('更新成功', 1.5);
        }
      }else{/*更新失败则提示卡片不存在*/
        message.error('改名失败',1,);
        this.props.initReleaseList();
      }
    });
  }
  pressEnter() {
    this.setState({
      editDisplay:"none",
      labelDisplay:"inline-block",
    })
  }
  changeShow(){
    let iconType="angle-right";
    if(this.state.iconType=="angle-right"){
      iconType="angle-down";}
      this.setState({
        iconType:iconType,
      })
    }
  render(){
    return (
      <div className="release">
        <div className="releaseName">
          {/*<div style={{display:'block',}}>*/}
          {/*<FontAwesome onClick={this.edit} name="pencil-square-o" style={{fontSize:"14px",color:"#8489ff",display:'block'}}></FontAwesome>*/}
          {/*<FontAwesome onClick={this.deleteRelease} name="trash" style={{fontSize:"14px",color:"#8489ff",display:'block'}}></FontAwesome>*/}
          {/*</div>*/}
            <p style={{display:this.state.labelDisplay,paddingLeft:5,fontSize:12,cursor:'pointer',}}>
              {this.state.name?this.state.name:'未命名发布'}</p>
            <Input  style={{display:this.state.editDisplay,paddingLeft:5,backgroundColor:'#ffffff',
              color:'#8489ff',fontSize:12,width:'130px',}}
                    id={this.state.id} defaultValue={this.state.name}
                    placeholder="请输入发布名称" ref={(input) => { this.myText = input; }}
                    onBlur={this.updateName} onPressEnter={this.pressEnter} />
          </div>
        <div style={{whiteSpace:'nowrap',display:'inline-block',borderBottom:'0.5px dotted',minHeight:164}}>
          {this.state.Lists}
        </div>
        <AddSprintModal modalVisible={this.state.modalVisible} releasePlanId={this.state.id} resetModal={this.resetModal}/>
      </div>
    )}
}
export default Release;

