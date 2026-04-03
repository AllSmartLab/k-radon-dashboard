import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import SignIn from '../views/auth/SignIn';
import SignUp from '../views/auth/SignUp';
import MainPage from '../views/main/MainPage';
import BillingPage from '../views/billing/BillingPage';

const AppRoutes = () => {
  return (
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />

      <Route
        path="/main"
        render={(props) => (
          <AppLayout>
            <MainPage {...props} />
          </AppLayout>
        )}
      />
      <Route
        path="/billing"
        render={(props) => (
          <AppLayout>
            <BillingPage {...props} />
          </AppLayout>
        )}
      />
      <Redirect to="/" />
    </Switch>
  );
};

export default AppRoutes;
