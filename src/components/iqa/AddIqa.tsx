import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import Button from '../Button';
import { AddIqaTypeData, UserInfo, CountsCode } from '../../types'
import { requirements, fileType, selectTeams } from '../../helpers';
import { useDepartmentsContext } from '../../state/dept-context';
import { useDepartmentsCdcContext } from '../../state/dept-cdc-context';
import { useAlertContext } from '../../state/alert-context';
import { useManageIqa } from '../../hooks/useManageIqa';
import { iqaCountsCodeRef, iqaCountsCodeCdcRef} from '../../firebase'

interface Props {
    userInfo: UserInfo | null
}

const AddIqa: React.FC<Props> = ({ userInfo }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [nameTwo, setNameTwo] = useState(false)
    const [nameThree, setNameThree] = useState(false)
    const [nameFour, setNameFour] = useState(false)

    const { setAlertType } = useAlertContext()

    const {
        register,
        handleSubmit,
        reset,
        errors
    } = useForm<AddIqaTypeData>({
        defaultValues: {
            inspector2: null,
            inspector3: null,
            inspector4: null
        }
    })

    const {
        departmentsState: { departments }
    } = useDepartmentsContext()

    const {
        departmentsState: { departments: deptCdc }
    } = useDepartmentsCdcContext()

    const {
        uploadFileToStorage,
        addNewIqa,
        setUploadProgression,
        uploadProgression,
        addIqaFinished,
        loading,
        error
    } = useManageIqa()

    const inputRef = useRef<HTMLInputElement>(null)

    const handleOpenUploadBox = () => {
        if (inputRef?.current) inputRef.current.click()
    }

    const today = new Date()
    const currentFullYear = today.getFullYear().toString()

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

    const handleAddIqa = handleSubmit(async (data) => {
        if (!userInfo?.personnel) return

        const signature = userInfo.personnel.find(item => item.personnelName === data.inspector1)

        if (!signature?.imageUrl) return alert('!Error No. image signature.')

        let codeFinished: string

        const creator = {
            id: userInfo.id,
            username: userInfo.username,
            dept: userInfo.dept,
            email: userInfo.email
        }

        const initial = userInfo.branch === 'ลาดกระบัง' ? 'J' : 'C'

        const code = `${initial}-${data.category}${data.round}${data.team}${currentFullYear}`

        if (userInfo.branch === 'ลาดกระบัง') {
            const codeCountsItem = iqaCountsCodeRef.doc(code)
            const codeCount = await codeCountsItem.get()

            if (!codeCount.exists) {
                codeFinished = code + '001'
            } else {
                const { counts } = codeCount.data() as CountsCode

                const sumCountCode = counts + 1
                codeFinished = code + sumCountCode.toString().padStart(3, '0')
            }
        } else {
            const codeCountsItemCdc = iqaCountsCodeCdcRef.doc(code)
            const codeCount = await codeCountsItemCdc.get()

            if (!codeCount.exists) {
                codeFinished = code + '001'
            } else {
                const { counts } = codeCount.data() as CountsCode

                const sumCountCode = counts + 1
                codeFinished = code + sumCountCode.toString().padStart(3, '0')
            }
        }

        return uploadFileToStorage(
            selectedFile,
            addNewIqa(
                data,
                creator,
                codeFinished,
                userInfo.branch,
                signature.imageUrl,
            )
        )
    })

    useEffect(() => {
        if (addIqaFinished) {
            reset()
            setSelectedFile(null)
            setUploadProgression(0)
            setAlertType('success')
        }
    }, [
        addIqaFinished,
        reset,
        setUploadProgression,
        setAlertType
    ])

    return (
        <AddIqaStyled>
            <h4>คำขอให้ปฏิบัติการแก้ไข</h4>

            {!userInfo?.personnel ? (
                <p className='paragraph-error text-center'>!โปรดเพิ่มชื่อผู้ใช้งานที่ Profile ของคุณ</p>
            ) : (
                <form className='form' onSubmit={handleAddIqa}>
                    {/* ผู้ตรวจ */}
                    <div className='flex-between'>
                        <div className='form-field'>
                            <label htmlFor='inspector1'>*ชื่อผู้ตรวจ/พบ 1 </label>
                            <select
                                name='inspector1'
                                id='inspector1'
                                ref={register({ required: 'โปรดเลือก ชื่อ-นามสกุล' })}
                            >
                                <option style={{ display: 'none' }}></option>
                                {(userInfo.personnel.length > 0) && userInfo.personnel.map((item, i) => (
                                    <option key={i} value={item.personnelName}>
                                        {item.personnelName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {!nameTwo && (
                            <Button
                                type='button'
                                className='btn--darkcyan'
                                onClick={() => setNameTwo(true)}
                            >
                                เพิ่ม
                            </Button>
                        )}
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.inspector1?.message}</p>
                    )}
                    {nameTwo && (
                        <div className='flex-between'>
                            <div className='form-field'>
                                <label htmlFor='inspector2'>ชื่อผู้ตรวจ/พบ 2 (หากมี)</label>
                                <input
                                    name='inspector2'
                                    id='inspector2'
                                    ref={register}
                                />
                            </div>
                            <Button 
                                type='button' 
                                className='btn--darkcyan' 
                                onClick={() => setNameThree(true)}
                            >
                                เพิ่ม
                            </Button>
                            <Button 
                            type='button' 
                            className='btn--red' 
                            onClick={() => setNameTwo(false)}
                            >
                                ลบ
                            </Button>
                        </div>
                    )}

                    {nameThree && (
                        <div className='flex-between'>
                            <div className='form-field'>
                                <label htmlFor='inspector3'>ชื่อผู้ตรวจ/พบ 3 (หากมี)</label>
                                <input
                                    name='inspector3'
                                    id='inspector3'
                                    ref={register}
                                />
                            </div>
                            <Button 
                                type='button' 
                                className='btn--darkcyan' 
                                onClick={() => setNameFour(true)}
                            >
                                เพิ่ม
                            </Button>
                            <Button 
                            type='button' 
                            className='btn--red' 
                            onClick={() => setNameThree(false)}
                            >
                                ลบ
                            </Button>
                        </div>
                    )
                    }

                    {nameFour && (
                        <div className='flex-between'>
                            <div className='form-field'>
                                <label htmlFor='inspector4'>ชื่อผู้ตรวจ/พบ 4 (หากมี)</label>
                                <input
                                    name='inspector4'
                                    id='inspector4'
                                    ref={register}
                                />
                            </div>
                            <Button type='button' className='btn--darkcyan' >เพิ่ม</Button>
                            <Button 
                            type='button' 
                            className='btn--red' 
                            onClick={() => setNameFour(false)}
                            >
                                ลบ
                            </Button>
                        </div>
                    )}

                    <div className='grid-add'>
                        <div className='flex-between'>
                            <div className='form-field'>
                                <label htmlFor='category'>
                                    CAR/OBS
                                </label>
                                <select name='category' ref={register({ required: 'โปรดเลือกประเภท  CAR หรือ OBS' })}>
                                    <option style={{ display: 'none' }}></option>
                                    <option value='CAR'>CAR</option>
                                    <option value='OBS'>OBS</option>
                                </select>
                            </div>
                            <div className='form-field'>
                                <label htmlFor='team'>ทีม</label>
                                <select name='team' ref={register({ required: 'โปรดเลือกทีม' })}>
                                    <option style={{ display: 'none' }}></option>
                                    {selectTeams.map((item,i) => {
                                        return (
                                            <option key={i} value={item}>ทีม {item}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='form-field'>
                            <label htmlFor='round'>
                                รอบที่ตรวจประจำปี {currentFullYear}
                            </label>
                            <select name='round' ref={register({ required: 'โปรดเลือกประเภทรอบที่ตรวจ' })}>
                                <option style={{ display: 'none' }}></option>
                                <option value='1'>รอบที่ 1</option>
                                <option value='2'>รอบที่ 2</option>
                            </select>
                        </div>
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.category?.message}</p>
                    )}
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.team?.message}</p>
                    )}
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.round?.message}</p>
                    )}

                    {/* ถึงชื่อ & แผนก*/}
                    <div className='flex-between'>
                        <div className='form-field'>
                            <label htmlFor='toName'>ถึงชื่อ-นามสกุล</label>
                            <input
                                name='toName'
                                id='toName'
                                ref={register({ required: 'โปรดใส่ ถึงชื่อ-นามสกุล' })}
                            />
                        </div>
                        {userInfo?.branch === 'ลาดกระบัง' ? (
                            departments && <div className='form-field'>
                                <label htmlFor='dept'>
                                    แผนก
                                </label>
                                <select
                                    name='dept'
                                    ref={register({ required: 'โปรดใส่แผนกที่คุณจะออก IQA ให้' })}
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
                                    แผนก
                                </label>
                                <select
                                    name='dept'
                                    ref={register({ required: 'โปรดใส่แผนกที่คุณจะออก IQA ให้' })}
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
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.toName?.message}</p>
                    )}
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.dept?.message}</p>
                    )}

                    {/* กระบวนการถูกตรวจ */}

                    <div className='flex-between'>
                        <div className='form-field'>
                            <label htmlFor='checkedProcess'>กระบวนการถูกตรวจ</label>
                            <input
                                name='checkedProcess'
                                id='checkedProcess'
                                ref={register({ required: 'โปรดใส่ชื่อกระบวนการถูกตรวจ' })}
                            />
                        </div>
                        <div className='form-field'>
                            <label htmlFor='requirements'>
                                ผิดข้อกำหนด ISO 9001 ข้อที่
                            </label>
                            <select name='requirements' ref={register({ required: 'โปรดใส่ ข้อกำหนด ISO 9001' })}>
                                <option style={{ display: 'none' }}></option>
                                {requirements.map((item, i) => (
                                    <option key={i} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.checkedProcess?.message}</p>
                    )}
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.requirements?.message}</p>
                    )}

                    {/* detail */}
                    <div className='form-field'>
                        <label htmlFor='detail'>
                            รายละเอียดข้อบกพร่อง
                        </label>
                        <textarea
                            cols={30}
                            rows={5}
                            name='detail'
                            id='detail'
                            ref={register({ required: 'โปรดใส่รายละเอียดข้อบกพร่อง' })}
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
                                        name='fileIqaName'
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
                                    background: '#007bff',
                                    margin: '2rem 0rem 0rem'
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
        </AddIqaStyled>
    )
}

