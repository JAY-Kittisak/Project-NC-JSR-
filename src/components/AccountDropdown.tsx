import React from 'react'
import styled from 'styled-components'
// import PersonIcon from '@material-ui/icons/Person';
// import EditIcon from '@material-ui/icons/Edit';
// import Settings from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/OpenInBrowser';
import { openUserDropdown, useAuthContext, signOutRedirect } from '../state/auth-context';
import {useAuthenticate} from '../hooks/useAuthenticate'

interface Props {
    // open: boolean
    // setOpen: (value: React.SetStateAction<boolean>) => void
    name: string | null
    email: string | null
}

const AccountDropdown: React.FC<Props> = ({name,email}) => {
    const {
        authState: { isUserDropdownOpen }, 
        authDispatch
    } = useAuthContext()

    const {signOut} = useAuthenticate()

    return (
        <DropdownStyled onMouseLeave={() => authDispatch(openUserDropdown(false))}>
            <div className={`menu ${isUserDropdownOpen && 'active'}`}>
                <h3>{name}
                    <br />
                    <span>{email}</span>
                </h3>
                <ul>
                    {/* <li><button><PersonIcon />My Profile</button></li>
                    <li><button><EditIcon />Edit Profile</button></li>
                    <li><button><Settings />Settings</button></li> */}
                    <li>
                        <button onClick={() => {
                            signOut()
                            authDispatch(signOutRedirect(true))
                        }}>
                            <LogoutIcon />
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </DropdownStyled>
    )
}

const DropdownStyled = styled.section`
    position: fixed;
    top: 90px;
    left: 220px;
    z-index: 11;

    .menu {
        position: absolute;
        top: 75px;
        right: -23px;
        padding: 10px 20px;
        background: var(--background-dark-color);
        width: 200px;
        box-sizing: 0 5px 25px rgba(0,0,0,0.1);
        border-radius: 15px;
        transition: 0.5s;
        visibility: hidden;
        opacity: 0;
    }
    .menu.active {
        top: 83px;
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
    .menu h3 {
        width: 100%;
        text-align: center;
        font-size: 18px;
        padding: 20px 0;
        font-weight: 500;
        font-size: 1.1rem;
        color: var(--primary-color);
        line-height: 1.2em;
    }
    .menu h3 span {
        font-size: .9rem;
        color: var(--white-color);
        font-weight: 400;
    }
    .menu ul li {
        list-style: none;
        padding: 10px 0;
        border-top: 1px solid var(--font-light-color);
        display: flex;
        align-items: center;
    }
    .menu ul li svg {
        margin-right: 10px;
        opacity: 0.5;
        transition: 0.5s;
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