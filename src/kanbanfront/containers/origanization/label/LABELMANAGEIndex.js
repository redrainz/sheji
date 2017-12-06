/**
 * Created by chenzl on 2017/8/29.
 */
import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';

const labelManage = asyncRouter(() => (import('./LabelManage')));
const editLabel = asyncRouter(() => (import('./EditLabel')));

const LABELMANAGEIndex = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/:issueTypeId`} component={editLabel} />
    <Route exact path={match.url} component={labelManage} />
  </Switch>
);

export default LABELMANAGEIndex;
