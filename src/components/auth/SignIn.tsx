import React from "react";
import styled from "styled-components";
import { useForm } from 'react-hook-form'
import { useHistory } from "react-router-dom";

import Button from '../Button'
import Input from '../Input'
// import SocialMediaLogin from "./SocialMediaLogin";
import { useModalContext } from '../../state/modal-context'
import { useAuthenticate } from '../../hooks/useAuthenticate'
import { SignUpData } from "../../types";

interface Props { }

const SignIn: React.FC<Props> = () => {
    const { setModalType } = useModalContext()
    const {
        signIn,
        loading,
        error,
        // socialLogin 
    } = useAuthenticate()
    const { register, errors, handleSubmit } = useForm<Omit<SignUpData, 'username'>>()

    const history = useHistory()

    const handleSignIn = handleSubmit(async (data) => {
        const response = await signIn(data)

        if (response) setModalType('close')
    })

    return (
        <>
            <SignInStyled
                onClick={() => {
                    history.replace('/', undefined)
                    setModalType('close')
                }}
            ></SignInStyled>

            <ModalStyled className="modal modal--auth-form">
                <div
                    className="modal-close"
                    onClick={() => {
                        history.replace('/', undefined)
                        setModalType('close')
                    }
                    }>
                    &times;
                </div>

                <h3 className="header--center">
                    Sign In to JSR-NC
                </h3>

                {/* <SocialMediaLogin socialLogin={socialLogin} loading={loading} /> 

                <p className="paragraph-center">
                Or sign in with an email
                </p> */}

                <hr></hr>

                <form onSubmit={handleSignIn}>
                    <Input
                        name='email'
                        label='Email'
                        placeholder='Your email'
                        error={errors.email?.message}
                        ref={register({
                            required: 'Email is required.'
                        })}
                    />

                    <Input
                        type='password'
                        name='password'
                        label='Password'
                        placeholder='Your password'
                        error={errors.password?.message}
                        ref={register({
                            required: 'Password is required.'
                        })}
                    />

                    <Button
                        loading={loading}
                        width='100%'
                        style={{ margin: '0.5rem 0' }}
                        spinnerHeight={25}
                        spinnerWidth={25}
                    >
                        Submit
                    </Button>
                    {error && <p>{error}</p>}
                </form>

                <p>
                    Don't have an account yet?&nbsp;
                    <span onClick={() => setModalType('signUp')}>
                        sign up
                    </span> 
                    &nbsp;instead.
                </p>

                <p>
                    Forgot your password? Click <span onClick={() => setModalType('reset_password')}>here</span>
                </p>

            </ModalStyled>
        </>
    );
};

const SignInStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0, 0, 0, 0.4);
`;

const ModalStyled = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
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
        font-size: 1.7rem;
        font-weight: 700;
        text-align: center;
        color: var(--primary-color);
    }

    .form__input-container {
        text-align: start;
        margin: 1rem auto;
        width: 100%;
    }

    .paragraph-center {
        margin: 5px 0;
        text-align: center;
        margin-bottom: -1rem;
    }

    form {
        padding: 0;
        width: 100%;
    }
    
    form p {
        margin: 10px 5px 0px 5px;
        padding: 5px;
        text-align: start;
        color: red;
        border: 1px dashed  red;
    }

    p {
        font-style: italic;
        color: grey;
        font-size: .8rem;
    }

    p span {
        color: chocolate;
        cursor: pointer;
    }
`;
export default SignIn;
