/**
 * Created by chenzl on 2017/9/5.
 * 用户故事地图页面
 */

import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import asyncRouter from 'asyncRouter';

const userStoryMap = asyncRouter(() => (import('./UserStoryMap')));
const USERSTORYMAPIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={userStoryMap} />
  </Switch>
);
export default USERSTORYMAPIndex;
