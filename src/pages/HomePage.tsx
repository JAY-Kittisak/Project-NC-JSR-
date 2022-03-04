import { useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import FacebookIcon from "@material-ui/icons/Facebook";
import YouTubeIcon from "@material-ui/icons/YouTube";

import Hero from "../components/hero/Hero";
import { useAuthContext } from "../state/auth-context";
import { useModalContext } from "../state/modal-context";
import { MainLayout } from "../styles/LayoutStyle";
import News from "../components/home/News";
import Holiday from "../components/home/Holiday";

function HomePage() {
    const { setModalType } = useModalContext()
    const { authState: { authUser, signOutRedirect } } = useAuthContext()

    const history = useHistory<{from: string}>()
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
                        <span className="span-primary">JSR</span> NC System
                    </h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis
                        minima, possimus omnis commodi officiis iure earum autem eveniet et.
                        Commodi, qui! Laudantium aliquam deserunt eligendi facere! Laudantium
                        natus saepe nobis!
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
            <MainLayout>
                <News />
                <Holiday />
            </MainLayout>
        </>
    );
}

const HomePageStyled = styled.header`
    width: 100%;
    height: 90vh;
    position: relative;

    .typography {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 80%;

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
`;
export default HomePage;
