/**
 * Created by chenzl on 2017/9/7.
 * issue 数据交互
 */
/*eslint-disable*/
import { observable, action, computed } from 'mobx';
import axios from 'Axios';
import store from 'Store';

@store('IssueManageStore')
class IssueManageStore {
  @observable issueData = [];
  @observable storyData = []; // 查看Story详情
  @observable storyId = 0; // storyId
  @observable isLoading = true; // 等待加载中
  @observable displayStatus = 'none'; // 隐藏详情页面
  @observable loadFlag = true;

  @action
  setLoadFlag(flag) {
    this.loadFlag = flag;
  }
  @computed
  get getLoadFlag() {
    return this.loadFlag;
  }

  @action
  setDisplayStatus(displayStatus) {
    this.displayStatus = displayStatus;
  }
  @computed
  get getDisplayStatus() {
    return this.displayStatus;
  }
  @action
  changeLoading(flag) {
    this.isLoading = flag;
  }

  @computed
  get getIsLoading() {
    return this.isLoading;
  }

  @computed
  get getStoryId() {
    return this.storyId;
  }
  @action
  setStoryId(id) {
    this.storyId = id;
  }
  @computed
  get getStoryData() {
    return this.storyData;
  }
  @action
  setStoryData(storyData) {
    console.log(storyData);
    this.storyData = {...this.storyData,...storyData};
    console.log({...this.storyData});
  }
  @computed
  get getIssueData() {
    return this.issueData.slice();
  }
  @action
  setIssueData(data) {
    this.issueData = data;
  }

  // 根据项目ID查询Issue信息列表 projectId=1
  localIssueModel() {
    this.changeLoading(true);
    axios
      .get('/kanban/v1/project/1/issue')
      .then(data => {
        if (data) {
          this.setIssueData(data);
        }
        this.changeLoading(false);
      })
      .catch(err => {
        window.console.log(err);
      });
  }
  // 创建新的Issue
  createIssue(data) {
    window.console.log('新建数据:' + JSON.stringify(data));
    return axios.post('/kanban/v1/issue', JSON.stringify(data));
  }
  // 删除
  deleteIssueById(id) {
    return axios.delete(`/kanban/v1/issue/${id}`);
  }
  // 根据Id查找Issue
  getIssueById(id) {
    return axios.get(`/kanban/v1/issue/${id}`);
  }
  // 根据Id查找story详情
  getStoryDataById(id) {
    return axios
      .get(`/kanban/v1/issue/${id}`)
      .then(data => {
        if (data) {
          console.log(data);
          this.setStoryData(data);
          this.setStoryId(id);
        }
      })
      .catch(err => {
        window.console.log(err);
      });
  }
  // 更新Issue
  updateIssueById(data, id) {
    window.console.log(JSON.stringify(data));
    return axios.put(`/kanban/v1/issue/${id}`, JSON.stringify(data));
  }
  // 查看Issue类型
  getIssueTypeList(projectId) {
    // const projectId=1;
    return axios.get(`/kanban/v1/project/${projectId}/label`);
  }
  // 查看Issue层级关系
  loadIssueLevelListData() {
    axios
      .get('/kanban/v1/project/1/issue')
      .then(data => {
        if (data) {
          this.setIssueData(data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}
const issueManageStore = new IssueManageStore();
export default issueManageStore;
