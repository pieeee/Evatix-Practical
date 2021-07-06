import React, { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import cookie from "cookie";

import "./css/style.scss";

import AOS from "aos";
import { focusHandling } from "cruip-js-toolkit";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
    focusHandling("outline");
  }, [location.pathname]); // triggered on route change

  const cookies = cookie.parse(document.cookie);

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route
          path="/signin"
          render={() => (cookies.signedIn ? <Redirect to="/" /> : <SignIn />)}
        />

        <Route
          path="/signup"
          render={() => (cookies.signedIn ? <Redirect to="/" /> : <SignUp />)}
        />
        <Route path="/reset-password">
          <ResetPassword />
        </Route>
        <Route
          path="/profile"
          render={() => (!cookies.signedIn ? <Redirect to="/" /> : <Profile />)}
        />
      </Switch>
    </>
  );
}

export default App;
