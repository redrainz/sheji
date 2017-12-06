/*eslint-disable*/
import React from 'react';
import axios from 'Axios';

class KanbanCardStore {
  /*
   * 更新卡片上的描述信息
   * @param id 卡片ID
   * @param description 卡片当前描述信息
   * */
  setRemoteDescription(id,description) {
    let descriptionObject = new Object();
    descriptionObject['description'] = description;
    return axios.put(`kanban/v1/issue/${id}`,JSON.stringify(descriptionObject)).catch(err => {
      console.log(err);
    });
  }
}
const kanbanCardStore = new KanbanCardStore();
export default kanbanCardStore;
