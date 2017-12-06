/**
 * Created by Yu Zhang on 2017/9/6.
 */
/*eslint-disable*/
import { observable, action, computed } from 'mobx';
import axios from 'Axios';
import store from 'Store';

@store('KanbanManageStore')
class KanbanManageStore {
 @observable kanbans=[];

 @computed get getKanbans(){
   return this.kanbans;
}
@action setKanbans(data){
   this.kanbans=data;
}
  //获取看板数据
  getKanbansByProjectId(value) {
    return axios.get(`/kanban/v1/project/${value}/kanban`);
  }

  getKanbansBySprintId(value) {
    return axios.get(`/kanban/v1/sprint/${value}/kanban`);
  }

  getKanbanRecentlyByProjectId(value){
  return axios.get(`/kanban/v1/project/${value}/kanban/recently`);
  }

  kanbanCreate(value){
    return axios.post('/kanban/v1/kanban',value);

  }

  deleteKanban(value){
    return axios.delete(`/kanban/v1/kanban/${value}`);
  }

  updateKanban(value){
    return axios.put(`/kanban/v1/kanban/${value.id}`,value);
  }

}
const kanbanManageStore = new KanbanManageStore();
export default kanbanManageStore;
