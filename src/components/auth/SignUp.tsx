import React from "react";
import styled from "styled-components";
import { useForm } from 'react-hook-form'

import Button from '../Button'
import Input from '../Input'
// import SocialMediaLogin from './SocialMediaLogin'
import { useModalContext } from '../../state/modal-context'
import { useAuthenticate } from '../../hooks/useAuthenticate'
import { SignUpData } from "../../types";

interface Props { }

const SignUp: React.FC<Props> = () => {
    const { setModalType } = useModalContext()
    const { 
        signUp, 
        loading, 
        error, 
        // socialLogin 
    } = useAuthenticate()
    const { register, errors, handleSubmit } = useForm<SignUpData>()

    const handleSignUp = handleSubmit(async (data) => {
        const response = await signUp(data)

        if (response) setModalType('close')
    })

    return (
        <>
            <SignUpStyled onClick={() => setModalType('close')}></SignUpStyled>

            <ModalStyled className="modal modal--auth-form">
                <div className="modal-close" onClick={() => setModalType('close')}>&times;</div>

                <h3 className="header--center">
                    Sign up to JSR-NC
                </h3>

                {/* <SocialMediaLogin socialLogin={socialLogin} loading={loading}/> */}

                {/* <p className="paragraph-center">
                    Or sign up with an email
                </p> */}

                <hr></hr>

                <form onSubmit={handleSignUp}>
                    <Input
                        name="username"
                        label='Department'
                        placeholder="เช่น แผนกไอที ลาดกระบัง"
                        error={errors.username?.message}
                        ref={register({
                            required: 'Username is required.',
                            minLength: {
                                value: 3,
                                message: 'Username must be at least 3 character.'
                            },
                            maxLength: {
                                value: 20,
                                message: 'Username must not be greater thant 20 character.'
                            }
                        })}
                    />

                    <Input
                        type='email'
                        name='email'
                        label='Email'
                        placeholder='Your email'
                        error={errors.email?.message}
                        ref={register({
                            required: 'Email is required.',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email is in wrong format.',
                            },
                        })}
                    />

                    <Input
                        type='password'
                        name='password'
                        label='Password'
                        placeholder='Your password'
                        error={errors.password?.message}
                        ref={register({
                            required: 'Password is required.',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters.',
                            },
                            maxLength: {
                                value: 50,
                                message: 'Password must not be greater thant 50 characters.',
                            },
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

                <p>Already have an account? <span onClick={() => setModalType('signIn')}>sign in</span> instead.</p>

            </ModalStyled>
        </>
    );
};

const SignUpStyled = styled.div`
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
    font-size: 1rem;
    
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
        font-size: 1.5rem;
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

    input {
        font-size: 1rem;
    }

    label {
        font-size: 1rem;
    }

    form {
        padding: 0;
        width: 100%;
    }

    form p {
        margin: 10px 5px 0px 5px;
        padding: 0;
        text-align: start;
        color: red;
    }

    p {
        font-style: italic;
        color: grey;
        font-size: .9rem;
    }

    p span {
        color: chocolate;
        cursor: pointer;
    }
`;
export default SignUp;
