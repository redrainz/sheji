/**
 * Created by chenzl on 2017/8/29.
 */
import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import asyncRouter from 'asyncRouter';

const kanbanManage = asyncRouter(() => (import('./KanbanManage')));
const newKanbanManage = asyncRouter(() => (import('./NewKanbanManage')));


const KANBANMANAGEIndex = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/:sprintId`} component={kanbanManage} />
    <Route path={`${match.url}/:sprintId/new`} component={newKanbanManage} />
  </Switch>
);

export default KANBANMANAGEIndex;
