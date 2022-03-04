import React, { useState } from 'react'
import styled from 'styled-components'
import { Department } from '../../types'
import AddAndEditDept from '../manage-dept/AddAndEditDept'
import PrimaryButton from '../PrimaryButton'

interface Props {
    department: Department
}

const TopicItem: React.FC<Props> = ({ department }) => {
    const [openDialog, setOpenDialog] = useState(false)
    const { id, dept, topic, emailJsr, emailCdc } = department

    return (
        <TopicItemStyled>
            <div className="left-content">
                <h5>{dept}</h5>
                <p>ลาดกระบัง : {emailJsr}</p>
                <p>ชลบุรี : {emailCdc}</p>
            </div>
            <div className="right-content">
                {(!topic || topic.length === 0)
                    ? (<h2>No Topic.</h2>) : topic.map((item, i) => {
                        return (
                            <p key={i}>{i + 1}. {item}</p>
                        )
                    })
                }
                <div className='flex-center' onClick={() => setOpenDialog(true)}>
                    <PrimaryButton title={"เพิ่มประเด็น"} />
                </div>
            </div>
            {openDialog && <AddAndEditDept setOpenDialog={setOpenDialog} title={dept} deptId={id} />}
        </TopicItemStyled>
    )
}

const TopicItemStyled = styled.div`
    display: flex;
    @media screen and (max-width: 421px){
        p, h5{
            font-size: 80%;
        }
    }
    &:not(:last-child){
        padding-bottom: 3rem;
    }
    .left-content{
        width: 20%;
        padding-left: 20px;
        position: relative;
        &::before{
            content: "";
            position: absolute;
            left: -10px;
            top: 15px;
            height: 15px;
            width: 15px;
            border-radius: 50%;
            border: 2px solid var(--border-color);
            background-color: var(--background-dark-color);
        }
        h5{
            color: var(--primary-color);
            font-size: 2rem;
        }
        p{
            display: inline-block;
            padding-bottom: .6rem;
            font-size: 1rem;
        }
    }
    .right-content{
        width: 50%;
        padding-left: 5rem;
        position: relative;

        &::before{
            content: "";
            position: absolute;
            left: 0;
            top: 15px;
            height: 2px;
            width: 3rem;
            background-color: var(--border-color);
        }
    }
`
export default TopicItem