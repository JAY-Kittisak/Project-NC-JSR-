import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import AttachFileIcon from "@material-ui/icons/AttachFile";

import { EditNcrNotifyData, NcrNotify } from '../../types';
import { useDepartmentsContext } from '../../state/dept-context';
import { useDepartmentsCdcContext } from '../../state/dept-cdc-context';
import { useManageNcNotify } from '../../hooks/useManageNcNotify'
import { storageRef } from '../../firebase/config'
import Input from '../Input'
import Button from '../Button';
import { categories, fileType } from '../../helpers';

interface Props {
    nc: NcrNotify
    setOpenNcForm: (open: boolean) => void
}

const EditNc: React.FC<Props> = ({ nc, setOpenNcForm }) => {
    const [dept, setDept] = useState(nc.dept)
    const [topic, setTopic] = useState<string[] | undefined>(undefined)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const {
        register,
        handleSubmit,
        errors,
    } = useForm<EditNcrNotifyData>()

    const inputRef = useRef<HTMLInputElement>(null)

    const {
        editNc,
        uploadImageToStorage,
        setUploadProgression,
        editNcFinished,
        uploadProgression,
        loading,
        error
    } = useManageNcNotify()

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

    const handleEditNc = handleSubmit(async (data) => {
        const {
            id,
            category,
            creatorName,
            dept,
            topicType,
            topic,
            detail,
            fileNcUrl,
            fileNcRef,
            fileNcName
        } = nc

        const isNotEdited =
            category === data.creatorName &&
            creatorName === data.creatorName &&
            dept === data.creatorName &&
            topicType === data.topicType &&
            topic === data.creatorName &&
            detail === data.creatorName &&
            fileNcName === data.creatorName

        // 1. Nothing Changed
        if (isNotEdited) return

        // 2. file NcName is not undefined
        if (fileNcUrl && fileNcRef && fileNcName) {
            // 3. Something changed
            if (fileNcName !== data.fileNcName) {
                // 3.1 If the iamge changed
                if (!selectedFile) return

                // Delete the old image
                const oldImageRef = storageRef.child(fileNcRef)
                await oldImageRef.delete()

                return uploadImageToStorage(
                    selectedFile,
                    editNc(id, data)
                )
            } else {
                // The image has not been changed
                return editNc(id,data)(fileNcUrl, fileNcRef)
            }
        } else {
            return uploadImageToStorage(selectedFile,editNc(id,data))
        }
    })

    useEffect(() => {

        if (nc.branch === 'ลาดกระบัง') {
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
    }, [nc.branch, departments, deptCdc, dept])

    useEffect(() => {
        if (editNcFinished) {
            setSelectedFile(null)
            setUploadProgression(0)
            setOpenNcForm(false)
        }
    }, [editNcFinished, setUploadProgression, setSelectedFile, setOpenNcForm])

    return (
        <>
            <EditNcStyled></EditNcStyled>
            <ModalStyled>
                <div
                    className='modal-close'
                    onClick={() => {
                        setOpenNcForm(false)
                    }}
                >
                    &times;
                </div>
                <h3>แก้ไข NC เลขที่ {nc.code}</h3>
                <form onSubmit={handleEditNc}>
                    <GridStyled>
                        {/* Category */}
                        <div className='form__input-container'>
                            <label htmlFor='category' className='form__input-label'>
                                ประเภท
                            </label>
                            <select
                                name='category'
                                className='input'
                                defaultValue={nc.category}
                                ref={register({ required: 'โปรดใส่แผนกที่คุณจะออก NC ให้' })}
                            >
                                <option style={{ display: 'none' }}></option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Creator Name */}
                        <Input
                            label='ชื่อ-นามสกุล ผู้ออก NC'
                            name='creatorName'
                            defaultValue={nc.creatorName}
                            ref={register({ required: 'โปรดใส่ ชื่อ-นามสกุล ผู้ออก NC' })}
                            error={errors.creatorName?.message}
                        />
                    </GridStyled>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.category?.message}</p>
                    )}

                    {/* dept */}
                    <GridStyled>
                        {nc.branch === 'ลาดกระบัง' ? (
                            departments && <div className='form__input-container'>
                                <label htmlFor='dept' className='form__input-label'>
                                    ถึงแผนก
                                </label>
                                <select
                                    name='dept'
                                    className='input'
                                    defaultValue={nc.dept}
                                    onChange={(e) => setDept(e.target.value)}
                                    ref={register({ required: 'โปรดใส่แผนกที่คุณจะออก NC ให้' })}
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
                                    name='dept'
                                    className='input'
                                    defaultValue={nc.dept}
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

                        {/* Topic Type */}
                        <div className='form__input-container'>
                            <label htmlFor='topicType' className='form__input-label'>
                                ประเภทความไม่สอดคล้อง
                            </label>
                            <select
                                name='topicType'
                                className='input'
                                defaultValue={nc.topicType}
                                ref={register({ required: 'โปรดใส่ประเภทความไม่สอดคล้อง' })}>
                                <option style={{ display: 'none' }}></option>
                                <option value='Product'>Product</option>
                                <option value='Process'>Process</option>
                            </select>
                        </div>
                    </GridStyled>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.dept?.message}</p>
                    )}
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.topicType?.message}</p>
                    )}


                    {/* Topic */}
                    {topic && (
                        <div className='form__input-container'>
                            <label htmlFor='topic' className='form__input-label'>
                                ประเด็นความไม่สอดคล้อง
                            </label>
                            <select
                                name='topic'
                                className='input'
                                defaultValue={nc.topic}
                                ref={register({ required: 'โปรดใส่ประเด็นความไม่สอดคล้อง' })}
                            >
                                <option style={{ display: 'none' }}></option>
                                {topic.map(item => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.topic?.message}</p>
                    )}

                    {/* Detail */}
                    <div className='form__input-container'>
                        <label className='form__input-label'>
                            รายละเอียดความไม่สอดคล้อง/ข้อบกพร่อง
                        </label>
                        <textarea
                            className='input'
                            cols={30}
                            rows={4}
                            name='detail'
                            id='detail'
                            defaultValue={nc.detail}
                            ref={register({ required: 'โปรดใส่รายละเอียดความไม่สอดคล้อง/ข้อบกพร่อง' })}
                        />
                    </div>
                    {errors.detail && (
                        <p className='paragraph-error text-center'>{errors.detail?.message}</p>
                    )}

                    {/* Upload File */}
                    <div className='form__input-container'>
                        <label htmlFor='fileNcName' className='form__input-label'>
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
                                    name='fileNcName'
                                    className='input'
                                    readOnly
                                    style={{ width: '70%', cursor: 'pointer' }}
                                    onClick={handleOpenUploadBox}
                                    value={
                                        selectedFile
                                            ? selectedFile.name
                                            : nc
                                                ? nc.fileNcName
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
                        width='100%'
                        style={{ margin: '1rem 0rem 0rem' }}
                    >
                        บันทึก
                    </Button>
                </form>
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

const GridStyled = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 2rem;
    @media screen and (max-width:1400px){
        grid-template-columns: repeat(1, 1fr);
    }
`

const EditNcStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(0, 0, 0, 0.4);
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
    width: 35%;
    z-index: 1;

    @media screen and (max-width: 600px) {
        position: fixed;
        width: 90%;
    }
    
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
        padding: 0.3rem;
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
export default EditNc