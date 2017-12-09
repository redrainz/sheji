/*eslint-disable*/
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {observer} from 'mobx-react';
import KanbanStore from '../../../stores/origanization/kanban/KanbanStore';
import KanbanCard from '../../../components/common/KanbanCard';
import SmallKanbanCard from '../../../components/common/SmallKanbanCard';
import CardsDetail from '../../../components/kanban/CardsDetail'
import {Button, Layout, message, Icon, Row, Col, Collapse, Tooltip, Badge, Dropdown, Menu} from 'antd'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import KanbanPlanModel from '../../../components/kanban/KanbanPlanModel'
import ReleasePlanModel from '../../../components/kanban/ReleasePlanModel'
import PageHeader, {PageHeadStyle} from '../../../components/common/PageHeader'
import EditCardDetailModel from '../../../components/kanban/EditCardDetail'
import CreateCard from '../../../components/kanban/CreateCard'
import KanbanHeader from '../../../components/kanban/KanbanHeader'
import SystemColumnContent from '../../../components/editKanban/SystemColumnContent'

require('../../../assets/css/kanban-card.css');
require('../../../assets/css/kanban.css');
const grid = 8;
const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  marginBottom: grid,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

@observer
class Kanban extends Component {
  constructor(props) {
    super(props);
    this.reloadKanban = this.reloadKanban.bind(this);
    this.fetchTableInfo = this.fetchTableInfo.bind(this);

    this.state = {
      array: [],
      height: 1,
      depth: 1,
      userStoryCards: [],
      cards: [],
      kanbanName: ' ',
      displayState: 'none',
      userStoryCardInKanban: [],
      selectedCards: 0,
      theadLeft: 0,
      taskColumnState: 'none',
      issue: {},
      planState: false,
      releasePlanState: false,
      CreateCardState: 'none'
    }
    ;
    this.height = 1;
    this.columnId = 0;
    this.allColumn = [];
    this.tbodyTop = 0;
    this.area = {};
    this.swimLaneArea = {};
    this.hrWidth = 0;
  }


  /*重置页面大小*/
  resizeKanbanContent = () => {
    let kanbanContent = document.getElementsByClassName("kanban-content")[0];
    let topHeight = 58 + 30;
    let autoRouter = document.getElementById("autoRouter");
    console.log('autoRouter', autoRouter.style.height);
    let height = Number(autoRouter.style.height.substr(0, autoRouter.style.height.length - 2));
    kanbanContent.style.height = height - topHeight - 2 + "px";
  };

  /*给指定元素添加事件*/
  addEvent(obj, type, handle) {
    try {  /* Chrome、FireFox、Opera、Safari、IE9.0及其以上版本*/
      obj.addEventListener(type, handle, false);
    } catch (e) {
      try {  /*IE8.0及其以下版本*/
        obj.attachEvent('on' + type, handle);
      } catch (e) {  /*早期浏览器*/
        obj['on' + type] = handle;
      }
    }
  }

  bindEvent = () => {
    window.onresize = () => {
      this.resizeKanbanContent();
    }
  };


  // }

  componentWillMount() {
    this.fetchTableInfo();
    this.fetchTaskCards(this.props.match.params.kanbanId);
    KanbanStore.getKanBanName(this.props.match.params.kanbanId).then((res) => {
      if (res) {
        this.setState({
          kanbanName: res.name
        })
      }
    })
  }

  //获得泳道存在的区域
  getSwimLaneArea = (allColumn) => {
    let swimlaneArea = {}
    //初始化泳道区域
    allColumn.map((column) => {
      swimlaneArea[`${column.id}`] = []
    })
    //遍历所有与tbody相邻的列，如果存在泳道，将泳道的数据添加到泳道区域中
    for (let i = 0; i < allColumn.length; i++) {
      let item = allColumn[i]
      if (item.swimLanes != null) {
        item.swimLanes.map((swimLane) => {
          swimlaneArea[`${item.id}`].push({
            y: swimLane.position,
            height: swimLane.height,
            width: swimLane.width,
            name: swimLane.name,
            id: swimLane.id,
            columnWidth: item.width,
          });
          if (swimLane.width > 1) {
            for (let j = 1; j < swimLane.width; j++) {
              //将泳道添加至泳道覆盖的列中
              if (swimlaneArea[`${allColumn[i + j].id}`] != null) {
                swimlaneArea[`${allColumn[i + j].id}`].push({
                  y: swimLane.position,
                  height: swimLane.height,
                  width: swimLane.width,
                  name: swimLane.name,
                  id: swimLane.id,
                  columnWidth: item.width,
                })
              }
            }
          }
        })
      }
    }
    this.swimLaneArea = swimlaneArea;
  };
  //获取空白的区域（非泳道区域）
  getBlankArea = (allColumn, kanbanHeight) => {
    this.area = {}
    this.getSwimLaneArea(allColumn);
    for (let z = 0; z < allColumn.length; z++) {
      let column = allColumn[z];
      this.area[column.id] = [];
      if (this.swimLaneArea[column.id].length === 0) {
        //如果当前列没有泳道 直接push一个与列高相同的区域
        const a = {
          height: kanbanHeight,
          width: column.width,
          y: 0,
        };
        this.area[column.id].push(a);
      } else {
        //当前列的swimlane区域根据y排序
        let tempSwimLine = this.swimLaneArea[column.id].sort((a, b) => {
          return a.y - b.y
        });
        //如果泳道不再最上方，那么push一个与从0到泳道y的区域
        if (tempSwimLine[0].y !== 0) {
          const b = {
            height: tempSwimLine[0].y,
            width: column.width,
            y: 0,
          }
          this.area[column.id].push(b)
        }
        //遍历当前列的泳道，计算出空白区域
        for (let k = 0; k < tempSwimLine.length; k++) {
          let item = tempSwimLine[k];
          let nextItem = tempSwimLine[k + 1];
          let tempy = item.y + item.height;
          let tempheight = nextItem !== undefined ? nextItem.y - item.y - item.height : kanbanHeight - item.y - item.height;
          let temp = {
            height: tempheight,
            width: column.width,
            y: tempy,
          }
          if (temp.height !== 0) {
            this.area[column.id].push(temp)
          }
        }
      }
    }
  };
  //子组件刷新父组件函数
  getIssue = (cards) => {
    this.setState({
      cards: cards,
    })
  };

