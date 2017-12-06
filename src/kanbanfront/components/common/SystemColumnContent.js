/*eslint-disable*/
import React from 'react';
import { Popover } from 'antd';

class SystemColumnContent extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let systemColumnColor = ["orange","#C1C1C1"];
    let columnStatus = ["todo","done"];
    let needAddColor = false;
    let i=0;
    for(;i<columnStatus.length;i++){
      if(columnStatus[i]===this.props.columnStatus&&this.props.selected){
        needAddColor = true;
        break;
      }
    }
    let response;
    let dataStatus = this.props.columnStatus;
    dataStatus = dataStatus+(needAddColor?':Y':':N');
    if(needAddColor){
      let content;
      if(this.props.columnStatus==="todo"){
        content = (<div>起始列</div>);
      }else{
        content = (<div>终止列</div>)
      }
      response = (
        <Popover content={content}>
          <div className="system-column-content" data-status={dataStatus} style={{backgroundColor:needAddColor?systemColumnColor[i]:'#39B2A9'}}/>
        </Popover>)
    }else{
      response = (<div className="system-column-content" data-status={dataStatus} style={{backgroundColor:needAddColor?systemColumnColor[i]:'#39B2A9'}}/>);
    }
    return response;
  }
}

export default SystemColumnContent;