const ButtonStyled = styled.section`
    width: 30%;
                
    svg {
        margin-bottom: -5px;
    }
`

const FlexStyled = styled.div`
    display: flex;
    margin-top: -0.5rem;
`

const AddIqaStyled = styled.section`
    background-color: var(--background-dark-color);
    max-height: 722px;

    @media screen and (max-width: 502px){
        width: 70%;
    }
    
    h4 {
        color: var(--white-color);
        font-size: 1.4rem;
        margin: 16px 0;
        border-left: 5px solid #e74c3c;
        padding-left: 16px;
    }

    .grid-add {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 1rem;

        @media screen and (max-width: 1400px){
            grid-template-columns: repeat(1, 1fr);
        }
    }

    .radio-group {
        display: flex;
        align-items: center;
        justify-content: center;
    }
        
    .btn--darkcyan {
        background-color: #007bff;
        margin: 2rem 0rem 0rem 1rem;
        font-weight: 600;

        svg {
            margin-bottom: -5px;
        }
    }

    .btn--darkcyan:hover {
        background-color: #0c4b8f;
                
    }
        
    .btn--red {
        background-color: #e74c3c;
        margin: 2rem 0rem 0rem 1rem;
        font-weight: 600;

        svg {
            margin-bottom: -5px;
        }
    }

    .btn--red:hover {
        background-color: #d31f0b;
                
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
export default AddIqa