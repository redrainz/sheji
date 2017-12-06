/**
 * Created by Yu Zhang on 2017/10/11.
 */
/*eslint-disable*/
import { Table, Input, Popconfirm,DatePicker } from 'antd';
import React,{Component} from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const dateFormat = 'YYYY-MM-DD';
class EditableDate extends Component {
  state = {
    editable:this.props.editable,
  }

  timeChange(date){
    //console.log(e.target.value)
    if (date.valueOf()!=this.props.value.valueOf)
      this.props.timeChange(date.valueOf());
    this.setState({editable:false});
  }

  render(){
    console.log(this.props.value);
    const {editable}=this.state;
    return(
      <div style={{width:'100%'}} onClick={(e)=>{this.setState({editable:true});}}>
        {
          editable
            ?
            <DatePicker defaultValue={moment(this.props.value, dateFormat)}
                        onChange={this.timeChange.bind(this)}
                        onMouseOver={(e)=>{e.target.focus()}}/>
            :
            <p>{this.props.value}</p>

        }
      </div>

    );
  }

}
export default EditableDate;


