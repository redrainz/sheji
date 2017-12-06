/**
 * Created by Yu Zhang on 2017/9/26.
 */
/*eslint-disable*/
import { observable, action, computed } from 'mobx';
import axios from 'Axios';
import store from 'Store';

@store('SprintStore')
class SprintStore {
  @observable sprintData = {};
  @observable sprints=[];
  @observable currentEditData = {};
  @observable rightShow = false;
  @observable createTaskShow = false;
  @observable currentId = 0;
  @observable taskType=false;

  @action
  setCurrentId(currentId){
    console.log(currentId)
    this.currentId=currentId;
     this.sprintData["issue"].map((item,index)=>{
       if(item.id==currentId){
         this.setCurrentEditData(item)
       }
     })
  }
  @action
  setRightShow(){
    this.rightShow=true;
    this.createTaskShow=false;
  }
  @action
  closeRight() {
    this.rightShow = false;
  }
  @action
  setCreateTaskShow(){
    this.rightShow=false;
    this.createTaskShow=true;
  }
  @action
  closeCreateTaskShow() {
    this.createTaskShow = false;
  }
  @action
  setCurrentEditData(currentEditData){
    this.currentEditData = {...this.currentEditData,...currentEditData};
  console.log(this.currentEditData)
  }
  @computed get
  getCurrentEditData(){
  return this.currentEditData;
}
  getSprintById(id){
    return axios.get(`kanban/v1/sprint/${id}`)
  }
  getSprintByProjectId(value){
    return axios.get(`kanban/v1/project/${value}/sprint`);
  }
  @action
  setSprintData(data){
       this.sprintData=data;
  }
  @computed get
  getSprintData(){
    return this.sprintData;
  }
  updateIssueById(id,value){
    window.console.log(value);
    return axios.put(`kanban/v1/issue/${id}`,value);
  }
  updateSprintById(id,value){
    return axios.put(`kanban/v1/sprint/${id}`,JSON.stringify(value));
  }
  deleteSprintById(id){
    return axios.delete(`kanban/v1/sprint/${id}`);
  }
  getKanBanName(id){
  return  axios.get(`/kanban/v1/kanban/${id}`)
  }
  getKanbansBySprintId(value) {
   return  axios.get(`/kanban/v1/sprint/${value}/kanban`)
  }
  getCharts(id){
    return axios.get(`/kanban/v1/${id}/charts`);
  }
  // 创建迭代
  createSprint(data){
    return axios.post('/kanban/v1/sprint',JSON.stringify(data));
  }

  // 根据项目Id查询release
  getReleaseData(){
    const projectId=1;
    return axios.get(`kanban/v1/project/${projectId}/releasePlan`);
  }
//批量更新story
  updateIssueArr(issueArr){
    console.log(issueArr)
    return axios.put(`kanban/v1/issue/issueArr`,JSON.stringify(issueArr));
  }


}
const sprintStore = new SprintStore();
export default sprintStore;
