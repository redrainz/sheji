import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import asyncRouter from 'asyncRouter';

const EditKanban = asyncRouter(() => (import('./EditKanban')));
const EDITKANBANIndex = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/:kanbanId`} component={EditKanban} />
  </Switch>
);

export default EDITKANBANIndex;
