import React from 'react'
import styled from 'styled-components'
import Icon from './common/Icon'
import Nav from './Nav'

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: center;
  padding: 32px 16px;
  width: 100%;
  max-width: 920px;
`

const Logo = styled.div`
  font-size: 2rem;
`

export default () => (
  <Header>
    <Logo>
      <Icon name="triangle" /> react-boilerplate
    </Logo>
    <Nav />
  </Header>
)
