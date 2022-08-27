import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import AttachFileIcon from "@material-ui/icons/AttachFile"

import { IqaType, EditIqaTypeData, Personnel } from '../../types'
import { selectTeams, requirements, fileType } from '../../helpers'
import { useDepartmentsContext } from '../../state/dept-context'
import { useDepartmentsCdcContext } from '../../state/dept-cdc-context'
import { useManageIqa } from '../../hooks/useManageIqa'
import { storageRef } from '../../firebase/config'
import Input from '../Input'
import Button from '../Button';

interface Props {
    iqa: IqaType
    setOpenIqaForm: (open: boolean) => void
    personnel?: Personnel[]
}

const EditIqa: React.FC<Props> = ({ iqa, setOpenIqaForm, personnel }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const {
        register,
        handleSubmit,
        errors,
    } = useForm<EditIqaTypeData>({
        defaultValues: {
            inspector2: iqa.inspector2,
            inspector3: iqa.inspector3,
            inspector4: iqa.inspector4
        }
    })

    const inputRef = useRef<HTMLInputElement>(null)

    const {
        editIqa,
        uploadFileToStorage,
        setUploadProgression,
        editFinished,
        uploadProgression,
        loading,
        error
    } = useManageIqa()

    const {
        departmentsState: { departments }
    } = useDepartmentsContext()

    const {
        departmentsState: { departments: deptCdc }
    } = useDepartmentsCdcContext()

    const handleOpenUploadBox = () => {
        if (inputRef?.current) inputRef.current.click()
    }

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

    const handleEditIqa = handleSubmit(async (data) => {
        const signature = personnel?.find(item => item.personnelName === data.inspector1)

        if (!signature?.imageUrl) return alert('!Error No. image signature.')

        const {
            id,
            inspector1,
            inspector2,
            inspector3,
            inspector4,
            category,
            team,
            round,
            toName,
            dept,
            checkedProcess,
            requirements,
            detail,
            fileIqaName,
            fileIqaUrl,
            fileIqaRef
        } = iqa

        const isNotEdited =
            inspector1 === data.inspector1 &&
            inspector2 === (data.inspector2 ? data.inspector2 : null) &&
            inspector3 === (data.inspector3 ? data.inspector3 : null) &&
            inspector4 === (data.inspector4 ? data.inspector4 : null) &&
            category === data.category &&
            team === data.team &&
            round === data.round &&
            toName === data.toName &&
            dept === data.dept &&
            checkedProcess === data.checkedProcess &&
            requirements === data.requirements &&
            detail === data.detail &&
            fileIqaName === data.fileIqaName

        // 1. Nothing Changed
        if (isNotEdited) return

        // 2. file Iqa Name is not undefined
        if (fileIqaUrl && fileIqaRef && fileIqaName) {
            // 3. Something changed
            if (fileIqaName !== data.fileIqaName) {
                // 3.1 If the file changed
                if (!selectedFile) return

                // Delete the old image
                const oldFileRef = storageRef.child(fileIqaRef)
                await oldFileRef.delete()

                return uploadFileToStorage(selectedFile, editIqa(id, data, signature.imageUrl))
            } else {
                // The image has not been changed
                return editIqa(id, data, signature.imageUrl)(fileIqaUrl, fileIqaRef)
            }
        } else {
            return uploadFileToStorage(selectedFile, editIqa(id, data, signature.imageUrl))
        }
    })

    useEffect(() => {
        if (editFinished) {
            setSelectedFile(null)
            setUploadProgression(0)
            setOpenIqaForm(false)
        }
    }, [editFinished, setUploadProgression, setSelectedFile, setOpenIqaForm])

    useEffect(() => {
        document.documentElement.style.overflowY = 'hidden'
        return () => { document.documentElement.style.overflowY = 'auto' }
    }, [])

    return (
        <>
            <EditIqaStyled></EditIqaStyled>
            <ModalStyled>
                <div
                    className='modal-close'
                    onClick={() => {
                        setOpenIqaForm(false)
                    }}
                >
                    &times;
                </div>
                <h3>แก้ไข IQA เลขที่ {iqa.code}</h3>

                {!personnel ? (
                    <p className='paragraph-error'>!โปรดเพิ่มชื่อผู้ใช้งานที่ Profile ของคุณ</p>
                ) : (
                    <form onSubmit={handleEditIqa}>
                        {/* inspector1 */}
                        <GridStyled>
                            <div className='form__input-container'>
                                <label htmlFor='inspector1' className='form__input-label'>
                                    ชื่อผู้ตรวจ/พบ 1
                                </label>
                                <select
                                    name='inspector1'
                                    className='input'
                                    defaultValue={iqa.inspector1}
                                    ref={register({ required: 'โปรดใส่ ชื่อ-นามสกุล' })}
                                >
                                    <option style={{ display: 'none' }}>{iqa.inspector1}</option>
                                    {(personnel && personnel.length > 0) && personnel.map((item, i) => (
                                        <option key={i} value={item.personnelName}>
                                            {item.personnelName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label='ชื่อผู้ตรวจ/พบ 2'
                                name='inspector2'
                                ref={register}
                            />
                        </GridStyled>

                        {/* inspector3 */}
                        <GridStyled>
                            <Input
                                label='ชื่อผู้ตรวจ/พบ 3'
                                name='inspector3'
                                ref={register}
                            />
                            <Input
                                label='ชื่อผู้ตรวจ/พบ 4'
                                name='inspector4'
                                ref={register}
                            />
                        </GridStyled>

                        <GridCarStyled>
                            <div className="flex-between">
                                {/* Category */}
                                <div className='form__input-container'>
                                    <label htmlFor='category' className='form__input-label'>
                                        CAR/OBS
                                    </label>
                                    <select
                                        id='category'
                                        name='category'
                                        className='input'
                                        defaultValue={iqa.category}
                                        ref={register({ required: 'โปรดใส่แผนกที่คุณจะออก NC ให้' })}
                                    >
                                        <option style={{ display: 'none' }}></option>
                                        <option value='CAR'>CAR</option>
                                        <option value='OBS'>OBS</option>
                                    </select>
                                </div>

                                {/* team */}
                                <div className='form__input-container'>
                                    <label htmlFor='team' className='form__input-label'>
                                        ทีม
                                    </label>
                                    <select
                                        id='team'
                                        name='team'
                                        className='input'
                                        defaultValue={iqa.team}
                                        ref={register({ required: 'โปรดใส่ทีม' })}
                                    >
                                        <option style={{ display: 'none' }}></option>
                                        {selectTeams.map((item, i) => {
                                            return (
                                                <option key={i} value={item}>ทีม {item}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>

                            {/* round */}
                            <div className='form__input-container'>
                                <label htmlFor='round' className='form__input-label'>
                                    รอบที่ตรวจประจำปี
                                </label>
                                <select
                                    id='round'
                                    name='round'
                                    className='input'
                                    defaultValue={iqa.round}
                                    ref={register({ required: 'โปรดใส่รอบที่ตรวจ' })}
                                >
                                    <option style={{ display: 'none' }}></option>
                                    <option value='1'>รอบที่ 1</option>
                                    <option value='2'>รอบที่ 2</option>
                                </select>
                            </div>
                        </GridCarStyled>
                        {errors && (
                            <p className='paragraph-error text-center'>{errors.team?.message}</p>
                        )}
                        {errors && (
                            <p className='paragraph-error text-center'>{errors.category?.message}</p>
                        )}
                        {errors && (
                            <p className='paragraph-error text-center'>{errors.round?.message}</p>
                        )}

                        {/* ถึงชื่อ & แผนก*/}
                        <GridStyled>
                            <Input
                                label='ถึงชื่อ-นามสกุล'
                                name='toName'
                                defaultValue={iqa.toName}
                                ref={register({ required: 'โปรดใส่ ถึงชื่อ-นามสกุล' })}
                                error={errors.toName?.message}
                            />

                            {iqa.branch === 'ลาดกระบัง' ? (
                                departments && <div className='form__input-container'>
                                    <label htmlFor='dept' className='form__input-label'>
                                        ถึงแผนก
                                    </label>
                                    <select
                                        id='dept'
                                        name='dept'
                                        className='input'
                                        defaultValue={iqa.dept}
                                        ref={register({ required: 'โปรดใส่แผนกที่คุณจะออก IQA ให้' })}
                                    >
                                        {departments.map((cat) => (
                                            <option key={cat.id} value={cat.dept}>
                                                {cat.dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                deptCdc && <div className='form__input-container'>
                                    <label htmlFor='dept' className='form__input-label'>
                                        ถึงแผนก
                                    </label>
                                    <select
                                        id='dept'
                                        name='dept'
                                        className='input'
                                        defaultValue={iqa.dept}
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
                        </GridStyled>
                        {errors && (
                            <p className='paragraph-error text-center'>{errors.dept?.message}</p>
                        )}

                        {/* กระบวนการถูกตรวจ & ผิดข้อกำหนด*/}
                        <GridStyled>
                            <Input
                                label='กระบวนการถูกตรวจ'
                                name='checkedProcess'
                                defaultValue={iqa.checkedProcess}
                                ref={register({ required: 'โปรดใส่ชื่อกระบวนการถูกตรวจ' })}
                                error={errors.checkedProcess?.message}
                            />

                            <div className='form__input-container'>
                                <label htmlFor='requirements' className='form__input-label'>
                                    ผิดข้อกำหนด ISO 9001 ข้อที่
                                </label>
                                <select
                                    id='requirements'
                                    name='requirements'
                                    className='input'
                                    defaultValue={iqa.requirements}
                                    ref={register({ required: 'โปรดใส่ ข้อกำหนด ISO 9001' })}
                                >
                                    <option style={{ display: 'none' }}></option>
                                    {requirements.map((item, i) => (
                                        <option key={i} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </GridStyled>
                        {errors && (
                            <p className='paragraph-error text-center'>{errors.checkedProcess?.message}</p>
                        )}
                        {errors && (
                            <p className='paragraph-error text-center'>{errors.requirements?.message}</p>
                        )}

                        {/* Detail */}
                        <div className='form__input-container'>
                            <label htmlFor='detail' className='form__input-label'>
                                รายละเอียดข้อบกพร่อง
                            </label>
                            <textarea
                                id='detail'
                                className='input'
                                rows={4}
                                name='detail'
                                defaultValue={iqa.detail}
                                ref={register({ required: 'โปรดใส่รายละเอียดข้อบกพร่อง' })}
                            />
                        </div>
                        {errors && (
                            <p className='paragraph-error text-center'>{errors.detail?.message}</p>
                        )}

                        {/* Upload File */}
                        <div className='form__input-container'>
                            <label htmlFor='fileIqaName' className='form__input-label'>
                                ชื่อไฟล์ (หากมี)
                            </label>

                            <div className='form__input-file-upload'>
                                {uploadProgression ? (
                                    <div style={{ width: '70%' }}>
                                        <input
                                            type='text'
                                            className='upload-progression'
                                            style={{
                                                width: `${uploadProgression}%`,
                                                color: 'white',
                                                textAlign: 'center',
                                            }}
                                            value={`${uploadProgression}%`}
                                            readOnly
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type='text'
                                        name='fileIqaName'
                                        className='input'
                                        readOnly
                                        style={{ width: '70%', cursor: 'pointer' }}
                                        onClick={handleOpenUploadBox}
                                        value={
                                            selectedFile
                                                ? selectedFile.name
                                                : iqa
                                                    ? iqa.fileIqaName
                                                    : ''
                                        }
                                        ref={register}
                                    />
                                )}

                                <ButtonStyled>
                                    <Button
                                        width='100%'
                                        type='button'
                                        onClick={handleOpenUploadBox}
                                        disabled={loading}
                                        style={{
                                            borderRadius: '0px',
                                            border: '1px solid #007bff',
                                            background: '#007bff',
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
                            </div>
                        </div>

                        <Button
                            type='submit'
                            loading={loading}
                            disabled={loading}
                            width='100%'
                            style={{ margin: '1rem 0rem 0rem' }}
                        >
                            บันทึก
                        </Button>

                    </form>
                )}
                {error && <p className='paragraph-error'>{error}</p>}
            </ModalStyled>
        </>
    )
}
const ButtonStyled = styled.section`
    width: 30%;
                
    svg {
        margin-bottom: -5px;
    }
`

const GridCarStyled = styled.section`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 1rem;
`

const GridStyled = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1rem;

    @media screen and (max-width:1000px){
        grid-template-columns: 1fr;
    }
`

const EditIqaStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgb(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
    z-index: 1;
`;

const ModalStyled = styled.div`
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2rem;
    background-color: var(--background-dark-color);
    border-radius: 2px;
    box-shadow: 0px 30px 20px rgba(0, 0, 0, 0.4);
    animation: appear 0.4s linear;
    position: fixed;
    min-width: 40rem;
    z-index: 1;
    
    @keyframes appear {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    h3 {
        margin: 1rem 0;
        text-align: center;
        font-size: 1.4rem;
    }

    .modal-close {
        position: absolute;
        padding: 2px 15px;
        top: 0.5rem;
        right: 1rem;
        font-size: 2rem;
        color: #282c34;
        cursor: pointer;
        font-weight: bolder;
        width: 3rem;
        height: 3rem;
        border-radius: 50px;
        transition: all 0.5s ease-in-out;
    }

    .form__input-container {
        text-align: start;
        margin: .3rem auto;
        width: 100%;
    }

    .form__input-label {
        font-weight: 600;
    }
    
    .input {
        width: 100%;
        border: 0.6px solid #79849b;
        padding: 0.2rem;
        outline: none;
        border-radius: 2px;
        box-shadow: 2px 2px 4px rgb(137, 145, 160, 0.4);
        color: inherit;
        background-color: transparent;
    }

    .form__input-file-upload {
        width: 100%;
        height: 2.5rem;
        display: flex;
    }

    .upload-progression {
        height: 100%;
        border: 0.6px solid #79849b;
        background-color: chocolate;
        outline: none;
    }
`
export default EditIqa