import React from 'react'
import { Link } from 'react-static'

import styles from './header.block.css'


class Header extends React.Component {
  render () {
    return (
      <nav className={styles}><Link exact to="/">Home</Link><Link to="/about">About</Link><Link to="/blog">Blog</Link>
      </nav>)
  }
}

export default Header
