/**
 * Created by knight on 2017/9/7.
 * Feature:展示Epic下的Story卡
 */
/*eslint-disable*/
import { Card,Icon,message } from 'antd';
import React, {Component} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EpicCard from "./EpicCard";
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import {observer} from 'mobx-react';


const show = {
  whiteSpace:'nowrap',
  display:'block',
  position:'fixed',
  left:UserStoryStore.getMenuWidth,
  top:100,
};
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  for(let i=0;i<result.length;i++)
    UserStoryStore.updateStoryMapSequence(result[i].props.id,i);
  return result;
};

@observer
class EpicList extends Component {

  constructor(props) {
    super(props);
    this.addEpic = this.addEpic.bind(this);
    this.deleteEpic = this.deleteEpic.bind(this);
    // this.addFeature = this.addFeature.bind(this);
    this.initEpicCard = this.initEpicCard.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    let left=UserStoryStore.getMenuWidth;
    this.state = {
      lists: [],
      data:this.props.data,
      left:left
    }
  }
  componentDidMount(){
    this.initEpicCard(this.state.data);
    document.getElementById("mapMenu").style.left=document.getElementById("mapMenu").getBoundingClientRect().x+"px" ;
    document.getElementById("mapMenu").style.top=document.getElementById("mapMenu").getBoundingClientRect().y+"px" ;
    document.getElementById("container").style.left=document.getElementById("container").getBoundingClientRect().x+"px" ;
    document.getElementById("container").style.top=document.getElementById("container").getBoundingClientRect().y+"px" ;
    document.getElementById("container").style.position="fixed" ;
    document.getElementById("mapMenu").style.position="fixed" ;
    document.getElementById("userStoryMap").style.paddingTop = document.getElementById("mapMenu").getBoundingClientRect().height+5+ "px";
  }
  componentWillReceiveProps(nextProps){
    this.initEpicCard(nextProps.data);
}
  /*保持在最后一个card*/
  setDiv(){
    console.log(document.getElementById('container').scrollLeft);
    console.log(document.getElementById('container').scrollWidth);
    console.log(document.getElementById('container').clientWidth);
    document.getElementById('container').scrollLeft +=284;
    console.log(document.getElementById('container').scrollLeft);
    console.log(document.getElementById('container').scrollWidth);
    console.log(document.getElementById('container').clientWidth);
  }
  deleteEpic(id){
    UserStoryStore.deleteIssueById(id).then(data => {
      let lists=this.state.lists;
      for(let i=0;i<lists.length;i++) {
        if (lists[i].key == id)
          lists.splice(i, 1);}
      this.props.initUserStoryMap();
      message.success("删除成功");
      this.setState({
        releaseLists:lists,
      })
    });
  }
  initEpicCard(data) {
    const cardArr = [];
      let epicList = data['Epic'];
      let featureList = data['Feature'];
      for(let count=0;count<epicList.length;count++){
        let epic=epicList[count];
        cardArr.push(
         <EpicCard  id={epic.id} description={epic.description} key={epic.id} featureData={featureList[count] }
                    storyMapSequence={epic.storyMapSequence}autoFocus={false} initEpicCard={this.props.initUserStoryMap}
                    addEpic={this.addEpic} addFeature={this.addFeature} deleteEpic={this.deleteEpic}/> )
      }
      this.setState({
        lists: cardArr,
        left:UserStoryStore.getMenuWidth,
      });
  }
  addEpic(e) {
    let storyMapSequence=0;
    let id=e.target.id;
    for(let count=0;count<this.state.lists.length;count++){
    if(this.state.lists[count].key==e.target.id) {
      if(this.state.lists[count+1]) {
        storyMapSequence = (this.state.lists[count].props.storyMapSequence
          + this.state.lists[count + 1].props.storyMapSequence) / 2;
      }
      else {
        storyMapSequence=this.state.lists[count].props.storyMapSequence+1}
      }
    }
    let values={
      issueType:'Epic',
      description:'',
      projectId:1,
      storyMapSequence:storyMapSequence,
    };
    UserStoryStore.createIssue(values).then(data => {
      if (data) {
        this.props.initUserStoryMap();
        window.console.log('创建: ', data);
        let featureList=[];
        let cardArr=this.state.lists;
        if(cardArr.length == 0)
          cardArr.push(<EpicCard id={data.id} description={data.description} key={data.id} feature={featureList}
                        epicDrag={this.state.epicDrag}
                      storyMapSequence={data.storyMapSequence} autoFocus={true} initEpicCard={this.props.initUserStoryMap}
                      addEpic={this.addEpic}addFeature={this.addFeature} deleteEpic={this.deleteEpic}/>);
        else for(let i=0;i<cardArr.length;i++) {
          if (cardArr[i].key == id)
            cardArr.splice(++i, 0,
              <EpicCard id={data.id} description={data.description} key={data.id} feature={featureList}
                        storyMapSequence={data.storyMapSequence} autoFocus={true}
                        initEpicCard={this.props.initUserStoryMap} addEpic={this.addEpic}
                        addFeature={this.addFeature} deleteEpic={this.deleteEpic}/>);
        }
      this.setState({
        lists:cardArr,
      })
      }
    }).catch (error => {
      message.error("创建失败");
    });
  };
  onDragEnd(result) {
    // dropped outside the list
    console.log(result)
    UserStoryStore.setEpicDrag(0);
    if (!result.destination) {
      return;
    }
    const lists = reorder(
      this.state.lists,
      result.source.index,
      result.destination.index
    );
    this.props.initUserStoryMap();
    this.setState({
      lists:lists,
      epicDrag:'block'
    });
  }
  onDragStart(initial){
    console.log(this.state.lists[initial.source.index])
    UserStoryStore.setEpicDrag(this.state.lists[initial.source.index].key)
  }
  render() {
    const show = {
      whiteSpace:'nowrap',
      display:'block',
      zIndex:1,
      backgroundColor:'#ffffff',
      top:96,
      borderBottom:'0.5px dotted',
    };
    return (
          <div  style={show}>
            <div  id="mapMenu" style={{height:'170px',display:'inline-block',width:'100px',verticalAlign:'top',
              zIndex:1,backgroundColor:'#ffffff',whiteSpace:'nowrap',borderRight:'1px dotted'}}>
              <div style={{
                paddingTop:'20px',
                width:'50px',
                display:'block',
                height:"100px",}}>Epic</div>
              <div style={{
                paddingTop:'20px',
                width:'50px',
                display:'block',
                verticalAlign: 'top',
                height:"100px",}}>feature</div>
            </div>
            <div id="container"style={{display:'inline-block',verticalAlign:'top',}}>
            {this.state.lists.length
            ? this.state.lists
            : <div style={{display:'inline-block',verticalAlign: 'top'}}><Card  style={{width: 130, height:80 , backgroundColor:'#ffffff',cursor:'pointer'}}
                  bodyStyle={{ padding: 0,}}>
              <a onClick={this.addEpic}>添加一个Epic</a>
            </Card>
       </div>}
            </div>
          </div>
)}
}
export default EpicList;
