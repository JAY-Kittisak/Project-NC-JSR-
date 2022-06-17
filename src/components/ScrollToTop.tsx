import React, { useState } from 'react'
import styled from 'styled-components'

import BarChartIcon from "@material-ui/icons/ArrowUpwardRounded";

interface Props { }

type ToTopProps = {scrollState: boolean}


const ScrollToTop: React.FC<Props> = () => {
    const [ scrollState, setScrollState] = useState(false)

    const toTop = () => {
        window.scrollTo({ top: 0 })
    }

    window.addEventListener("scroll", () => {
        window.pageYOffset > 200 ? setScrollState(true) : setScrollState(false)
    })

    return (
        <ToTop scrollState={scrollState} onClick={toTop}>
            <BarChartIcon />
        </ToTop>
    )
}

const ToTop = styled.div<ToTopProps>`
    display: ${(props) => (props.scrollState ? "block" : "none")};
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    z-index: 10;
    cursor: pointer;
    border-radius: 50%;
    background-color: var(--primary-color);
    padding: 1rem;

    svg {
        width: 40px;
        height: 40px;
        position: absolute;
        bottom: 5px;
        left: 5px;
        color: #fff;
    }
`

export default ScrollToTop