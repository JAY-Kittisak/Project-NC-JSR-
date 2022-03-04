import React from "react";
import styled from "styled-components";

import { InnerLayout } from "../../styles/LayoutStyle";
import ServiceCard from "../ServiceCard";
import Title from "../Title";
import design from '../../assets/svg/design.svg'
import intelligence from '../../assets/svg/intelligence.svg'
import gameDev from '../../assets/svg/game-dev.svg'

interface Props { }

const News: React.FC<Props> = () => {
    return (
        <InnerLayout>
            <ServicesSectionStyled>
                <Title title={"News"} span={"News"} />
                <div className="services">
                    <ServiceCard
                        image={design}
                        title={"เปลี่ยนแปลงวันหยุด"}
                        paragraph={
                            "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Sit et, voluptatibus vitae fuga aperiam numquam! Animi odit iure."
                        }
                    />
                    <ServiceCard
                        image={intelligence}
                        title={"สัมมนาประจำปี"}
                        paragraph={
                            "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Sit et, voluptatibus vitae fuga aperiam numquam! Animi odit iure."
                        }
                    />
                    <ServiceCard
                        image={gameDev}
                        title={"งานกีฬาประจำปี"}
                        paragraph={
                            "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Sit et, voluptatibus vitae fuga aperiam numquam! Animi odit iure."
                        }
                    />
                </div>
            </ServicesSectionStyled>
        </InnerLayout>
    );
};

const ServicesSectionStyled = styled.section`
    .services{
        margin-top: 5rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 1.5rem;
        @media screen and (max-width:1000px){
            flex-direction: column;
        }
        @media screen and (max-width:950px){
            grid-template-columns: repeat(2, 1fr);
        }
        @media screen and (max-width:650px){
            grid-template-columns: repeat(1, 1fr);
        }
    }
`;

export default News