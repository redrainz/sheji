/*eslint-disable*/
import React from 'react';
import { InputNumber,Button,Checkbox } from 'antd';
require('../../assets/css/kanban-edit.css');
class ColumnMenu extends React.Component {
  constructor(props){
    super(props);
  }
  changeCheckbox=(e)=>{
    this.props.handleOnChangeCheckbox(e);
  }
  render() {
    return (
      <div className="column-menu" style={this.props.display?{display:'block'}:{display:'none'}}>
        <div><Checkbox onChange={this.changeCheckbox} defaultChecked={this.props.checked}/><span>在制品:</span><InputNumber size="small" defaultValue={this.props.value} min={0} disabled={this.props.disabled}/></div>
        <Button type="primary" size="small" style={{color: 'rgb(202, 234, 248)', backgroundColor: 'rgba(33, 150, 243, 0)',borderColor:'unset',height:14,padding:'0 4px',}}>保存</Button>
        <Button size="small" style={{color: 'rgba(158, 158, 158, 0.75)',height:14,padding:'0 4px',}}>取消</Button>
      </div>);
  }
}
export default ColumnMenu;
