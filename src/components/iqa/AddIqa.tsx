import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import Button from '../Button';
import { AddIqaTypeData, UserInfo, AlertType, AlertNt } from '../../types'
import { requirements, fileType } from '../../helpers';
import AddInspector from './AddInspector';
import { useDepartmentsContext } from '../../state/dept-context';
import { useDepartmentsCdcContext } from '../../state/dept-cdc-context';
import { useManageIqa } from '../../hooks/useManageIqa';

interface Props {
    userInfo: UserInfo | null
    setAlertWarning: React.Dispatch<React.SetStateAction<AlertNt>>
    setAlertState: React.Dispatch<React.SetStateAction<AlertType>>
}

const AddIqa: React.FC<Props> = ({ userInfo, setAlertWarning, setAlertState }) => {
    const [ inspector, setInspector ] = useState<string[]>([])

    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        errors
    } = useForm<AddIqaTypeData>()

    const {
        departmentsState: { departments }
    } = useDepartmentsContext()

    const {
        departmentsState: { departments: deptCdc }
    } = useDepartmentsCdcContext()

    const {
        uploadImageToStorage,
        addNewIqa,
        setUploadProgression,
        uploadProgression,
        addIqaFinished,
        loading,
        error
    } = useManageIqa()
    
    const inputRef = useRef<HTMLInputElement>(null)

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

    const handleOpenUploadBox = () => {
        if (inputRef?.current) inputRef.current.click()
    }

    // const today = new Date()
    // const currentFullYear = today.getFullYear().toString()
    // const currentMonth = today.getMonth() + 1
    // const padCurrentMonth = currentMonth.toString().padStart(2, '0')

    const handleAddIqa = handleSubmit(async (data) => {
        if (!userInfo) return
        if (inspector.length < 1) return alert('โปรดเพิ่มชื่อผู้ตรวจ/พบ')

        let codeFinished: string
        // FIXME:
        codeFinished = ''

        const creator = {
            id: userInfo.id,
            username: userInfo.username,
            dept: userInfo.dept,
            email: userInfo.email
        }

        // const initial = userInfo.branch === 'ลาดกระบัง' ? 'J' : 'C'

        // const code = `${initial}-${data.category}${currentFullYear}${padCurrentMonth}`

        // if (userInfo.branch === 'ลาดกระบัง') {
        //     const codeCountsItem = ncCountsCodeRef.doc(code)
        //     const codeCount = await codeCountsItem.get()

        //     if (!codeCount.exists) {
        //         codeFinished = code + '001'
        //     } else {
        //         const { counts } = codeCount.data() as CountsCode

        //         const sumCountCode = counts + 1
        //         codeFinished = code + sumCountCode.toString().padStart(3, '0')
        //     }
        // } else {
        //     const codeCountsItemCdc = ncCountsCodeCdcRef.doc(code)
        //     const codeCount = await codeCountsItemCdc.get()

        //     if (!codeCount.exists) {
        //         codeFinished = code + '001'
        //     } else {
        //         const { counts } = codeCount.data() as CountsCode

        //         const sumCountCode = counts + 1
        //         codeFinished = code + sumCountCode.toString().padStart(3, '0')
        //     }
        // }

        return uploadImageToStorage(
            selectedFile,
            addNewIqa(
                data,
                inspector,
                creator,
                codeFinished,
                userInfo.branch
            )
        )
    })

    useEffect(() => {
        if (addIqaFinished) {
            reset()
            setSelectedFile(null)
            setUploadProgression(0)
            setAlertState('success')
            setAlertWarning('show')
        }
    }, [
        addIqaFinished,
        reset,
        setUploadProgression,
        setAlertState,
        setAlertWarning
    ])

    return (
        <AddIqaStyled>
            <h4>คำขอให้ปฏิบัติการแก้ไข</h4>

            {/* ผู้ตรวจ */}
            <h5>ขั้นตอนที่ 1</h5>
            <hr />
            <AddInspector inspector={inspector} setInspector={setInspector} />
            
            <h5>ขั้นตอนที่ 2</h5>
            <hr />
            <form className='form' onSubmit={handleAddIqa}>
                {/* team & CAR หรือ OBS */}
                <div className='flex-between'>
                    <div className='form-field'>
                        <label htmlFor='team'>ทีม</label>
                        <select name='team' ref={register({ required: 'โปรดเลือกประเภท  CAR หรือ OBS' })}>
                            <option style={{ display: 'none' }}></option>
                            <option value='Team A'>Team A</option>
                            <option value='Team B'>Team B</option>
                            <option value='Team C'>Team C</option>
                            <option value='Team D'>Team D</option>
                        </select>
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

                {/* กระบวนการถูกตรวจ & แผนก*/}
                <div className='flex-between'>
                    <div className='form-field'>
                        <label htmlFor='toName'>ถึงชื่อ-นามสกุล</label>
                        <input
                            name='toName'
                            id='toName'
                            ref={register({ required: 'โปรดใส่ ชื่อ-นามสกุล' })}
                        />
                    </div>
                    {userInfo?.branch === 'ลาดกระบัง' ? (
                        departments && <div className='form-field'>
                            <label htmlFor='dept'>
                                แผนก
                            </label>
                            <select
                                name='dept'
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
                                แผนก
                            </label>
                            <select
                                name='dept'
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
                        <select name='requirements' ref={register({ required: 'โปรดใส่ประเภทความไม่สอดคล้อง' })}>
                            <option style={{ display: 'none' }}></option>
                            {requirements.map((item, i) => (
                                <option key={i} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>
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
                    width='100%'
                    style={{ margin: '0.5rem 0' }}
                >
                    SAVE
                </Button>
            </form>
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
    display: grid;
    grid-template-columns: repeat(1,1fr);
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

    h5 {
        color: var(--white-color);
        font-size: 1.2rem;
        margin-top: 16px;
    }

    .grid-inspector {
        padding: 1rem 0rem 0rem 6rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 1.5rem;
        grid-row-gap: 1.5rem;

        p {
            margin-bottom: 1rem;
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