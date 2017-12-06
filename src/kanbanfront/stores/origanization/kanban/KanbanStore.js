/*eslint-disable*/
import { observable, action, computed } from 'mobx';
import React from 'react';
import {message} from 'antd';
import axios from 'Axios';

class KanbanStore {
  @observable issue = {}
  @action setIssue(issue){
    this.issue = issue
  }
  @computed get getIssue(){
    return this.issue
  }
  getColumnId(kanbanId){
    return axios.get(`/kanban/v1/kanban/${kanbanId}/column`).catch(err =>{
      console.log(err)
    })
  }

  getStoryCardByProjectId(projectId) {
    return axios.get(`/kanban/v1/project/${projectId}/issue`).catch(err => {
      console.log(err);
    });
  }
  getCardById(kanbanId){
    return axios.get(`/kanban/v1/kanban/${kanbanId}/columns/issue`).catch(err => {
      console.log(err);
    });
  }
  getKanBanName(kanbanId){
    return axios.get(`/kanban/v1/kanban/${kanbanId}`).catch(err =>{
      console.log(err)
    })
  }
  getStoryCardByKanbanId(kanbanId){
    return axios.get(`/kanban/v1/kanban/${kanbanId}/issue`).catch(err => {
      console.log(err);
    });
  }

  getColumn(kanbanId){
    return axios.get(`/kanban/v1/kanban/${kanbanId}/column`).catch(err => {
      console.log(err);
    });
  }

  addColumn(newColumn){
    return axios.post(`/kanban/v1/column`,JSON.stringify(newColumn)).catch(err => {
      console.log(err);
    });
  }

  updateColumn(columnId,column){
    return axios.put(`/kanban/v1/column/${columnId}`,JSON.stringify(column)).catch(err => {
      console.log(err);
    })
  }

  updateAllColumn(kanbanId,kanbanInfo){
    console.log(JSON.stringify(kanbanInfo));
    return axios.post(`/kanban/v1/kanban/${kanbanId}/column`,JSON.stringify(kanbanInfo)).catch(err => {
      console.log(err);
      message.destroy();
      message.error('网络故障，请重新保存',1);
    })
  }

  deleteColumn(columnId){
    return axios.delete(`/kanban/v1/column/${columnId}`).catch(err => {
      console.log(err);
    })
  }
  updateKanban(kanbanId,kanbanInfo){
    console.log(JSON.stringify(kanbanInfo));
    return axios.put(`/kanban/v1/kanban/${kanbanId}`,JSON.stringify(kanbanInfo)).catch(err => {
      console.log(err);
      message.destroy();
      message.error('网络故障，请重新保存',1);
    })
  }

  // updateAllColumn(kanbanId,array){
  //   return axios.post(`/kanban/v1/kanban/${kanbanId}/column`,JSON.stringify(array)).catch(err => {
  //     console.log(err);
  //     message.destroy();
  //     message.error('网络故障，请重新保存',1);
  //   })
  // }

  deleteColumns(toBeDeletedColumn){
    return axios.put(`/kanban/v1/column/deletedIdArr`,JSON.stringify(toBeDeletedColumn)).catch(err => {
      console.log(err);
      message.destroy();
      message.error('网络故障，请重新保存',1);
    })
  }

  deleteSwimLanes(toBeDeletedSwimLane){
    console.log(JSON.stringify(toBeDeletedSwimLane));
    return axios.put(`/kanban/v1/swimLane/deletedGroupIdArr`,JSON.stringify(toBeDeletedSwimLane)).catch(err => {
      console.log(err);
      message.destroy();
      message.error('网络故障，请重新保存',1);
    })
  }
  updateIssueById(id,issue){
    return axios.put(`/kanban/v1/issue/${id}`,issue).catch(err=>{
      console.log(err);
      message.destroy();
      message.error('网络故障，请刷新',1);
      }
    )
  }
  getSprintBySprintId(sprintId){
    return axios.get(`/kanban/v1/sprint/${sprintId}`).catch(err=>{
      console.log(err);
      message.destroy();
      message.error('网络故障，请刷新',1);
    })
  }
  getSprintByProjectId(projectId){
    return axios.get(`/kanban/v1/project/${projectId}/sprint`).catch(err=>{
      console.log(err);
      message.destroy();
      message.error('网络故障，请刷新',1);
    })
  }
  getIssueWithoutKanbanIDbySprintId(sprintId){
    return axios.get(`/kanban/v1/sprint/${sprintId}/issue`).catch(err=>{
      console.log(err);
      message.destroy();
      message.error('网络故障，请刷新',1);
    })
  }
  getKanbanById(kanbanId){
    return axios.get(`/kanban/v1/kanban/${kanbanId}`).catch(err=>{
      console.log(err);
      message.destroy();
      message.error('网络故障，请刷新',1);
    })
  }
  MountUpdateIssue(issueArr){
    return axios.put(`/kanban/v1/issue/issueArr`,JSON.stringify(issueArr)).catch(err=>{
      console.log(err);
      message.destroy();
      message.error('网络故障，请刷新',1);
    })
  }
  getReleasePlanByProjectId(projectId){
    return axios.get(`/kanban/v1/project/${projectId}/releasePlan`).catch(err=>{
      console.log(err);
      message.destroy();
      message.error('网络故障，请刷新',1);
    })
  }
  getIssueByProjectId(projectId){
    return axios.get(`/kanban/v1/project/${projectId}/issue`).catch(err=>{
      console.log(err);
      message.destroy();
      message.error('网络故障，请刷新',1);
    })
  }
}
const kanbanStore = new KanbanStore();
export default kanbanStore;
