/**
 * Created by Yu Zhang on 2017/10/10.
 */
/*eslint-disable*/
import {Table, Input, Popconfirm, Popover} from 'antd';
import React,{Component} from "react";

class EditableCell extends Component {
state = {
  editable:this.props.editable,
}
blur(e){
this.setState({editable:false});
if(this.props.value!=e.target.value)
  this.props.save(e.target.value);
}
  render(){
  const {editable}=this.state;
  let shortValue=this.props.value;
   let p= <pre style={{width:'100%'}}>{shortValue?shortValue:" "}{this.props.suffix}</pre>
  if(this.props.value&&this.props.value.length>35){
    shortValue=this.props.value.substr(0,35)+"...";
    p= <Popover placement="bottom"
                content={<p style={{
                  width: 260, display: 'block',
                  fontSize: 14, wordBreak: 'break-all', wordWrap: 'break-word'
                }}>{this.props.value}{this.props.suffix}</p>}>
      <p style={{width:'100%'}}>{shortValue}{this.props.suffix}</p>
    </Popover>;
  }
  let input=<Input defaultValue={this.props.value} onMouseOver={(e) => {
    e.target.focus()
  }}/>
    if (this.props.suffix)
      input=<input style={{width:'100%'}} type="number" defaultValue={this.props.value}
                   onMouseOver={(e) => {e.target.focus()}}/>

  return(
    <div style={{width:'100%',cursor:'pointer'}} onClick={()=>{this.setState({editable:true})}}onBlur={this.blur.bind(this)}>
      {
        editable
          ?
         <div style={{width:'100%'}}>{input}</div>
          :
          <div style={{width:'100%'}}>{p}</div>
      }
    </div>

  );
}

}
export default EditableCell;
