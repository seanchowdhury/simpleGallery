import React from 'react';
import Gallery from './gallery';
import Showcase from './showcase';
import ShowcaseCreate from './showcaseCreate';
import { Route, Switch, Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
import createHistory from "history/createBrowserHistory";

const history = createHistory();

const App = ({ store }) =>  (
  <Switch>
    <Route exact path="/create" component={ShowcaseCreate} />
    <Route exact path="/" component={Showcase} />
    <Route path="/:token" render={(props) => initialAuthorize(props)}/>
    //<ProtectedRoute path="/" />
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

const ProtectedRoute = () => {

  return <Redirect to="/welcome" component={Showcase} />;
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
