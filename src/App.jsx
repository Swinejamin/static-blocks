import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { hot } from "react-hot-loader";
import { Link, BrowserRouter, Route } from "react-static";
import styles from "./App.block.css";
import Home from "./containers/Home";
import About from "./containers/About";

class App extends Component {
  render() {
    return (
      <div className={styles}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">Demo</Link>
            </li>
          </ul>
        </nav>
        <main>
          {/*<Route exact path="/" component={Home} />*/}
          {/*<Route path="/about" component={About} />*/}
        </main>
        <footer className={styles.footer}>
          <p className={styles.footerLink}>Made with ♥ by</p>
        </footer>
      </div>
    );
  }
}

App.propTypes = {};

/* eslint-disable */

export default App;

/* eslint-enable */