  /*利用随机数和时间戳生成一个不会重复的ID,并将其入队*/
  generateNoneDuplicateID(randomLength) {
    let noneDuplicateID = Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36);
    return noneDuplicateID;
  }

  /*
   * 该方法作为props传入子组件KanbanCard，被调用将重新渲染卡片
   * */
  reloadKanban() {
    this.fetchTaskCards(this.props.match.params.kanbanId);
  }

  /*初始化看板*/
  initTable() {
    this.resizeKanbanContent();
    /*初始化列的宽度*/
    for (let item of document.getElementsByClassName("kanban-table")[0].getElementsByTagName("thead")[0].getElementsByTagName("td")) {
      let colWidth = item.getAttribute("data-colWidth");
      let nextToBody = item.getAttribute("data-nextToBody");
      if (nextToBody === '1') {
        if (colWidth > 1) {
          let content = item.getElementsByClassName("content")[0];
          let width = colWidth * 163 - 1
          content.setAttribute('style', 'width: ' + width + 'px');
        }
      }
    }
  }

  /*删除列中的多余字段，fieldArray为多余字段数组*/
  removeRedundantField(column, fieldArray) {
    for (let field of fieldArray) {
      delete column[field];
    }
  }

  /*
   * 获取指定项目的所有卡片
   * @param projectId 项目ID
   * @callback 回调函数fetchTableInfo 渲染看板
   * */
  fetchTaskCards(kanbanId, allColumn) {
    let cards = {};
    KanbanStore.getCardById(kanbanId).then(response => {
      if (response) {
        console.log('执行');
        cards = response;
        this.setState({
          cards: cards
        })
      }
    });
  }

  /*获取看板信息*/
  fetchTableInfo() {
    /*看板id，通过url获取*/
    const kanbanId = this.props.match.params.kanbanId;
    KanbanStore.getColumn(kanbanId).then(response => {
      if (response !== null) {
        /*取得看板列数组和列树深度*/
        let array = response.list;
        let kanbanHeight = response.height;
        let depth = response.depth;
        this.setState({
          array: array,
          depth: depth,
          height: kanbanHeight,
        });
      }
    });
  }

  /*初始化源数组，设置各自相应的colSpan,nextToBody,position等字段（多余字段在编辑看板页面需删除）*/
  initColumn(column, position, tdNextToBody) {
    /*若subColumns不存在或长度为0则当前column位于thead最下层和tbody相邻，且colSpan为1*/
    if (column.subColumns === null || column.subColumns.length === 0) {
      column["colSpan"] = 1;
      /*nextToBody字段为1标志和tbody相邻*/
      column["nextToBody"] = 1;
      /*position字段通过递归的方式构造出当前列的索引数组*/
      column["position"] = position;
      tdNextToBody.push(column);
      return 1;
    }
    /*否则colSpan的值取决于当前列的子列colSpan之和，且当前列不和tbody相邻*/
    let colSpan = 0;
    for (let i = 0; i < column.subColumns.length; i++) {
      colSpan += this.initColumn(column.subColumns[i], position + "," + i, tdNextToBody);
    }
    column["colSpan"] = colSpan;
    /*nextToBody字段为0标志和tbody不相邻*/
    column["nextToBody"] = 0;
    column["position"] = position;
    return colSpan;
  }

  //将卡片放入列中
  getColumnWithCard = (array) => {
    const {cards} = this.state;
    array.map((item) => {
      if (item.subColumns !== null && item.subColumns.length !== 0) {
        this.getColumnWithCard(item.subColumns)
      } else {
        item = {
          ...item,
          card: cards[`${item.id}`] !== undefined ? cards[`${item.id}`] : [],
        }
        this.allColumn.push(item);
      }
    })
  };
  //获取卡片组件DOM
  getCards = (area, cards, columnId, y, kanbanheight, x) => {
    if (cards !== undefined && cards[`${columnId}`] !== undefined) {
      let tempCard = [];
      area[columnId].map((item) => {
        for (let i = 0; i < cards[`${columnId}`].length; i += 1) {
          let card = cards[`${columnId}`][i]
          if (item.y <= card.positionY && card.positionY < item.y + item.height && item.y === y && x === card.positionX) {
            if (i === 0) {
              tempCard.push(
                <Draggable key={card.id} draggableId={card.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={{
                        zIndex: 10,
                        ...provided.draggableStyle,
                      }}
                      {...provided.dragHandleProps}
                    >

                      <KanbanCard issueInfo={card} id={card.id}
                                  changeCardsDetail={this.handleChangeCardsDetailState}
                                  handleReloadKanban={this.reloadKanban}
                                  getSubCards={this.getSubCards}
                                  linktoChange={this.linktoChange}
                                  key={card.id}/>
                    </div>

                  )}
                </Draggable>
              )
            } else {
              tempCard.push(
                <Draggable key={card.id} draggableId={card.id}>
                  {(provided, snapshot) => (

                    <div
                      ref={provided.innerRef}
                      style={{
                        zIndex: 10,
                        ...provided.draggableStyle,
                      }}
                      {...provided.dragHandleProps}
                    >

                      <KanbanCard issueInfo={card} id={card.id}
                                  changeCardsDetail={this.handleChangeCardsDetailState}
                                  handleReloadKanban={this.reloadKanban}
                                  getSubCards={this.getSubCards}
                                  linktoChange={this.linktoChange}
                                  key={card.id}
                      />

                    </div>

                  )}
                </Draggable>
              )
            }

          }
        }
      });
      if (tempCard.length > kanbanheight) {
        let tempMixCard = []
        let simple = tempCard.length - kanbanheight + 1
        area[columnId].map((item) => {
          for (let i = 0; i < cards[`${columnId}`].length; i += 1) {
            let card = cards[`${columnId}`][i]
            if (item.y <= card.positionY && card.positionY < item.y + item.height && item.y === y) {
              if (i <= simple) {
                tempMixCard.push(
                  <Draggable key={card.id} draggableId={card.id}>
                    {(provided, snapshot) => (

                      <div
                        ref={provided.innerRef}
                        style={{
                          zIndex: 10,
                          ...provided.draggableStyle,
                        }}
                        {...provided.dragHandleProps}
                      >

                        <SmallKanbanCard issueInfo={card} id={card.id}
                                         changeCardsDetail={this.handleChangeCardsDetailState}
                                         getSubCards={this.getSubCards}
                                         linktoChange={this.linktoChange}
                                         handleReloadKanban={this.reloadKanban} key={card.id}/>
                      </div>)}
                  </Draggable>
                )
              } else {
                tempMixCard.push(
                  <Draggable key={card.id} draggableId={card.id}>
                    {(provided, snapshot) => (

                      <div
                        ref={provided.innerRef}
                        style={{
                          zIndex: 10,
                          ...provided.draggableStyle,
                        }}
                        {...provided.dragHandleProps}
                      >

                        <KanbanCard issueInfo={card} id={card.id}
                                    changeCardsDetail={this.handleChangeCardsDetailState}
                                    getSubCards={this.getSubCards}
                                    linktoChange={this.linktoChange}
                                    handleReloadKanban={this.reloadKanban} key={card.id}/>
                      </div>)}
                  </Draggable>
                )
              }

            }
          }
        })
        return tempMixCard;
      }
      return tempCard;
    }
  }
  //获取泳道区域DOM
  getSwimLane = (y, index, columns, swimLanes, cards, columnId, kanbanheight) => {
    for (let i = 0; i < swimLanes.length; i++) {
      // console.log('11')
      // console.log(swimLanes)
      let item = swimLanes[i]
      let realWidth = 0;
      for (let j = 0; j < item.width; j += 1) {
        realWidth += columns[j + index].width
      }

      if (item.position === y) {
        let width, height;
        width = 163 * realWidth + 1;
        height = 105 * item.height + 1;
        return (
          <div style={{
            width: width,
            height: height,
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: 1,
            top: -1,
            left: -1,
            border: '1px solid',
            borderColor: '#BEBDBD',
            borderCollapse: 'collapse',
            boxSizing: 'border-box',
          }}
          >
            <span style={{
              top: -5,
              left: 7,
              position: 'absolute',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              fontSize: 12,
            }}>
              {item.name}
              </span>
          </div>
        )
      }
    }
    // return this.getCards(cards, columnId, y)
  };
  //获取格子Dom
  getCell = (y, index, columns, swimLanes, cards, columnId, kanbanheight) => {
    let tempCells = []
    let width = 1;
    if (columns[index].width != null) {
      width = columns[index].width
    }
    for (let i = 0; i < this.area[`${columnId}`].length; i++) {
      let item = this.area[`${columnId}`][i];
      if (item.y === y) {
        for (let g = 0; g < item.width; g++) {
          tempCells.push(
            <Droppable droppableId={`${columns[index].id},${y},${g},0,area`}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef}
                     style={{
                       ...snapshot.isDraggingOver,
                       height: 105 * item.height,
                       width: 163,
                       display: 'inline-block',
                       position: 'absolute',
                       left: 163 * g,
                       borderBottom: '1px solid #BEBDBD'
                     }}
                     className="cell"
                >
                  {this.getCards(this.area, cards, columnId, y, kanbanheight, g)}
                  {provided.placeholder}
                  {/*{this.getSwimLane(y, index, columns, swimLanes, cards, columnId)}*/}
                </div>
              )}
            </Droppable>
          )
        }
      }
    }
    for (let j = 0; j < this.swimLaneArea[columnId].length; j++) {
      let swimlane = this.swimLaneArea[columnId][j]
      if (swimlane.length !== 0 && swimlane.y === y) {
        for (let l = 0; l < columns[index].width; l++) {
          tempCells.push(
            <div>
              <Droppable droppableId={`${columns[index].id},${y},${l},${swimlane.id},swimLane`}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}
                       style={{
                         ...snapshot.isDraggingOver,
                         height: 105 * swimlane.height,
                         width: 163,
                         display: 'inline-block',
                         boxSizing: 'border-box',
                         position: 'absolute',
                         // overflow: 'hidden',
                         left: 163 * l,
                       }}
                       className="swimlane-cell"
                  >
                    {this.getCards(this.swimLaneArea, cards, columnId, y, kanbanheight, l)}
                    {/*{this.getSwimLane(y, index, columns, swimLanes, cards, columnId)}*/}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {l === 0 ? this.getSwimLane(y, index, columns, swimLanes, cards, columnId, kanbanheight) : ''}
            </div>
          );
        }
        break;
      }
    }
    return tempCells;
  };
  //获取task卡片
  getTaskCards = () => {
    let tempCard = []
    if (this.state.cards[`temp`] != null) {
      this.state.cards[`temp`].map((card) => {
        tempCard.push(<Draggable key={card.id} draggableId={card.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{
                zIndex: 10,
                ...provided.draggableStyle,
              }}
              {...provided.dragHandleProps}
            >
              <KanbanCard issueInfo={card} id={card.id}
                          changeCardsDetail={this.handleChangeCardsDetailState}
                          getSubCards={this.getSubCards}
                          linktoChange={this.linktoChange}
                          handleReloadKanban={this.reloadKanban} key={card.id}/>
            </div>)}
        </Draggable>)
      });
      return tempCard;
    }
    // if (this.allColumn[2] !== undefined) {
    //   this.allColumn[2].card.map((card) => {
    //     tempCard.push(<Draggable key={card.id} draggableId={card.id}>
    //       {(provided, snapshot) => (
    //
    //         <div
    //           ref={provided.innerRef}
    //           style={{
    //             zIndex: 10,
    //             ...provided.draggableStyle,
    //           }}
    //           {...provided.dragHandleProps}
    //         >
    //
    //           <KanbanCard issueInfo={card} id={card.id}
    //                       changeCardsDetail={this.handleChangeCardsDetailState}
    //                       handleReloadKanban={this.reloadKanban} key={card.id}/>
    //         </div>)}
    //     </Draggable>)
    //   });
    //   return tempCard
    // }
  }

  ifCardInUnnamedSwimLane = (swimLaneId) => {
    for (let i = 0; i < this.allColumn.length; i++) {
      let item = this.allColumn[i];
      for (let j = 0; j < item.swimLanes.length; j++) {
        let sw = item.swimLanes[j];
        if (sw.id === swimLaneId) {
          if (sw.name != null) {
            return 0
          }
          else {
            return 1
          }
        }
      }
    }
  };

  /*使用队列queue层次遍历生  成看板的表结构*/
  generateTable(array, depth, kanbanheight) {
    /*数组tdNextToBody记录thead中和tbody相邻的td单元*/
    let tdNextToBody = [];
    /*thead和tbody保存结果tr信息*/
    let queue = [], thead = [], tbody = [];
    /* currentLayoutLength：当前层次下节点的数量、 nextLayoutLength：下一层节点的数量、currentLayout：当前层树*/
    let currentLayoutLength = array.length, nextLayoutLength = 0, currentLayout = 1;
    for (let i = 0; i < array.length; i++) {/*将源数组元素压入队列*/
      queue.unshift(array[i]);
      /*初始化源数组，设置各列相对应的colSpan,nextToBody,position属性*/
      this.initColumn(array[i], i, tdNextToBody);
    }
    this.allColumn = []
    this.getColumnWithCard(array);
    this.getBlankArea(this.allColumn, kanbanheight)
    console.log('列', this.allColumn)
    console.log('卡', this.state.cards)
    /*保存多余字段名称的数组，用于删除多余字段*/
    let redundantFieldArray = ['colSpan', 'nextToBody', 'position'];
    /*用来保存同一个tr中的td元素，初始化包含pb列*/
    let row = [];
    while (queue.length !== 0) {
      /*利用队列层次遍历表头树，动态创建tr td标签*/
      let node = queue.pop();
      // console.log(node)
      let cardNum = 0;
      this.allColumn.map((item) => {
        if (item.id === node.id) {
          item.card.map((cards) => {
            if (cards.swimLaneId === 0) {
              cardNum += 1;
            } else {
              let sim = this.ifCardInUnnamedSwimLane(cards.swimLaneId);
              if (sim === 1) {
                cardNum += 1
              }
            }
          })
        }
      })
      row.push(<td id={node.id}
                   rowSpan={(node.subColumns === null || node.subColumns.length === 0) ? (depth - currentLayout + 1) : 1}
                   colSpan={node.colSpan} key={node.id} data-colWidth={node.width === 0 ? 1 : node.width}
                   data-status="doing"
                   data-columnId={node.id} data-nextToBody={node.nextToBody}
                   data-position={node.position}
      >
        <SystemColumnContent columnStatus={node.status} selected={node.selected}/>
        <div className="content" style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width: '100%',
        }}>{node.name}</div>
        <div style={{display: 'inline', position: 'absolute', right: 10, bottom: -5}}>
          {node.wipNum != -1 && cardNum != null && node.wipNum != null ? `${cardNum}/${node.wipNum}` : ``}
        </div>
      </td>);

      /*删除多余字段*/
      this.removeRedundantField(node, redundantFieldArray);
      currentLayoutLength -= 1;
      if (node.subColumns != null) {/*若子列数组不为空，则依次将子列添加到队列中，并记录下层节点数量*/
        nextLayoutLength += node.subColumns.length;
        for (let item of node.subColumns) {
          queue.unshift(item);
        }
      } else {/*防止子列数组出现null，引起不必要的异常*/
        node.subColumns = [];
      }
      if (currentLayoutLength == 0) {/*当前层次下节点的数量为0时，进入下一层，将row包装成tr压入thead*/
        thead.push(<tr key={currentLayout}>{row}</tr>);
        row = [];
        /*重新设置相应计数器，层数加一*/
        currentLayoutLength = nextLayoutLength;
        nextLayoutLength = 0;
        currentLayout += 1;
      }
    }
    /*初始化tbody（暂时简易的处理）*/

    // console.log('<<<<<<<<<<<<<<<<<<')
    // console.log(this.state.cards)
    // console.log(this.allColumn)
    // console.log('>>>>>>>>>>>>>>>>>>')
    for (let z = 0; z < kanbanheight; z += 1) {
      let rowTbody = [];
      for (let j = 0; j < this.allColumn.length; j += 1) {
        let tempid = this.generateNoneDuplicateID(3);
        if (z === kanbanheight - 1) {
          rowTbody.push(
            <td
              style={{minWidth: 163 * this.allColumn[j].width, borderTop: 'none'}}>

              {this.getCell(z, j, this.allColumn, this.allColumn[j].swimLanes, this.state.cards, this.allColumn[j].id, kanbanheight)}
            </td>)
        } else {
          rowTbody.push(
            <td
              style={{minWidth: 163 * this.allColumn[j].width, borderTop: 'none', borderBottom: 'none'}}>

              {this.getCell(z, j, this.allColumn, this.allColumn[j].swimLanes, this.state.cards, this.allColumn[j].id, kanbanheight)}
            </td>)
        }
      }
      tbody.push(<tr key={this.generateNoneDuplicateID(3)}>{rowTbody}</tr>);
    }

    let tableInfo = {};
    tableInfo["thead"] = thead;
    tableInfo["tbody"] = tbody;
    return tableInfo;
  }

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {history, match} = this.props;
    history.push(`/kanbanFront/editkanban/${match.params.kanbanId}`)

  };
  //打开侧边栏
  handleChangeCardsDetailState = (e) => {
    e.preventDefault()
    e.stopPropagation();
    console.log('selectCards', e.target);
    this.setState({
      selectedCards: e.target.id,
      displayState: 'block',
    })
  };
  //使侧边栏不可见
  setCardsDetailUnSeen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.displayState === 'block') {
      this.setState({
        displayState: 'none',
      })
    }
  };
  //获取空的格子
  getEmptyCell = (tempArea, columnId, limit) => {
    let countCard = {}
    this.allColumn.map((temp) => {
      countCard[temp.id] = [];
    })
    let index = [];
    for (let i = 0; i < this.allColumn.length; i++) {
      let item = this.allColumn[i]
      for (let n = 0; n < item.swimLanes.length; n++) {
        let sw = item.swimLanes[n]
        if (sw.id === tempArea.id) {
          index.push(i);
        }
      }
    }
    for (let j = index[0]; j < index[0] + tempArea.width; j++) {
      if (this.allColumn[j].card != null) {
        this.allColumn[j].card.map((card) => {
          if (card != null) {
            if (card.positionY >= tempArea.y && card.positionY < tempArea.y + tempArea.height) {
              countCard[this.allColumn[j].id].push(card)
            }
          } else {
            return this.allColumn[j].id
          }
        })
      }
    }
    for (let k = index[0]; k < index[0] + tempArea.width; k++) {
      let column = this.allColumn[k];
      if (countCard[column.id].length < limit) {
        return column.id
      }
    }
    return 0
  };
  //获取格子中card的数量
  getCardCountInCell = (area, columnId, startColumnId, y, startY, x, startX) => {
    let cards = [];
    let xcount = 0;
    let ycount = 0;
    let count = {
      x: undefined,
      y: undefined,
    }
    this.allColumn.map((item) => {
      if (item.id === Number(columnId)) {
        cards = item.card
      }
    })
    cards.map((card) => {
      if (card.positionY >= area.y && card.positionY < area.y + area.height && card.positionY === Number(y)) {
        xcount += 1
      }
      if (card.positionY >= area.y && card.positionY < area.y + area.height && card.positionX === Number(x)) {
        ycount += 1
      }
    })
    let limit = area.columnWidth == null ? area.width * area.height : area.columnWidth * area.height;
    if (ycount < area.height) {
      if (columnId === startColumnId && x === startX) {
        count.y = ycount - 1;
      } else {
        count.y = ycount
      }
    }
    if (xcount < limit) {
      if (columnId === startColumnId && y === startY) {
        if (xcount < area.height) {
          count.x = 0
        } else {
          count.x = Math.floor((xcount - 1) / area.height);
        }
      } else {
        if (xcount < area.height) {
          count.x = 0
        } else {
          count.x = Math.floor((xcount) / area.height);
        }
      }
    }
    return count
  };
  //拖动结束的处理
  onDragEnd = (result) => {
    // dropped outside the list
    console.log(result)
    if (result.destination != null) {
      let tempArea = {}
      let countCard = []
      const {cards} = this.state
      let startArray = result.source.droppableId.split(',')
      let endArray = result.destination.droppableId.split(',')
      let tempCard = JSON.parse(JSON.stringify(this.state.cards))
      if (startArray[0] === '0' && startArray.length === 1) {
        startArray[0] = 'temp'
      }
      if (startArray[4] === 'CardChild') {
        let temp = []
        tempCard[startArray[0]].map((item) => {
          if (item.id === Number(startArray[5])) {
            temp = item.subIssue
          }
        })
        tempCard[startArray[0]].push(temp);
      }
      if (endArray[0] === '0' && endArray.length === 1) {
        endArray[0] = 'temp'
        endArray[1] = 0;
        endArray[2] = 0;
        endArray[3] = 0;
        endArray[4] = 'area'
      }

      if (endArray[0] !== 'temp') {
        if (endArray[4] === 'area') {
          this.area[endArray[0]].map((item) => {
            if (Number(endArray[1]) === item.y) {
              tempArea = item;
            }
          })
        } else if (endArray[4] === 'swimLane') {
          this.swimLaneArea[endArray[0]].map((item) => {
            if (Number(endArray[1]) === item.y) {
              tempArea = item;
            }
          })
        }
        cards[endArray[0]].map((item) => {
          if (item.positionY >= tempArea.y && item.positionY < tempArea.y + tempArea.height) {
            countCard.push(item)
          }
        });
      }
      if (startArray[4] === 'CardChild') {
        for (let i = 0; i < tempCard[startArray[0]].length; i += 1) {
          let card = JSON.parse(JSON.stringify(tempCard[startArray[0]][i]));
          if (card.id === Number(startArray[5])) {
            for (let h = 0; h < card.subIssue.length; h++) {
              let item = card.subIssue[h]
              let temp = JSON.parse(JSON.stringify(item))
              if (item.id === result.draggableId) {
                temp.positionY = Number(endArray[1]);
                temp.columnId = Number(endArray[0]);
                temp.positionX = Number(endArray[2]);
                temp.swimLaneId = Number(endArray[3]);
                item = temp;
                KanbanStore.updateIssueById(item.id, item).then((res) => {
                  if (res) {
                    KanbanStore.getCardById(this.props.match.params.kanbanId).then(response => {
                      if (response) {
                        this.setState({
                          cards: response
                        })
                      }
                    });
                  }
                });
              }
            }
            ;
          }
        }
      } else if (endArray[4] === 'CardChild') {
        for (let i = 0; i < tempCard[startArray[0]].length; i += 1) {
          let item = JSON.parse(JSON.stringify(tempCard[startArray[0]][i]));
          if (item.id === result.draggableId) {
            item.positionY = Number(0);
            item.columnId = Number(endArray[0]);
            item.positionX = Number(0);
            item.swimLaneId = Number(endArray[3]);
            item.parentId = Number(endArray[5]);
            KanbanStore.updateIssueById(item.id, item).catch((err) => {
              console.log(err);
              message.error('网络不稳定，请重试', 1.5);
              this.fetchTaskCards(this.props.match.params.kanbanId);
            });
            tempCard[`${endArray[0]}`].push(item);
            tempCard[startArray[0]].splice(i, 1);
            this.setState({
              cards: tempCard,
            })
          }
        }
      } else if (endArray[0] === 'temp') {
        for (let i = 0; i < tempCard[startArray[0]].length; i += 1) {
          let item = JSON.parse(JSON.stringify(tempCard[startArray[0]][i]));
          if (item.id === result.draggableId) {
            item.positionY = Number(endArray[1]);
            item.columnId = Number(0);
            item.positionX = Number(endArray[2]);
            item.swimLaneId = Number(endArray[3]);
            item.status = 'pre todo';
            item.projectId = 1;
            KanbanStore.updateIssueById(item.id, item).catch((err) => {
              console.log(err);
              message.error('网络不稳定，请重试', 1.5);
              this.fetchTaskCards(this.props.match.params.kanbanId);
            });
            tempCard[`${endArray[0]}`].push(item);
            tempCard[startArray[0]].splice(i, 1);
            this.setState({
              cards: tempCard,
            })
          }
        }
      } else if (countCard.length < tempArea.height * tempArea.width && endArray[4] !== 'swimLane') {
        console.log('进入area')
        let cardCountInCell = this.getCardCountInCell(tempArea, endArray[0],
          startArray[0], endArray[1], startArray[1], endArray[2], startArray[2]);
        for (let i = 0; i < tempCard[startArray[0]].length; i += 1) {
          let item = JSON.parse(JSON.stringify(tempCard[startArray[0]][i]));
          if (item.id === result.draggableId) {
            item.positionY = Number(endArray[1]);
            item.columnId = Number(endArray[0]);
            item.positionX = cardCountInCell.x != null ? cardCountInCell.x : Number(endArray[2]);
            item.swimLaneId = Number(endArray[3]);
            item.kanbanId = this.props.match.params.kanbanId
            this.allColumn.map((column) => {
              let realCardNum = 0;
              let cardNum = 0;
              tempCard[item.columnId].map((item) => {
                cardNum += 1;
                if (item.swimLaneId === 0) {
                  realCardNum += 1
                }
              });
              if (column.id === item.columnId) {
                if (column.wipNum === -1 || column.wipNum === null || realCardNum < column.wipNum) {
                  if (cardNum < this.state.height * column.width) {
                    item.status = column.status;
                    KanbanStore.updateIssueById(item.id, item).catch((err) => {
                      console.log(err);
                      message.error('网络不稳定，请重试', 1.5);
                      this.fetchTaskCards(this.props.match.params.kanbanId);
                    });
                    tempCard[`${endArray[0]}`].push(item);
                    tempCard[startArray[0]].splice(i, 1);
                    this.setState({
                      cards: tempCard,
                    })
                  } else {
                    message.warning('此列已满')
                  }
                }
                else if (startArray[0] === endArray[0]) {
                  item.status = column.status
                  KanbanStore.updateIssueById(item.id, item).catch((err) => {
                    console.log(err);
                    message.error('网络不稳定，请重试', 1.5);
                    this.fetchTaskCards(this.props.match.params.kanbanId);
                  });
                  tempCard[`${endArray[0]}`].push(item);
                  tempCard[startArray[0]].splice(i, 1);
                  this.setState({
                    cards: tempCard,
                  })
                }
                else {
                  message.warning('此列已满')
                }
              }
            })
          }
        }
      } else if (endArray[4] === 'swimLane') {
        let tempId = this.getEmptyCell(tempArea, endArray[0], tempArea.height * tempArea.columnWidth)
        let cardCountInCell = this.getCardCountInCell(tempArea, endArray[0],
          startArray[0], endArray[1], startArray[1], endArray[2], startArray[2]);
        if (tempId !== 0 && cardCountInCell != null) {
          for (let i = 0; i < tempCard[startArray[0]].length; i += 1) {
            let item = JSON.parse(JSON.stringify(tempCard[startArray[0]][i]));
            if (item.id === result.draggableId) {
              item.positionY = Number(endArray[1]);
              item.columnId = Number(tempId);
              item.positionX = cardCountInCell.x != null ? cardCountInCell.x : Number(endArray[2]);
              item.swimLaneId = Number(endArray[3]);
              item.kanbanId = this.props.match.params.kanbanId
              this.allColumn.map((column) => {
                let realCardNum = 0;
                tempCard[item.columnId].map((item) => {
                  if (item.swimLaneId === 0) {
                    realCardNum += 1
                  }
                });
                if (column.id === item.columnId) {
                  if (column.status === 'doing') {
                    if (column.wipNum === -1 || column.wipNum === null || realCardNum < column.wipNum) {
                      item.status = column.status
                      KanbanStore.updateIssueById(item.id, item).catch((err) => {
                        console.log(err);
                        message.error('网络不稳定，请重试', 1.5);
                        this.fetchTaskCards(this.props.match.params.kanbanId);
                      });
                      tempCard[`${endArray[0]}`].push(item);
                      tempCard[startArray[0]].splice(i, 1);
                      this.setState({
                        cards: tempCard,
                      })

                    }
                    else if (startArray[0] === endArray[0]) {
                      item.status = column.status
                      KanbanStore.updateIssueById(item.id, item).catch((err) => {
                        console.log(err);
                        message.error('网络不稳定，请重试', 1.5);
                        this.fetchTaskCards(this.props.match.params.kanbanId);
                      });
                      tempCard[`${endArray[0]}`].push(item);
                      tempCard[startArray[0]].splice(i, 1);
                      this.setState({
                        cards: tempCard,
                      })
                    }
                    else {
                      message.warning('此列已满')
                    }
                  } else {
                    item.status = column.status;
                    KanbanStore.updateIssueById(item.id, item).catch((err) => {
                      console.log(err);
                      message.error('网络不稳定，请重试', 1.5);
                      this.fetchTaskCards(this.props.match.params.kanbanId);
                    });
                    tempCard[`${endArray[0]}`].push(item);
                    tempCard[startArray[0]].splice(i, 1);
                    this.setState({
                      cards: tempCard,
                    })
                  }
                }
              })
            }
          }
        }
      } else {
        message.warning('此列已满')
      }
    }
  };
  handleScroll = (e) => {
    let KanbantheadDom = document.getElementsByClassName('kanban-thead');
    let KanbanContentDom = document.getElementsByClassName('kanban-content');
    KanbantheadDom[0].setAttribute('style', `top:${KanbanContentDom[0].scrollTop}px;position:absolute;z-index:7;`)
  };

  componentDidUpdate() {
    this.initTable();
    this.bindEvent();
    let KanbantheadDom = document.getElementsByClassName('kanban-thead');
    let KanbantbodyDom = document.getElementsByClassName('kanban-tbody');
    KanbantbodyDom[0].setAttribute('style', `position: absolute;
                padding-top: 0;
                padding-bottom: 0;
                border-collapse: collapse;
                top: ${KanbantheadDom[0].offsetHeight - 2}px;`)
  }

  handleCreateCard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // const {history, match} = this.props;
    // history.push(`${match.url}/create`)
    this.setState({
      CreateCardState: 'block'
    })
  };
  handleTaskColumn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      taskColumnState: 'block',
    })
  };
  disableTaskColunm = () => {
    if (this.state.taskColumnState === 'block') {
      this.setState({
        taskColumnState: 'none',
      })
    }
  };
  //获取子卡
  getSubCards = (subCards) => {
    let tempCard = []
    if (subCards != null && subCards.length !== 0) {
      subCards.map((card) => {
          if (card.status === 'pre todo') {
            tempCard.push(
              <Draggable draggableId={card.id}>
                {(provided, snapshot) => (

                  <div
                    ref={provided.innerRef}
                    style={{
                      zIndex: 10,
                      ...provided.draggableStyle,
                    }}
                    {...provided.dragHandleProps}
                  >
                    <KanbanCard issueInfo={card} id={card.id}
                                changeCardsDetail={this.handleChangeCardsDetailState}
                                handleReloadKanban={this.reloadKanban}
                                getSubCards={this.getSubCards}
                                linktoChange={this.linktoChange}
                                key={card.id}/>
                  </div>

                )}
              </Draggable>
            )
          }
        }
      );
      return tempCard;
    }
  };
  linktoChange = (url) => {
    const {history, match} = this.props;
    history.push(`${match.url}/${url}`)
  };
  onDragStart = (res) => {
    let event = window.event || arguments[0];
  };
  preventTest = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  handlePlanState = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      planState: true
    })
  };
  handleReleasePlanState = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      releasePlanState: true
    })
  };
  ChangePlanState = (planState) => {
    this.setState({
      planState: planState,
    })
  };
  ChangeReleasePlanState = (releasePlanState) => {
    this.setState({
      releasePlanState: releasePlanState,
    })
  };
  ChangeCreateCardState = () => {
    this.setState({
      CreateCardState: 'none'
    })
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a onClick={this.handlePlanState}>从迭代导入</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a onClick={this.handleReleasePlanState}>从用户故事导入</a>
        </Menu.Item>
      </Menu>
    );
    let tableInfo = this.generateTable(this.state.array, this.state.depth, this.state.height);
    let thead = tableInfo.thead;
    let tbody = tableInfo.tbody;
    return (
      <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
        <div className="kanban" onClick={this.setCardsDetailUnSeen}>
          <div className="taskColumn"
               onMouseDown={this.preventTest}
               style={{
                 position: 'fixed',
                 width: 158,
                 minHeight: 345,
                 backgroundColor: 'rgba(0, 0, 0, 0.6)',
                 boxSizing: 'border-box',
                 borderWidth: 1,
                 borderStyle: 'solid',
                 borderColor: 'rgba(215, 215, 215, 1)',
                 borderRadius: 0,
                 boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.349019607843137)',
                 zIndex: 8,
                 right: 21,
                 top: 125,
                 textAlign: 'center',
                 display: this.state.taskColumnState,
                 maxHeight: 575,
               }}>
            <Icon type="close" style={{position: 'absolute', left: 0, color: 'white'}}
                  onClick={this.disableTaskColunm}/>
            <span id='1' style={{top: 6, fontSize: 12, color: 'white', position: 'relative', cursor: 'pointer',}}
                  onClick={this.handleClick}><Icon type='plus' style={{position: 'relative', top: 1}}/>添加卡片</span>
            <hr style={{marginTop: 12, color: 'white', opacity: '1.0'}}/>
            <Droppable droppableId={'0'}>
              {(provided, snapshot) => (
                <div className="innerTaskColumn" ref={provided.innerRef}
                     style={{...snapshot.isDraggingOver, minHeight: 376, maxHeight: 376, overflow: 'auto'}}
                >
                  {this.getTaskCards()}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <KanbanHeader
            kanbanName={this.state.kanbanName}
            handleCreateCard={this.handleCreateCard}
            handleTaskColumn={this.handleTaskColumn}
            handleClick={this.handleClick}
            handleReleasePlanState={this.handleReleasePlanState}
            handlePlanState={this.handlePlanState}
            cardNum={this.state.cards}
          />
          <div className="kanban-content" style={{overflow: 'auto', position: 'relative', marginTop: 2}}
               onScroll={this.handleScroll}>
            <table className="kanban-table"
                   style={{borderCollapse: 'collapse',}}
                   onClick={this.setCardsDetailUnSeen}>
              <thead style={{position: 'absolute', zIndex: 7}} className="kanban-thead">
              {thead}
              </thead>
              <tbody style={{
                position: 'absolute',
                paddingTop: 0,
                paddingBottom: 0,
                borderCollapse: 'collapse',
                top: document.getElementsByClassName('kanban-thead')[0] != null ?
                  document.getElementsByClassName('kanban-thead')[0].offsetHeight : 0,
              }} className="kanban-tbody"
              >
              {tbody}
              </tbody>
            </table>
          </div>
          <KanbanPlanModel visible={this.state.planState} ChangePlanState={this.ChangePlanState}
                           kanbanId={this.props.match.params.kanbanId} getIssue={this.getIssue}
                           Cards={this.state.cards['temp']}/>
          <ReleasePlanModel visible={this.state.releasePlanState} ChangeReleasePlanState={this.ChangeReleasePlanState}
                            kanbanId={this.props.match.params.kanbanId} getIssue={this.getIssue}
                            Cards={this.state.cards['temp']}/>

          <div style={{display: this.state.displayState}}>
            <EditCardDetailModel id={this.state.selectedCards} getIssue={this.getIssue}
                                 ChangePlanState={this.ChangePlanState}/>
          </div>

          <div style={{display: this.state.CreateCardState}}>
            <CreateCard ChangeCreateCardState={this.ChangeCreateCardState} getIssue={this.getIssue}/>
          </div>
        </div>
      </DragDropContext>
    );
  }
}

export default Kanban;
