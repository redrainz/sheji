import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';

const Kanban = asyncRouter(() => (import('./Kanban')));
const CreatCardPage = asyncRouter(() => (import('./CreateCardPage')));
const CreateSubCardPage = asyncRouter(() => (import('./CreateSubCardPage')));
const KANBANIndex = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/:kanbanId`} component={Kanban} />
    <Route exact path={`${match.url}/:kanbanId/createSubCard/:parentCardId`} component={CreateSubCardPage} />
    <Route exact path={`${match.url}/:kanbanId/create`} component={CreatCardPage} />
  </Switch>
);

export default KANBANIndex;
