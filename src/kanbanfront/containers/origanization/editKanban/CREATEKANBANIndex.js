/**
 * Created by chenzl on 2017/8/31.
 */
import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import asyncRouter from 'asyncRouter';

const createKanban = asyncRouter(() => (import('./CreateKanban')));
const EditKanban = asyncRouter(() => (import('./EditKanban')));

const CREATEKANBANIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={createKanban} />
    <Route path={`${match.url}/editKanban`} component={EditKanban} />
  </Switch>
);

export default CREATEKANBANIndex;
