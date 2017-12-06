/**
 * Created by knight on 2017/9/7.
 * Feature:展现Epic卡
 */
/*eslint-disable*/
import { Popover, Card, Icon,message} from 'antd';
import React,{Component} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import '../../assets/css/userStoryMap-card.css';
import FeatureList from "./FeatureList";

const textStyle = {
  width:'100%',
  height:48,
  border:'hidden',
  resize: 'none',
  outline: 'none',
  rows:4,
  overflow:'hidden',
  backgroundColor:'#bbb4d6',
  fontSize:14,
  lineHeight:'16px',
};
const cardStyle = {
  width: 130,
  height:80 ,
  backgroundColor:'#bbb4d6'
};
const cardBody={
  height:80,
  display:'block',
  position:'relative'};
const popoverStyle={
  width: 100,
  display:'block',
  fontSize:14,
  wordBreak: 'break-all',
  wordWrap: 'break-word'};
const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'blue' : 'red',

  // styles we need to apply on draggables
  ...draggableStyle,
});
// const iconStyle={
//   height:25,
//   width:130,
//   display:'block',
//   position:'absolute',
//   left:0,bottom:0,
//   paddingRight:8,paddingLeft:8 ,paddingTop:4};
class EpicCard extends Component {
  constructor(props) {
    super(props);
    this.upData = this.upData.bind(this);
    this.edit = this.edit.bind(this);
    this.addEpic = this.addEpic.bind(this);
    this.delete = this.delete.bind(this);
    this.state = {
      id: this.props.id,
      cardDescription: this.props.description,
      featureData: this.props.featureData,
      disabled: true,
      autoFocus: this.props.autoFocus,
      storyMapSequence: this.props.storyMapSequence,
      epicDrag:this.props.epicDrag,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      featureData: nextProps.featureData,
      epicDrag:nextProps.epicDrag,
    });
  }

  delete(e) {
    this.props.deleteEpic(this.state.id);
  };

  addEpic(e) {
    this.props.addEpic(e);
  }

  upData(e) {
    console.log(1)
    const id = e.target.id;
    const description = e.target.value;
    UserStoryStore.updateDescription(id, description).then(returnData => {
      /*如果有返回数据，则判断卡片描述信息是否发生变化*/
      if (returnData) {
        /*如果发生变化则提示更新成功*/
        if (description != this.props.description) {
          message.success('更新成功', 1.5);
        }
      } else {/*更新失败则提示卡片不存在*/
        message.error('该卡片不存在', 1,);
      }
    });
    this.setState({
      cardDescription: description,
      disabled: true,
    });
  }

  edit(e) {
    e.stopPropagation();
    this.setState({
      disabled: false,
    });
  }

  onDragEnd = () => {
    message.success("hello")
  }

  render() {
    return (
      <div style={{position:'relative',display: 'inline-block', verticalAlign: 'top'}}>
                  <div className="epicCard" >
                      {this.state.disabled
                        ? <Card style={cardStyle} bodyStyle={{padding: 0,}}>
                          <div className="epicCard">
                            <div onMouseDown={this.edit}style={{height: 64, display: 'block', padding: 5}}>
                              <Popover content={<div style={popoverStyle}>
                                {this.state.cardDescription}</div>} placement="top" bodyStyle={{padding: 0,}}>
                              <textarea type="text" style={textStyle} defaultValue={this.state.cardDescription}
                              disabled={this.state.disabled} id={this.props.id} placeholder="请输入Epic描述"
                              autoFocus={this.state.autoFocus} onBlur={this.upData} >
                              </textarea>
                              </Popover>
                            </div>
                          </div>
                          <div className="iconStyle">
                            <Icon id={this.props.id} type="right"
                                  style={{float: 'right', fontSize: 18, color: '#ffffff', cursor: 'pointer'}}
                                  onClick={this.addEpic}/>
                            <Icon id={this.props.id} type="delete" style={{
                              float: 'right', fontSize: 18, color: '#ffffff', paddingLeft: 5,
                              paddingRight: 5, cursor: 'pointer'
                            }} onClick={this.delete}/>
                          </div>
                        </Card>
                        : <Card style={cardStyle} bodyStyle={{padding: 0,}}>
                          <div className="epicCard">
                            <div  style={{height: 64, display: 'block', padding: 5}}>
                            <textarea type="text" style={textStyle} defaultValue={this.state.cardDescription}
                            disabled={this.state.disabled} id={this.props.id} placeholder="请输入Epic描述"
                            autoFocus={this.state.autoFocus} onBlur={this.upData} onMouseDown={this.edit}>
                            </textarea>
                            </div>
                          </div>
                        </Card>}
                    </div>
                  <FeatureList initFeatureList={this.props.initEpicCard} data={this.state.featureData}
                               parentId={this.state.id}/>
        </div>
  )}
}
export default EpicCard;

