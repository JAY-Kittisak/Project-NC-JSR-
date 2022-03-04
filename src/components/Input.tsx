import React, { InputHTMLAttributes, forwardRef, Ref } from 'react'
import styled from 'styled-components'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = forwardRef(
    (
        { label, error, type = 'text', ...props }: Props,
        ref: Ref<HTMLInputElement>
    ) => {
        return (
            <InputStyled>
                <label htmlFor={label}>
                    {label}
                </label>
                <input type={type} {...props} ref={ref} />
                {error && <p>{error}</p>}
            </InputStyled>
        )
    }
)

const InputStyled = styled.div`
    text-align: start;
    margin: 1rem auto;
    width: 100%;

    label {
        font-weight: 600;
    }

    input {
        width: 100%;
        height: 100%;
        border: 0.6px solid #79849b;
        padding: 0.5rem;
        outline: none;
        border-radius: 2px;
        box-shadow: 2px 2px 4px rgb(137, 145, 160, 0.4);
    }
    
    p {
        margin: 0;
        padding: 0;
        text-align: start;
        color: red;
        font-size: 1.1rem;
    }
`
export default Input