import React from 'react'
import styled from 'styled-components'
import { useForm, useFieldArray } from 'react-hook-form';

import { AddIqaTypeData, UserInfo } from '../../types'
import { requirements } from '../../helpers';


interface Props {
    userInfo: UserInfo | null
}

const AddIqa: React.FC<Props> = ({ userInfo }) => {

    const {
        register,
        control,
        handleSubmit,
        // errors,
        formState: { errors }
    } = useForm<AddIqaTypeData>({
        defaultValues: {
            inspector: [{ name: "test"}]
        },
        mode: "onBlur"
      })

    const { fields, append, remove } = useFieldArray({
        name: "inspector",
        control
    });

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

        return console.log(data)
    })

    return (
        <AddIqaStyled>
            <div className='nc-notify-title'>
                <h4>รายงานสิ่งที่ไม่เป็นไปตามข้อกำหนด/ข้อบกพร่อง</h4>
            </div>

            <form className='form' onSubmit={handleAddIqa}>

                {/* ผู้ตรวจ */}
                {fields.map((field, index) => {
                    return (
                        <div key={field.id}>
                            <section className={"section"} key={field.id}>
                                <input
                                    placeholder="name"
                                    {...register(`inspector.${index}.name` as const, {
                                        required: true
                                    })}
                                    className={errors?.inspector?.[index]?.name ? "error" : ""}
                                    defaultValue={field.name}
                                />
                                <button type="button" onClick={() => remove(index)}>
                                    DELETE
                                </button>
                            </section>
                        </div>

                        //     <div className='form-field'>
                        //     <label htmlFor='inspector'>ผู้ตรวจ/พบ</label>
                        //     <input
                        //         name='inspector'
                        //         id='inspector'
                        //         ref={register({ required: 'โปรดใส่ ชื่อ-นามสกุล ผู้ออก IQA' })}
                        //         {...register(`cart.${index}.name` as const, {
                        //             required: true
                        //           })}
                        //     />
                        // </div>
                    )
                })}

                {/* CAR หรือ OBS */}
                <div className='flex-between'>
                    <div className='form-field'>
                        <label htmlFor='team'>ทีม</label>
                        <input
                            name='team'
                            id='team'
                            ref={register({ required: 'โปรดใส่เลือกทีม' })}
                        />
                    </div>
                    <div className='form-field'>
                        <label htmlFor='category'>
                            เป็น CAR หรือ OBS
                        </label>
                        <select name='category' ref={register({ required: 'โปรดเลือกประเภท  CAR หรือ OBS' })}>
                            <option style={{ display: 'none' }}></option>
                            <option value='CAR'>CAR</option>
                            <option value='OBS'>OBS</option>
                        </select>
                    </div>
                </div>
                
                {errors && (
                    <p className='paragraph-error text-center'>{errors.team?.message}</p>
                )}
                {errors && (
                    <p className='paragraph-error text-center'>{errors.category?.message}</p>
                )}

                {/* กระบวนการถูกตรวจ */}
                {/* <div className='flex-between'>
                    <div className='form-field'>
                        <label htmlFor='creatorName'>กระบวนการถูกตรวจ</label>
                        <input
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
                            {requirements.map((item, i) => (
                                <option key={i} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.requirements?.message}</p>
                )} */}

                {/* กระบวนการถูกตรวจ */}

                {/* <div className='flex-between'>
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
                            {requirements.map((item, i) => (
                                <option key={i} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.requirements?.message}</p>
                )} */}


                <button
                    type="button"
                    onClick={() =>
                        append({
                            name: "",
                        })
                    }
                >
                    APPEND
                </button>

                <button type="submit">Submit</button>
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