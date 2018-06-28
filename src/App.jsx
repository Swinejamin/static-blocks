import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { Link, BrowserRouter, Route } from 'react-static'
import styles from './App.block.css'
import Home from './containers/Home'
import About from './containers/About'

// import logo from './logo.png'
class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    // Display fallback UI
    this.setState({ hasError: true })
    // You can also log the error to an error reporting service
    console.error(error)
    console.info(info)
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p content="Somtehing wen">Something went wrong.</p >
    }
    return this.props.children
  }
}

class App extends Component {
  render () {
    return (
      <ErrorBoundary >

        <BrowserRouter >
          <div className={styles} >
            <nav className={styles.nav} >
              <ul className={styles.navList} >
                <li ><Link to="/" >Home</Link ></li >
                <li ><Link to="/about" >Demo</Link ></li >
              </ul >
            </nav >
            <main >
              <Route exact path="/" component={Home} />
              <Route path="/about" component={About} />
            </main >
            <footer className={styles.footer} >
              {/* eslint-disable  */}
              <a href="https://engineering.linkedin.com/open-source" className={styles.footerLink} target="_blank"
                 rel="noopener noreferrer" >Made with ♥ by</a >
              {/* eslint-ensable  */}
            </footer >
          </div >
        </BrowserRouter >
      </ErrorBoundary >)
  }
}

export default hot(module)(App)
