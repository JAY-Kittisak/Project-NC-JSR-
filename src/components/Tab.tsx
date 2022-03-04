import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

interface Props {
    label: string
    historyTitle: string
    tabType: string
}

interface PropsStyled {
    label: string
    historyTitle: string
}

function getLabelColor(label: string) {
    if (label === "All") return "#007bff"
    else return ""
}

const Tab: React.FC<Props> = ({ label, historyTitle, tabType}) => {
    const { pathname } = useLocation()

    return (
        <Link to={`${pathname}?${tabType}=${label}`}>
            <ParagraphStyled label={label} historyTitle={historyTitle}>
                {label}
            </ParagraphStyled>
        </Link>
    )
}

const ParagraphStyled = styled.p`
    margin: 1rem .8rem 1rem 0rem;
    padding: 0;
    text-align: start;
    color: ${(props: PropsStyled) => getLabelColor(props.label)};
    font-weight: ${(props: PropsStyled) => (props.label === "All" ? 600 : undefined)};
    font-size: ${(props: PropsStyled) => (props.historyTitle === "ประวัติการออก NC" ? '.9rem' : undefined)};

    &:hover {
        color: var(--primary-color);
    }
`
export default Tab