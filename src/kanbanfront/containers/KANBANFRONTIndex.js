import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject } from 'mobx-react';

import Home from './Home';
// import KANBANMANAGEIndex from './origanization/managePage/KANBANMANAGEIndex';
// import LABELMANAGEIndex from './origanization/label/LABELMANAGEIndex';
// import CREATEKANBANIndex from './origanization/editKanban/CREATEKANBANIndex';
// import ISSUEMANAGEIndex from './origanization/issue/ISSUEMANAGEIndex';
import USERSTORYMAPIndex from './origanization/userStoryMap/USERSTORYMAPIndex';
// import KANBANIndex from './origanization/kanban/KANBANIndex';
// import EDITKANBANIndex from './origanization/editKanban/EDITKANBANIndex';
// import SPRINTIndex from './origanization/sprint/SPRINTIndex';

class KANBANFRONTIndex extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Switch>
          <Route exact path={match.url} component={Home} />
          {/* <Route
            path={`${match.url}/kanbanManage`}
            component={KANBANMANAGEIndex}
          />
          <Route
            path={`${match.url}/createKanban`}
            component={CREATEKANBANIndex}
          />
          <Route
            path={`${match.url}/issueManage`}
            component={ISSUEMANAGEIndex}
          /> */}
          <Route
            path={`${match.url}/userStoryMap`}
            component={USERSTORYMAPIndex}
          />
          {/* <Route path={`${match.url}/kanban`} component={KANBANIndex} />
          <Route path={`${match.url}/editkanban`} component={EDITKANBANIndex} />
          <Route
            path={`${match.url}/labelManage`}
            component={LABELMANAGEIndex}
          />
          <Route path={`${match.url}/editLabel`} component={LABELMANAGEIndex} />
          <Route path={`${match.url}/sprintManage`} component={SPRINTIndex} />
          <Route path={`${match.url}/sprintDetails`} component={SPRINTIndex} /> */}
        </Switch>
      </div>
    );
  }
}

export default KANBANFRONTIndex;
