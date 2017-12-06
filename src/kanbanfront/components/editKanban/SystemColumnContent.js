/*eslint-disable*/
import React from 'react';
import { Popover } from 'antd';

class SystemColumnContent extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let systemColumnColor = ["#598DED","#598DED"];
    let columnStatus = ["todo","done"];
    let isSelectedColumn = false;
    let i=0;
    for(;i<columnStatus.length;i++){
      if(columnStatus[i]===this.props.columnStatus&&this.props.selected){
        isSelectedColumn = true;
        break;
      }
    }
    let response;
    let dataStatus = this.props.columnStatus;
    dataStatus = dataStatus+(isSelectedColumn?':Y':':N');
    if(isSelectedColumn){
      let content;
      if(this.props.columnStatus==="todo"){
        content = (<div>起始列</div>);
      }else if(this.props.columnStatus==="done"){
        content = (<div>终止列</div>);
      }
      response = (
        <Popover content={content}>
          <div  data-status={dataStatus} style={{
            position: 'absolute',
            fontSize: 12,
            left: 10,
            top: 0
          }}>{this.props.columnStatus==="todo"?'Start':'End'}</div>
        </Popover>)
    }else{
      response = (
        <div  data-status={dataStatus} style={{
          position: 'absolute',
          fontSize: 12,
          left: 10,
          top: 0
        }}/>
      );
    }
    return response;
  }
}

export default SystemColumnContent;
