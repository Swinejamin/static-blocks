import React from 'react'
import { Router } from 'react-static'
import { hot } from 'react-hot-loader'
//
import Routes from 'react-static-routes'
import Header from './elements/Header'

import styles from './app.block.css'

const App = () => (
  <Router>
    <div className={styles}>
      <Header />
      <div className={styles.content}>
        <Routes />
      </div>
    </div>
  </Router>
)

export default hot(module)(App)
