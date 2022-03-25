import React,{useEffect} from 'react'
import styled from 'styled-components'
import { NavLink,useLocation } from 'react-router-dom'

import avatar from '../assets/image/demo-user.png'
import avatarJsr from '../assets/image/JSR-Logo-new-PNG.png'
import {openUserDropdown, useAuthContext} from '../state/auth-context'
import { isAdmin, isClient } from '../helpers'
import AccountDropdown from './AccountDropdown'

interface Props { }

const Navigation: React.FC<Props> = () => {
    const {
        authState: { authUser,isUserDropdownOpen, userInfo }, 
        authDispatch
    } = useAuthContext()

    const location = useLocation()

    useEffect(() => {
        if (isUserDropdownOpen) authDispatch(openUserDropdown(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <NavigationStyled>
            {authUser ? (
                <div className='avatar'>
                    <img src={avatar} alt="" onMouseOver={() => authDispatch(openUserDropdown(true))} />
                        <AccountDropdown
                            name={authUser.displayName}
                            email={authUser.email}
                        />
                </div>
            ): (
                <div className='avatar'>
                    <img src={avatarJsr} alt=""/>
                </div>
            )}
            <ul className="nav-items">
                <li className="nav-item">
                    <NavLink to="/" exact className={(isActive) => isActive ? "active-class" : ""}>
                        Home
                    </NavLink>
                </li>
                {userInfo?.role && (
                    <>
                        {(isClient(userInfo.role) || isAdmin(userInfo.role)) && (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/nc/notify" className={(isActive) => isActive ? "active-class" : ""}>
                                        ออก ncr
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/nc/answer" className={(isActive) => isActive ? "active-class" : ""}>
                                        ตอบ ncr
                                    </NavLink>
                                </li>
                                <li className="nav-item ">
                                    <NavLink to="/iqa/internal-quality" exact className={(isActive) => isActive ? "active-class" : ""}>
                                        ออก iqa
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {isAdmin(userInfo.role) && (
                            <>
                                <hr />
                                <div className="admin-view">
                                    Admin View
                                </div>
                                <li className="nav-item">
                                    <NavLink to="/admin/manage-nc" exact className={(isActive) => isActive ? "active-class" : ""}>
                                        manage nc
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/admin/manage-iqa" exact className={(isActive) => isActive ? "active-class" : ""}>
                                        manage iqa
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/admin/manage-dept" exact className={(isActive) => isActive ? "active-class" : ""}>
                                        manage dept
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/admin/manage-dept-cdc" exact className={(isActive) => isActive ? "active-class" : ""}>
                                        manage dept Cdc
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/admin/manage-users" exact className={(isActive) => isActive ? "active-class" : ""}>
                                        manage users
                                    </NavLink>
                                </li>
                                <hr />
                            </>
                        )}
                    </>
                )}
            </ul>
            <footer className='footer'>
                <p>JSR NC System v1.8</p>
            </footer>
        </NavigationStyled>
    )
}

const NavigationStyled = styled.nav`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    border-right: 1px solid var(--border-color);

    .admin-view {
        padding-top: 1rem;
        width: 100%;
        color: var(--primary-color);
        font-size: 1.5rem;
        font-weight: 600;
    }

    .avatar{
        width: 100%;
        border-bottom: 1px solid var(--border-color);
        text-align: center;
        padding: 1rem 0;
        img {
            width: 70%;
            border-radius: 50%;
            border: 8px solid var(--border-color);
        }
    }
    .nav-items{
        width: 100%;
        text-align: center;
        .active-class{
                background-color: var(--primary-color-light);
                color: var(--white-color);
        }
        li{
            display: block;
            a{
                display: block;
                padding: .45rem 0;
                position: relative;
                z-index: 10;
                text-transform: uppercase;
                transition: all .4s ease-in-out;
                font-weight: 600;
                letter-spacing: 1px;
                &:hover{
                    cursor: pointer;
                    color: var(--white-color);
                }
                &::before{
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 50%;
                    background-color: var(--primary-color);
                    transition: All 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
                    opacity: 0.21;
                    z-index: -1;
                }
            }

            a:hover::before{
                width: 100%;
                height: 100%;
            }
        }
    }

    hr {
        margin: 1rem 2.5rem 0rem 2.5rem;
    }

    footer{
        border-top: 1px solid var(--border-color);
        width: 100%;
        p{
            padding: 1.3rem 0;
            font-size: 1.1rem;
            display: block;
            text-align: center;
        }
    }
`;

export default Navigation