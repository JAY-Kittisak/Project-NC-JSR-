import React, { ButtonHTMLAttributes, forwardRef, Ref } from 'react'
import styled from 'styled-components'

import Spinner from './Spinner'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    height?: string
    width?: string
    loading?: boolean
    spinnerColor?: string
    spinnerHeight?: number
    spinnerWidth?: number
}

const Button = forwardRef(
    (
        {
            children,
            disabled,
            style,
            className,
            height = '2.7rem',
            width = '9rem',
            loading,
            spinnerColor,
            spinnerHeight,
            spinnerWidth,
            ...props
        }: Props,
        ref: Ref<HTMLButtonElement>
    ) => {
        return (
            <ButtonStyled
                ref={ref}
                className={`btn ${className}`}
                disabled={disabled}
                style={{
                    cursor: loading || disabled ? 'not-allowed' : undefined,
                    height,
                    width,
                    ...style,
                }}
                {...props}
            >
                {loading ? (
                    <Spinner
                        color={spinnerColor}
                        height={spinnerHeight}
                        width={spinnerWidth}
                    />
                ) : (
                    children
                )}
            </ButtonStyled>
        )
    }
)

const ButtonStyled = styled.button`
    padding: auto 1rem;
    color: white;
    background-color: #282c34;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: 0.4s ease-in;

    :hover {
        background-color: #596275;
    }
`
export default Button
