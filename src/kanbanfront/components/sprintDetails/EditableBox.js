/**
 * Created by Yu Zhang on 2017/10/11.
 */
/*eslint-disable*/
import { Table, Input, Popconfirm } from 'antd';
import React,{Component} from "react";
const statusSelect=[{name:"todo",value:"规划中"},{name:"doing",value:"进行时"},{name:"done",value:"已完成"}];
const statusP={todo:"规划中",doing:"进行时",done:"已完成"};
const prioritySelect=[{name:"low",value:"低"},{name:"mid",value:"中"},{name:"high",value:"高"},{name:"veryhigh",value:"非常高"}];
const priorityP={low:"低",mid:"中",high:"高",veryhigh:"非常高"};
const userSelect=[{name:"qmm",value:"qmm"},{name:"cz",value:"cz"},{name:"czz",value:"czz"}];
const userP={qmm:"qmm",cz:"cz",czz:"czz"};
class EditableBox extends Component {
  state = {
    editable:this.props.editable
  }

  blur(){
    this.setState({editable:false});
  }
  boxsChange(e){
    console.log(e.target.value)
    if (e.target.value!=this.props.value)
      this.props.boxsChange(e.target.value);

  }

  render(){

    const {editable}=this.state;
    let statusSelectValue=[];
    let statusPValue={};
    if(this.props.status=="status"){
      statusSelectValue=statusSelect.map((a)=>
        <option value={a.name} >{a.value}</option>);
      statusPValue=statusP;
    }

    else if(this.props.status=="issuePriority"){
      statusSelectValue=prioritySelect.map((a)=>
        <option value={a.name} >{a.value}</option>);
      statusPValue=priorityP;
    }

    else if(this.props.status=="user"){
      statusSelectValue=userSelect.map((a)=>
        <option value={a.name} >{a.value}</option>);
      statusPValue=userP;
    }



    return(
      <div style={{width:'100%',cursor:'pointer'}} onClick={(e)=>{this.setState({editable:true});}}onBlur={this.blur.bind(this)}>
        {
          editable
            ?
            <select defaultValue={this.props.value} onChange={this.boxsChange.bind(this)} onMouseOver={(e)=>{e.target.focus()}}>

            {statusSelectValue}
            </select>
            :
            <pre style={{width:'100%'}} >{statusPValue[this.props.value]?statusPValue[this.props.value]:" "}</pre>

        }
      </div>

    );
  }

}
export default EditableBox;

