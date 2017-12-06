/**
 * Created by Yu Zhang on 2017/9/6.
 */
/*eslint-disable*/
import { observable, action, computed } from 'mobx';
import axios from '../../../../../../../boot/src/containers/common/axios';
import store from '../../../../../../../boot/src/containers/common/store';

@store('LabelManageStore')
class LabelManageStore {
 @observable labels=[];

 @computed get getLabels(){
   return this.labels;
}
@action setLabels(data){
   this.labels=data;
}

  findByProjectId(value){

   return axios.get(`kanban/v1/project/${value}/label`);

  }

  deleteById(value){
    return axios.delete(`/kanban/v1/label/${value}`);
  }
  findById(value)
  {
    return axios.get(`/kanban/v1/label/${value}`);
  }

  create(value){
    return axios.post(`/kanban/v1/label`,value);
  }
  update(value){
    return axios.put(`/kanban/v1/label/${value.id}`,value);
  }
}
const labelManageStore = new LabelManageStore();
export default labelManageStore;
