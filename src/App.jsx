import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
//
import app from './app.blocks.css'
import logo from './logo.png'

class App extends Component {
  render () {
    return (
      <div className={app} >
        <header className="App-header" >
          <img src={logo} className="App-logo" alt="logo" />
          {/* eslint-disable */}
          <h1 className="App-title" >Welcome to React-Static</h1 >
          {/* eslint-enable */}
        </header >
        <p className="App-intro" >
          To get started, edit <code >src/App.js</code > and save to reload.
        </p >
      </div >)
  }
}

export default hot(module)(App)
