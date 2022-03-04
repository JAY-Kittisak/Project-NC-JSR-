import React from 'react'
import styled from 'styled-components'
import BusinessCenter from '@material-ui/icons/BusinessCenter'

import SmallTitle from '../SmallTitle'
import CalendarItem from './CalendarItem'

interface Props { }

const CalendarDetail: React.FC<Props> = () => { 
    const briefcase = <BusinessCenter />
    return (
        <ResumeStyled>
                <div className='small-title'>
                    <SmallTitle icon={briefcase} title={'Holiday details'} />
                </div>
                <div className="resume-content">
                    <CalendarItem
                        year={'Jan 1,3'}
                        title={'วันปีใหม่/New Year Holiday'}
                        subTitle={''}
                        text={
                            `Lorem ipsum dolor, sit amet ste quibusdam voluptate.`
                        }
                    />
                    {/* <ResumeItem
                        year={'2020 - Present'}
                        title={'Full Stack Developer'}
                        subTitle={'JSR Group'}
                        text={
                            `Lorem ipsum dolor, sit amet ste quibusdam voluptate.`
                        }
                    />
                    <ResumeItem
                        year={'2022 - Present'}
                        title={'UX/UI Designer'}
                        subTitle={'JSR Group'}
                        text={
                            `Lorem ipsum dolor, sit amet ste quibusdam voluptate.`
                        }
                    /> */}
                </div>
        </ResumeStyled>
    )
}

const ResumeStyled = styled.section`
    .small-title{
        padding-bottom: 3rem;
    }
    .u-small-title-margin{
        margin-top: 4rem;
    }

    .resume-content{
        border-left: 2px solid var(--border-color);
    }
`
export default CalendarDetail