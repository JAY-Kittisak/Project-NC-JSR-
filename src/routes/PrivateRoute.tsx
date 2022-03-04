import React, { ReactElement } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import Spinner from '../components/Spinner'
import { useAuthContext } from '../state/auth-context'

interface Props { }

const PrivateRoute: React.FC<Props> = ({ children }) => {
    const { authState: { authUser, authChecked, userInfo } } = useAuthContext()

    const location = useLocation()

    if (!authChecked && (!authUser || !userInfo)) return <PrivateStyled>
        <div className="typography">
            <Spinner color='#007bff' height={50} width={50} /> <span>Loading... </span>
        </div>
    </PrivateStyled>

    if (authChecked && (!authUser || !userInfo)) return <Redirect to={{
        pathname: '/',
        state: {
            from: location.pathname
        }
    }}/>

    return (
        <>{React.Children.map(children as ReactElement, (child) => React.cloneElement(child, { userInfo }))}</>
    )
}

const PrivateStyled = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;

    .typography {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 80%;
    }

    span {
        font-weight: 600;
        font-size: 2rem;
        color: var(--white--color);
    }
`
export default PrivateRoute