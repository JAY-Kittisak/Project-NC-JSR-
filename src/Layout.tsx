import React, { useState } from 'react'
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import Sidebar from './components/Sidebar';
import { useModalContext } from './state/modal-context'

interface Props { }

const Layout: React.FC<Props> = ({ children }) => {
  const [navToggle, setNavToggle] = useState(false)

  const { modal } = useModalContext()

  return (
    <div>
      <Sidebar navToggle={navToggle} />

      <div className='ham-burger-menu'>
        <IconButton onClick={() => setNavToggle(!navToggle)}>
          <MenuIcon />
        </IconButton>
      </div>

      <MainContentStyled>
        <div className='lines'>
          <div className='line-1'></div>
          <div className='line-2'></div>
          <div className='line-3'></div>
          <div className='line-4'></div>
        </div>
        {children}

        {modal && modal}
      </MainContentStyled>

    </div>
  )
}

const MainContentStyled = styled.main`
  position: relative;
  margin-left: 16.3rem;
  min-height: 100vh;
  
  @media screen and (max-width: 1400px){
    margin-left: 0;
  }

  .lines {
    position: absolute;
    min-height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    opacity: 0.4;
    z-index: -1;
    .line-1,
    .line-2,
    .line-3,
    .line-4 {
      width: 1px;
      min-height: 100vh;
      background-color: var(--border-color);
    }
  }
`;
export default Layout