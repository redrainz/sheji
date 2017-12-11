/*eslint-disable*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon,message,Button,Input,Modal,notification,Checkbox,Popover } from 'antd';
import { observer } from 'mobx-react';
import SiderMenu from '../../../components/editKanban/SiderMenu';
import InnerContent from '../../../components/editKanban/InnerContent';
import SystemColumnContent from '../../../components/editKanban/SystemColumnContent';
import ColumnMenu from '../../../components/editKanban/ColumnMenu';
import InputNumber from '../../../components/editKanban/InputNumber';
import EditKanbanHeader from '../../../components/editKanban/EditKanbanHeader';
import KanbanStore from '../../../stores/origanization/kanban/KanbanStore';
import PageHeader,{PageHeadStyle} from '../../../components/common/PageHeader'
// import SiderMenu from "../../../../../../../boot/src/app/kanbanfront/components/common/SiderMenu";

require('../../../assets/css/kanban-card.css');
require('../../../assets/css/kanban-edit.css');
/*
 对Date的扩展，将 Date 转化为指定格式的String
 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 例子：
 (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function(fmt){
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

@observer
class EditKanban extends Component {

  constructor(props){
    super(props);
    this.initColumn = this.initColumn.bind(this);
    this.fetchTableInfo = this.fetchTableInfo.bind(this);
    this.generateTable = this.generateTable.bind(this);
    this.handleOnGenerateSwimLane = this.handleOnGenerateSwimLane.bind(this);
    this.handleOnDeleteSwimLane = this.handleOnDeleteSwimLane.bind(this);
    this.handleOnAddColumn = this.handleOnAddColumn.bind(this);
    this.handleOnAddHeight = this.handleOnAddHeight.bind(this);
    this.handleOnReduceHeight = this.handleOnReduceHeight.bind(this);
    this.handleOnExtend = this.handleOnExtend.bind(this);
    this.handleOnShrink = this.handleOnShrink.bind(this);
    this.handleOnDeleteColumn = this.handleOnDeleteColumn.bind(this);
    this.handleOnAddSubColumn = this.handleOnAddSubColumn.bind(this);
    this.handleOnSave = this.handleOnSave.bind(this);
    this.handleOnAlterColumnName = this.handleOnAlterColumnName.bind(this);

    // let isFold = true;
    // if(document.getElementsByClassName("anticon anticon-menu-fold")[0]!=null){
    //   isFold = false;
    // }
    // window.startColumnId = null;
    // window.endColumnId = null;
    /*array 看板表头的原始数据,height 看板的高度*/
    this.state = {
      array: [],
      height: 1,
      kanbanName: null,
      isCreatingSwimLane: false,
      // isFold:isFold,
    }
  }

  componentDidMount(){
    this.fetchTableInfo();
    window.toBeDeletedColumn = [];
    window.toBeDeletedSwimLane = [];
    window.tdNextToBody = [];
    window.newColumnId = null;
    window.historyState = {};
    window.openMenu = [];
    window.openMenuTemp = [];
  }
  createHistoryState=(array,height,isCreatingSwimLane)=>{
    let newRecord = {};
    newRecord["array"]=this.deepCopy(array);
    newRecord["height"]=this.deepCopy(height);
    newRecord["isCreatingSwimLane"]=this.deepCopy(isCreatingSwimLane);
    // newRecord["isFold"]=this.deepCopy(isFold);
    if(window.historyState["index"]==null){
      window.historyState["index"]=0;
    }else{
      window.historyState["index"]=window.historyState["index"]+1;
    }
    if(window.historyState["stateArray"]==null){
      window.historyState["stateArray"]=[];
    }
    if(window.historyState["toBeDeletedColumnArray"]==null){
      window.historyState["toBeDeletedColumnArray"]=[];
    }
    if(window.historyState["toBeDeletedSwimLaneArray"]==null){
      window.historyState["toBeDeletedSwimLaneArray"]=[];
    }
    window.historyState["stateArray"].push(newRecord);
    window.historyState["toBeDeletedColumnArray"].push(this.deepCopy(toBeDeletedColumn));
    window.historyState["toBeDeletedSwimLaneArray"].push(this.deepCopy(toBeDeletedSwimLane));
  }
  /*撤销*/
  handleOnRevocate=()=>{
    // e.target.blur();
    let index = window.historyState.index==0?0:window.historyState.index-1;
    let oldRecord = window.historyState.stateArray[index];
    window.historyState.index = index;
    window.toBeDeletedSwimLane = window.historyState.toBeDeletedSwimLaneArray[index];
    window.toBeDeletedColumn = window.historyState.toBeDeletedColumnArray[index];

    this.setState({
      array:oldRecord.array,
      height:oldRecord.height,
      isCreatingSwimLane:oldRecord.isCreatingSwimLane,
      // isFold:oldRecord.isFold,
    });
  }

  /*恢复*/
  handleOnRecover=()=>{
    // e.target.blur();
    let index = window.historyState.index+1;
    let newRecord;
    if(index!=window.historyState.stateArray.length){
      window.historyState.index = index;
      newRecord=window.historyState.stateArray[index];
    }else{
      return;
    }
    window.toBeDeletedSwimLane = window.historyState.toBeDeletedSwimLaneArray[index];
    window.toBeDeletedColumn = window.historyState.toBeDeletedColumnArray[index];
    this.setState({
      array:newRecord.array,
      height:newRecord.height,
      isCreatingSwimLane:newRecord.isCreatingSwimLane,
      // isFold:newRecord.isFold,
    });
  }

  /*组件在即将进行更新时将调用此方法*/
  componentDidUpdate(){
    /*初始化看板的样式*/
    this.initTableStyle();
    /*绑定看板上各按钮的点击事件*/
    this.bindEvent();
  }

  handleOnChangeModel=(e)=>{
    if(!this.state.isCreatingSwimLane){
      const desc = (<div>按住鼠标<b style={{color: '#c7254e',
        backgroundColor: '#f9f2f4'}}>左键</b>拖拽<b style={{background: 'aliceblue',
        color: '#4192d9'}}>单元格</b>绘制泳道</div>);
      const args = {
        message: <div style={{color:'#EC454C'}}>Tips:</div>,
        description: desc,
        duration: 4,
      };
      notification.open(args);
    }
    this.setState({
      isCreatingSwimLane:!this.state.isCreatingSwimLane,
    })
  }

  handleOnMouseOver=(e)=>{
    if(e.target.parentNode.className.indexOf("selected") == -1){
      for(let item of e.target.parentNode.childNodes){
        item.style.backgroundColor = '#F5FAFE';
      }
    }
  }

  handleOnMouseOut=(e)=>{
    for(let item of e.target.parentNode.childNodes){
      item.style.backgroundColor = 'unset';
    }
    // e.target.style.backgroundColor = 'unset';
  }

  addOrRemoveMouseEvent=(event)=>{
    let tbodyDivs = document.getElementsByClassName("innerDiv");
    if(event=="add"){
      for(let item of tbodyDivs){
        this.addEvent(item,"mouseover",this.handleOnMouseOver);
        this.addEvent(item,"mouseout",this.handleOnMouseOut);
      }
    }else if(event=="remove"){
      for(let item of tbodyDivs){
        this.removeEvent(item,"mouseover",this.handleOnMouseOver);
        this.removeEvent(item,"mouseout",this.handleOnMouseOut);
      }
    }
  }

  /*初始化看板的样式*/
  initTableStyle(){
    /*根据侧边栏展开与否调整kanban-conten的宽度和高度*/
    this.resizeKanbanContent();

    /*设置tbody 的top*/
    let tbody = document.getElementsByClassName("edit-kanban-tbody")[0];
    tbody.style.top = document.getElementsByClassName("edit-kanban-thead")[0].offsetHeight - 2 + "px";


    /*为列名设置marginLeft(为了居中显示)*/
    for(let columnName of document.getElementsByClassName("kanban-column-name")){
      let marginLeft = columnName.nextSibling.offsetWidth;
      columnName.style.marginLeft = marginLeft + "px";
    }

    /*初始化thead单元样式*/
    for(let item of document.getElementsByTagName("thead")[0].getElementsByTagName("td")){
      // if(item.getAttribute("data-status")=="doing"){/*若不为pb列则设置相应的列宽和鼠标样式*/
      /* colWidth 列宽、nextToBody 是否和tbody相邻、content 内部div元素 */
      let colWidth = item.getAttribute("data-colWidth");
      let nextToBody = item.getAttribute("data-nextToBody");
      // let content = item.getElementsByClassName("edit-content")[0];
      /*缩列或扩列按钮的父级容器*/
      let extendOrFoldButton = item.firstChild.lastChild;
      /*若列不和tbody相邻且非pb列,则设置其扩列按钮的鼠标样式为not-allowed,其内部div宽度调整为auto*/
      if(nextToBody!=1){
        item.firstChild.lastChild.lastChild.style.cursor = "not-allowed";
        // item.firstChild.lastChild.lastChild.firstChild.firstChild.style.cursor = "not-allowed";
        // content.setAttribute("style","width:auto;");
        item.firstChild.setAttribute('style', 'width: auto');
        /*所有不和tbody相邻的td均需隐藏缩列按钮*/
        if(extendOrFoldButton.childNodes.length!=1){
          extendOrFoldButton.removeChild(extendOrFoldButton.firstChild);
          // extendOrFoldButton.style.width = '15px';
          // extendOrFoldButton.setAttribute("style","width:15px");
        }
      }else{/*和tbody相邻的td需设置内部div宽度大小*/
        item.firstChild.lastChild.lastChild.style.cursor = "pointer";
        // item.firstChild.lastChild.lastChild.firstChild.firstChild.style.cursor = "pointer";
        item.firstChild.setAttribute('style', 'width: '+colWidth*163+'px');
        /*列宽大于1且缩列按钮不存在时才添加缩列按钮*/
        if(colWidth>1&&extendOrFoldButton.childNodes.length==1){
          let newIcon = document.createElement("i");
          newIcon.className="anticon anticon-verticle-right";
          newIcon.style.fontSize = "12px";
          extendOrFoldButton.insertBefore(newIcon,extendOrFoldButton.firstChild);
          // extendOrFoldButton.setAttribute("style","width:30px");
          // extendOrFoldButton.style.width = '30px';
        }else if(colWidth==1&&extendOrFoldButton.childNodes.length==2){
          /*列宽等于1且缩列按钮存在时需移除缩列按钮*/
          extendOrFoldButton.removeChild(extendOrFoldButton.firstChild);
          // extendOrFoldButton.setAttribute("style","width:15px");
          // extendOrFoldButton.style.width = '15px';

        }
      }
    }
    /*为新建的列初始化样式（为了让其input显示并获得焦点）*/
    if(window.newColumnId!=null){
      let targetTd = document.getElementById(window.newColumnId);
      let span = targetTd.firstChild.firstChild.nextSibling;
      let input = span.nextSibling.nextSibling;
      span.style.display = "none";
      input.style.display = "inline-block";
      input.focus();
      window.newColumnId=null;
    }

    /*根据历史记录的状态信息控制撤销和恢复按钮的样式以及能否响应点击事件*/
    if(window.historyState.index==0){
      document.getElementById("revocate").style.color='rgba(51,51,51,0.22)';
      document.getElementById("revocate").style.opacity='unset';
      document.getElementById("revocate").style.cursor='not-allowed';
    }else{
      document.getElementById("revocate").style.color='#333333';
      document.getElementById("revocate").style.opacity='0.8';
      document.getElementById("revocate").style.cursor='pointer';
    }

    if(window.historyState.index==window.historyState.stateArray.length-1){
      document.getElementById("recover").style.color='rgba(51,51,51,0.22)';
      document.getElementById("recover").style.opacity='unset';
      document.getElementById("recover").style.cursor='not-allowed';
    }else{
      document.getElementById("recover").style.color='#333333';
      document.getElementById("recover").style.opacity='0.8';
      document.getElementById("recover").style.cursor='pointer';
    }

  }

  resizeSiderMenu=()=>{
    let siderMenu = document.getElementsByClassName("kanban-sidermenu")[0];
    let topHeight = document.getElementsByClassName("ant-menu ant-menu-horizontal ant-menu-light ant-menu-root")[0].offsetHeight;
    siderMenu.style.top = ( window.innerHeight - topHeight  - siderMenu.offsetHeight)/2 + topHeight + "px";
  }

  resizeKanbanContent=()=>{
    // let kanbanContent = document.getElementsByClassName("kanban-content")[0];
    // let topHeight = 47 + 94 + 2;
    // // let menu = document.getElementById("menu");
    // kanbanContent.style.height = window.innerHeight - topHeight + "px";
    // // kanbanContent.style.width = window.innerWidth - 280 -2 + "px";
    // // this.resizeSiderMenu();

    let kanbanContent = document.getElementsByClassName("kanban-content")[0];
    let topHeight = 58 + 30;
    let autoRouter = kanbanContent.parentNode;
    console.log('autoRouter',autoRouter.style.height);
    let height = Number(autoRouter.style.height.substr(0,autoRouter.style.height.length-2));
    kanbanContent.style.height = height - topHeight  + "px";
  }

  getTopAndLeft(obj,result) { //获取某元素以浏览器左上角为原点的坐标
    let t = obj.offsetTop; //获取该元素对应父容器的上边距
    let l = obj.offsetLeft; //对应父容器的上边距
    //判断是否有父容器，如果存在则累加其边距
    while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
      t += obj.offsetTop; //叠加父容器的上边距
      l += obj.offsetLeft; //叠加父容器的左边距
    }
    result["top"]=t;
    result["left"]=l;
  }

  /*为当前页面的有效按钮绑定点击事件，点击事件发生时将调用各自相对应的handleOn方法*/
  bindEvent(){
    let thead = document.getElementsByTagName("thead")[0];
    let tbody = document.getElementsByTagName("tbody")[0];

    window.onresize = ()=>{
      this.resizeKanbanContent();
    }

    /*清空kanbanContent上的鼠标事件*/
    let kanbanContent = document.getElementsByClassName("kanban-content")[0];
    tbody.onmousedown=null;
    kanbanContent.onmousemove=null;
    document.onmouseup=null;
    /*绑定扩列按钮*/
    for(let item of thead.getElementsByClassName("anticon anticon-verticle-left")){
      let targetTd = item.parentNode.parentNode.parentNode;
      /*只有和tbody相邻的单元格的扩列按钮才是有效点击事件*/
      if(targetTd.getAttribute("data-nextToBody")==1) {
        this.addEvent(item,"click",this.handleOnExtend);
        // item.style.cursor='pointer';
      }else{/*防止之前添加过点击事件，但是之后不再位于最下层时点击事件仍然生效*/
        this.removeEvent(item,"click",this.handleOnExtend);
      }
    }
    /*绑定缩列按钮，缩列按钮只要存在就是有意义、可点击的*/
    for(let item of thead.getElementsByClassName("anticon anticon-verticle-right")){
      // item.style.cursor='pointer';
      this.addEvent(item,"click",this.handleOnShrink);
    }
    /*绑定删除按钮*/
    for(let item of thead.getElementsByClassName("anticon anticon-close")){
      // item.style.cursor='pointer';
      this.addEvent(item,"click",this.handleOnDeleteColumn);
    }
    /*绑定添加子列按钮*/
    for(let item of thead.getElementsByClassName("anticon anticon-plus")){
      // item.style.cursor='pointer';
      this.addEvent(item,"click",this.handleOnAddSubColumn);
    }
    /*绑定泳道删除按钮*/
    for(let item of tbody.getElementsByClassName("anticon anticon-close")){
      // item.style.cursor='pointer';
      this.addEvent(item,"click",this.handleOnDeleteSwimLane);
    }
    /*绑定列上设置按钮*/
    // for(let item of thead.getElementsByClassName("anticon anticon-setting")){
    //   this.addEvent(item,"click",this.handleOnSetColumn);
    // }
    // for(let item of thead.getElementsByClassName("anticon anticon-setting")){
    //   this.addEvent(item,"click",this.handleOnSetColumn);
    // }

    /*为侧边栏的折叠和展开按钮添加点击事件*/
    // let foldIcon = document.getElementsByClassName("anticon anticon-menu-fold")[0];
    // if(foldIcon!=null){
    //   this.addEvent(foldIcon.parentNode,"click",this.handleOnClickSliderButton);
    // }
    // let unfoldIcon = document.getElementsByClassName("anticon anticon-menu-unfold")[0];
    // if(unfoldIcon!=null){
    //   this.addEvent(unfoldIcon.parentNode,"click",this.handleOnClickSliderButton);
    // }

    /*为kanbanContent添加鼠标事件mousedown,mousemove,mouseup*/
    if(this.state.isCreatingSwimLane){/*只有进入绘制模式才能绘制看板*/
      this.addOrRemoveMouseEvent("add");
      document.getElementsByTagName("tbody")[0].style.userSelect = 'unset';
      tbody.onmousedown = () => {
        evt = window.event || arguments[0];
        if(!this.ifRespondToMouseDrag(evt.target)){/*判断当前位置是否响应鼠标拖拽和点击事件*/
          return;
        }
        this.clearSelections();

        /*删除意外情况下保留的拖选框*/
        let selectDivs = document.getElementsByClassName("selectDiv");
        for(let selectDiv of selectDivs){
          kanbanContent.removeChild(selectDiv);
        }

        /*获取tbody上可操作区域所有的div*/
        let selList = [];
        let cells = tbody.getElementsByClassName("edit-tbody-td-content");
        for(let i=0;i<cells.length;i++){
          this.removeEvent(cells[i].firstChild,"mouseover",this.handleOnMouseOver);
          this.removeEvent(cells[i].firstChild,"mouseout",this.handleOnMouseout);
          selList.push(cells[i]);
        }


        /*获取鼠标相对kanbanConten的位置（无法直接使用layerX或者offsetX直接获取，需通过‘特殊’手段算出来）*/
        let isSelect = true;
        let evt = window.event || arguments[0];

        let topAndLeft = {
          left:0,
          top:0
        }

        this.getTopAndLeft(kanbanContent,topAndLeft);

        let startX = evt.clientX - topAndLeft.left + kanbanContent.scrollLeft+document.documentElement.scrollTop;
        let startY = evt.clientY - topAndLeft.top + kanbanContent.scrollTop+document.documentElement.scrollLeft;

        let selDiv = document.createElement("div");
        selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;pointer-events:none";
        selDiv.className = "selectDiv";
        kanbanContent.appendChild(selDiv);
        selDiv.style.left = startX + "px";
        selDiv.style.top = startY + "px";

        let _x = null;
        let _y = null;
        let selectedArray = [];
        let selectedArrayBackUp = [];

        kanbanContent.onmousemove = () => {
          evt = window.event || arguments[0];
          if(!this.ifRespondToMouseDrag(evt.target)){
            return;
          }
          if (isSelect) {
            if (selDiv.style.display == "none") {
              selDiv.style.display = "";
            }
            _x = evt.clientX - topAndLeft.left + kanbanContent.scrollLeft + document.documentElement.scrollLeft;
            _y = evt.clientY - topAndLeft.top + kanbanContent.scrollTop + document.documentElement.scrollTop;

            selDiv.style.left = Math.min(_x, startX) + "px";
            selDiv.style.top = Math.min(_y, startY) + "px";
            selDiv.style.width = Math.abs(_x - startX) + "px";
            selDiv.style.height = Math.abs(_y - startY) + "px";

            // let scroll = document.getElementsByClassName("kanban-content")[0];
            let _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
            let _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
            for ( let i = 0; i < selList.length; i++) {
              let sl = selList[i].offsetLeft;
              console.log(`tbody.top:${tbody.offsetTop}`);
              let st = selList[i].offsetTop+tbody.offsetTop;
              if (sl +selList[i].offsetWidth > _l && _l + _w > sl && _t<st+selList[i].offsetHeight &&_t+_h>st) {
                let hasSameItem = false;/*防止重复添加相同的div*/
                for(let item of selectedArray){
                  if(item===selList[i]){
                    hasSameItem=true;
                    break;
                  }
                }
                if(!hasSameItem){/*记录选中状态前的item*/
                  selectedArrayBackUp.push(selList[i].className);
                }
                if (selList[i].className.indexOf("selected") == -1) {
                  selList[i].className = selList[i].className + " selected";
                }
                if(!hasSameItem){/*拿到所有选中的item数组*/
                  selectedArray.push(selList[i]);
                }
              }else{
                let hasItem = false;
                let _i=0;
                for(;_i<selectedArray.length;_i++){
                  if(selectedArray[_i]==selList[i]){
                    hasItem = true;
                    break;
                  }
                }
                if(hasItem){
                  selectedArray[_i].className = selectedArrayBackUp[_i];
                  selectedArray.splice(_i,1);
                  selectedArrayBackUp.splice(_i,1);
                }
              }
            }
          }
        }
        document.onmouseup = () => {
          evt = window.event || arguments[0];
          if(!this.ifRespondToMouseDrag(evt.target)){
            return;
          }
          let hasConflict = false;
          for(let item of selectedArray){/*检查是否有重叠泳道*/
            if(item.getAttribute("data-groupId")!=null){
              hasConflict = true;
              break;
            }
          }
          if(!hasConflict){/*泳道无重叠创建新的泳道*/
            for(let item of selectedArray){
              if(item.className.indexOf("selected")==-1){
                item.className = item.className + " selected";
              }
            }
            this.handleOnGenerateSwimLane(selectedArray);
          }else{/*否则恢复item原状态*/
            message.warning("泳道无法重叠,请重试",1.5);
            for(let i=0;i<selectedArray.length;i++){
              selectedArray[i].className = selectedArrayBackUp[i];
            }
          }
          isSelect = false;
          // if (selDiv) {
          //   kanbanContent.removeChild(selDiv);
          // }

          /*删除意外情况下保留的拖选框*/
          let selectDivs = document.getElementsByClassName("selectDiv");
          for(let selectDiv of selectDivs){
            kanbanContent.removeChild(selectDiv);
          }

          this.addOrRemoveMouseEvent("add");
          selectedArray = [];
          selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
          this.clearSelections();
        }
      }
    }else{
      this.addOrRemoveMouseEvent("remove");
      document.getElementsByTagName("tbody")[0].style.userSelect = 'none';
    }
  }
  handleOnSetColumn=(e)=>{
    let columnMenu = e.target.parentNode.parentNode.parentNode.lastChild;
    if(columnMenu.style.display=="block"){
      let sourceArray = this.deepCopy(this.state.array);
      let positionArray =columnMenu.parentNode.getAttribute("data-position").split(",");
      let targetColumn = this.findTargetColumn(sourceArray,positionArray);
      for(let m=0;m<window.openMenuTemp.length;m++){
        if(window.openMenuTemp[m].id==columnMenu.parentNode.id){
          targetColumn.wipNum = window.openMenuTemp[m].wipNum;
          targetColumn.wipChecked = window.openMenuTemp[m].wipChecked;
          targetColumn.startChecked = window.openMenuTemp[m].startChecked;
          targetColumn.endChecked = window.openMenuTemp[m].endChecked;
          window.openMenuTemp.splice(m,1);
          window.openMenu.splice(m,1);
          break;
        }
      }
      columnMenu.style.display = 'none';
      this.setState({
        array:sourceArray,
      });
      return;
    }
    columnMenu.style.display = 'block';
    window.openMenu.push(columnMenu.parentNode.id);
    let sourceArray = this.state.array;
    let positionArray = columnMenu.parentNode.getAttribute("data-position").split(",");
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    if(!targetColumn.wipChecked){
      columnMenu.firstChild.lastChild.value = this.state.height;
    }
    let columnData = {};
    columnData.id = columnMenu.parentNode.id;
    columnData.wipChecked = targetColumn.wipChecked;
    columnData.wipNum = targetColumn.wipNum;
    columnData.startChecked = targetColumn.startChecked;
    columnData.endChecked = targetColumn.endChecked;
    window.openMenuTemp.push(columnData);
  }
  /*清除页面上所有选中的元素（解决按住文字无法拖动鼠标）*/
  clearSelections=()=>{
    if (window.getSelection) {
      // 获取选中
      let selection = window.getSelection();
      // 清除选中
      selection.removeAllRanges();
    } else if (document.selection && document.selection.empty) {
      // 兼容 IE8 以下，但 IE9+ 以上同样可用
      document.selection.empty();
    }
  }
  /*控制是否出现鼠标拖选框（屏蔽掉Input，name，icon上拖拽鼠标的事件，即不出现拖选框）*/
  ifRespondToMouseDrag(target){
    let notCreateSwimLaneArray = ["edit-tbody-swimlane-name","anticon anticon-close","ant-input","column-menu","startAndEndDiv","wipDiv"];
    for(let ncw of notCreateSwimLaneArray){
      if(target.className===ncw){
        return false;
      }
    }
    let notCreateSwimLaneTageNameArray = ["INPUT","SPAN","LABEL","BUTTON"];
    for(let ncw_ of notCreateSwimLaneTageNameArray){
      if(target.tagName===ncw_){
        return false;
      }
    }
    return true;
  }
  handleOnDeleteSwimLane(e){
    this.removeInvalidRecord();
    let sourceArray = this.deepCopy(this.state.array);
    let groupId = e.target.parentNode.getAttribute("data-groupId");
    toBeDeletedSwimLane.push(groupId);
    for(let item of document.getElementsByClassName("edit-tbody-td-content")){
      if(item.getAttribute("data-groupId")==groupId){
        let parentNode = document.getElementById(item.getAttribute("data-parentId"));
        let positionArray = this.getPositionArray(parentNode);
        let targetColumn = this.findTargetColumn(sourceArray,positionArray);
        for(let i=0;i<targetColumn.swimLanes.length;i++){
          if(groupId==targetColumn.swimLanes[i].groupId){
            targetColumn.swimLanes.splice(i,1);
            break;
          }
        }
      }
    }
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane);
    this.setState({
      array:sourceArray,
    });
  }

  /*创建新的泳道*/
  handleOnGenerateSwimLane(selectedArray){
    if(selectedArray.length==0){
      return;
    }
    this.removeInvalidRecord();
    let temp_i = selectedArray[0].getAttribute("data-i"),temp_j=selectedArray[0].getAttribute("data-j");
    let min_i=parseInt(temp_i),max_i=parseInt(temp_i);
    let min_j=parseInt(temp_j),max_j=parseInt(temp_j);
    let columnsId = [];
    for(let item of selectedArray){/*得到item数组中最小i,j以及最大的i,j*/
      temp_i = parseInt(item.getAttribute("data-i"));
      temp_j = parseInt(item.getAttribute("data-j"));
      if(temp_i<min_i){
        min_i=temp_i;
      }else if(temp_i>max_i){
        max_i=temp_i;
      }
      if(temp_j<min_j){
        min_j=temp_j;
      }else if(temp_j>max_j){
        max_j=temp_j;
      }
      /*拿到列id数组*/
      let hasSameId = false;
      for(let columnId of columnsId){
        if(columnId==item.getAttribute("data-parentId")){
          hasSameId = true;
          break;
        }
      }
      if(!hasSameId){
        columnsId.push(item.getAttribute("data-parentId"));
      }
    }
    /*泳道的高度和最大最小i有关*/
    let height = max_i-min_i+1;
    let sourceArray = this.deepCopy(this.state.array);
    let swimLaneId = this.generateNoneDuplicateID(3);
    let kanbanId = this.props.match.params.kanbanId;
    for(let i=0;i<columnsId.length;i++){
      let positionArray = this.getPositionArray(document.getElementById(columnsId[i]));
      let targetColumn = this.findTargetColumn(sourceArray,positionArray);
      let infoArray = [kanbanId,targetColumn.id,swimLaneId,height,1,null,min_i];
      /*根据infoArray创建泳道对象*/
      let newSwimLane = this.createSwimLane(infoArray);
      if(targetColumn.swimLanes==null||targetColumn.swimLanes.length==0){
        targetColumn.swimLanes.push(newSwimLane);
      }else{
        let _i;
        /*查找泳道插入位置*/
        for(_i=0;_i<targetColumn.swimLanes.length;_i++){
          if(targetColumn.swimLanes[_i].position>min_i){
            break;
          }
        }
        if(_i==targetColumn.swimLanes.length){
          targetColumn.swimLanes.push(newSwimLane);
        }else{
          targetColumn.swimLanes.splice(_i,0,newSwimLane);
        }
      }
    }
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane);
    this.setState({
      array:sourceArray,
    });
  }
  /*根据传入的数据，使用已定义的字段创建新的泳道单元对象*/
  createSwimLane(infoArray){
    let fieldArray = ['kanbanId','columnId','groupId','height','width',
      'name','position'];
    let newSwimLane= {},index = 0;
    for(let field of fieldArray){
      newSwimLane[field] = infoArray[index++];
    }
    newSwimLane["uniqueId"]=this.generateNoneDuplicateID(3);
    return newSwimLane;
  }
  /*给指定元素添加事件*/
  addEvent(obj,type,handle){
    try{  /* Chrome、FireFox、Opera、Safari、IE9.0及其以上版本*/
      obj.addEventListener(type,handle,false);
    }catch(e){
      try{  /*IE8.0及其以下版本*/
        obj.attachEvent('on' + type,handle);
      }catch(e){  /*早期浏览器*/
        obj['on' + type] = handle;
      }
    }
  }

  /*移除元素上绑定的事件*/
  removeEvent(obj,type,handle){
    try{
      obj.removeEventListener(type,handle);
    }catch(e){
      try{
        obj.removeEvent('on' + type,handle);
      }catch (e){
        delete obj['on' + type];
      }
    }
  }
  /*递归清除看板数组中保存的临时多余变量（用于保存看板时提交清洁数据）*/
  cleanRedundantField(array){
    let redundantFieldArray = ['colSpan','nextToBody','position','columnId','wipChecked',"startChecked","endChecked","startDisabled","endDisabled","wipDisabled"];
    if(array.subColumns==null||array.subColumns.length==0){
      return;
    }
    for(let node of array.subColumns){
      this.removeRedundantField(node,redundantFieldArray);
      this.cleanRedundantField(node.subColumns);
    }
  }

  /*在保存前初查找起始列和终止列*/
  findStartAndEndColumnIdBeforeSave=(array)=>{
    let startAndEndColumnId = {};
    for(let i=0;i<array.length;i++){
      let item = array[i];
      item.sequence = i+1;
      this.findStartAndEndColumnIdBeforeSaveTool(item,startAndEndColumnId);
    }
    return startAndEndColumnId;
  }
  findStartAndEndColumnIdBeforeSaveTool=(root,startAndEndColumnId)=>{
    if(root.subColumns==null||root.subColumns.length==0){
      if(root.selected){
        if(root.status=="todo"){
          startAndEndColumnId["startColumnId"]=root.id==null?root.uniqueId:root.id;
        }else if(root.status=="done"){
          startAndEndColumnId["endColumnId"]=root.id==null?root.uniqueId:root.id;
        }
      }
      return;
    }
    for(let i=0;i<root.subColumns.length;i++){
      let subColumn = root.subColumns[i];
      subColumn.sequence = i+1;
      this.findStartAndEndColumnIdBeforeSaveTool(subColumn,startAndEndColumnId);
    }
    if(root.selected){
      if(root.status=="todo"){
        startAndEndColumnId["startColumnId"]=root.id==null?root.uniqueId:root.id;
      }else if(root.status=="done"){
        startAndEndColumnId["endColumnId"]=root.id==null?root.uniqueId:root.id;
      }
    }
  }

  handleOnSave(){
    // e.target.blur();
    let loading = message.loading("保存中",0);
    const kanbanId = this.props.match.params.kanbanId;
    let array = this.state.array;
    /*清除多余字段*/
    this.cleanRedundantField(array);
    let kanbanHeight = this.state.height;
    let kanban = {};
    kanban.id = kanbanId;kanban.height = kanbanHeight;

    let startAndEndColumnId = this.findStartAndEndColumnIdBeforeSave(array);
    let startColumnId = startAndEndColumnId.startColumnId;
    let endColumnId = startAndEndColumnId.endColumnId;

    /*如果用户没有设置起始列和终止列，尝试自动设置*/
    if(startColumnId!=null&&endColumnId==null){
      if(!array[array.length-1].selected){
        array[array.length-1].selected=true;
        array[array.length-1].status="done";
        endColumnId = array[array.length-1].id==null?array[array.length-1].uniqueId:array[array.length-1].id;

        // const desc = (<div>按住鼠标<b style={{color: '#c7254e',
        //   backgroundColor: '#f9f2f4'}}>左键</b>拖拽<b style={{background: 'aliceblue',
        //   color: '#4192d9'}}>单元格</b>绘制泳道</div>);
        const desc = (<div>已为您自动设置<b style={{backgroundColor:'rgba(193, 193, 193, 0.4)',color:'rgba(5, 38, 53, 0.7)'}}>终止列</b></div>);
        const args = {
          // message: <div style={{color:'#EC454C'}}>Tips:</div>,
          description: desc,
          duration: 3,
        };
        notification.open(args);
      }
    }else if(startColumnId==null&&endColumnId==null){
      if(array.length>=2){
        array[0].selected=true;
        array[0].status="todo";
        array[array.length-1].selected=true;
        array[array.length-1].status="done";
        startColumnId = array[0].id==null?array[0].uniqueId:array[0].id;
        endColumnId = array[array.length-1].id==null?array[array.length-1].uniqueId:array[array.length-1].id;
        const desc = (<div>已为您自动设置<b style={{backgroundColor:'rgba(255, 165, 0, 0.27)',color: '#ef5b21'}}>起始列</b>和<b style={{backgroundColor:'rgba(193, 193, 193, 0.4)',color:'rgba(5, 38, 53, 0.7)'}}>终止列</b></div>);
        const args = {
          description: desc,
          duration: 3,
        };
        notification.open(args);
      }else if(array.length==1){
        array[0].selected=true;
        array[0].status="todo";
        startColumnId = array[0].id==null?array[0].uniqueId:array[0].id;
        const desc = (<div>已为您自动设置<b style={{backgroundColor:'rgba(255, 165, 0, 0.27)',color: '#ef5b21'}}>起始列</b></div>);
        const args = {
          description: desc,
          duration: 3,
        };
        notification.open(args);
      }
    }else if(startColumnId==null&&endColumnId!=null){
      if(!array[0].selected){
        array[0].selected=true;
        array[0].status="todo";
        startColumnId = array[0].id==null?array[0].uniqueId:array[0].id;
        const desc = (<div>已为您自动设置<b style={{backgroundColor:'rgba(255, 165, 0, 0.27)',color: '#ef5b21'}}>起始列</b></div>);
        const args = {
          description: desc,
          duration: 3,
        };
        notification.open(args);
      }
    }
    startAndEndColumnId.startColumnId = startColumnId;
    startAndEndColumnId.endColumnId = endColumnId;

    for(let item_ of array){
      this.initAllColumn(item_,startAndEndColumnId);
    }
    if(startColumnId!=null){
      this.initStartStatus(startColumnId,array);
    }
    if(endColumnId!=null){
      this.initEndStatus(endColumnId,array);
    }
    if(toBeDeletedColumn.length==0){
      if(toBeDeletedSwimLane.length==0){
        KanbanStore.updateKanban(kanbanId,kanban).then(response => {
          if(response){
            KanbanStore.updateAllColumn(kanbanId,array).then( response => {
              if(response){
                message.destroy();
                message.success('保存成功',1.5);
                toBeDeletedSwimLane = [];
                toBeDeletedColumn = [];
                window.historyState = {};
                this.createHistoryState(response,this.state.height,this.state.isCreatingSwimLane);
                this.setState({
                  array:response,
                });
              }
            });
          }
        });
      }else{
        KanbanStore.deleteSwimLanes(toBeDeletedSwimLane).then( response => {
          if(response){
            KanbanStore.updateKanban(kanbanId,kanban).then(response => {
              if(response){
                KanbanStore.updateAllColumn(kanbanId,array).then( response => {
                  if(response){
                    message.destroy();
                    message.success('保存成功',1.5);
                    toBeDeletedSwimLane = [];
                    toBeDeletedColumn = [];
                    window.historyState = {};
                    this.createHistoryState();
                    this.setState({
                      array:response,
                    });
                  }
                });
              }
            });
          }
        });
      }
    }else{
      if(toBeDeletedSwimLane.length==0){
        KanbanStore.deleteColumns(toBeDeletedColumn).then( response => {
          if(response){
            KanbanStore.updateKanban(kanbanId,kanban).then(response => {
              if(response){
                KanbanStore.updateAllColumn(kanbanId,array).then( response => {
                  if(response){
                    message.destroy();
                    message.success('保存成功',1.5);
                    toBeDeletedSwimLane = [];
                    toBeDeletedColumn = [];
                    window.historyState = {};
                    this.createHistoryState();
                    this.setState({
                      array:response,
                    });
                  }
                });
              }
            });
          }
        });
      }else{
        KanbanStore.deleteColumns(toBeDeletedColumn).then( response => {
          if(response){
            KanbanStore.deleteSwimLanes(toBeDeletedSwimLane).then( response => {
              if(response){
                KanbanStore.updateKanban(kanbanId,kanban).then(response => {
                  if(response){
                    KanbanStore.updateAllColumn(kanbanId,array).then( response => {
                      if(response){
                        message.destroy();
                        message.success('保存成功',1.5);
                        toBeDeletedSwimLane = [];
                        toBeDeletedColumn = [];
                        window.historyState = {};
                        this.createHistoryState();
                        this.setState({
                          array:response,
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  }

  handleOnAddHeight(){
    // e.target.blur();
    this.removeInvalidRecord();
    this.createHistoryState(this.state.array,this.state.height+1,this.state.isCreatingSwimLane);
    this.setState({
      height:this.state.height+=1,
    });
  }

  handleOnReduceHeight(){
    // e.target.blur();
    for(let i=0;i<tdNextToBody.length-1;i++){
      if(tdNextToBody[i].swimLanes!=null&&tdNextToBody[i].swimLanes.length!=0){
        let swimLane = tdNextToBody[i].swimLanes[tdNextToBody[i].swimLanes.length-1];
        if(swimLane.position+swimLane.height==this.state.height){
          message.warning("请先删除最下方泳道",1.5);
          return;
        }
      }
    }
    let height = this.state.height;
    if(height==1){
      message.warning("已达到最小看板高度",1.5);
      return;
    }
    this.removeInvalidRecord();
    height-=1;
    this.createHistoryState(this.state.array,height,this.state.isCreatingSwimLane);
    this.setState({
      height:height,
    });
  }

  /*处理缩列按钮的点击事件*/
  handleOnShrink(e){
    /*找到扩列按钮所在的td DOM元素*/
    this.removeInvalidRecord();
    let targetTd = e.target.parentNode.parentNode.parentNode;
    /*获取位置数组和源数组，通过他们找到目标column的引用*/
    let positionArray = this.getPositionArray(targetTd);
    let sourceArray = this.deepCopy(this.state.array);
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    /*更新列宽，若更新后列宽长度为1，则设置目标td的样式（解决列宽长度为1时样式
     不发生变化的问题，参见initTableStyle中有关colWidth的相关逻辑语句）*/
    let width = targetColumn.width==1?1:targetColumn.width-1;
    targetColumn.width=width;
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane);
    this.setState({
      array:sourceArray,
    });
  }

  /*处理扩列按钮的点击事件*/
  handleOnExtend(e){
    /*找到扩列按钮所在的td DOM元素*/
    this.removeInvalidRecord();
    let targetTd = e.target.parentNode.parentNode.parentNode;
    /*相关操作逻辑同handleOnShrink*/
    let positionArray = this.getPositionArray(targetTd);
    let sourceArray = this.deepCopy(this.state.array);
    let target = this.findTargetColumn(sourceArray,positionArray);
    target.width += 1;
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane);
    this.setState({
      array:sourceArray,
    });
  }

  /*获取目标单元格的position数组，可通过其在原始数组中快速找到对应的column*/
  getPositionArray(targetTd){
    return targetTd.getAttribute("data-position").split(",");
  }

  /*根据位置数组信息在源数组中查找目标column,并返回对目标的引用*/
  findTargetColumn(sourceArray,positionArray){
    let target = null;
    for(let i=0;i<positionArray.length;i++){
      if(i!=positionArray.length-1){
        sourceArray = sourceArray[positionArray[i]].subColumns;
      }else{
        target = sourceArray[positionArray[i]];
        break;
      }
    }
    return target;
  }

  /*处理删除列按钮的点击事件*/
  handleOnDeleteColumn(e){
    this.removeInvalidRecord();
    /*找到删除按钮所在的td DOM元素*/
    let targetTd = e.target.parentNode.parentNode.parentNode;
    let targetColWidth = targetTd.getAttribute("data-colWidth");
    let columnId = targetTd.getAttribute("data-columnId");
    if(columnId!=null&&columnId!=''){/*若columnId不存在（新建的列无真实id）*/
      toBeDeletedColumn.push(columnId);
    }
    /*相关操作逻辑类似handleOnShrink，获取目标在array数组中的位置*/
    let positionArray = this.getPositionArray(targetTd);
    let sourceArray = this.deepCopy(this.state.array);
    if(positionArray.length==1){/*若待删除单元位于源数组最上层，可直接删除*/
      for(let i=parseInt(positionArray[0])+1;i<sourceArray.length;i++){
        sourceArray[i].sequence-=1;
      }
      sourceArray.splice(positionArray[0],1);
    }else{/*否则需先找到父级column，并在其subColumns中将目标单元删除*/
      let parent = this.findTargetColumn(sourceArray,positionArray.slice(0,-1));
      for(let i=parseInt(positionArray[positionArray.length-1])+1;i<parent.subColumns.length;i++){
        parent.subColumns[i].sequence-=1;
      }
      parent.subColumns.splice(positionArray[positionArray.length-1],1);
      if(parent.subColumns.length==0){/*若父节点下再无子节点，则设置父节点width为最后一个子节点宽度*/
        parent.width=parseInt(targetColWidth);
      }
    }
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane);
    this.setState({
      array:sourceArray,
    });
  }

  /*根据传入的数据，使用已定义的字段创建新列*/
  createColumn(infoArray){
    let fieldArray = ['creationDate','height','kanbanId','name','objectVersionNumber',
      'parentId','sequence','status','subColumns','swimLanes','width','wipNum'];
    let newColumn = {},index = 0;
    for(let field of fieldArray){
      newColumn[field] = infoArray[index++];
    }
    newColumn["uniqueId"]=this.generateNoneDuplicateID(3);
    window.newColumnId = newColumn.uniqueId;
    return newColumn;
  }
  removeInvalidRecord=()=>{
    let currentIndex = window.historyState.index;
    for(let i=window.historyState.stateArray.length-1;i>currentIndex;i--){
      window.historyState.stateArray.splice(i,1);
      window.historyState.toBeDeletedSwimLaneArray.splice(i,1);
      window.historyState.toBeDeletedColumnArray.splice(i,1);
    }
  }
  /*处理添加一列按钮的点击事件*/
  handleOnAddColumn(){
    // e.target.blur();
    this.removeInvalidRecord();
    /*获取看板id*/
    const kanbanId = this.props.match.params.kanbanId;
    let sourceArray = this.deepCopy(this.state.array);
    /*初始化新建一列的信息*/
    let infoArray = [(new Date().Format("yyyy-MM-dd HH:mm:ss")),
      1,kanbanId,'未命名列名',1,'0',sourceArray.length+1,'doing',[],[],1,-1];
    let newColumn = this.createColumn(infoArray);
    // sourceArray[sourceArray.length-1].sequence+=1;
    sourceArray.push(newColumn);
    // sourceArray.splice(sourceArray.length-1, 0, newColumn);
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane);
    this.setState({
      array:sourceArray,
    });
  }

  handleOnAddSubColumn(e){
    /*找到添加按钮所在的td DOM元素*/
    this.removeInvalidRecord();
    let kanbanId = this.props.match.params.kanbanId;
    let targetTd = e.target.parentNode.parentNode.parentNode;
    let positionArray = this.getPositionArray(targetTd);
    let sourceArray = this.deepCopy(this.state.array);
    let target = this.findTargetColumn(sourceArray,positionArray);
    /*若新增的子列是第一个，则子列width等于父级width；否则width设为1*/
    let infoArray = [(new Date().Format("yyyy-MM-dd HH:mm:ss")),
      1,kanbanId,'未命名列名',1,target.parentId+","+targetTd.id,target.subColumns.length+1,
      'doing',[],[],target.subColumns.length==0?target.width:1,-1];
    let newColumn = this.createColumn(infoArray);
    target.subColumns.push(newColumn);
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane);
    this.setState({
      array:sourceArray,
    });
  }

  /*获取看板信息*/
  fetchTableInfo(){
    /*看板id，通过url获取*/
    const kanbanId = this.props.match.params.kanbanId;
    KanbanStore.getColumn(kanbanId).then(response => {
      if (response != null) {
        /*取得看板列数组和看板高度*/
        let array = response.list;
        let kanbanHeight = response.height;
        let kanbanName = response.kanbanName;
        this.createHistoryState(array,kanbanHeight,this.state.isCreatingSwimLane,this.state);
        this.setState({
          array: array,
          height: kanbanHeight,
          kanbanName: kanbanName,
        });
      }
    });
  }
  /*获取看板列树的高度*/
  getTreeHeight(root){
    if(root.subColumns==null||root.subColumns.length==0){
      return 1;
    }
    let maxHeight = 0;
    for(let node of root.subColumns){
      let maxHeightTemp = this.getTreeHeight(node);
      if(maxHeightTemp>maxHeight){
        maxHeight = maxHeightTemp;
      }
    }
    return maxHeight+1;
  }
  /*删除列中的多余字段，fieldArray为多余字段数组*/
  removeRedundantField(column,fieldArray){
    for(let field of fieldArray){
      delete column[field];
    }
  }
  /*利用随机数和时间戳生成一个不会重复的ID,并将其入队*/
  generateNoneDuplicateID(randomLength){
    let noneDuplicateID = Number(Math.random().toString().substr(3,randomLength)+Date.now()).toString(36);
    return noneDuplicateID;
  }

  getKanbanDepth(array){
    if(array==null||array.length==0){
      return;
    }
    /*看板表头树的深度数组，用于保存各列所对应树的深度*/
    let kanbanHeightArray = [];
    for(let node of array){
      kanbanHeightArray.push(this.getTreeHeight(node));
    }
    /*对深度数组进行排序，数值最大的即为表头深度*/
    kanbanHeightArray = kanbanHeightArray.sort();
    return kanbanHeightArray[kanbanHeightArray.length-1];
  }
  showAlterColumnNameInput(e){
    e.target.nextSibling.nextSibling.style.display='inline-block';
    e.target.nextSibling.nextSibling.focus();
    e.target.style.display='none';
    e.target.nextSibling.style.display='none';
  }

  handleOnAlterColumnName(e){
    let columnName;
    if(e.target.value==null||e.target.value==''){
      columnName='未命名列名';
    }else{
      columnName=e.target.value;
    }

    if(e.target.previousSibling.innerHTML==columnName){
      e.target.style.display='none';
      e.target.previousSibling.style.display="inline-block";
      e.target.previousSibling.previousSibling.style.display="inline-block";
      return;
    }
    this.removeInvalidRecord();
    let sourceArray = this.deepCopy(this.state.array);
    let parentNode = e.target.parentNode.parentNode;
    let positionArray = this.getPositionArray(parentNode);
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    targetColumn.name = columnName/*!=null&&e.target.value!=''?e.target.value:'未命名列名'*/;
    e.target.style.display="none";
    e.target.previousSibling.style.display="inline-block";
    e.target.previousSibling.previousSibling.style.display="inline-block";
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane,this.state);
    this.setState({
      array:sourceArray,
    })
  }
  showAlterSwimLaneNameInput=(e)=>{
    let parentNode = e.target.parentNode;
    e.target.style.display="none";
    parentNode.firstChild.style.display='inline-block';
    parentNode.firstChild.focus();
  }
  handleOnAlterSwimLaneName=(e)=>{
    let swimLaneName;
    if(e.target.value==null||e.target.value==''){
      swimLaneName='未命名';
    }else{
      swimLaneName=e.target.value;
    }

    if(e.target.nextSibling.nextSibling.innerHTML==swimLaneName){
      e.target.style.display='none';
      e.target.nextSibling.nextSibling.style.display="inline-block";
      return;
    }
    this.removeInvalidRecord();

    const kanbanId = this.props.match.params.kanbanId;
    const groupId = e.target.parentNode.getAttribute('data-groupId');
    /*parentId 所属列id，iIndex 在看板上的行数*/
    const parentId = e.target.parentNode.getAttribute('data-parentId');
    const iIndex = parseInt(e.target.parentNode.getAttribute('data-i'));
    let sourceArray = this.deepCopy(this.state.array);
    let count=0;

    let _tdNextToBody = [];
    for(let _item of window.tdNextToBody){
      let _postionArray = _item.position.toString().split(',');
      let _column = this.findTargetColumn(sourceArray,_postionArray);
      _tdNextToBody.push(_column);
    }

    /*列的位置数组以及利用位置数组找到的对目标列的引用，i记录当前泳道在对应列的泳道索引位置*/
    let positionArray = this.getPositionArray(document.getElementById(parentId));
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    let i=0;
    for(;i<targetColumn.swimLanes.length;i++){
      if(groupId==targetColumn.swimLanes[i].groupId){
        break;
      }
    }
    /*pointer保存对目标泳道的引用,parentColumnId为所属列Id(可能为空，为空并不影响后台创建)，swimLaneHeight为泳道高度*/
    const pointer = targetColumn.swimLanes[i];
    const parentColumnId = targetColumn.id;
    const swimLaneHeight = pointer.height;
    if(pointer.width==1&&e.target.value!=null&&e.target.value.name!=''){/*输入名称不为空且目标泳道宽度为1时需要合并单元格*/
      /*将当前泳道所有的单元格都删除*/
      window.toBeDeletedSwimLane.push(pointer.groupId);
      for(let item of document.getElementsByClassName('edit-tbody-td-content')){
        if(item.getAttribute('data-groupId')==groupId){
          let positionArrayT = this.getPositionArray(document.getElementById(item.getAttribute('data-parentId')));
          let targetColumnT = this.findTargetColumn(sourceArray,positionArrayT);
          for(let _i=0;_i<targetColumnT.swimLanes.length;_i++){
            if(groupId==targetColumnT.swimLanes[_i].groupId){
              targetColumnT.swimLanes.splice(_i, 1);
              break;
            }
          }
          count++;
        }
      }
      /*在目标泳道位置重新插入泳道单元*/
      let groupIdT = this.generateNoneDuplicateID(3);
      let infoArray = [kanbanId,parentColumnId,groupIdT,swimLaneHeight,count,e.target.value,iIndex];
      let newSwimLane = this.createSwimLane(infoArray);
      targetColumn.swimLanes.splice(i,0,newSwimLane);
    }else if(pointer.width!=1&&(e.target.value==null||e.target.value=='')){/*若泳道长度大于1且输入框内无内容时需拆分单元格*/
      /*获取目标泳道所属列在上面声明的局部数组_tdNextToBody中的索引位置*/
      let jIndex = parseInt(e.target.parentNode.getAttribute('data-j'));
      count = pointer.width;
      /*将已存在的泳道删除，重新创建指定数量的泳道单元格*/
      targetColumn.swimLanes.splice(i,1);
      window.toBeDeletedSwimLane.push(groupId);
      let groupIdT2 = this.generateNoneDuplicateID(3);
      for(let k=0;k<count;k++){
        let infoArray2 = [kanbanId,_tdNextToBody[jIndex+k].id,groupIdT2,swimLaneHeight,1,null,iIndex];
        let newSwimLane2 = this.createSwimLane(infoArray2);
        let _i2;
        /*查找泳道插入位置*/
        for(_i2=0;_i2<_tdNextToBody[jIndex+k].swimLanes.length;_i2++){
          if(_tdNextToBody[jIndex+k].swimLanes[_i2].position>iIndex){
            break;
          }
        }
        if(_i2==_tdNextToBody[jIndex+k].swimLanes.length){
          _tdNextToBody[jIndex+k].swimLanes.push(newSwimLane2);
        }else{
          _tdNextToBody[jIndex+k].swimLanes.splice(_i2,0,newSwimLane2);
        }
      }
    }else{/*否则只修改名称*/
      pointer.name=e.target.value;
    }
    e.target.style.display="none";
    e.target.nextSibling.nextSibling.style.display="inline-block";
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane);
    this.setState({
      array:sourceArray,
    });
  }

  handleOnClickWipCheckbox=(e)=>{
    let sourceArray = this.deepCopy(this.state.array);
    let positionArray = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-position").split(",");
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    if(targetColumn.wipChecked){
      targetColumn.wipChecked = false;
    }else{
      targetColumn.wipChecked = true;
    }
    this.setState({
      array:sourceArray,
    });
  }

  /*控制是否显示当前列菜单，使用全局变量window.openMenu来记录所有打开的列菜单*/
  ifDisplayColumnMenu=(node)=>{
    for(let m=0;m<window.openMenu.length;m++){
      if(node.id!=null){
        if(node.id==window.openMenu[m]){
          return true;
        }
      }else{
        if(node.uniqueId==window.openMenu[m]){
          return true;
        }
      }
    }
    // console.log("进行到这里了");
    return false;
  }

  handleOnSaveColumn=(e)=>{
    this.removeInvalidRecord();
    /*移除openMenu和openMenuTemp的记录*/
    let columnMenu = e.target.parentNode.parentNode.lastChild;
    columnMenu.style.display = 'none';
    for(let m=0;m<window.openMenu.length;m++){
      if(window.openMenu[m]==columnMenu.parentNode.id){
        window.openMenu.splice(m,1);
        window.openMenuTemp.splice(m,1);
        break;
      }
    }
    /*保存对列的在制品限制*/
    let sourceArray = this.deepCopy(this.state.array);
    let positionArray = e.target.parentNode.parentNode.getAttribute("data-position").split(",");
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    if(columnMenu.firstChild.firstChild.firstChild.firstChild.checked){
      targetColumn.wipNum = e.target.previousSibling.previousSibling.lastChild.value;
    }else{
      targetColumn.wipNum = -1;
      // columnMenu.firstChild.lastChild.value = this.state.height;
    }
    /*查找当前看板上的起始列和终止列id*/
    let startAndEndColumnId = this.findStartAndEndColumnId(targetColumn);
    /*初始化看板起始列和终止列之间的类为doing状态*/
    for(let node_ of sourceArray){
      this.initAllColumn(node_,startAndEndColumnId);
    }
    /*初始化部分列的status为todo状态*/
    if(startAndEndColumnId.startColumnId!=null){
      this.initStartStatus(startAndEndColumnId.startColumnId,sourceArray);
    }
    /*初始化部分列的status为done状态*/
    if(startAndEndColumnId.endColumnId!=null){
      this.initEndStatus(startAndEndColumnId.endColumnId,sourceArray);
    }
    this.createHistoryState(sourceArray,this.state.height,this.state.isCreatingSwimLane);
    this.setState({
      array:sourceArray,
    });
  }
  initAllColumn=(root,startAndEndColumnId)=>{
    if(root.subColumns==null||root.subColumns.length==0){
      if(root.status!="pb"){
        root.status = "doing";
      }
      root.startChecked = false;
      root.endChecked = false;
      root.selected=false;
      // if(root.id!=null){
      //   if(startAndEndColumnId["startColumnId"]!=null||startAndEndColumnId["endColumnId"]!=null){
      //     if(root.id!=startAndEndColumnId["startColumnId"]&&root.id!=startAndEndColumnId["endColumnId"]){
      //       root.selected = false;
      //     }
      //   }else{
      //     root.selected = false;
      //   }
      // }else{
      //   if(startAndEndColumnId["startColumnId"]!=null||startAndEndColumnId["endColumnId"]!=null){
      //     if(root.uniqueId!=startAndEndColumnId["startColumnId"]&&root.uniqueId!=startAndEndColumnId["endColumnId"]){
      //       root.selected = false;
      //     }
      //   }else{
      //     root.selected = false;
      //   }
      // }
      return;
    }
    for(let node of root.subColumns){
      this.initAllColumn(node,startAndEndColumnId);
    }
    if(root.status!="pb"){
      root.status = "doing";
    }
    root.startChecked = false;
    root.endChecked = false;
    root.selected=false;
    // if(root.id!=null){
    //   if(startAndEndColumnId["startColumnId"]!=null||startAndEndColumnId["endColumnId"]!=null){
    //     if(root.id!=startAndEndColumnId["startColumnId"]&&root.id!=startAndEndColumnId["endColumnId"]){
    //       root.selected = false;
    //     }
    //   }else{
    //     root.selected = false;
    //   }
    // }else{
    //   if(startAndEndColumnId["startColumnId"]!=null||startAndEndColumnId["endColumnId"]!=null){
    //     if(root.uniqueId!=startAndEndColumnId["startColumnId"]&&root.uniqueId!=startAndEndColumnId["endColumnId"]){
    //       root.selected = false;
    //     }
    //   }else{
    //     root.selected = false;
    //   }
    // }
  }
  findColumn=(targetStatus)=>{
    let result = null;
    for(let item of document.getElementsByTagName("thead")[0].getElementsByTagName("td")){
      if(item.id!="pb"){
        if(item.firstChild.nextSibling.getAttribute("data-status")==targetStatus){
          result=item.id;
          break;
        }
      }
    }
    return result;
  }
  findStartAndEndColumnId=(targetColumn)=>{
    let result = {};
    if(targetColumn.startChecked){
      let startColumnId = targetColumn.id==null?targetColumn.uniqueId:targetColumn.id
      result["startColumnId"]=startColumnId;
      /*找终止列*/
      let endColumnId = this.findColumn("done:Y");
      if(endColumnId==startColumnId){
        result["endColumnId"]=null;
      }else{
        result["endColumnId"]=this.findColumn("done:Y");
      }
    }else if(targetColumn.endChecked){
      let endColumnId = targetColumn.id==null?targetColumn.uniqueId:targetColumn.id
      result["endColumnId"]=endColumnId;
      /*找起始列*/
      let startColumnId = this.findColumn("todo:Y");
      if(startColumnId==endColumnId){
        result["startColumnId"]=null;
      }else{
        result["startColumnId"]=this.findColumn("todo:Y");
      }
    }else{
      /*找起始列和终止列*/
      let start = this.findColumn("todo:Y");
      let end = this.findColumn("done:Y");
      if(start==null||start==targetColumn.id||start==targetColumn.uniqueId){
        result["startColumnId"]=null;
      }else{
        result["startColumnId"]=start;
      }
      if(end==null||end==targetColumn.id||end==targetColumn.uniqueId){
        result["endColumnId"]=null;
      }else{
        result["endColumnId"]=end;
      }
    }


    // if(targetColumn.selected){
    //   if(!targetColumn.startChecked&&!targetColumn.endChecked){
    //     /*find*/
    //   }else{
    //
    //   }
    // }else{
    //   if(targetColumn.startChecked){
    //     result["startColumnId"]=targetColumn.id==null?targetColumn.uniqueId:targetColumn.id;
    //   }else if(targetColumn.endChecked){
    //     result["endColumnId"]=targetColumn.id==null?targetColumn.uniqueId:targetColumn.id;
    //   }else{
    //     /*find*/
    //   }
    // }
    // if(targetColumn.startChecked){
    //   result["startColumnId"]=targetColumn.id==null?targetColumn.uniqueId:targetColumn.id;
    // }else if(targetColumn.endChecked){
    //   result["endColumnId"]=targetColumn.id==null?targetColumn.uniqueId:targetColumn.id;
    // }else{
    //   if(targetColumn.selected){
    //
    //   }
    // }
    //
    //
    // /******/
    // if(targetColumn.startChecked){
    //   result["startColumnId"]=targetColumn.id==null?targetColumn.uniqueId:targetColumn.id;
    // }else if(!targetColumn.selected){
    //   /*在所有列中查找起始列*/
    //   let flag = false;
    //   for(let item of document.getElementsByTagName("thead")[0].getElementsByTagName("td")){
    //     /*列的颜色为orange的为起始列*/
    //     if(item.id!="pb"){
    //       if(item.firstChild.nextSibling.nextSibling.getAttribute("data-status")=="todo"){
    //         result["startColumnId"]=item.id;
    //         flag = true;
    //         break;
    //       }
    //     }
    //   }
    //   if(!flag){
    //     result["startColumnId"]=null;
    //   }
    //   // /*在所有列中查找起始列*/
    // }else{
    //   result["startColumnId"]=null;
    // }
    // if(targetColumn.endChecked){
    //   result["endColumnId"]=targetColumn.id==null?targetColumn.uniqueId:targetColumn.id;
    // }else if(!targetColumn.selected){
    //   /*在所有列中查找终止列*/
    //   let flag_ = false;
    //   for(let item_ of document.getElementsByTagName("thead")[0].getElementsByTagName("td")){
    //     /*列的颜色为orange的为起始列*/
    //     if(item_.id!="pb"){
    //       if(item_.firstChild.nextSibling.nextSibling.getAttribute("data-status")=="done"){
    //         result["endColumnId"]=item_.id;
    //         flag_ = true;
    //         break;
    //       }
    //     }
    //   }
    //   if(!flag_){
    //     result["endColumnId"]=null;
    //   }
    // }else{
    //   result["endColumnId"]=null;
    // }

    // for(let item of document.getElementsByTagName("thead")[0].getElementsByTagName("td")){
    //   if(item.lastChild.firstChild.lastChild.firstChild.checked){
    //     result["startColumnId"] = item.id;
    //   }
    //   if(item.lastChild.firstChild.lastChild.lastChild.checked){
    //     result["endColumnId"] = item.id;
    //   }
    // }
    // window.startColumnId = result["startColumnId"];
    // window.endColumnId = result["endColumnId"];
    return result;
  }

  handleOnCancelColumn=(e)=>{
    let columnMenu = e.target.parentNode.parentNode.lastChild;
    let sourceArray = this.deepCopy(this.state.array);
    let positionArray = e.target.parentNode.parentNode.getAttribute("data-position").split(",");
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    for(let m=0;m<window.openMenuTemp.length;m++){
      if(window.openMenuTemp[m].id==columnMenu.parentNode.id){
        targetColumn.wipNum = window.openMenuTemp[m].wipNum;
        targetColumn.wipChecked = window.openMenuTemp[m].wipChecked;
        targetColumn.startChecked = window.openMenuTemp[m].startChecked;
        targetColumn.endChecked = window.openMenuTemp[m].endChecked;
        window.openMenuTemp.splice(m,1);
        window.openMenu.splice(m,1);
        break;
      }
    }
    columnMenu.style.display = 'none';
    if(targetColumn.wipNum!=-1){
      columnMenu.firstChild.lastChild.value = targetColumn.wipNum;
    }
    this.setState({
      array:sourceArray,
    })
  }
  initStartStatus=(columnId,sourceArray)=>{
    let parentTd = document.getElementById(columnId);
    // let sourceArray = this.deepCopy(this.state.array);
    let positionArray = parentTd.getAttribute("data-position").split(",");
    // let parentPositionArray = this.deepCopy(positionArray).splice(positionArray.length-1,1);
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    // let parentColumn = this.findTargetColumn(sourceArray,parentPositionArray);
    targetColumn.selected = true;
    targetColumn.startChecked = true;

    for(let i=positionArray.length-1;i>=0;i--){
      let count = positionArray[i];
      let parentPositionArrayTemp="";
      let positiontArrayTemp="";
      for(let k=0;k<=i;k++){
        if(k==0){
          positiontArrayTemp+=positionArray[k];
        }else{
          positiontArrayTemp+=","+positionArray[k];
        }
      }
      let targetColumnTemp;
      let parentColumnTemp;
      if(i==0){
        parentPositionArrayTemp=null;
      }else{
        for(let k_=0;k_<i;k_++){
          if(k_==0){
            parentPositionArrayTemp+=positionArray[k_];
          }else{
            parentPositionArrayTemp+=","+positionArray[k_];
          }
        }

      }

      targetColumnTemp = this.findTargetColumn(sourceArray,positiontArrayTemp.split(","));
      if(parentPositionArrayTemp!=null){
        parentColumnTemp = this.findTargetColumn(sourceArray,parentPositionArrayTemp.split(","));
      }else{
        parentColumnTemp = null;
      }
      for(let j=0;j<=count;j++){
        if(parentColumnTemp!=null){
          if(!this.containsTargetColumn(parentTd.getAttribute("data-parentId"),parentColumnTemp.subColumns[j].id==null?parentColumnTemp.subColumns[j].uniqueId:parentColumnTemp.subColumns[j].id)){
            /*全部都改状态*/
            this.changeLegalColumnStatus(parentColumnTemp.subColumns[j],"todo");
          }else{
            /*检查是否改状态*/
            let flag = true;
            for(let subColumn of parentColumnTemp.subColumns){
              if(subColumn.status!="todo"){
                flag = false;break;
              }
            }
            if(!flag){
              parentColumnTemp.subColumns[j].status = "other";
            }else{
              parentColumnTemp.status=="todo";
            }
          }
        }else{
          // this.changeLegalColumnStatus(sourceArray[j],"todo");
          if(!this.containsTargetColumn(parentTd.getAttribute("data-parentId"),sourceArray[j].id==null?sourceArray[j].uniqueId:sourceArray[j].id)){
            /*全部都改状态*/
            this.changeLegalColumnStatus(sourceArray[j],"todo");
          }else{
            /*检查是否改状态*/
            let flag = true;
            for(let subColumn of sourceArray[j].subColumns){
              if(subColumn.status!="todo"){
                flag = false;break;
              }
            }
            if(!flag){
              sourceArray[j].status = "other";
            }else{
              // sourceArray[j].status=="todo";
              this.changeLegalColumnStatus(sourceArray[j],"todo");
            }
          }
        }
      }
    }
    // this.setState({
    //   array:sourceArray,
    // });
  }
  initEndStatus=(columnId,sourceArray)=>{
    let parentTd = document.getElementById(columnId);
    // let sourceArray = this.deepCopy(this.state.array);
    let positionArray = parentTd.getAttribute("data-position").split(",");
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    targetColumn.selected = true;
    targetColumn.endChecked = true;

    for(let i=positionArray.length-1;i>=0;i--){
      let parentPositionArrayTemp="";
      let positiontArrayTemp="";
      for(let k=0;k<=i;k++){
        if(k==0){
          positiontArrayTemp+=positionArray[k];
        }else{
          positiontArrayTemp+=","+positionArray[k];
        }
      }
      let targetColumnTemp;
      let parentColumnTemp;
      if(i==0){
        parentPositionArrayTemp=null;
      }else{
        for(let k_=0;k_<i;k_++){
          if(k_==0){
            parentPositionArrayTemp+=positionArray[k_];
          }else{
            parentPositionArrayTemp+=","+positionArray[k_];
          }
        }
      }
      targetColumnTemp = this.findTargetColumn(sourceArray,positiontArrayTemp.split(","));
      if(parentPositionArrayTemp!=null){
        parentColumnTemp = this.findTargetColumn(sourceArray,parentPositionArrayTemp.split(","));
      }else{
        parentColumnTemp = null;
      }
      let count;
      if(parentColumnTemp!=null){
        count = parentColumnTemp.subColumns.length - 1;
      }else{
        count = sourceArray.length-1;
      }
      console.log("targetColumnTemp.sequence:"+targetColumnTemp.sequence);
      for(let j=targetColumnTemp.sequence-1;j<=count;j++){
        if(parentColumnTemp!=null){
          if(!this.containsTargetColumn(parentTd.getAttribute("data-parentId"),parentColumnTemp.subColumns[j].id==null?parentColumnTemp.subColumns[j].uniqueId:parentColumnTemp.subColumns[j].id)){
            /*全部都改状态*/
            this.changeLegalColumnStatus(parentColumnTemp.subColumns[j],"done");
          }else{
            /*检查是否改状态*/
            let flag = true;
            for(let subColumn of parentColumnTemp.subColumns){
              if(subColumn.status!="done"){
                flag = false;break;
              }
            }
            if(!flag){
              parentColumnTemp.subColumns[j].status = "other";
            }else{
              parentColumnTemp.status=="done";
            }
          }
        }else{
          // this.changeLegalColumnStatus(sourceArray[j],"todo");
          if(!this.containsTargetColumn(parentTd.getAttribute("data-parentId"),sourceArray[j].id==null?sourceArray[j].uniqueId:sourceArray[j].id)){
            /*全部都改状态*/
            this.changeLegalColumnStatus(sourceArray[j],"done");
          }else{
            /*检查是否改状态*/
            let flag = true;
            for(let subColumn of sourceArray[j].subColumns){
              if(subColumn.status!="done"){
                flag = false;break;
              }
            }
            if(!flag){
              sourceArray[j].status = "other";
            }else{
              // sourceArray[j].status=="todo";
              this.changeLegalColumnStatus(sourceArray[j],"done");
            }
          }
        }
      }
    }
    // this.setState({
    //   array:sourceArray,
    // });
  }

  // handleOnNumberChange=(e)=>{
  //   let sourceArray = this.deepCopy(this.state.array);
  //   let positionArray = e.target.parentNode.parentNode.parentNode.getAttribute("data-position").split(",");
  //   let targetColumn = this.findTargetColumn(sourceArray,positionArray);
  //   targetColumn.wipNum = e.target.value;
  //   this.setState({
  //     array:sourceArray,
  //   });
  // }
  handleOnClickStartCheckbox=(e)=>{
    let parentTd = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    let sourceArray = this.deepCopy(this.state.array);
    let positionArray = parentTd.getAttribute("data-position").split(",");
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    targetColumn.startChecked = !targetColumn.startChecked;
    this.setState({
      array: sourceArray,
    });

    /**************************************/

    // for(let i=0;i<=targetColumn.sequence;i++){
    //   parentColumn.subColumns[i].status = "todo";
    // }
  }

  handleOnClickEndCheckbox=(e)=>{
    let parentTd = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    let sourceArray = this.deepCopy(this.state.array);
    let positionArray = parentTd.getAttribute("data-position").split(",");
    let targetColumn = this.findTargetColumn(sourceArray,positionArray);
    // if(!targetColumn.endChecked){
    //   targetColumn.startDisabled = true;
    // }else{
    //   targetColumn.startDisabled = false;
    // }
    targetColumn.endChecked = !targetColumn.endChecked;
    this.setState({
      array: sourceArray,
    });
  }

  /*将指定列（包括子列）的所有状态赋予target*/
  changeLegalColumnStatus=(column,target)=>{
    if(column.subColumns==null||column.subColumns.length==0){
      column.status = target;
      return;
    }
    for(let item of column.subColumns){
      this.changeLegalColumnStatus(item,target);
    }
    column.status = target;
  }

  containsTargetColumn=(targetColumnParentId,parentId)=>{
    let parentIdArray = targetColumnParentId.split(",");
    for(let item of parentIdArray){
      if(item==parentId){
        return true;
      }
    }
    return false;
  }
  findSpecialColumn=(array,status,result)=>{
    for(let item of array){
      this.findSpecialColumnTool(item,status,result);
    }
  }
  findSpecialColumnTool=(root,status,result)=>{
    if(root.subColumns==null||root.subColumns.length==0){
      if(root.selected&&root.status==status){
        result["specialColumn"] = root;
      }
      return;
    }
    for(let subColumn of root.subColumns){
      this.findSpecialColumnTool(subColumn,status,result);
    }
    if(root.selected&&root.status==status){
      result["specialColumn"] = root;
    }
  }
  // findSpecialColumnTopParentIndex=(array,status)=>{
  //   let index = -1;
  //   for(let i=0;i<array.length;i++){
  //     if(this.findSpecialColumnTopParentIndexTool(array[i],status)){
  //       index = i;
  //       break;
  //     }
  //   }
  //   return index;
  // }
  // findSpecialColumnTopParentIndexTool=(root,status)=>{
  //   if(root.subColumns==null||root.subColumns.length==0){
  //     if(root.selected&&root.status==status){
  //       return true;
  //     }else{
  //       return false;
  //     }
  //   }
  //   if(root.selected&&root.status==status){
  //     return true;
  //   }
  //   let flag = false;
  //   for(let subColumn of root.subColumns){
  //     if(this.findSpecialColumnTopParentIndexTool(subColumn,status)){
  //       flag = true;
  //       break;
  //     }
  //   }
  //   return flag;
  // }
  // disableCheckboxOnBothEnds=(root,status)=>{
  //   if(root.subColumns==null||root.subColumns.length==0){
  //     if(status=="start"){
  //       root.endDisabled = true;
  //     }else{
  //       root.startDisabled = true;
  //     }
  //     return;
  //   }
  //   for(let subColumn of root.subColumns){
  //     this.disableCheckboxOnBothEnds(subColumn,status);
  //   }
  //   if(status=="start"){
  //     root.endDisabled = true;
  //   }else{
  //     root.startDisabled = true;
  //   }
  // }
  //
  // findSpecialColumnParent=(status,stack)=>{
  //   while(stack.length!=0){
  //     let node = stack.shift();
  //     if(node.subColumns!=null){
  //       for(let i=0;i<node.subColumns.length;i++){
  //         let subColumn = node.subColumns[i];
  //         stack.push(subColumn);
  //         if(subColumn.selected&&subColumn.status===status){
  //           let result = {};
  //           result["index"]=i;
  //           result["parentColumn"]=node;
  //           return result;
  //         }
  //       }
  //     }
  //   }
  // }
  /*根据status控制起始列和终止列设置按钮的禁用状态，status为根节点的状态信息（todo需要设置endDisable,done需要设置startDisable）*/
  disableWholeTreeByStatus=(root,status)=>{
    let flag = true;
    if(root.selected){
      flag = false;
    }
    if(root.subColumns==null||root.subColumns.length==0){
      if(status=="todo"&&flag){
        root.endDisabled = true;
      }else if(status=="done"&&flag){
        root.startDisabled = true;
      }
      return;
    }
    for(let subColumn of root.subColumns){
      this.disableWholeTreeByStatus(subColumn,status);
    }
    if(status=="todo"&&flag){
      root.endDisabled = true;
    }else if(status=="done"&&flag){
      root.startDisabled = true;
    }
  }
  // recoverWholeTreeByStatus=(root,status)=>{
  //   if(root.subColumns==null||root.subColumns.length==0){
  //     if(status=="todo"){
  //       root.startDisabled = false;
  //     }else if(status=="done"){
  //       root.endDisabled = false;
  //     }
  //     return;
  //   }
  //   for(let subColumn of root.subColumns){
  //     this.recoverWholeTreeByStatus(subColumn,status);
  //   }
  //   if(status=="todo"){
  //     root.startDisabled = false;
  //   }else if(status=="done"){
  //     root.endDisabled = false;
  //   }
  // // }

  /*根据state控制列的起始列和终止列设置按钮的状态，position为目标列的位置信息，status为目标列的状态*/
  initDisabledStateByStatus=(array,position,status)=>{
    let positionArray = position.toString().split(",");
    for(let a=0;a<positionArray.length;a++){
      positionArray[a] = parseInt(positionArray[a]);
    }
    for(let i=positionArray.length-1;i>=0;i--){
      let parentPositionArray = [];
      for(let j=0;j<i;j++){
        parentPositionArray.push(positionArray[j]);
      }
      if(parentPositionArray.length!=0){
        let parentColumn = this.findTargetColumn(array,parentPositionArray);
        if(status==="todo"){
          parentColumn.endDisabled = true;
          for(let k=0;k<positionArray[i];k++){
            this.disableWholeTreeByStatus(parentColumn.subColumns[k],status);
          }
        }else if(status==="done"){
          parentColumn.startDisabled = true;
          for(let k=positionArray[i]+1;k<parentColumn.subColumns.length;k++){
            this.disableWholeTreeByStatus(parentColumn.subColumns[k],status);
          }
        }

      }else{/*最上层数组*/
        if(status==="todo"){
          if(!(array[positionArray[i]].selected&&array[positionArray[i]].status=="todo")){
            array[positionArray[i]].endDisabled = true;
          }
          // array[positionArray[i]].endDisabled = true;
          for(let l=0;l<positionArray[i];l++){
            this.disableWholeTreeByStatus(array[l],status);
          }
        }else if(status==="done"){
          if(!(array[positionArray[i]].selected&&array[positionArray[i]].status=="done")){
            array[positionArray[i]].startDisabled = true;
          }
          for(let l=positionArray[i]+1;l<array.length;l++){
            this.disableWholeTreeByStatus(array[l],status);
          }
        }
      }
    }

  }

  /*使用队列queue层次遍历生成看板的表结构*/
  generateTable(array,kanbanHeight){
    /*数组tdNextToBody记录thead中和tbody相邻的td单元*/
    window.tdNextToBody = [];
    /*thead和tbody保存结果tr信息*/
    let queue = [],thead = [],tbody = [];
    /* currentLayoutLength：当前层次下节点的数量、 nextLayoutLength：下一层节点的数量、currentLayout：当前层树*/
    let currentLayoutLength = array.length,nextLayoutLength = 0,currentLayout = 1;
    /*表头森林的深度*/
    let depth = this.getKanbanDepth(array);
    for(let i=0;i<array.length;i++){/*将源数组元素压入队列*/
      queue.unshift(array[i]);
      /*初始化源数组，设置各列相对应的colSpan,nextToBody,position属性*/
      this.initColumn(array[i],i);
    }
    /*将不合法的设置终止列按钮禁用*/
    if(array!=null&&array.length!=0){
      let target = {};
      /*查找起始列，存入target对象*/
      this.findSpecialColumn(array,"todo",target);
      if(target.specialColumn!=null){/*若起始列存在，先将以起始列节点为根节点的树所有的终止列设置按钮全部禁用*/
        this.disableWholeTreeByStatus(target.specialColumn,"todo");
        let startPosition = target.specialColumn.position;
        /*层级初始化todo列之前列的终止列设置状态*/
        this.initDisabledStateByStatus(array,startPosition,"todo");
      }
      /*将不合法的设置起始列按钮禁用，逻辑类比起始列*/
      target = {};
      this.findSpecialColumn(array,"done",target);
      if(target.specialColumn!=null){
        this.disableWholeTreeByStatus(target.specialColumn,"done");
        let endPosition = target.specialColumn.position;
        this.initDisabledStateByStatus(array,endPosition,"done");
      }
    }

    /*用来保存同一个tr中的td元素，初始化包含pb列*/
    let row = [];
    while(queue.length!=0){/*利用队列层次遍历表头树，动态创建tr td标签*/
      let node = queue.pop();
      /*display控制列菜单是否显示，defalutValue为在制品input的初始化值，wip为左上角在制品数值的显示*/
      let display = this.ifDisplayColumnMenu(node);
      let defalutValue = (node.wipNum==-1||node.wipNum==null)?this.state.height:node.wipNum;
      let wip = null;
      if(node.nextToBody==1&&node.wipNum!=-1){
        wip = (
          <Popover content="在制品">
            {/*rgb(48, 63, 159)*/}
            <span style={{position: 'relative', color: 'white',top: -4,left:4}}>({node.wipNum})</span>
          </Popover>);
      }else {
        wip = <span/>;
      }
      /*渲染表头*/
      row.push(<td id={node.id==null?node.uniqueId:node.id} rowSpan={(node.subColumns==null||node.subColumns.length==0)?(depth-currentLayout+1):1}
      colSpan={node.colSpan} key={node.id==null?node.uniqueId:node.id} data-colWidth={node.width==0?1:node.width} data-status="doing"
      data-columnId={node.id} data-nextToBody={node.nextToBody} data-parentId={node.parentId}
      data-position={node.position} data-uniqueId={node.uniqueId}>
        <div>
          <div className="edit-item edit-close" style={{position:'absolute',top:0,right:8}}>
            <Icon type="close" style={{fontSize:12}} />
          </div>
          <div className="kanban-column-name" onDoubleClick={this.showAlterColumnNameInput} style={{
            display:'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            position: 'relative',
            /* height: 17px; */
            top: 4,
            maxWidth: 84,
          }} title={node.name}>{node.name}</div>
          {wip}

          <Input className="edit-kanban-column-name-input" style={{backgroundColor:'white',position:'relative',display:'none',padding:'none', width: '50%'}} placeholder="未命名列名" defaultValue={node.name=='未命名列名'?'':node.name} onBlur={this.handleOnAlterColumnName} onPressEnter={this.handleOnAlterColumnName}/>

          <div className="edit-item" style={{
            display: 'inline-block',
            position: 'absolute',
            left: 10,
            bottom: -2,
            cursor:'pointer',
            /*设置zIndex的目的是防止被+号图标的div挡住*/
            zIndex:2,
          }}>
            <Icon type="setting" style={{fontSize:12}} onClick={this.handleOnSetColumn}/>
          </div>
          <div className="edit-item" style={{
            display: 'inline-block',
            position: 'absolute',
            bottom: -3,
            width: '100%',
            left: 0,
            textAlign: 'center',
          }}>
            <Icon type="plus" style={{fontSize:12}}/>
          </div>
          <div className="edit-item" style={{
            display: 'inline-block',
            position: 'absolute',
            right: 8,
            bottom: -3,
          }}>
            <Icon type="verticle-left" style={{fontSize:12}}/>
          </div>


          {/*<div style={{position: 'absolute',bottom: -4,width: '98%',left:'1%',height:4,}}>*/}
            {/*<div className="edit-bottom">*/}
              {/*<div className="edit-item"><Icon type="setting" style={{fontSize:12}}/></div>*/}
              {/*<div className="edit-item"><Icon type="plus" style={{fontSize:12}}/></div>*/}
              {/*<div className="edit-item"><Icon type="verticle-left" style={{fontSize:12}}/></div>*/}
            {/*</div>*/}
          {/*</div>*/}
        </div>
        {/*<span style={{position: 'absolute', top: 0, left: 3}}>{node.wipNum!=null?`wip:${node.nextToBody==1?node.wipNum}`:''}</span>*/}
        <SystemColumnContent columnStatus={node.status} selected={node.selected}/>
        <div className="column-menu"  style={display?{display:'block'}:{display:'none'}}>
          <div className="wipDiv">
            <Checkbox onClick={this.handleOnClickWipCheckbox} checked={node.wipChecked} disabled={node.wipDisabled}/>
            <span>在制品:</span>
            <InputNumber disabled={!node.wipChecked} defaultValue={defalutValue}/>
          </div>
          <div className="startAndEndDiv">
            <Checkbox checked={node.startChecked} onClick={this.handleOnClickStartCheckbox} disabled={node.startDisabled}/>
            <span>起始列</span>
            <Checkbox checked={node.endChecked} onClick={this.handleOnClickEndCheckbox} disabled={node.endDisabled}/>
            <span>终止列</span>
          </div>
          <Button id="wip-save-button" onClick={this.handleOnSaveColumn} type="primary" size="small" style={{borderColor:'white', backgroundColor: 'rgba(33, 150, 243, 0)',borderColor:'unset',height:14,padding:'0 4px',}}>保存</Button>
          <Button onClick={this.handleOnCancelColumn} size="small" style={{color: 'rgba(158, 158, 158, 0.75)',height:14,padding:'0 4px',}}>取消</Button>
        </div>
      </td>);
      currentLayoutLength-=1;
      if(node.subColumns!=null){/*若子列数组不为空，则依次将子列添加到队列中，并记录下层节点数量*/
        nextLayoutLength+=node.subColumns.length;
        for(let item of node.subColumns){
          queue.unshift(item);
        }
      }else{/*防止子列数组出现null，引起不必要的异常*/
        node.subColumns = [];
      }
      if(currentLayoutLength==0){/*当前层次下节点的数量为0时，进入下一层，将row包装成tr压入thead*/
        thead.push(<tr key={currentLayout}>{row}</tr>);
        row = [];
        /*重新设置相应计数器，层数加1*/
        currentLayoutLength=nextLayoutLength;
        nextLayoutLength=0;
        currentLayout+=1;
      }
    }
    /*初始化tbody，包含极为复杂的泳道渲染逻辑，swimLaneIndexArray数组记录各列的泳道坐标，初始化为0*/
    let swimLaneIndexArray = new Array(tdNextToBody.length);
    swimLaneIndexArray.fill(0);
    let rowTbody = [];
    let swimLane;
    let groupIds = {};
    let i = 0;
    for(;i<kanbanHeight;i++){
      rowTbody = [];
      for(let j=0;j<tdNextToBody.length+1;j++){/*为了解决table的一整行td同时使用rowSpan会坍塌并且显示异常的问题，在最后一列额外添加不予以显示的td（通过css控制widt和border）*/
        if(j==tdNextToBody.length){
          rowTbody.push(<td className="not-show"></td>);
        }else{
          /*needGenerateSwimLane表示是否需要渲染泳道*/
          let needGenerateSwimLane = false;
          if(tdNextToBody[j].swimLanes!=null&&tdNextToBody[j].swimLanes.length!=0){
            swimLane = tdNextToBody[j].swimLanes[swimLaneIndexArray[j]];
            if(i==swimLane.position){
              needGenerateSwimLane = true;
            }
          }
          if(needGenerateSwimLane){/*若第i行需要绘制泳道，记录下当前swimLane的位置*/
            if(swimLane.width>1){/*当泳道的宽度大于1时，当前泳道单元将会出现跨列问题*/
              if(tdNextToBody.length-j<swimLane.width){/*若当前列的数量不满足泳道长度的需要，将泳道长度更新为可用值*/
                swimLane.width=tdNextToBody.length-j-1;
              }
              /*解决跨列单元格的竖直虚线不对齐的问题，specialIndexArray记录需要特殊处理的div的坐标,colWidth为虚线div的单位宽度*/
              let colWidth = 0;
              let specialIndexArray = [];
              for(let k=0;k<swimLane.width;k++){
                colWidth+=tdNextToBody[j+k].width;
                if(swimLane.width>1&&k!=swimLane.width-1){
                  specialIndexArray.unshift(colWidth);
                }
              }

              /*selected决定单元格是否添加选中背景色，colWidth控制虚线div的绘制数量，相同groupId的单元格所属同一个泳道，
               swimName为泳道名称，ifAddName决定是否显示泳道名称（同一个泳道的名称只在第一个泳道单元格中显示），specialIndexArray记录需特殊处理虚线div的位置.
               parentId记录单元格所属列id或uniqueId,i/j为单元格在tbody上的位置*/
              rowTbody.push(<td style={i==this.state.height-1?{borderBottom:'1px solid #bebdbd'}:{}} className="swimlane-td" key={tdNextToBody[j].uniqueId+'-'+i+'-'+j} rowSpan={swimLane.height} colSpan={swimLane.width}>
                <InnerContent selected="true" groupId={swimLane.groupId} colWidth={colWidth}
                swimName={swimLane.name} ifAddName={this.ifAddName(swimLane.groupId,groupIds)} specialIndexArray={specialIndexArray}
                showInput={this.showAlterSwimLaneNameInput} hideInput={this.handleOnAlterSwimLaneName} parentId={tdNextToBody[j].id==null?tdNextToBody[j].uniqueId:tdNextToBody[j].id} i={i} j={j}/></td>);
            }else{
              rowTbody.push(<td style={i==this.state.height-1?{borderBottom:'1px solid #bebdbd'}:{}} className="swimlane-td" key={tdNextToBody[j].uniqueId+'-'+i+'-'+j} rowSpan={swimLane.height}><InnerContent selected="true"
               groupId={swimLane.groupId} swimName={swimLane.name} ifAddName={this.ifAddName(swimLane.groupId,groupIds)} colWidth={tdNextToBody[j].width}
               showInput={this.showAlterSwimLaneNameInput} hideInput={this.handleOnAlterSwimLaneName} parentId={tdNextToBody[j].id==null?tdNextToBody[j].uniqueId:tdNextToBody[j].id} i={i} j={j}/></td>);
            }
            if(swimLaneIndexArray[j]<tdNextToBody[j].swimLanes.length-1){/*泳道指针需要指向下一个泳道（需要控制不溢界）*/
              swimLaneIndexArray[j]=swimLaneIndexArray[j]+1;
            }
          }else{/*不需要绘制泳道，但需要考虑是否渲染单元格（单元格的合并是通过rowSpan和colSpan实现的）*/
            let _i=0;
            if(tdNextToBody[j].swimLanes!=null){/*查找当前列中第一个position超过i的泳道的index（可能不存在）*/
              for(;_i<tdNextToBody[j].swimLanes.length;_i++){
                if(tdNextToBody[j].swimLanes[_i].position>i){
                  break;
                }
              }
            }

            if(_i==0){/*当前列没有泳道，只需要考虑当前单元格左侧是否有跨列泳道*/
              let _j=j-1;
              let hasSwimLaneLeft=false,indexSwimLeft;
              for(;_j>=0;_j--){
                if(tdNextToBody[_j].swimLanes!=null){
                  for(let k=0;k<tdNextToBody[_j].swimLanes.length;k++){
                    if(tdNextToBody[_j].swimLanes[k].position==i||(tdNextToBody[_j].swimLanes[k].position+tdNextToBody[_j].swimLanes[k].height>i)&&tdNextToBody[_j].swimLanes[k].position<i){
                      hasSwimLaneLeft=true;
                      indexSwimLeft=k;
                      break;
                    }
                  }
                }
                if(hasSwimLaneLeft){
                  break;
                }
              }
              if(hasSwimLaneLeft){
                if(j-_j+1>tdNextToBody[_j].swimLanes[indexSwimLeft].width){
                  rowTbody.push(<td style={i==this.state.height-1?{borderBottom:'1px solid #bebdbd'}:{}} key={tdNextToBody[j].uniqueId+'-'+i+'-'+j}><InnerContent selected="false"
                    colWidth={tdNextToBody[j].width} parentId={tdNextToBody[j].id==null?tdNextToBody[j].uniqueId:tdNextToBody[j].id} i={i} j={j}/></td>);
                }
              }else{
                rowTbody.push(<td style={i==this.state.height-1?{borderBottom:'1px solid #bebdbd'}:{}} key={tdNextToBody[j].uniqueId+'-'+i+'-'+j}><InnerContent selected="false"
                    colWidth={tdNextToBody[j].width} parentId={tdNextToBody[j].id==null?tdNextToBody[j].uniqueId:tdNextToBody[j].id} i={i} j={j}/></td>);
              }
            }else{/*否则还需要考虑单元格上方泳道的高度*/
              let swimLaneTop = tdNextToBody[j].swimLanes[_i-1];
              if(i-swimLaneTop.position+1>swimLaneTop.height){
                let _j=j-1;
                let hasSwimLaneLeft=false,indexSwimLeft;
                for(;_j>=0;_j--){
                  if(tdNextToBody[_j].swimLanes!=null){
                    for(let k=0;k<tdNextToBody[_j].swimLanes.length;k++){
                      if(tdNextToBody[_j].swimLanes[k].position==i||tdNextToBody[_j].swimLanes[k].position+tdNextToBody[_j].swimLanes[k].height>i&&tdNextToBody[_j].swimLanes[k].position<i){
                        hasSwimLaneLeft=true;
                        indexSwimLeft=k;
                        break;
                      }
                    }
                  }
                  if(hasSwimLaneLeft){
                    break;
                  }
                }
                if(hasSwimLaneLeft){
                  if(j-_j+1>tdNextToBody[_j].swimLanes[indexSwimLeft].width){
                    rowTbody.push(<td style={i==this.state.height-1?{borderBottom:'1px solid #bebdbd'}:{}} key={tdNextToBody[j].uniqueId+'-'+i+'-'+j}><InnerContent selected="false"
                      colWidth={tdNextToBody[j].width} parentId={tdNextToBody[j].id==null?tdNextToBody[j].uniqueId:tdNextToBody[j].id} i={i} j={j}/></td>);
                  }
                }else{
                  rowTbody.push(<td style={i==this.state.height-1?{borderBottom:'1px solid #bebdbd'}:{}} key={tdNextToBody[j].uniqueId+'-'+i+'-'+j}><InnerContent selected="false"
                      colWidth={tdNextToBody[j].width} parentId={tdNextToBody[j].id==null?tdNextToBody[j].uniqueId:tdNextToBody[j].id} i={i} j={j}/></td>);
                }
              }
            }
          }
        }
      }
      if(rowTbody.length!=0){
        tbody.push(<tr key={i+depth+1}>{rowTbody}</tr>);
      }
    }

    let tableInfo = {};
    tableInfo["thead"]=thead;
    tableInfo["tbody"]=tbody;
    return tableInfo;
  }
  /*控制是否在泳道单元格中显示名称*/
  ifAddName(groupId,array){
    if(array[groupId]==null){
      array[groupId]=1;
      return true;
    }else{
      return false;
    }
  }
  /*深度拷贝函数*/
  deepCopy(obj){
    if (obj instanceof Array) {
      let array = [];
      for (let i=0;i<obj.length;++i) {
        array[i] = this.deepCopy(obj[i]);
      }
      return array;
    } else if (obj instanceof Object) {
      let newObj = {}
      for (let field in obj) {
        newObj[field] = this.deepCopy(obj[field]);
      }
      return newObj;
    } else {
      return obj;
    }
  }
  /*初始化源数组，设置各自相应的colSpan,nextToBody,position字段*/
  initColumn(column,position){
    /*若subColumns不存在或长度为0则当前column位于thead最下层和tbody相邻，且colSpan为1*/
    if(column.subColumns==null||column.subColumns.length==0){
      column["colSpan"] = 1;
      /*nextToBody字段为1标志和tbody相邻*/
      column["nextToBody"] = 1;
      /*position字段通过递归的方式构造出当前列的索引数组*/
      column["position"]=position;

      /*第一次加载数组时需要根据实际情况初始化selected(是否为起始终止列的状态)、
      wipChecked（在制品设置按钮是否选中）、wipDiabled(在制品设置按钮是否禁用)、
      startChecked（终止列是否选中）、endChecked（终止列是否选中）*/
      if(column.selected==null){
        column.selected=false;
      }

      if(column.wipChecked==null){
        if(column.wipNum!=-1){
          column["wipChecked"]=true;
        }else{
          column["wipChecked"]=false;
        }
      }
      column.wipDisabled = false;
      if(column.startChecked==null){
        if(column.selected&&column.status=="todo"){
          column["startChecked"]=true;
        }else{
          column["startChecked"]=false;
        }
      }
      if(column.endChecked==null){
        if(column.selected&&column.status=="done"){
          column["endChecked"]=true;
        }else{
          column["endChecked"]=false;
        }
      }
      /*根据startChecked和endChecked粗略的设置下startDiable和endDisable(由于具体的逻辑规则，还需要更加严格的限制，如：起始列之前不能设置终止列)*/
      if(column.startChecked&&!column.endChecked){
        column.startDisabled=false;
        column.endDisabled=true;
      }else if(!column.startChecked&&column.endChecked){
        column.startDisabled=true;
        column.endDisabled=false;
      }else if(!column.startChecked&&!column.endChecked){
        column.startDisabled=false;
        column.endDisabled=false;
      }

      tdNextToBody.push(column);
      return 1;
    }

    /*否则colSpan的值取决于当前列的子列colSpan之和，且当前列不和tbody相邻*/
    let colSpan = 0;
    for(let i=0;i<column.subColumns.length;i++){
      colSpan += this.initColumn(column.subColumns[i],position+","+i);
    }
    /****************************/

    column["colSpan"] = colSpan;
    /*nextToBody字段为0标志和tbody不相邻*/
    column["nextToBody"] = 0;
    column["position"]=position;
    if(column.selected==null){
      column.selected=false;
    }

    if(column.startChecked==null){
      if(column.selected&&column.status=="todo"){
        column["startChecked"]=true;
      }else{
        column["startChecked"]=false;
      }
    }
    if(column.endChecked==null){
      if(column.selected&&column.status=="done"){
        column["endChecked"]=true;
      }else{
        column["endChecked"]=false;
      }
    }

    // if(column.wipChecked==null){
    //   if(column.wipNum!=-1){
    //     column["wipChecked"]=true;
    //   }else{
    //     column["wipChecked"]=false;
    //   }
    // }
    column.wipDisabled = true;
    column.wipChecked = false;

    if(column.startChecked&&!column.endChecked){
      column.startDisabled=false;
      column.endDisabled=true;
    }else if(!column.startChecked&&column.endChecked){
      column.startDisabled=true;
      column.endDisabled=false;
    }else if(!column.startChecked&&!column.endChecked){
      column.startDisabled=false;
      column.endDisabled=false;
    }

    return colSpan;
  }

  toUseKanbanPage=()=>{
    if(window.historyState.stateArray==null||window.historyState.stateArray.length==1){
      // e.target.blur();
      this.props.history.push(`/kanbanFront/kanban/${this.props.match.params.kanbanId}`);
    }else{
      let confirm = Modal.confirm({
        title: '确认前往看板使用页面?',
        content: '您当前的操作还未保存，请确认是否继续',
        okText:"确认",
        cancelText:"取消",
        style:{zIndex:1001},
        onOk:()=>{
          this.props.history.push(`/kanbanFront/kanban/${this.props.match.params.kanbanId}`);
          confirm.destroy();
        },
        onCancel() {},
      });
    }
  }

  handleOnScroll=()=>{
    let KanbantheadDom = document.getElementsByClassName('edit-kanban-thead');
    let KanbanContentDom = document.getElementsByClassName('kanban-content');
    KanbantheadDom[0].setAttribute('style', `top:${KanbanContentDom[0].scrollTop}px;position:absolute;z-index:1001;`)
  }

  render() {
    let tableInfo = this.generateTable(this.state.array,this.state.height);
    let thead = tableInfo.thead;
    let tbody = tableInfo.tbody;
    return (
      <div className="edit-kanban" style={{height: window.innerHeight - 48}}>
        <EditKanbanHeader kanbanName={this.state.kanbanName}
                          isCreatingSwimLane={this.state.isCreatingSwimLane}
                          handleOnAddColumn={this.handleOnAddColumn}
                          handleOnChangeModel={this.handleOnChangeModel}
                          handleOnAddHeight={this.handleOnAddHeight}
                          handleOnReduceHeight={this.handleOnReduceHeight}
                          handleOnRevocate={this.handleOnRevocate}
                          handleOnRecover={this.handleOnRecover}
                          handleOnSave={this.handleOnSave}
                          toUseKanbanPage={this.toUseKanbanPage}/>

        {/*<SiderMenu isCreatingSwimLane={this.state.isCreatingSwimLane}*/}
                   {/*handleOnAddColumn={this.handleOnAddColumn}*/}
                   {/*handleOnChangeModel={this.handleOnChangeModel}*/}
                   {/*handleOnAddHeight={this.handleOnAddHeight}*/}
                   {/*handleOnReduceHeight={this.handleOnReduceHeight}*/}
                   {/*handleOnRevocate={this.handleOnRevocate}*/}
                   {/*handleOnRecover={this.handleOnRecover}*/}
                   {/*handleOnSave={this.handleOnSave}*/}
                   {/*toUseKanbanPage={this.toUseKanbanPage}*/}
                   {/*resizeSiderMenu={this.resizeSiderMenu}/>*/}
        {/*<SiderMenu onCilckAddColumn={this.handleOnAddColumn} onClickAddHeight={this.handleOnAddHeight}*/}
        {/*onClickReduceHeight={this.handleOnReduceHeight} onClickSave={this.handleOnSave}/>*/}
        <div className="kanban-content" style={{overflow:'auto',position:'relative'}} onScroll={this.handleOnScroll}>
          <table className="edit-kanban-table" style={{borderCollapse:'collapse'}}>
            <thead className="edit-kanban-thead">
            {thead}
            </thead>
            <tbody className="edit-kanban-tbody">
            {tbody}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default EditKanban;
