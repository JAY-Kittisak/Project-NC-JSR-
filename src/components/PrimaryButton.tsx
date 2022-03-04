import React from 'react'
import styled from 'styled-components'
import AttachFileIcon from '@material-ui/icons/AttachFile';

import Spinner from './Spinner'

interface Props {
    title: string
    loading?: boolean
    spinnerColor?: string
    spinnerHeight?: number
    spinnerWidth?: number
}

const PrimaryButton: React.FC<Props> = ({ title,loading,spinnerColor,spinnerHeight,spinnerWidth }) => {
    return (
        <PrimaryButtonStyled>
            {loading ? (
                    <Spinner
                        color={spinnerColor}
                        height={spinnerHeight}
                        width={spinnerWidth}
                    />
                ) : (
                    <>
                        {title === 'แนบไฟล์' && <AttachFileIcon/> }
                        {title}
                    </>
                )}
        </PrimaryButtonStyled>
    )
}

const PrimaryButtonStyled = styled.a`
    background-color: var(--primary-color);
    padding: .5rem 2.5rem;
    color: white;
    cursor: pointer;
    display: inline-block;
    font-size: inherit;
    text-transform: uppercase;
    position: relative;
    transition: all .4s ease-in-out;
    &::after{
        content: "";
        position: absolute;
        width: 0;
        height: .2rem;
        transition: all .4s ease-in-out;
        left: 0;
        bottom: 0;
        opacity: .7;
    }
    &:hover::after{
        width: 100%;
        background-color: white;
    }

    svg {
        margin-bottom: -5px;
    }
`
export default PrimaryButton