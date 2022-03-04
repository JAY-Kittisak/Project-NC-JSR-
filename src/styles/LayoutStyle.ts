import styled from "styled-components";
import ImagePath from '../assets/svg/check-circle.svg'
export const MainLayout = styled.div`
    padding: 5rem;
    @media screen and (max-width: 1600px){
        padding: 3rem;
    }
    /* @media screen and (max-width: 510px){
        padding: 3rem;
    } */
    @media screen and (max-width: 571px){
        padding: 2rem .4rem;
    }
`
export const InnerLayout = styled.div`
    padding-top: 3.5rem;
`

export const CheckboxStyled = styled.div`
    .group {
        padding: 8px 48px;
        margin: 8px;
    }

    input[type="checkbox"] {
        display: none;
    }

    label {
        cursor: pointer;
        position: relative;
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