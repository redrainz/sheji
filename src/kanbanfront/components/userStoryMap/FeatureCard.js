/**
 * Created by knight on 2017/9/7.
 * Feature:展现Feature的信息
 */
/*eslint-disable*/
import { Popover, Card, Icon,message} from 'antd';
import React,{Component} from 'react';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';

const textStyle = {
  width:'100%',
  height:64,
  border:'hidden',
  outline: 'none',
  resize:'none',
  rows:4,
  overflow:'hidden',
  backgroundColor:'#61bba1',
  fontSize:14,
  lineHeight:'16px',
};
const cardStyle = {
  width: 130,
  height:80 ,
  backgroundColor:'#61bba1'
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
class FeatureCard extends Component {
  constructor(props) {
    super(props);
    this.upData = this.upData.bind(this);
    this.addFeature = this.addFeature.bind(this);
    this.edit = this.edit.bind(this);
    this.delete=this.delete.bind(this);
    this.state = {
      id:this.props.id,
      cardDescription:this.props.description,
      parentId:this.props.parentId,
      autoFocus:this.props.autoFocus,
      disabled:true,
      storyMapSequence:this.props.storyMapSequence,
    }
  }
  delete (e) {
    const id = e.target.id;
    UserStoryStore.deleteIssueById(id).then(data => {
        message.success("删除成功");
        this.props.initFeatureCard();
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
        message.error('该卡片不存在',1);
      }
      this.props.initFeatureCard();
    });
    this.setState({
      cardDescription:description,
      disabled:false,
    });
  }
  edit(e){
    e.preventDefault();
    e.stopPropagation();
    alert(1);
    this.setState({
      disabled: false,
    });
  }
  addFeature(e){
    this.props.addFeature(e);
  }
  render(){
    return (
      <div   style={{display:'inline-block',verticalAlign: top,
        marginTop:3,marginLeft:3,marginRight:3}}>
        <Card  style={cardStyle}  bodyStyle={{ padding: 0,}} >
          {this.state.disabled
            ? <div style={cardBody}>
              <div className="featureCard">
              <Popover content={<div style={popoverStyle}>
                {this.state.cardDescription}</div>} placement="top" bodyStyle={{ padding: 0,}}>
            <textarea type="text" disabled={false}  style={textStyle} id={this.props.id}
                      autoFocus={this.state.autoFocus} placeholder="请输入Feature描述"
                      onBlur={this.upData} defaultValue={this.state.cardDescription}></textarea>
              </Popover>
            </div>
              <div className="iconStyle">
              <Icon id={this.props.id} type="right"  style={{float:'right',fontSize:18,color:'#ffffff',cursor:'pointer'}}
                    onClick={this.addFeature}/>
              <Icon  style={{float:'right',fontSize:18,color:'#ffffff',paddingLeft:5, paddingRight: 5,cursor:'pointer'}}
                     id={this.props.id} type="delete" onClick={this.delete}/>
            </div>
              </div>
            : <div style={{  width: 130, height:80 , backgroundColor:'#61bba1',zIndex:3}}>
              <div className="featureCard">
              <textarea type="text" disabled={false}  style={textStyle} id={this.props.id}
                        autoFocus={this.state.autoFocus} placeholder="请输入Feature描述"
                        onBlur={this.upData} defaultValue={this.state.cardDescription}></textarea></div></div>}
        </Card>
      </div>
    )}
}
export default FeatureCard;
