import React from "react";
import styled from "styled-components";
import { useForm } from 'react-hook-form'

import Button from '../Button'
import Input from '../Input'
import {useModalContext} from '../../state/modal-context'
import { useAuthenticate } from '../../hooks'
import { SignUpData } from "../../types";

interface Props { }

const ResetPassword: React.FC<Props> = () => {
    const { setModalType } = useModalContext()
    const { loading, error, resetPassword, successMsg } = useAuthenticate()
    const { register, errors, handleSubmit } = useForm<Omit<SignUpData, 'username' | 'password'>>()

    const handleResetPass = handleSubmit((data) => resetPassword(data))

    return (
        <>
            <ResetPassStyled onClick={() => setModalType('close')}></ResetPassStyled>

            <ModalStyled className="modal modal--auth-form">
                <div className="modal-close" onClick={() => setModalType('close')}>&times;</div>

                <h5 className="header--center">
                    Enter your email below to reset your password
                </h5>

                <form onSubmit={handleResetPass}>
                    <Input
                        name='email'
                        placeholder='Your email'
                        error={errors.email?.message}
                        ref={register({
                            required: 'Email is required.'
                        })}
                    />

                    <Button loading={loading} width='100%' style={{ margin: '0.5rem 0' }}>Submit</Button>

                {error && <p>{error}</p>}
                </form>    
                
                {successMsg && <p>{successMsg}</p>}
            </ModalStyled>
        </>
    );
};

const ResetPassStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0, 0, 0, 0.4);
`;

const ModalStyled = styled.div`
    position: absolute;
    top: 50%;
    left: 43%;
    transform: translate(-50%, -50%);
    padding: 2rem;
    background: white;
    border-radius: 2px;
    box-shadow: 0px 30px 20px rgba(0, 0, 0, 0.4);
    animation: appear 0.4s linear;
    max-width: 380px;
    
    @keyframes appear {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    .modal--auth-form {
        width: 25%;
    }

    .modal-close {
        position: absolute;
        padding: 2px 15px;
        top: 0.5rem;
        right: 1rem;
        font-size: 2rem;
        color: #282c34;
        cursor: pointer;
        font-weight: bolder;
        width: 3rem;
        height: 3rem;
        border-radius: 50px;
        transition: all 0.5s ease-in-out;
    }

    .modal-close:hover {
        color: red;
        background-color: rgba(92, 101, 119, 0.3);
    }

    .header--center {
        margin: 1rem 0;
        font-size: 1.3rem;
        font-weight: 700;
        text-align: center;
        color: var(--primary-color);
    }

    .form__input-container {
        text-align: start;
        margin: 1rem auto;
        width: 100%;
    }
    form {
        padding: 0;
        width: 100%;
    }

    form p {
        margin: 0;
        padding: 0;
        text-align: start;
        color: red;
    }

    p { 
        font-style: italic;
        color: grey;
        font-size: .9rem;
        color: green;
        text-align: center;
    }
`;
export default ResetPassword;
