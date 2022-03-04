import React from 'react'
import styled from 'styled-components'

interface Props {
    icon: JSX.Element
    title: string
}

const SmallTitle: React.FC<Props> = ({ icon, title }) => {
    return (
        <SmallTitleStyled>
            <p>{icon}</p>
            <h3>{title}</h3>
        </SmallTitleStyled>
    )
}

const SmallTitleStyled = styled.div`
    display: flex;
    align-items: center;
    p{
        padding-right: 1rem;
        svg{
            font-size: 3rem
        }
    }
    h3{
        color: ver(--white-color);
        font-size: 1.4rem;
    }
`
export default SmallTitle