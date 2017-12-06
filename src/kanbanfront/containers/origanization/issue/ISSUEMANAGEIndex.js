/**
 * Created by chenzl on 2017/9/5.
 * Feature:管理Issue组件
 */
/*eslint-disable*/
import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import asyncRouter from 'asyncRouter';

const issueManage = asyncRouter(() => (import('./IssueManage')), () => (import('../../../stores/origanization/issue/IssueManageStore')));
const createIssue = asyncRouter(() => (import('./CreateIssuePage')), () => (import('../../../stores/origanization/issue/IssueManageStore')));
const updataIssue = asyncRouter(() => (import('./UpdataIssuePage')), () => (import('../../../stores/origanization/issue/IssueManageStore')));
const createSubIssue = asyncRouter(() => (import('./CreateSubIssue')), () => (import('../../../stores/origanization/issue/IssueManageStore')));
const associationBug = asyncRouter(() => (import('./AssociationBug')), () => (import('../../../stores/origanization/issue/IssueManageStore')));
const ISSUEMANAGEIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={issueManage} />
    <Route path={`${match.url}/create`} component={createIssue} />
    <Route path={`${match.url}/updata`} component={updataIssue} />
    <Route path={`${match.url}/createSub`} component={createSubIssue} />
    <Route path={`${match.url}/createBug`} component={associationBug} />
  </Switch>
);
export default ISSUEMANAGEIndex;
