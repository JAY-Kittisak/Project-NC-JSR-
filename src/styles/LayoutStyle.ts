import styled from "styled-components";
import ImagePath from '../assets/svg/check-circle.svg'
import { getStatusColor } from "../helpers";
import { StatusProps } from "../types";

export const MainLayout = styled.div`
    padding: 4rem;
    @media screen and (max-width: 1600px){
        padding: 3rem;
    }
    @media screen and (max-width: 571px){
        padding: 2rem 1rem 2rem 1rem;
    }
`
export const InnerLayout = styled.div`
    padding-top: 3rem;
`

export const CheckboxStyled = styled.div`
    .group {
        padding: 8px 48px;
        margin: 5px;
    }

    input[type="checkbox"] {
        display: none;
    }

    label {
        cursor: pointer;
        position: relative;
        padding-top: 2px;
        font-size: 1rem;
    }
    
    label::before {
        content: "";
        border-radius: 50%;
        background-color: #fff;
        background-image: url(${ImagePath});
        background-position: center;
        background-size: contain;
        width: 32px;
        height: 32px;
        position: absolute;
        left: -44px;
        top: -2px;

        transform: scale(0) rotateZ(180deg);
        transition: all 0.4s cubic-bezier(0.54, 0.01, 0, 1.49);
    }

    input[type="checkbox"]:checked + label::before {
        transform: scale(1) rotateZ(0deg);
    }

    label::after {
        content: "";
        border: 2px solid var(--white-color);
        width: 24px;
        height: 24px;
        position: absolute;
        left: -42px;
        top: 0px;
        border-radius: 50%;
    }
`;

export const RadioStyled = styled.div`
    .group {
        padding: 8px 58px;
        margin: 4px;
    }
    
    input[type="radio"] {
        display: none;
    }
    
    label {
        cursor: pointer;
        position: relative;
        padding-top: 2px;
        font-size: 1.1rem;
    }
    
    label::before {
        content: "";
        border-radius: 50%;
        background-color: #fff;
        background-image: url(${ImagePath});
        background-position: center;
        background-size: contain;
        width: 32px;
        height: 32px;
        position: absolute;
        left: -44px;
        top: -2px;

        transform: scale(0) rotateZ(180deg);
        transition: all 0.4s cubic-bezier(0.54, 0.01, 0, 1.49);
    }

    input[type="radio"]:checked + label::before {
        transform: scale(1) rotateZ(0deg);
    }

    label::after {
        content: "";
        border: 2px solid var(--white-color);
        width: 24px;
        height: 24px;
        position: absolute;
        left: -42px;
        top: 0px;
        border-radius: 50%;
    }
`;

export const SpinnerStyled = styled.div`
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
`

export const ItemStyled = styled.div`
    padding: 0rem 1rem ;
    border-top: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgb(40, 44, 52, 0.3);
    border-bottom: 0.5px solid rgb(40, 44, 52, 0.3);
    cursor: pointer;
    transition: 0.4s ease-in;
    &:hover {
        background-color: var(--background-hover-color);
    }

    p {
        margin: 5px 0;
        text-align: center;
        font-style: italic;
        font-size: 0.9rem;
    }
    
    .bg-status {
        width: 80px;
        padding: 2px;
        margin: 0 auto;
        border-radius: 30px;
        color: white;
        background-color: ${(props: StatusProps) => getStatusColor(props.status)};
        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    }
`