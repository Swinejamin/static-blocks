import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { Link, Router, Route, Switch } from 'react-static'
//
import styles from './App.block.css'

// import logo from './logo.png'

class App extends Component {
  render () {
    return (
      <Router className={styles.app} >
        <header className={styles.appHeader} >
          <ul >
            <li ><Link to="/About" >About</Link ></li >
            <li ><Link to="/Home" >Home</Link ></li >
          </ul >
        </header >
        <Switch >

          <Route path="/About" render={({ match }) => {
            console.log(match)
            return (
              <p className="App-intro" >
                To get started, edit <code >src/App.js</code > and save to reload.
                <pre >{match}</pre >
              </p >)
          }} />
          <Route path="/Home" >
            <p className="App-intro" >
              Home page, bitch

            </p >
          </Route >
        </Switch >
      </Router >)
  }
}

export default hot(module)(App)
