/**
 * Created by Yu Zhang on 2017/9/20.
 */
/*eslint-disable*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {
  Layout, Menu, Button, Icon, Modal, Form, Radio, Input, Row, Col, Card, message, Popover, Table, Checkbox
} from 'antd';
import {NavLink, withRouter} from 'react-router-dom';
import Routes from '../../../common/RouteMap';
import PageHeader, {PageHeadStyle} from "../../../components/common/PageHeader";
import LabelManageStore from '../../../stores/origanization/label/LabelManageStore';
import '../../../assets/css/acss.css';
const FormItem = Form.Item;
const {TextArea} = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
@observer
class EditLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: {
        color: "#ff5b64",
        description: "",
        id: 0,
        name: "",
        projectId: 1
      },
    }

  }

  componentWillMount() {
      this.issueTypeId=this.props.match.params.issueTypeId;
      if(this.issueTypeId!='0')
        this.init(this.issueTypeId);
  }

  //跳转界面
  toLabelManage() {
    this.linkToChange(`/kanbanFront/labelManage`);
  }

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  }

  handleSubmit(){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let temp=this.state.label;
        temp.color=values.color;
        temp.name=values.name;
        temp.description=values.description;
        if(this.issueTypeId=='0'){
             this.save(temp);
        }
        else{
          this.update(temp);
        }
      }
    });
  }

  saveAndTO(){
    this.flag=true;
    this.handleSubmit();

  }
  saveAndCon(){
    this.flag=false;
    this.handleSubmit();
  }

  backButton(){
    this.toLabelManage();
  }

  save(value){
    LabelManageStore.create(value).then(
      data=>{
        if(data){
          this.setState({label:data});
          message.success("创建成功！");
          if(this.flag)
            this.toLabelManage();
          else this.linkToChange(`/kanbanFront/editLabel/0`);

        }
      }
    ).catch(e=>{
      message.error("网络不稳！");
    });

  }

  update(value){
    LabelManageStore.update(value).then(
      data=>{
        if(data){
          this.setState({label:data});
          message.success("更新成功！");
          if(this.flag)
            this.toLabelManage();
          else this.linkToChange(`/kanbanFront/editLabel/0`);
        }
      }
    ).catch(e=>{
      message.error("网络不稳！");
    });

  }

  init(value){
    LabelManageStore.findById(value).then(
      data=>{
        if(data){
          this.setState({label:data});
        }
      }
    ).catch(e=>{
      message.error("网络不稳！");
    });
  }

  divColorClick(color){
    let temp=this.state.label;
    temp.color=color;
    this.setState({
      label:temp
    });
    this.props.form.setFieldsValue({color:color});
  }

  inputColorClick(e){
    console.log(e)
    let temp=this.state.label;
    temp.color=e.target.value;
    this.setState({
      label:temp
    });
    this.props.form.setFieldsValue({color:color});
  }

  render() {
    //初始化表单数据
    const label = this.state.label;
    const {getFieldDecorator} = this.props.form;
    let title = "修改类型";
    if (this.issueTypeId == "0") title = "新建类型";
    else title = "修改类型";
    const colors1 = ['#ff5b64', '#d74087', '#fb74f0', '#d8c495', '#81c497', '#6eb59d', '#4a9fef'];
    const colors2 = ['#8eb277', '#b94629', '#f3b6d3', '#b95e89', '#74b058', '#6a68bf', '#afeeee'];
    //单选框1
    const divcolors1 = colors1.map(
      (color, index) => <div value={color} key={index} style={{
        width: 50,
        height: 25,
        backgroundColor: color,
        marginLeft: 10,
        borderRadius: '15%',
        display: 'inline-block',
        cursor: 'pointer'
      }} onClick={this.divColorClick.bind(this,color)}/>
    );
    //单选框2
    const divcolors2 = colors2.map(
      (color, index) => <div value={color} key={index} style={{
        width: 50,
        height: 25,
        backgroundColor: color,
        marginLeft: 10,
        borderRadius: '15%',
        display: 'inline-block',
        cursor: 'pointer'
      }} onClick={this.divColorClick.bind(this,color)}/>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <PageHeader title={title}/>
        <Form style={{marginTop:20}} onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="名称"
            hasFeedback>
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入名称',
              }], initialValue: label.name,
            })(
              <Input style={{width:418}}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="描述"
            hasFeedback>
            {getFieldDecorator('description', {
              rules: [{
                required: true, message: '请输入描述',

              }], initialValue: label.description,
            })(
              <TextArea style={{width:418}} autosize={{minRows: 2, maxRows: 2}}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="颜色"
            hasFeedback>
            {getFieldDecorator('color', {
              rules: [{
                required: true, message: '请输入颜色',
              }], initialValue: label.color,
            })(
              <div>
                <span>
                  <div style={{
                    width: 50,
                    height: 25,
                    backgroundColor: this.state.label.color,
                    marginLeft: 10,
                    borderRadius: '15%',
                    float:'left'
                  }}/>
                  <Input style={{
                    width: 348,float:'left',marginLeft:10}}
                         value={this.state.label.color} onChange={this.inputColorClick.bind(this)}/>I
                </span>

                <span style={{margin:20}}>
                 <div>
                     {divcolors1}<br/>
                     {divcolors2}<br/>
                 </div>
               </span>
              </div>
            )}
          </FormItem>
        </Form>
        <div style={{marginTop: 30, marginLeft: 210}}>
          <Button type="primary" onClick={this.saveAndTO.bind(this)} style={{marginLeft: 15}}>保存</Button>
          <a onClick={this.saveAndCon.bind(this)} style={{marginLeft: 24}}>保存并继续创建</a>
          <Button onClick={this.backButton.bind(this)} style={{marginLeft: 226}}>返回</Button>
        </div>
      </div>
    );
  }
}
export default Form.create({})(withRouter(EditLabel));
