/**
 * Created by knight on 2017/9/5.
 * 用户故事地图
 */
/*eslint-disable*/
import React, { Component, Children, PropTypes } from 'react';
import { Affix, Button, Col, Row, Slider, Icon, message, Tooltip } from 'antd';
import PageHeader, {
  PageHeadStyle,
} from '../../../components/common/PageHeader';
import { observer } from 'mobx-react';
import UserStoryStore from '../../../stores/origanization/userStory/UserStoryStore';
import IssueManageStore from '../../../stores/origanization/issue/IssueManageStore';
import RightEdit from '../../../components/userStoryMap/RightEdit';
import EditStory from '../../../components/userStoryMap/EditStory';
import Header from '../../../components/userStoryMap/Header';
import ToolBar from '../../../components/userStoryMap/ToolBar';
import UserColumn from '../../../components/userStoryMap/UserColumn';
import FoldUser from '../../../components/userStoryMap/FoldUser';
import '../../../assets/css/userStoryMap-card.css';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const styles = {
  cardstyle: {
    width: '150px',
    height: '100px',
    overflow: 'hidden',
    padding: '10px',
    border: '1px solid #000',
    margin: '10px',
  },
  content: {
    paddingBottom: '10px',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
  },
  container: {
    display: 'flex',
    // alignItems: 'flex-start',
    transformOrigin: 'left top',
    // transform: 'scale(0.3)',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px dashed gray',
  },
  line: {
    display: 'flex',
  },
};
// a little function to help us with reordering the result

