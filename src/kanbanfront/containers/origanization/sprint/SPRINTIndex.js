/**
 * Created by chenzl on 2017/9/5.
 * 用户故事地图页面
 */

import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';

const sprintManage = asyncRouter(() => (import('./SprintManage')));
// const sprintDetails = asyncRouter(() => (import('./SprintDetails')));
const sprintDetailOther = asyncRouter(() => (import('./SprintDetailOther')));
const SPRINTIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={sprintManage} />
    <Route path={`${match.url}/:sprintId`} component={sprintDetailOther} />
  </Switch>
);
export default SPRINTIndex;
