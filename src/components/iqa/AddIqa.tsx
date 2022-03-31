import React from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';

import { AddNcrNotifyData, UserInfo } from '../../types'

const requirements = [
    '4.1',
    '4.2',
    '4.3',
    '4.4.1',
    '5.1.1',
    '5.1.2',
    '5.2.1',
    '5.2.2',
    '5.3',
    '6.1',
    '6.1.2',
    '6.2.1',
    '6.2.2',
    '6.3',
    '7.1.1',
    '7.1.2',
]

interface Props {
    userInfo: UserInfo | null
}

const AddIqa: React.FC<Props> = ({ userInfo }) => {

    const { register, handleSubmit, errors } = useForm<AddNcrNotifyData>()

    const today = new Date()
    const currentFullYear = today.getFullYear().toString()
    const currentMonth = today.getMonth() + 1
    const padCurrentMonth = currentMonth.toString().padStart(2, '0')

    const handleAddIqa = handleSubmit(async (data) => {
        if (!userInfo) return

        const creator = {
            id: userInfo.id,
            username: userInfo.username,
            dept: userInfo.dept,
            email: userInfo.email
        }

        const initial = userInfo.branch === 'ลาดกระบัง' ? 'J' : 'C'

        const code = `${initial}-${data.category}${currentFullYear}${padCurrentMonth}`

        return console.log({ ...creator, code })
    })

    return (
        <AddIqaStyled>
            <div className='nc-notify-title'>
                <h4>รายงานสิ่งที่ไม่เป็นไปตามข้อกำหนด/ข้อบกพร่อง</h4>
            </div>

            <form className='form' onSubmit={handleAddIqa}>

                <div className='flex-between'>
                    <div className='form-field'>
                        <label htmlFor='creatorName'>ชื่อ-นามสกุล ผู้ออก NC</label>
                        <input
                            type='text'
                            name='creatorName'
                            id='creatorName'
                            ref={register({ required: 'โปรดใส่ ชื่อ-นามสกุล ผู้ออก NC' })}
                        />
                    </div>
                    <div className='form-field'>
                        <label htmlFor='topicType'>
                            เป็น CAR หรือ OBS
                        </label>
                        <select name='topicType' ref={register({ required: 'โปรดใส่ประเภทความไม่สอดคล้อง' })}>
                            <option style={{ display: 'none' }}></option>
                            <option value='Product'>CAR</option>
                            <option value='Process'>OBS</option>
                        </select>
                    </div>
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.dept?.message}</p>
                )}
                {errors && (
                    <p className='paragraph-error text-center'>{errors.creatorName?.message}</p>
                )}



                <div className='flex-between'>
                    <div className='form-field'>
                        <label htmlFor='creatorName'>กระบวนการถูกตรวจ</label>
                        <input
                            type='text'
                            name='creatorName'
                            id='creatorName'
                            ref={register({ required: 'โปรดใส่ ชื่อ-นามสกุล ผู้ออก NC' })}
                        />
                    </div>
                    <div className='form-field'>
                        <label htmlFor='topicType'>
                            ผิดข้อกำหนด ISO 9001 ข้อที่
                        </label>
                        <select name='topicType' ref={register({ required: 'โปรดใส่ประเภทความไม่สอดคล้อง' })}>
                            <option style={{ display: 'none' }}></option>
                            {requirements.map((item,i) => (
                                <option key={i} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.creatorName?.message}</p>
                )}


                <button>Submit</button>
            </form>
        </AddIqaStyled>
    )
}

const AddIqaStyled = styled.section`
    display: grid;
    grid-template-columns: repeat(1,1fr);
    background-color: var(--background-dark-color);
    max-height: 722px;

    @media screen and (max-width: 502px){
        width: 70%;
    }
    
    .nc-notify-title{
        h4 {
            color: var(--white-color);
            font-size: 1.4rem;
            margin: 16px 0;
            border-left: 5px solid #e74c3c;
            padding-left: 16px;
        }
    }

    .radio-group {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .form{
        width: 100%;
        @media screen and (max-width: 502px){
            width: 100%;
        }
        .form-field{
            margin-top: 2rem;
            position: relative;
            width: 100%;
            label{
                position: absolute;
                left: 20px;
                top: -17px;
                display: inline-block;
                background-color: var(--background-dark-color);
                padding: 0 .5rem;
                font-size: 1.2rem;
                color: inherit;
            }
            input{
                border: 1px solid var(--border-color);
                outline: none;
                background: transparent;
                height: 40px;
                padding: 0 15px;
                width: 100%;
                color: inherit;
                box-shadow: none;
            }
            select{
                border: 1px solid var(--border-color);
                outline: none;
                height: 40px;
                padding: 0 15px 0px 15px;
                width: 100%;
                color: inherit;
                box-shadow: none;
                background-color: var(--background-dark-color);
            }
            textarea{
                background-color: transparent;
                border: 1px solid var(--border-color);
                outline: none;
                color: inherit;
                width: 100%;
                padding: .8rem 1rem;
            }
            
            .upload-progression {
                height: 100%;
                border: 0.6px solid #79849b;
                background-color: #27AE60;
                outline: none;
            }
        }
    }
`
export default AddIqa