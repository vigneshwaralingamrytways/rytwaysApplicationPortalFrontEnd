import React from 'react'
import Header from './Navbar/Header'

function Layout(props) {
  return (
    <Header>
        {props.children}
    </Header>
  )
}

export default Layout
