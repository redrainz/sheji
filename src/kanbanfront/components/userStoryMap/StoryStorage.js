/**
 * Created by knight on 2017/10/10.
 * 用户故事暂存区
 */
/*eslint-disable*/
import { Pagination, Button, Icon,message} from 'antd';
import StoryCard from "./StoryCard";
import React,{Component} from 'react';
import '../../assets/css/userStoryMap-card.css';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
const projectId=1;

class StoryStorage extends Component {
  constructor(props) {
    super(props);
    this.upData = this.upData.bind(this);
    this.delete=this.delete.bind(this);
    this.changeShow=this.changeShow.bind(this);
    this.state = {
      lists:[],
      buttonDisplay:"inline-block",
      storyDisplay:"none",
      currentPageNum:1,
      totalPages:0,
    }
  }
  componentDidMount(){
    this.initUserStoryStorage(this.state.currentPageNum);
  }
  initUserStoryStorage(n) {
    let m=4;
    UserStoryStore.tempUserStoryData(1,n,m).then(data => {
      let totalPages=data['totalPages']
      let list = [];
      let parentId=0;
      let releasePlanId=0;
      for (let item of data['content']) {
        list.push(
          <div  style={{marginTop:3,marginLeft:3,marginRight:3,width:130,display:'inline-block'}}>
          <StoryCard id={item.id} description={item.description} key={item.id}
                     parentId={parentId} releasePlanId={releasePlanId} delete={this.delete}
          />
          </div>)
      }
      this.setState({
      lists: list,
      currentPageNum:n,
      totalPages:totalPages,
      })
    })
  }
  pageUP=()=>{
    this.initUserStoryStorage(this.state.currentPageNum+1);
  }
  pageDown=()=>{
    this.initUserStoryStorage(this.state.currentPageNum-1);
  }
  delete (id) {
    UserStoryStore.deleteIssueById(id).then(data => {
      message.success("删除成功");
      this.initUserStoryStorage(this.state.currentPageNum);
    });
  };
  upData(e){
    const id = e.target.id;
    const description = e.target.value;
    UserStoryStore.updateDescription(id,description).then(returnData => {
      /*如果有返回数据，则判断卡片描述信息是否发生变化*/
      if(returnData){
        /*如果发生变化则提示更新成功*/
        if(description!=this.props.description){
          message.success('更新成功',1.5);
        }
      }else{/*更新失败则提示卡片不存在*/
        message.error('该卡片不存在',1,);
      }
    });
    this.setState({
      cardDescription:description,
    });
  }
  changeShow(){
    let storyDisplay="block"
    let buttonDisplay="none"
    if(this.state.storyDisplay=="block"){
      storyDisplay="none"
      buttonDisplay="inline-block"}
    this.setState({
      buttonDisplay:buttonDisplay,
      storyDisplay:storyDisplay,
    })
  }
  render() {
    return (
      <div >
        <div style={{display:this.state.buttonDisplay,padding:3,position:'fixed',bottom:10,right:5}}>
          <Button  onClick={this.changeShow}>
            <Icon type="plus-square" style={{paddingLeft: 8,cursor:'pointer', fontSize: 12,color:'#8489ff'}}
            />无发布计划的故事</Button></div>
        <div style={{display:this.state.storyDisplay,backgroundColor:'#ffffff',
          height:115,borderTop:'1px solid #D4D4D4',borderBottom:'1px solid #D4D4D4',}}>
          <div style={{display:'block',padding:3,height:30,width:'100%'}}>
            {/*<Pagination defaultCurrent={1}  defaultPageSize={2}/>;*/}
            <Button style={{float:'right',}} onClick={this.changeShow}>
              <Icon type="minus-square" style={{paddingLeft: 8,cursor:'pointer', fontSize: 12,color:'#8489ff'}}
              />无发布计划的故事</Button></div>
          <div style={{paddingLeft:'0%',position:'relative',}}>
            {this.state.currentPageNum>1?
            <div className="leftPageIcon" onClick={this.pageDown}><Icon type="left-square" /></div>:''}
            {this.state.currentPageNum<this.state.totalPages?
            <div className="rightPageIcon" onClick={this.pageUP}><Icon type="right-square" /></div> :''}
            <div>{this.state.lists}</div>
          </div>
        </div>
      </div>
    )
  }
}
export default StoryStorage;

