import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { inject } from 'mobx-react';

import asyncRouter from 'asyncRouter';

const Home = asyncRouter(() => import('./Home'));
const KANBANMANAGEIndex = asyncRouter(() => import('./origanization/managePage/KANBANMANAGEIndex'));
const LABELMANAGEIndex = asyncRouter(() => import('./origanization/label/LABELMANAGEIndex'));
const CREATEKANBANIndex = asyncRouter(() => import('./origanization/editKanban/CREATEKANBANIndex'));
const ISSUEMANAGEIndex = asyncRouter(() => import('./origanization/issue/ISSUEMANAGEIndex'));
const USERSTORYMAPIndex = asyncRouter(() => import('./origanization/userStoryMap/USERSTORYMAPIndex'));
const KANBANIndex = asyncRouter(() => import('./origanization/kanban/KANBANIndex'));
const EDITKANBANIndex = asyncRouter(() => import('./origanization/editKanban/EDITKANBANIndex'));
const SPRINTIndex = asyncRouter(() => import('./origanization/sprint/SPRINTIndex'));

class KANBANFRONTIndex extends React.Component {
  render() {
    const { match } = this.props;
    
    return (
      
        <div>
          <Switch>
            <Route exact path={match.url} component={Home} />
            <Route path={`${match.url}/kanbanManage`} component={KANBANMANAGEIndex} />
            <Route path={`${match.url}/createKanban`} component={CREATEKANBANIndex} />
            <Route path={`${match.url}/issueManage`} component={ISSUEMANAGEIndex} />
            <Route path={`${match.url}/userStoryMap`} component={USERSTORYMAPIndex} />
            <Route path={`${match.url}/kanban`} component={KANBANIndex} />
            <Route path={`${match.url}/editkanban`} component={EDITKANBANIndex} />
            <Route path={`${match.url}/labelManage`} component={LABELMANAGEIndex} />
            <Route path={`${match.url}/editLabel`} component={LABELMANAGEIndex} />
            <Route path={`${match.url}/sprintManage`} component={SPRINTIndex} />
            <Route path={`${match.url}/sprintDetails`} component={SPRINTIndex} />
          </Switch>
        </div>
     
    );
  }
}

export default KANBANFRONTIndex;
