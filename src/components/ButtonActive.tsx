import { ButtonHTMLAttributes, forwardRef, Ref } from 'react'
import styled from 'styled-components'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    active: boolean
}

const ButtonActive = forwardRef(
    (
        {
            children,
            active,
            ...props
        }: Props,
        ref: Ref<HTMLButtonElement>
    ) => {
    return (
        <ButtonStyled active={active} ref={ref} {...props}>
            {children}
        </ButtonStyled>
    )
})

const ButtonStyled = styled.button<Props>`
    margin-right: .5rem;
    width: 100px;
    height: 35px;
    color: ${(prop => prop.active ? 'white' : "var(--font-light-color)")};
    transition: ease-out 0.3s;
    border-radius: 3px;
    border: none;
    background-color: ${(prop => prop.active ? 'var(--primary-color)' : "var(--background-dark-color)")};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    
    :hover {
        color: white;
        cursor: pointer;
        background-color: var(--primary-color);
    }
`
export default ButtonActive