import React, { useState } from 'react'
import styled from "styled-components";
import { NavLink } from 'react-router-dom'

import { SidebarType } from '../types'

interface Props {
    item: SidebarType
}

const SubMenu: React.FC<Props> = ({ item }) => {
    const [subNav, setSubNav] = useState(false);

    const showSubNav = () => setSubNav(!subNav);
    
    return (
        <>
            <NavLink
                to={item.path}
                onClick={item.subNav && showSubNav}
                className={(isActive) => isActive ? "active-class" : ""}
            >
                <IconStyled>
                    <span>{item.title}</span>
                    {item.subNav && subNav
                        ? item.iconClosed
                        : item.subNav
                            ? item.iconOpened
                            : null}
                </IconStyled>
            </NavLink>

            {subNav &&
                item.subNav.map((item, i) => {
                    return (
                        <NavLink
                            key={i} 
                            to={item.path}
                            className={(isActive) => isActive ? "active-class sub-menu" : "sub-menu"}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </NavLink>
                    );
                })}
        </>
    )
}

const IconStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px 0px 110px;
`

export default SubMenu