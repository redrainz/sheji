/*eslint-disable*/
import React, { Component } from 'react';
require("../../assets/css/kanban-edit.css");

class InputNumber extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  componentDidUpdate(){
  }

  render() {
    let input = null;
    if(this.props.disabled){
      input = <input type="number" min="0" defaultValue={this.props.defaultValue} disabled style={{ width: 50,height: 18,color:'rgba(0,0,0,0.26)',cursor:'not-allowed',margin:'0 6px'}}/>;
    }else{
      input = <input type="number" min="0" defaultValue={this.props.defaultValue} style={{ width: 50,height: 18,color:'#333333',cursor:'text',margin: '0 6px'}}/>;
    }

    return (input);
  }
}

export default InputNumber;
