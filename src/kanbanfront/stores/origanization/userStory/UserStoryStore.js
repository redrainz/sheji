/**
 * Created by knight on 2017/9/11.
 * feature:用户故事地图数据接口
 */
/*eslint-disable*/
import { observable, computed, action, extendObservable } from 'mobx';
import axios from 'Axios';
import store from 'Store';
import IssueManageStore from '../issue/IssueManageStore';
// function sortFeature(data) {
//   let newepic = data.Epic.map(one => one.id);
//   console.log(newepic);
//   data.Feature.forEach((one)=>{
//     if(one.length>0){
//       one[0].parentId
//     }
//   })
// }
function movedata(data) {
  let current = 0;
  if (data.Feature.length > 0) {
    data.Feature.forEach(one => {
      if (one.length > 0) {
        one.forEach(two => {
          if (!two.issues) {
            two.issues = [];
          }
          data.ReleasePlan.forEach(three => {
            three.issues
              ? two.issues.push(three.issues[current])
              : two.issues.push([]);
          });
          current++;
        });
      }
    });
  } else {
    let empty = Array(data.ReleasePlan.length).fill([]);
    console.log(empty);
    data.Feature = [[{ issues: empty }]];
  }
  console.log(data);
  return data;
}
function movestorydata(data) {
  let arr = [];
  let current = 0;
  data.Feature.forEach(one => {
    if (one.length > 0) {
      one.forEach(two => {
        if (!two.issues) {
          two.issues = [];
        }
        data.ReleasePlan.forEach(three => {
          three.issues
            ? two.issues.push(three.issues[current])
            : two.issues.push([]);
        });
        current++;
      });
    }
  });
  // console.log(data);
  return data;
}
function exchange(source, start, end) {
  console.log(source);
  let ar1 = source.splice(start, 1);
  source.splice(end, 0, ar1);
}
@store('UserStoryStore')
class UserStoryStore {
  constructor() {
    this.localUserStoryData();
  }
  @observable userStoryData = null;
  @observable ReleasePlanData = null;
  @observable newheights = 0;
  @observable groupnum = null;
  @observable showstorynum = false;
  @observable StoryHeights = [];
  @observable initStoryHeights = [];
  @observable rightshow = false;
  @observable currentEditData = null;
  @observable issueIdArr = [];
  @observable sprintData = {};

