import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
// import nomatch from 'nomatch';
// import asyncRouter from '../../util/asyncRouter';

// const Home = asyncRouter(() => import('../iam/containers/Home'))
import KANBANFRONTIndex from './kanbanfront/containers/KANBANFRONTIndex';

function AutoRouter() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      {/* <Route path="/iam" component={IAMIndex} /> */}
      <Route path="/kanbanfront" component={KANBANFRONTIndex} />
      {/* <Route path={'*'} component={nomatch} /> */}
    </Switch>
  );
}

export default AutoRouter;
