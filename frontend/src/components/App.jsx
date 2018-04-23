import React from 'react';
import Gallery from './gallery';
import Showcase from './showcase';
import ShowcaseCreate from './showcaseCreate';
import { Route, Switch, Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';

const App = ({ store }) =>  (
  <Switch>
    <ProtectedRoute authorized={checkJWT()} path="/welcome" component={Showcase} />
    <Route exact path="/create" component={ShowcaseCreate} />
    <Route path="/:token" render={(props) => initialAuthorize(props)}/>
  </Switch>
);

const initialAuthorize = (props) => {
  fetch('/authorize', {
    headers: {
      token: props.match.params.token
    },
    method: 'GET'
  })
  .then(res => res.json())
  .then(res => Cookie.set('authToken', res));
  return <Redirect to="/" />;
};

const ProtectedRoute = (props) => {
  console.log(props);
  if(props.authorized) {
    return <Route exact path={props.path} component={props.component}/>;
  } else {
    return <Redirect to="/"/>;
  }
};

const checkJWT = () => {
  fetch('/checkJWT', {
    headers: {
      authToken: Cookie.set('authToken')
    },
    method: 'GET'
  })
  .then(res => res.json())
  .then(res => res);
};

export default App;