  @action
  setIssueIdArr(issueIdArr) {
    this.issueIdArr = issueIdArr;
  }
  @computed
  get getIssueIdArr() {
    return this.issueIdArr.slice();
  }
  @action
  showStoryNum(flag) {
    console.log(flag);
    this.showstorynum = flag;
  }
  @action
  setUserStoryData(data) {
    this.userStoryData = data;
  }
  @action
  setReleasePlanData(data) {
    console.log(data);
    this.ReleasePlanData = data;
  }
  @computed
  get getUserStoryData() {
    return this.userStoryData;
  }
  // 加载数据
  localUserStoryData = () => {
    console.log('加载');
    const data2 = [
      {
        id: 1,
        description: 'user',
        subIssue: [
          {
            id: 2,
            description: 'activity1',
            subIssue: [
              {
                id: 6,
                description: 'task',
                story: [
                  [
                    [
                      {
                        id: 15,
                        description: 'story',
                        storyMapSequence: 1,
                      },
                      {
                        id: 16,
                        description: 'story',
                        storyMapSequence: 3,
                      },
                      {
                        id: 17,
                        description: 'story',
                        storyMapSequence: 4,
                      },
                    ],
                    [
                      {
                        id: 44,
                        description: 'story',
                        storyMapSequence: 1,
                      },
                      {
                        id: 55,
                        description: 'story',
                        storyMapSequence: 2,
                      },
                      {
                        id: 66,
                        description: 'story2',
                        storyMapSequence: 3,
                      },
                    ],
                  ],
                  [
                    [
                      {
                        id: 20,
                        description: 'story',
                        storyMapSequence: 1,
                      },
                      {
                        id: 21,
                        description: 'story',
                        storyMapSequence: 2,
                      },
                      {
                        id: 22,
                        description: 'story',
                        storyMapSequence: 3,
                      },
                    ],
                  ],
                ],
              },
              {
                id: 8,
                description: 'task',
                story: [],
              },
            ],
          },
          {
            id: 4,
            subIssue: [],
            description: 'activity2',
          },
        ],
      },
      {
        id: 16,
        description: 'user2',
        subIssue: [],
      },
    ];
    axios.get('/kanban/v1/project/1/releasePlan').then(data => {
      if (data) {
        console.log('已获取story数据');
        console.log(data);
        this.setReleasePlanData(data);
        axios.get('/kanban/v1/project/1/userStoryMap').then(data => {
          if (data) {
            console.log('已获取数据');
            console.log(data);
            this.setUserStoryData(data);
            this.getstorynum();
          }
        });
      }
    });
  };
  @action
  getstorynum() {
    this.userStoryData.forEach(one => {
      let userstory = 0;
      one.subIssue.forEach(two => {
        let activitystorys = 0;
        two.subIssue.forEach(three => {
          let taskstorys = 0;
          three.story.forEach((four, i) => {
            //four拿到task的story分组，一个组包含若干列

            four.forEach(five => {
              taskstorys += five.length;
            });
          });
          extendObservable(three, {
            storynum: taskstorys,
          });
          // three['storynum'] = taskstorys;
          activitystorys += taskstorys;
          // console.log(taskstorys);
        });
        extendObservable(two, {
          storynum: activitystorys,
        });
        // two['storynum'] = activitystorys;
        userstory += activitystorys;
        // console.log(activitystorys);
      });
      extendObservable(one, {
        storynum: userstory,
      });
      // one['storynum'] = userstory;
      // console.log(userstory);
    });
  }
  tempUserStoryData(projectId, n, m) {
    return axios
      .get(`kanban/v1/project/1/userStoryMap/tempIssue/page/${n}/size/${m}`)
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(err => {
        window.console.log(err);
      });
  }
  updateDescription(id, description) {
    let descriptionObject = new Object();
    descriptionObject['description'] = description;
    return axios
      .put(`kanban/v1/issue/${id}`, JSON.stringify(descriptionObject))
      .catch(err => {
        console.log(err);
      });
  }
  updateStoryMapSequence(id, storyMapSequence) {
    let storyMapSequenceObject = new Object();
    storyMapSequenceObject['storyMapSequence'] = storyMapSequence;
    return axios
      .put(`kanban/v1/issue/${id}`, JSON.stringify(storyMapSequenceObject))
      .catch(err => {
        console.log(err);
      });
  }
  updateMoveCard(id, storyMapSequence, parentId) {
    let storyMapSequenceObject = new Object();
    storyMapSequenceObject['storyMapSequence'] = storyMapSequence;
    storyMapSequenceObject['parentId'] = parentId;
    return axios
      .put(`kanban/v1/issue/${id}`, JSON.stringify(storyMapSequenceObject))
      .catch(err => {
        console.log(err);
      });
  }
  updateReleasePlanName(id, name) {
    let descriptionObject = new Object();
    descriptionObject['name'] = name;
    return axios
      .put(`kanban/v1/releasePlan/${id}`, JSON.stringify(descriptionObject))
      .catch(err => {
        console.log(err);
      });
  }
  @action
  updateLocalReleasePlanName(storygroup, name) {
    this.ReleasePlanData[storygroup].name = name;
  }
  @action
  updateLocalReleasePlanFlag(storygroup) {
    this.ReleasePlanData[storygroup].flag = false;
  }
  deleteIssueById(id) {
    return axios.delete(`/kanban/v1/issue/${id}`);
  }
  createIssue(data) {
    window.console.log(data);
    return axios.post('/kanban/v1/issue', JSON.stringify(data));
  }
  // 更新Issue
  updateIssueById(id, data) {
    window.console.log(JSON.stringify(data));
    return axios.put(`/kanban/v1/issue/${id}`, JSON.stringify(data));
  }
  @action
  updateLocalIssue(obj, data) {
    console.log(obj);
    if (obj.type === 'user') {
      this.userStoryData[obj.index].description = data.description;
    } else if (obj.type === 'activity') {
      this.userStoryData[obj.index].subIssue[obj.column].description =
        data.description;
    } else if (obj.type === 'task') {
      this.userStoryData[obj.index].subIssue[obj.column].subIssue[
        obj.taskindex
      ].description =
        data.description;
    }
  }
  @action
  updateLocalStory(
    index,
    column,
    taskindex,
    storyindex,
    storygroup,
    storyMapSequence,
    data,
  ) {
    let len = this.userStoryData[index].subIssue[column].subIssue[taskindex]
      .story[storygroup][storyindex].length;
    for (let i = 0; i < len; i++) {
      if (
        this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
          storygroup
        ][storyindex][i].storyMapSequence === storyMapSequence
      ) {
        this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
          storygroup
        ][storyindex][i] = {
          ...this.userStoryData[index].subIssue[column].subIssue[taskindex]
            .story[storygroup][storyindex][i],
          ...data,
        };
      }
    }
  }
  createRelease(data) {
    window.console.log(data);
    return axios.post('/kanban/v1/releasePlan', JSON.stringify(data));
  }
  deleteReleaseById(id) {
    return axios.delete(`/kanban/v1/releasePlan/${id}`);
  }
  @action
  deleteRelease(storygroup) {
    this.groupnum--;
    this.userStoryData.forEach(one => {
      one.subIssue.forEach(two => {
        two.subIssue.forEach(three => {
          if (three.story[storygroup]) {
            three.story.length > 1
              ? three.story.splice(storygroup, 1)
              : three.story.pop();
          }
        });
      });
    });
    this.ReleasePlanData.length > 1
      ? this.ReleasePlanData.splice(storygroup, 1)
      : this.ReleasePlanData.pop();
  }
  createSprint(data) {
    data.issueIdArr.forEach(id => {
      // IssueManageStore.updateIssueById({ id: id, status: 'doing' });
      this.sprintData[id] = true;
    });
    return axios.post('/kanban/v1/sprint', JSON.stringify(data));
  }
  getSprintByProjectId(value) {
    return axios
      .get(`kanban/v1/project/${value}/sprint`)
      .then(data => {
        if (data) {
          return data;
        }
      })
      .catch(err => {
        window.console.log(err);
      });
  }
  @action
  handleDragSameList(
    index,
    column,
    taskindex,
    storyindex,
    storygroup,
    source,
    target,
  ) {
    let needupdate = [];
    let sourceindex = null;
    let targetindex = null;
    //遍历修改storyMapSequence,同时取得source和target
    this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
      storygroup
    ][storyindex].forEach((one, i) => {
      if (one.storyMapSequence === source) {
        sourceindex = i;
      }
      if (one.storyMapSequence === target) {
        targetindex = i;
      }

      if (
        one.storyMapSequence > Math.min(source, target) &&
        one.storyMapSequence < Math.max(source, target)
      ) {
        if (source > target) {
          needupdate.push({
            id: one.id,
            storyMapSequence: one.storyMapSequence + 1,
          });
          one.storyMapSequence++;
        } else if (source < target) {
          needupdate.push({
            id: one.id,
            storyMapSequence: one.storyMapSequence - 1,
          });
          one.storyMapSequence--;
        }
      } else if (one.storyMapSequence === target && source > target) {
        needupdate.push({
          id: one.id,
          storyMapSequence: one.storyMapSequence + 1,
        });
        one.storyMapSequence++;
      }
    });

    this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
      storygroup
    ][storyindex][sourceindex].storyMapSequence =
      this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
        storygroup
      ][storyindex][targetindex].storyMapSequence - 1;
    needupdate.push({
      id: this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
        storygroup
      ][storyindex][sourceindex].id,
      storyMapSequence: this.userStoryData[index].subIssue[column].subIssue[
        taskindex
      ].story[storygroup][storyindex][sourceindex].storyMapSequence,
    });
    console.log(needupdate);
    this.updateIssueArr(needupdate);
  }
  updateIssueArr(arr) {
    return axios.put(`/kanban/v1/issue/issueArr`, arr);
  }
  //添加一项
  @action
  addItem(
    data,
    type,
    index,
    column,
    taskindex,
    storyindex,
    storygroup,
    storyMapSequence,
  ) {
    console.log(
      data,
      type,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      storyMapSequence,
    );
    // console.log(this.userStoryData.Epic.slice());
    if (type === 'user') {
      this.userStoryData.splice(index + 1, 0, { ...data, ...{ subIssue: [] } });
      // this.userStoryData.activity.splice(
      //   index === 0 ? index : index + 1,
      //   0,
      //   [],
      // );
    } else if (type === 'activity') {
      this.userStoryData[index].subIssue.splice(column + 1, 0, {
        ...data,
        ...{ subIssue: [] },
      });
    } else if (type === 'task') {
      this.userStoryData[index].subIssue[column].subIssue.splice(
        taskindex + 1,
        0,
        { ...data, ...{ story: [] } },
      );
    } else if (type === 'story') {
      console.log('story');
      this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
        storygroup
      ].splice(storyindex + 1, 0, [data]);
      let needupdate = [];
      this.userStoryData[index].subIssue[column].subIssue[
        taskindex
      ].story.forEach((one, i) => {
        if (i !== storygroup) {
          one.push([]);
        }
      });
      let len = this.userStoryData[index].subIssue[column].subIssue[taskindex]
        .story[storygroup].length;
      for (let i = storyindex + 2; i < len; i++) {
        this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
          storygroup
        ][i].forEach(one => {
          needupdate.push({ id: one.id, storyColumn: one.storyColumn + 1 });
          one.storyColumn++;
        });
      }
      console.log(needupdate);
      this.updateIssueArr(needupdate);
      //更新Release里的story数量，来确定是否可删除release
      this.ReleasePlanData[storygroup].issues.push({});
    } else if (type === 'newstory' || type === 'dragstory') {
      console.log('newstory');
      if (
        this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
          storygroup
        ] &&
        this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
          storygroup
        ][storyindex]
      ) {
        if (type === 'dragstory') {
          let needupdate = [];
          this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
            storygroup
          ][storyindex].forEach(one => {
            if (one.storyMapSequence >= storyMapSequence) {
              needupdate.push({
                id: one.id,
                storyMapSequence: one.storyMapSequence + 1,
              });
              one.storyMapSequence++;
            }
          });
          this.updateIssueArr(needupdate);
        }
        this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
          storygroup
        ][storyindex].splice(storyMapSequence + 1, 0, data);
      } else if (
        this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
          storygroup
        ]
      ) {
        this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
          storygroup
        ] = [[data]];
      } else {
        let less =
          storygroup -
          this.userStoryData[index].subIssue[column].subIssue[taskindex].story
            .length;
        let empty = Array(less).fill([[]]);
        empty.push([[data]]);
        this.userStoryData[index].subIssue[column].subIssue[taskindex].story = [
          ...this.userStoryData[index].subIssue[column].subIssue[taskindex]
            .story,
          ...empty,
        ];
      }
      //更新Release里的story数量，来确定是否可删除release
      this.ReleasePlanData[storygroup].issues.push({});
    }
    //更新显示的story数量
    this.getstorynum();
  }
  //删除一个项，可以是user,activity,task,story
  @action
  delItem(
    type,
    index,
    column,
    taskindex,
    storyindex,
    storygroup,
    storyMapSequence,
  ) {
    console.log(
      type,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      storyMapSequence,
    );
    if (type === 'user') {
      this.userStoryData.splice(index, 1);
    } else if (type === 'activity') {
      console.log('activity');
      this.userStoryData[index].subIssue.splice(column, 1);
    } else if (type === 'task') {
      this.userStoryData[index].subIssue[column].subIssue.splice(taskindex, 1);
    } else if (type === 'story') {
      let posi;
      let len = this.userStoryData[index].subIssue[column].subIssue[taskindex]
        .story[storygroup][storyindex].length;
      for (let i = 0; i < len; i++) {
        if (
          this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
            storygroup
          ][storyindex][i].storyMapSequence === storyMapSequence
        ) {
          posi = i;
          break;
        }
      }
      this.userStoryData[index].subIssue[column].subIssue[taskindex].story[
        storygroup
      ][storyindex].splice(posi, 1);
      //当前列的每个Release都没有story时，则删除这个列
      let lineHasStory = this.userStoryData[index].subIssue[column].subIssue[
        taskindex
      ].story.some(one => one[storyindex].length > 0);
      //当只有一个列时，不删除
      // let oneline = this.userStoryData[index].subIssue[column].subIssue[
      //   taskindex
      // ].story.some(one => one[storyindex].length > 0);

      if (!lineHasStory) {
        //删除列
        let needupdate = [];
        this.userStoryData[index].subIssue[column].subIssue[
          taskindex
        ].story.forEach(one => {
          one.forEach((two, i) => {
            if (i > storyindex) {
              two.forEach(three => {
                needupdate.push({
                  id: three.id,
                  storyColumn: three.storyColumn - 1,
                });
              });
            }
          });
          one.splice(storyindex, 1);
        });
        console.log(needupdate);
        this.updateIssueArr(needupdate);
      }
      //更新Release里的story数量，来确定是否可删除release
      this.ReleasePlanData[storygroup].issues.pop();
    }
    //更新显示的story数量
    this.getstorynum();
  }
  //增加一个分组
  @action
  addHeight(releaseData) {
    this.ReleasePlanData.push(releaseData);
    console.log(this.ReleasePlanData.length);
    this.groupnum++;
    console.log(this.groupnum);
  }
  //获取每个分组的高度
  @computed
  get getHeights() {
    let heights = [];
    this.userStoryData.forEach(one => {
      one.subIssue.forEach(two => {
        two.subIssue.forEach(three => {
          three.story.forEach((four, i) => {
            //four拿到task的story分组，一个组包含若干列
            let onegroup = [];
            four.forEach(five => {
              //five拿到每个task的每个列
              let onelist = [];
              five.forEach(six => {
                if (six.storyMapSequence != undefined) {
                  onelist.push(six.storyMapSequence + 2);
                }
              });
              onelist.length > 0
                ? onegroup.push(Math.max.apply(null, onelist))
                : null;
            });
            if (onegroup.length > 0) {
              if (heights[i] == undefined) {
                heights[i] = Math.max.apply(null, onegroup);
              } else {
                heights[i] = Math.max(
                  heights[i],
                  Math.max.apply(null, onegroup),
                );
              }
            } else {
              if (heights[i] == undefined) {
                heights[i] = 1;
              }
            }
          });
        });
      });
    });
    //添加分组之后返回正确的分组数
    if (this.groupnum == null) {
      this.groupnum = heights.length;
    } else {
      heights = heights.concat(Array(this.groupnum - heights.length).fill(1));
    }
    return heights;
  }
  @action
  closeright() {
    this.rightshow = false;
  }
  @action
  editItem(data) {
    this.currentEditData = data;
    this.rightshow = true;
  }
  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    var mode;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    for (let i = 0; i < result.length; i++) {
      // console.log(result[i].id, i);
      if (result[i] && result[i].id) {
        this.updateStoryMapSequence(result[i].id, i);
      }
    }
    return result;
  }
  @action
  resort(result) {
    const source = result.source.index;
    const destination = result.destination.index;
    //
    this.userStoryData.Epic = this.reorder(
      this.userStoryData.Epic,
      source,
      destination,
    );
    this.userStoryData.Feature = this.reorder(
      this.userStoryData.Feature,
      source,
      destination,
    );
    console.log(this.userStoryData.Epic[1].id);
  }
}
const userStoryStore = new UserStoryStore();
export default userStoryStore;
