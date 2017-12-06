/**
 * Created by chenzl on 2017/8/29.
 */
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import kanbanManage from './KanbanManage';
// import newKanbanManage from './NewKanbanManage';
import Test from './Test';
const KANBANMANAGEIndex = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/:sprintId`} component={Test} />
    <Route path={`${match.url}/:sprintId/new`} component={Test} />
  </Switch>
);

export default KANBANMANAGEIndex;
