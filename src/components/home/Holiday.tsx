import React from 'react'
import styled from "styled-components";

import holiday from "../../assets/image/holiday.jpg";
// import { InnerLayout } from "../../styles/LayoutStyle";
import Title from "../Title";
import PrimaryButton from "../PrimaryButton";
import CalendarDetail from './CalendarDetail';

interface Props { }

const Holiday: React.FC<Props> = () => {
    return (
        <>
            <Title title={"Calendar 2022"} span={"Calendar 2022"} />
            <HolidayStyled >
                <div className="left-content">
                    <img src={holiday} alt="" />
                </div>
                <div className="right-content">
                    <CalendarDetail />
                    <PrimaryButton title={"Download Cv"} />
                </div>
            </HolidayStyled>
        </>
    )
}

const HolidayStyled = styled.section`
    margin-top: 5rem;
    display: flex;
    @media screen and (max-width: 1000px){
        flex-direction: column;
        .left-content{
            margin-bottom: 2rem;
        }
    }
    .left-content{
        width: 100%;
        img{
            width: 90%;
            object-fit: cover;
        }
    }
    .right-content{
        width: 50%;
    }
`
export default Holiday