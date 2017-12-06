/**
 * Created by chenzl on 2017/10/25.
 * feature:markdown 编辑文本
 */
/*eslint-disable*/
import React,{Component} from 'react'
import {observer} from 'mobx-react';
import IssueTextEditor from './IssueTextEditor'
import 'react-simplemde-editor/dist/simplemde.min.css'

@observer
class SimplemdeEditor extends Component{
  constructor(props){
    super(props);
    this.state={
      textValue1: "## 描述 \n " +
      "-  \n  " +
      "## 验收标准 \n " +
      "- \n"
    }
  }
  extraKeys() {
    return {
      Up: function(cm) {
        cm.replaceSelection(" surprise. ");
      },
      Down: function(cm) {
        cm.replaceSelection(" surprise again! ");
      }
    };
  }
  handleChange1=(value)=> {
    this.setState({
      textValue1: value
    });
    this.props.getEditorValue(value);
  }
  render(){
    return(
      <div className='container container-narrow text-editor'>
      <IssueTextEditor
        value={this.state.textValue1}
        handleEditorChange={this.handleChange1}
      />
    </div>);
  }
}
export default SimplemdeEditor
