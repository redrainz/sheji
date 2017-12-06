/**
 * Created by knight on 2017/10/23.
 * 每个Epic下的feature信息
 */
/*eslint-disable*/
import { Card, Icon, message } from 'antd';
import React, { Component } from 'react';
import FeatureCard from "./FeatureCard";
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import { observer } from 'mobx-react';

@observer
class FeatureList extends Component {
  constructor(props) {
    super(props);
    this.addFeature = this.addFeature.bind(this);
    this.initFeature = this.initFeature.bind(this);
    this.state = {
      id:this.props.parentId,
      data: this.props.data,
      lists:[],
    }
  }
  componentDidMount() {
    this.initFeature(this.state.data);
  }
  componentWillReceiveProps(nextProps){
    this.initFeature(nextProps.data);
  }
  initFeature(data) {
    let Arr=[];
    if(data) {
      for (let item of data) {
        Arr.push(
          <FeatureCard id={item.id} parentId={item.parentId} description={item.description} key={item.id}
                       storyMapSequence={item.storyMapSequence} initFeatureCard={this.props.initFeatureList}
                       addFeature={this.addFeature}/>)
      }}
    this.setState({
      lists: Arr,
    });
  }
  addFeature(e) {
    let storyMapSequence=0;
    let parentId=this.state.id;
    let id=e.target.id;
    let list=this.state.lists;
      for(let n=0;n<list.length;n++) {
        if (list[n].id == id) {
          if (list[n + 1]) {
            storyMapSequence = (list[n].storyMapSequence
              + list[n + 1].storyMapSequence) / 2;
          }
          else {
            storyMapSequence = list[n].storyMapSequence + 1;
          }
      }
    }
    let values={
      issueType:'Feature',
      description:'',
      projectId:1,
      parentId:parentId,
      storyMapSequence:storyMapSequence,
    };
    UserStoryStore.createIssue(values).then(data => {
      if (data) {
        this.props.initFeatureList();
        let cardArr=this.state.lists;
        if(cardArr.length == 0)
          cardArr.push(
            <FeatureCard
             id={data.id} description={data.description} key={data.id} parentId={data.parentId}
             storyMapSequence={data.storyMapSequence}
             autoFocus={true} initFeatureCard={this.props.initFeatureList} addFeature={this.addFeature}/>)
        else for(let i=0;i<cardArr.length;i++) {
          if (cardArr[i].key == id)
            cardArr.splice(++i, 0,
              <FeatureCard
                id={data.id} description={data.description} key={data.id} parentId={data.parentId}
                storyMapSequence={data.storyMapSequence}
                autoFocus={true} initFeatureCard={this.props.initFeatureList}addFeature={this.addFeature}/>)
        }
        this.setState({
          lists: cardArr,
        });
      }}).catch (error => {
      message.error("创建失败");
    });
  }
  render() {
    return (<div>
        {this.state.lists.length? this.state.lists:
          <div style={{marginTop:3,marginLeft:3,marginRight:3}} >
            <Card  style={{width: 130, height:80 , backgroundColor:'#ffffff',cursor:'pointer'}} bodyStyle={{ padding: 0,}}>
              <a onClick={this.addFeature}>添加一个feature</a>
            </Card>
          </div>}
      </div>
    )
  }
}
export default FeatureList;
