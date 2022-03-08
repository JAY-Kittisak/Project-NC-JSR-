import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

interface Props<T> {
    label: T
    tabType: string
    activeTab: T
    withPagination?: boolean
}

interface PropStyled {
    label: string
    activeTab: string
}

function getLabelColor(label: string, activeTab: string) {
    if (label === activeTab) return "#007bff"
    else return ""
}

const Tab = <T extends string>({ label, tabType, activeTab, withPagination }: Props<T>) => {
    const { pathname } = useLocation()

    return (
        <Link 
            to={
                withPagination 
                    ? `${pathname}?${tabType}=${label}&page=1` 
                    : `${pathname}?${tabType}=${label}`
            }
        >
            <ParagraphStyled label={label} activeTab={activeTab}>
                {label}
            </ParagraphStyled>
        </Link>
    )
}

const ParagraphStyled = styled.p`
    margin: 1rem .8rem 1rem 0rem;
    padding: 0;
    text-align: start;
    color: ${(props: PropStyled) => getLabelColor(props.label, props.activeTab)};

    &:hover {
        color: var(--primary-color);
    }
`
export default Tab