/**
 * Created by chenzl on 2017/11/13.
 * Feature:Issue 显示迭代
 */
/*eslint-disable*/
import React,{Component} from 'react';
import SprintStore from '../../stores/origanization/sprint/SprintStore'
import {observer} from 'mobx-react';

@observer
class IssueSprint extends Component{
  constructor(props){
    super(props);
    this.state={
      sprintArr:'',
    }
  }
  componentDidMount(){
    this.getSprintName();
  }
  getSprintName=()=>{
    const id=this.props.text;
    if(id!=null){
      SprintStore.getSprintById(id).then((data)=>{
        this.setState({
          sprintArr:data.name
        })
      });
    }else {
      this.setState({
        sprintArr:'未分配'
      });
    }
  }
  render(){
   return(
     <div>
       {this.state.sprintArr}
     </div>
   );
  }
}
export default IssueSprint;
