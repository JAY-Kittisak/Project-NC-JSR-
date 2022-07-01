import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import LogoutIcon from '@material-ui/icons/OpenInBrowser';
import Switch from '@material-ui/core/Switch'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import BadgeIcon from '@material-ui/icons/SupervisorAccount';
// import BadgeIcon from '@mui/icons-material/Badge';

import { openUserDropdown, useAuthContext, signOutRedirect } from '../state/auth-context';
import { useAuthenticate } from '../hooks/useAuthenticate'

interface Props {
    name: string | null
    email: string | null
}

const AccountDropdown: React.FC<Props> = ({ name, email }) => {
    const [theme, setTheme] = useState('light-theme')
    const [checked, setChecked] = useState(false)

    const {
        authState: { isUserDropdownOpen },
        authDispatch
    } = useAuthContext()

    const { signOut } = useAuthenticate()

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme])

    const themeToggler = () => {
        if (theme === 'dark-theme') {
            setTheme('light-theme')
            setChecked(false)
        } else {
            setTheme('dark-theme')
            setChecked(true)
        }
    }

    return (
        <DropdownStyled onMouseLeave={() => authDispatch(openUserDropdown(false))}>
            <div className={`menu ${isUserDropdownOpen && 'active'}`}>
                <div>
                    <p>{name}</p>
                    <span>{email}</span>
                </div>
                <ul>
                    <li>
                        <LinKing to='/users/profile'>
                            <BadgeIcon />
                            <p>View Profile</p>
                        </LinKing>
                    </li>
                    <li>
                        <button onClick={() => {
                            signOut()
                            authDispatch(signOutRedirect(true))
                        }}>
                            <LogoutIcon />
                            <p>Logout</p>
                        </button>
                    </li>
                    <li>
                        <Brightness4Icon />
                        <Switch
                            color='default'
                            value=''
                            checked={checked}
                            inputProps={{ 'aria-label': '' }}
                            size='medium'
                            onClick={themeToggler}
                        />
                    </li>
                </ul>
            </div>
        </DropdownStyled>
    )
}

const LinKing = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--white-color);
    font-weight: 500;
    transition: 0.5s;
    background-color: transparent;

    :hover {
        color: var(--primary-color-light);
    }
`

const DropdownStyled = styled.section`
    position: fixed;
    top: 100px;
    left: 207px;
    z-index: 11;

    .menu {
        position: absolute;
        top: 75px;
        right: -23px;
        padding: 10px 20px 0px;
        background: var(--background-dark-color);
        width: 200px;
        box-sizing: 0 5px 25px rgba(0,0,0,0.1);
        border-radius: 15px;
        transition: 0.5s;
        visibility: hidden;
        opacity: 0;
    }
    .menu.active {
        top: 60px;
        visibility: visible;
        opacity: 1;
    }
    .menu::before {
        content: '';
        position: absolute;
        top: -5px;
        right: 90px;
        width: 20px;
        height: 20px;
        background: var(--background-dark-color);
        transform: rotate(45deg);
    }
    .menu div {
        width: 100%;
        text-align: center;
        padding: 15px 0;
    }
    .menu div p {
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--primary-color);
        line-height: 1.2em;
    }
    .menu div span {
        font-size: .9rem;
        font-weight: 400;
        color: var(--white-color);
    }
    .menu ul li {
        list-style: none;
        padding: 10px 0;
        border-top: 1px solid var(--font-light-color);
        display: flex;
        align-items: center;
    }
    .menu ul li svg {
        opacity: 0.5;
        transition: 0.5s;
    }

    .menu ul li p{
        margin-left: 10px;
    }

    .menu ul li:hover svg {
        opacity: 1;
    }
    .menu ul li button {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--white-color);
        font-weight: 500;
        transition: 0.5s;
        border: none;
        background-color: transparent;
        cursor: pointer;
    }
    .menu ul li:hover button {
        color: var(--primary-color-light);
    }
`
export default AccountDropdown