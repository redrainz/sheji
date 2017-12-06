/*eslint-disable*/
import React from 'react';
import { Icon,Input } from 'antd';

class InnerContent extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let colWidth = this.props.colWidth;
    let array = [];
    let specialIndexArray = this.props.specialIndexArray;
    let lineColor = '1px dashed';
    if(this.props.groupId!=null){
      lineColor += ' rgb(235,235,235)';
    }else{
      lineColor += ' rgb(242, 242, 242)';
    }
    if(specialIndexArray!=null&&specialIndexArray.length!=0){
      for(let i=0;i<colWidth;i++){
        if(i==0){
          array.push(<div className="innerDiv" style={{borderLeft:'none'}} key={i}/>)
        }else{
          let temp = specialIndexArray.pop();
          if(temp!=i){
            array.push(<div className="innerDiv" style={{borderLeft:lineColor}} key={i}/>);
            specialIndexArray.push(temp);
          }else{
            array.push(<div className="innerDiv" style={{width:164,borderLeft:lineColor}} key={i}/>)
          }
        }
      }
    }else{
      for(let i=0;i<colWidth;i++) {
        if(i==0){
          array.push(<div className="innerDiv" style={{borderLeft:'none'}} key={i}/>)
        }else{
          array.push(<div className="innerDiv" style={{borderLeft:lineColor}} key={i}/>);
        }
      }
    }
    let result;
    if(this.props.groupId!=null){
      let className = "edit-tbody-td-content"+(this.props.selected=="true"?" selected":"");
      if(this.props.ifAddName){
        if(this.props.swimName==null||this.props.swimName==''){
          result = (<div data-groupId={this.props.groupId} data-parentId={this.props.parentId}
                         data-i={this.props.i} data-j={this.props.j} className={className}>
            <Input style={{position:'absolute',display:'none',zIndex:992,top:'18px',padding:'none', width: '50%',height: 20}} placeholder="未命名" onBlur={this.props.hideInput} onPressEnter={(e)=>{e.target.blur();}}/>
            <Icon type="close" style={{fontSize:12,position:'absolute',top: 5,left: 4}}/>
            {/*<span style={{height: 13,width: 13,position:'absolute',top: 5,left: 5}}></span>*/}
            <span onDoubleClick={this.props.showInput} className="edit-tbody-swimlane-name" style={{color:'#888888'}}>未命名</span>
            {array}</div>);
        }else{
          result = ((<div data-groupId={this.props.groupId} data-parentId={this.props.parentId}
                          data-i={this.props.i} data-j={this.props.j} className={className}>
            <Input style={{position:'absolute',display:'none',zIndex:992,top:'18px',padding:'none', width: '50%',height: 20}} placeholder="未命名" defaultValue={this.props.swimName} onBlur={this.props.hideInput} onPressEnter={(e)=>{e.target.blur();}}/>
            <Icon type="close" style={{fontSize:12,position:'absolute',top: 3,left: 2}}/>
            <span onDoubleClick={this.props.showInput} className="edit-tbody-swimlane-name" style={{color:'#1b1d1e'}}>{this.props.swimName}</span>{array}</div>));
        }
      }else{
        result = (<div data-groupId={this.props.groupId} data-parentId={this.props.parentId}
                                data-i={this.props.i} data-j={this.props.j} className={className}>{array}</div>);
      }
    }else{
      result = (<div className="edit-tbody-td-content" data-parentId={this.props.parentId} data-i={this.props.i} data-j={this.props.j}>{array}</div>)
    }
    return (
      result
    );
  }
}

export default InnerContent;
