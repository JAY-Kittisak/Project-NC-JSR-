import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface Props {
    label: string
    historyTitle: string
}

function getLabelColor(label: string) {
    if(label === "All") return "#007bff"
    else return ""
}

const Tab: React.FC<Props> = ({ label, historyTitle }) => {
    return (
        <Link to="/">
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
    color: ${(props: Props) => getLabelColor(props.label)};
    font-weight: ${(props: Props) => (props.label === "All" ? 600 : undefined)};
    font-size: ${(props: Props) => (props.historyTitle === "ประวัติการออก NC" ? '.9rem' : undefined)};

    &:hover {
        color: var(--primary-color);
    }
`
export default Tab