/**
 * Created by chenzl on 2017/10/24.
 * Feature:富文本编辑器
 */
/*eslint-disable*/
import React,{Component} from 'react';
import {observer} from 'mobx-react';
import SimpleMDEReact from 'react-simplemde-editor';
import 'react-simplemde-editor/dist/simplemde.min.css'

@observer
class IssueTextEditor extends Component{

  getMarkdownOptions() {
    return {
      autofocus: false,
      spellChecker: true,
      initialValue: this.props.value
    }
  }
  render() {
    return (
      <div>
        <SimpleMDEReact
          onChange={this.props.handleEditorChange}
          options={this.getMarkdownOptions()}
          value={this.props.value}
          extraKeys={this.props.extraKeys}
        />
      </div>
    )
  }
}
export default IssueTextEditor;
