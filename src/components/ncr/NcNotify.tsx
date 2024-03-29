import React, { useEffect, useState, useRef, ChangeEvent } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import Button from '../Button';
import { useManageNcNotify } from '../../hooks/useManageNcNotify';
import { RadioStyled } from '../../styles/LayoutStyle';
import { AddNcrNotifyData, UserInfo } from '../../types';
import { categories, fileType } from '../../helpers'
import { useDepartmentsContext } from '../../state/dept-context';
import { useDepartmentsCdcContext } from '../../state/dept-cdc-context';
import { useAlertContext } from '../../state/alert-context'

interface Props {
    user: UserInfo
}

const NcNotify: React.FC<Props> = ({ user }) => {
    const [radioBtn, setRadioBtn] = useState('NCR')

    const [topic, setTopic] = useState<string[] | undefined>(undefined)
    const [dept, setDept] = useState('SC')

    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const {
        departmentsState: { departments }
    } = useDepartmentsContext()

    const {
        departmentsState: { departments: deptCdc }
    } = useDepartmentsCdcContext()

    const { setAlertType } = useAlertContext()

    const {
        addNewNcNotify,
        setUploadProgression,
        uploadProgression,
        addNcNotifyFinished,
        loading,
        error
    } = useManageNcNotify()

    const { register, handleSubmit, errors, reset } = useForm<AddNcrNotifyData>()

    const inputRef = useRef<HTMLInputElement>(null)

    const handleOpenUploadBox = () => {
        if (inputRef?.current) inputRef.current.click()
    }

    const today = new Date()
    const currentFullYear = today.getFullYear().toString()
    const currentMonth = today.getMonth() + 1
    const padCurrentMonth = currentMonth.toString().padStart(2, '0')

    const isRadioSelected = (value: string): boolean => radioBtn === value
    const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => setRadioBtn(e.currentTarget.value)

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (!files || !files[0]) return

        const file = files[0]

        if (!fileType.includes(file.type)) {
            alert('Wrong file format, allow only ".png",".jpeg",".jpg" and ".pdf".')
            return
        }

        setSelectedFile(file)
    }

    const handleAddNotifyNc = handleSubmit(async (data) => {
        const signature = user.personnel?.find(item => item.personnelName === data.creatorName)

        if (!signature?.imageUrl) return alert('!Error No. image signature.')

        const creator = {
            id: user.id,
            username: user.username,
            dept: user.dept,
            email: user.email
        }

        const initial = user.branch === 'ลาดกระบัง' ? 'J' : 'C'

        const code = `${initial}-${data.category}${currentFullYear}${padCurrentMonth}`

        return addNewNcNotify(
            selectedFile,
            data,
            creator,
            code,
            user.branch,
            signature.imageUrl,
            'รอตอบ',
        )
    })

    useEffect(() => {
        if (user.branch === 'ลาดกระบัง') {
            if (departments) {
                const filterTopic = departments.filter((value) => value.dept === dept)
                const mapTopic = filterTopic.map(item => item.topic)
                const mapIs = mapTopic[0]
                setTopic(mapIs)
            }
        } else {
            if (deptCdc) {
                const filterTopic = deptCdc.filter((value) => value.dept === dept)
                const mapTopic = filterTopic.map(item => item.topic)
                const mapIs = mapTopic[0]
                setTopic(mapIs)
            }
        }
    }, [departments, dept, deptCdc, user])

    useEffect(() => {
        if (addNcNotifyFinished) {
            reset()
            setSelectedFile(null)
            setUploadProgression(0)
            setAlertType('success')
        }
    }, [
        addNcNotifyFinished,
        reset,
        setUploadProgression,
        setAlertType
    ])

    return (
        <NcNotifyStyled>
            <div className='nc-notify-title truncated'>
                <h4>รายงานสิ่งที่ไม่เป็นไปตามข้อกำหนด/ข้อบกพร่อง</h4>
            </div>

            {!user.personnel ? (
                <p className='paragraph-error text-center'>!โปรดเพิ่มชื่อผู้ใช้งานที่ Profile ของคุณ</p>
            ) : (
                <form className='form' onSubmit={handleAddNotifyNc}>
                    <div className='radio-group'>
                        {categories.map((radio, i) => (
                            <RadioStyled key={i}>
                                <div className='group'>
                                    <input
                                        type='radio'
                                        name='category'
                                        id={radio}
                                        value={radio}
                                        checked={isRadioSelected(radio)}
                                        onChange={handleRadioClick}
                                        ref={register({ required: 'Category is required.' })}
                                    />
                                    <label htmlFor={radio}>{radio}</label>
                                </div>
                            </RadioStyled>
                        ))}
                    </div>
                    {errors && (
                        <p>{errors.category?.message}</p>
                    )}
                    <div className='form-field'>
                        <label htmlFor='creatorName'>ชื่อ-นามสกุล ผู้ออก NC</label>
                        <select
                            name='creatorName'
                            ref={register({ required: 'โปรดเลือก ชื่อ-นามสกุล ผู้ออก NC ให้' })}
                        >
                            <option style={{ display: 'none' }}></option>
                            {(user.personnel.length > 0) && user.personnel.map((item, i) => (
                                <option key={i} value={item.personnelName}>
                                    {item.personnelName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.creatorName?.message}</p>
                    )}
                    <div className='flex-dept'>
                        {user.branch === 'ลาดกระบัง' ? (
                            departments && <div className='form-field'>
                                <label htmlFor='dept'>
                                    ถึงแผนก
                                </label>
                                <select
                                    name='dept'
                                    onChange={(e) => setDept(e.target.value)}
                                    ref={register({ required: 'โปรดใส่แผนกที่คุณจะออก NC ให้' })}
                                >
                                    <option style={{ display: 'none' }}></option>
                                    {departments.map((cat) => (
                                        <option key={cat.id} value={cat.dept}>
                                            {cat.dept}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            deptCdc && <div className='form-field'>
                                <label htmlFor='dept'>
                                    ถึงแผนก
                                </label>
                                <select
                                    name='dept'
                                    onChange={(e) => setDept(e.target.value)}
                                    ref={register({ required: 'โปรดใส่แผนกที่คุณจะออก NC ให้' })}
                                >
                                    <option style={{ display: 'none' }}></option>
                                    {deptCdc.map((cat) => (
                                        <option key={cat.id} value={cat.dept}>
                                            {cat.dept}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className='form-field'>
                            <label htmlFor='topicType'>
                                ประเภทความไม่สอดคล้อง
                            </label>
                            <select name='topicType' ref={register({ required: 'โปรดใส่ประเภทความไม่สอดคล้อง' })}>
                                <option style={{ display: 'none' }}></option>
                                <option value='Product'>Product</option>
                                <option value='Process'>Process</option>
                            </select>
                        </div>
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.dept?.message}</p>
                    )}
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.topicType?.message}</p>
                    )}
                    {topic && <div className='form-field'>
                        <label htmlFor='topic'>
                            ประเด็นความไม่สอดคล้อง
                        </label>
                        <select name='topic' ref={register({ required: 'โปรดใส่ประเด็นความไม่สอดคล้อง' })}>
                            <option style={{ display: 'none' }}></option>
                            {topic.map(item => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>}
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.topic?.message}</p>
                    )}
                    <div className='form-field'>
                        <label htmlFor='detail'>
                            รายละเอียดความไม่สอดคล้อง/ข้อบกพร่อง
                        </label>
                        <textarea
                            cols={30}
                            rows={5}
                            name='detail'
                            id='detail'
                            ref={register({ required: 'โปรดใส่รายละเอียดความไม่สอดคล้อง/ข้อบกพร่อง' })}
                        />
                    </div>
                    {errors.detail && (
                        <p className='paragraph-error text-center'>{errors.detail?.message}</p>
                    )}

                    <FlexStyled>
                        <div className='form-field' style={{ width: '70%' }}>
                            {uploadProgression ? (
                                <>
                                    <input
                                        readOnly
                                        type='text'
                                        className='upload-progression'
                                        style={{
                                            width: `${uploadProgression}%`,
                                            color: 'white',
                                            textAlign: 'center',
                                        }}
                                        // uploadProgression={uploadProgression}
                                        value={`${uploadProgression}%`}
                                    />
                                </>
                            ) : (
                                <>
                                    <label>
                                        ชื่อไฟล์ (หากมี)
                                    </label>
                                    <input
                                        readOnly
                                        type='text'
                                        name='fileNcName'
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleOpenUploadBox}
                                        value={selectedFile ? selectedFile.name : ''}
                                        ref={register}
                                    />
                                </>
                            )}

                        </div>
                        <ButtonStyled>
                            <Button
                                width='100%'
                                type='button'
                                onClick={handleOpenUploadBox}
                                disabled={loading}
                                style={{
                                    borderRadius: '0',
                                    border: '1px solid #007bff',
                                    background: '#007bff'
                                }}
                            >
                                <span>แนบไฟล์<AttachFileIcon /></span>
                            </Button>
                        </ButtonStyled>
                        <input
                            type='file'
                            ref={inputRef}
                            style={{ display: 'none' }}
                            onChange={handleSelectFile}
                        />
                    </FlexStyled>

                    <Button
                        type='submit'
                        loading={loading}
                        disabled={loading}
                        width='100%'
                        style={{ margin: '0.5rem 0' }}
                    >
                        SAVE
                    </Button>
                </form>
            )}
            {error && <p className='paragraph-error text-center'>{error}</p>}
        </NcNotifyStyled>
    )
}

const ButtonStyled = styled.section`
    margin-top: 2rem;
    width: 30%;
                
    svg {
        margin-bottom: -5px;
    }
`

const FlexStyled = styled.div`
    display: flex;
    margin-top: -0.5rem;
`

const NcNotifyStyled = styled.section`
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

    .flex-dept{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 1rem;
        
        @media screen and (max-width: 1200px) and (min-width: 980px) {
            grid-template-columns: repeat(1, 1fr);
        }
        @media screen and (max-width: 700px) {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    .form{
        width: 100%;
        
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
export default NcNotify