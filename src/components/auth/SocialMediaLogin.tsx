import React from 'react'
import styled from 'styled-components'

import GoogleIcon from '../../assets/svg/icons_google.svg'
import { useModalContext } from '../../state/modal-context'
import { Provider } from '../../types'
import Button from '../Button'
import { firebase } from '../../firebase/config'

interface Props {
    socialLogin: (provider: Provider) => Promise<firebase.functions.HttpsCallableResult | undefined>
    loading: boolean
}

const SocialMediaLogin: React.FC<Props> = ({ socialLogin, loading }) => {
    const { setModalType } = useModalContext()

    const handleSocialLogin = async (provider: Provider) => {
        const response = await socialLogin(provider)

        if (response) setModalType('close')
    }

    return (
        <SocialLoginStyled>
            <Button
                className="social-btn--google"
                width='100%'
                height="3rem"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
            >
                <div className="image">
                    <img src={GoogleIcon} alt="" />
                </div>
                <span>Log in with Google</span>
            </Button>
        </SocialLoginStyled>

    )
}

const SocialLoginStyled = styled.section`
    width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
    border-radius: 2px;

    .social-btn--google {
        display: flex;
        justify-content: space-around;
        align-items: center;
        transition: 0.4s ease-in;
        margin-bottom: 1rem;
        background-color: #ff5252;
    }

    .social-btn--google:hover {
        background-color: #d32f2f;
    }

    .image{
        margin: 3px 0px 3px 0px;
        width: 15%;
        overflow: hidden;
        background-color: #fff;
        border-radius: 12px;
        img{  
            height: 40px;
            display: block;
            margin-left: auto;
            margin-right: auto;
            object-fit: cover;
            transition: all .4s ease-in-out;
            &:hover{
                transform: rotate(3deg) scale(1.1);
            }
        }
    }
`
export default SocialMediaLogin