const epicShow = {
  paddingLeft: 20,
  paddingTop: 12,
  paddingBottom: 12,
  backgroundColor: '#ffffff',
  display: 'block',
  // position:'fixed',
  width: '100%',
  float: 'left',
  height: 200,
  // borderBottom:'1px solid #D4D4D4',
};
const storyShow = {
  paddingLeft: 20,
  paddingBottom: 12,
  display: 'block',
};
const footer = {
  paddingTop: 4,
  paddingBottom: 4,
  position: 'fixed',
  bottom: '0%',
  right: '0%',
  display: 'block',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  overflowY: 'hidden',
  float: 'left',
  width: '100%',
  zIndex: 6,
  marginTop: 3,
};
let scrollLeft = 0;
let scrollTop = 0;
@observer
class UserStoryMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      scale: 1,
      fold: false,
    };
    this.scale = this.scale.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.newRelease = this.newRelease.bind(this);
    this.deleteRelease = this.deleteRelease.bind(this);
  }

  deleteRelease(e) {
    console.log(e.target.getAttribute('data-index'));
    const index = e.target.getAttribute('data-index');
    const id = UserStoryStore.ReleasePlanids[index];
    UserStoryStore.deleteReleaseById(id).then(data => {
      if (data) {
        UserStoryStore.setNewRelease('delete', index);
      }
      message.success('删除成功');
    });
  }
  newRelease(e) {
    // let arr = [];
    // for (let key in UserStoryStore.selectStorys) {
    //   if (UserStoryStore.selectStorys[key]) {
    //     arr.push(key);
    //   }
    // }
    // console.log(arr);
    let name = '未命名release';
    let release = {
      name: name,
      projectId: 1,
    };
    // UserStoryStore.setNewRelease('add', 0);
    UserStoryStore.createRelease(release)
      .then(releaseData => {
        if (releaseData) {
          UserStoryStore.setNewRelease('add', 0, releaseData);
          message.success('添加成功');
        }
      })
      .catch(err => {
        console.log(err);
        message.error('添加失败');
      });
  }
  onDragStart() {
    console.log('start');
  }
  scale(num) {
    this.setState({
      scale: num / 10,
    });
  }
  onDragEnd = result => {
    console.log(result);
    /*...*/
    if (!result.destination) {
      return;
    }
    console.log(JSON.parse(result.destination.droppableId));
    if (result.type === 'PERSON') {
      UserStoryStore.resort(result);
    }
    // UserStoryStore.resort(result);
  };
  fake(instance) {
    if (instance && this.state.width === 0 && this.state.height === 0) {
      this.instance = instance;
      this.setState({
        height: instance.offsetHeight,
        width: instance.offsetWidth,
      });
      console.log(instance.getBoundingClientRect().width);
    }
  }
  edit(e) {
    // document.body.onclick = () => {
    //   console.log('close');
    //   UserStoryStore.closeright();
    // };
    UserStoryStore.updateReleasePlanName(
      e.target.getAttribute('data-id'),
      e.target.value,
    ).then(returnData => {
      /*如果有返回数据，则判断卡片描述信息是否发生变化*/
      if (returnData) {
        if (name != this.props.name) {
          /*如果发生变化则提示更新成功*/
          message.success('更新成功', 1.5);
        }
      } else {
        /*更新失败则提示卡片不存在*/
        message.error('改名失败', 1);
        this.props.initReleaseList();
      }
    });
    console.log('edit', e.target.getAttribute('data-id'), e.target.value);
  }
  focus(e) {
    console.log('focus', e.target.value);
  }
  hideright() {
    UserStoryStore.closeright();
  }
  scroll() {
    console.log('scroll');
  }
  getscroll(instance) {
    if (instance) {
      this.scrollele = instance;
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.ChangeContent.bind(this));
    if (this.scrollele) {
      let ele = this.scrollele.parentNode.parentNode;
      console.log(ele.getBoundingClientRect());
    }
  }
  ChangeContent() {
    if (this.scrollele) {
      this.scrollele.style.height = `${window.innerHeight - 48}px`;
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.ChangeContent.bind(this));
  }
  unfold() {
    this.setState({
      fold: false,
    });
  }
  fold() {
    this.setState({
      fold: true,
    });
  }
  render() {
    console.log('render');
    const data = UserStoryStore.getUserStoryData;
    // console.log(data);
    // const heights = UserStoryStore.StoryHeights;
    // console.log(heights);
    // if (UserStoryStore.currentEditid != undefined) {
    //   IssueManageStore.getStoryDataById(UserStoryStore.currentEditid);
    // }
    // console.log(data.Epic.slice());
    if (data) {
      console.log(data.length);
      return (
        <div
          id="userstory"
          ref={this.getscroll.bind(this)}
          onClick={this.hideright.bind(this)}
          style={{       
            height: window.innerHeight - 48,
            backgroundColor: 'white',
          }}
        >
          <Header />
          <ToolBar
            scale={this.scale.bind(this)}
            fold={this.fold.bind(this)}
            unfold={this.unfold.bind(this)}
          />
          <div
            id="storyarea"
            style={{
              width: '100%',
              overflow: 'auto',
              height: 'calc(100% - 97px)',
              backgroundColor: 'white',
            }}
            onScroll={this.scroll.bind(this)}
          >
            <div
              style={{ display: UserStoryStore.rightshow ? 'block' : 'none' }}
              // style={{ display: UserStoryStore.rightshow ? 'block' : 'block' }}
              onClick={e => e.stopPropagation()}
            >
              <EditStory id={UserStoryStore.currentEditid} />

              {/*  */}
            </div>
            <div>
              <div
                style={{
                  ...styles.container,
                  ...{
                    transform: `scale(${this.state.scale})`,
                    // zoom: this.state.scale,
                  },
                }}
              >
                {data.length > 0 ? (
                  data.map((item, i) => (
                    <div className="boxmargin">
                      {this.state.fold ? (
                        <FoldUser />
                      ) : (
                        <UserColumn
                          index={i}
                          key={Math.random()}
                          isfirst={i === 0}
                          userdata={item}
                          parentId={item.id}
                          // taskdata={data.task[i]}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <UserColumn
                    index={0}
                    key={Math.random()}
                    isfirst={true}
                    userdata={{ id: null, description: null, subIssue: [] }}
                    parentId={null}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
export default DragDropContext(HTML5Backend)(UserStoryMap);
