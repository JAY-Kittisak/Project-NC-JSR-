import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useHistory } from "react-router-dom";
import FacebookIcon from "@material-ui/icons/Facebook";
import YouTubeIcon from "@material-ui/icons/YouTube";

import Hero from "../components/hero/Hero";
import { useAuthContext } from "../state/auth-context";
import { useModalContext } from "../state/modal-context";
// import { MainLayout } from "../styles/LayoutStyle";
// import News from "../components/home/News";
// import Holiday from "../components/home/Holiday";

function HomePage() {
    const { setModalType } = useModalContext()
    const { authState: { authUser, signOutRedirect } } = useAuthContext()

    const nameArray = 'NC'.split('')

    const history = useHistory<{ from: string }>()
    const { state } = history.location

    useEffect(() => {
        // Open the sign in modal after the user has been redirected from some private route
        if (!signOutRedirect) {
            if (state?.from) {
                if (!authUser) setModalType('signIn')
                else history.push(state.from)
            }
        } else {
            history.replace('/', undefined)
        }
    }, [setModalType, state, authUser, history, signOutRedirect])

    return (
        <>
            <HomePageStyled>
                <div className="typography">
                    <h1>
                        <span className="span-primary">JSR</span>
                        &nbsp;
                        <Wrapper>
                            {nameArray.map((item, i) => {
                                return (
                                    <span key={i}>{item}</span>
                                )
                            })}
                        </Wrapper>
                        <span> System</span>
                    </h1>
                    {/* <h1>
                        บริษัท <span className="span-primary">จ.ศรีรุ่งเรื่องอิมเป็กซ์</span> จำกัด
                    </h1> */}
                    <p>
                        เรา JSR มุ่งมั่นที่จะเป็นผู้นำด้านการจำหน่ายเครื่องมืออุตสาหกรรม ที่มีผลิตภัณฑ์ หลากหลาย ครอบคลุมความต้องการของลูกค่า
                    </p>
                    <p>
                        ตลอดจนการคัดสรรผลิตภัณฑ์ให้มีคุณภาพสูงสุดโดยการพัฒนาศักยภาพยุคลากร และ ระบบงานอย่างต่อเนื่อง
                    </p>
                    <p>
                        <span className="span-slogan">ดังสโลแกน</span> "ผู้นำด้านเครื่องเมืออุตสาหกรรม ผลิตภัณฑ์ครอบคลุมคุณภาพมาตรฐานบริการประทับใจ พร้อมก้าวไปกับทุกอุตสาหกรรม ของประเทศไทย"
                    </p>

                    <div className="icons">
                        <a href="https://www.facebook.com/jsrimpex" className="icon i-facebook">
                            <FacebookIcon />
                        </a>
                        <a href="https://www.youtube.com/channel/UCG07ZN0IwxB1ri7jf6Z5V2g/featured" className="icon i-youtube">
                            <YouTubeIcon />
                        </a>
                    </div>
                    {!authUser && (
                        <Hero />
                    )}
                </div>
            </HomePageStyled>
            {/* <MainLayout>
                <News />
                <br />
                <Holiday />
            </MainLayout> */}
        </>
    );
}

const animation = keyframes`
    0% { 
        opacity: 0; 
        transform: translateY(-100px) skewY(10deg) skewX(10deg) rotateZ(30deg); 
        filter: blur(10px);
    }
    25% { 
        opacity: 1; 
        transform: translateY(0px) skewY(0deg) skewX(0deg) rotateZ(0deg); 
        filter: blur(0px);
    }
    75% { 
        opacity: 1; 
        transform: translateY(0px) skewY(0deg) skewX(0deg) rotateZ(0deg); 
        filter: blur(0px);
    }
    100% {
        opacity: 0; 
        transform: translateY(-100px) skewY(10deg) skewX(10deg) rotateZ(30deg); 
        filter: blur(10px);
    }
`

const Wrapper = styled.span`
    display: inline-block;
    
    span {
        display: inline-block;
        opacity: 0;
        animation-name: ${animation};
        animation-duration: 6s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    span:nth-child(1) {
        animation-delay: 0.1s;
    }
    span:nth-child(2) {
        animation-delay: 0.2s;
    }
`

const HomePageStyled = styled.header`
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

        .span-slogan {
            font-weight: 600;
        }

        .icons{
            display: flex;
            justify-content: center;
            margin-top: 1rem;
            margin-bottom: 1rem;
            .icon{
                border: 2px solid var(--border-color);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all .4s ease-in-out;
                cursor: pointer;
                &:hover{
                    border: 2px solid var(--primary-color);
                    color: var(--primary-color);
                }
                &:not(:last-child){
                    margin-right: 1rem;
                }
                svg{
                    margin: .5rem;
                }
            }

            .i-youtube{
                &:hover{
                    border: 2px solid red;
                    color: red;
                }
            }
        }
    }

    .span-primary {
        color: var(--primary-color);
    }
`;
export default HomePage;
