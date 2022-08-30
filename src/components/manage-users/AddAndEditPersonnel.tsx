import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form';
import styled from 'styled-components'
import AttachFileIcon from '@material-ui/icons/AttachFile';

import Button from '../Button'
import { UserInfo, PersonnelInput, Personnel } from '../../types'
import { useManagePersonnel } from '../../hooks/useManagePersonnel'
import { storageRef } from '../../firebase/config'

const typeSignature = ['image/png', 'image/jpeg', 'image/jpg']

interface Props {
    userInfo: UserInfo | null
    setOpenDialog: (value: boolean) => void
    personnelToEdit: Personnel | null
    setPersonnelToEdit: (personnel: Personnel | null) => void
}

const AddAndEditPersonnel: React.FC<Props> = ({
    userInfo,
    setOpenDialog,
    personnelToEdit,
    setPersonnelToEdit
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const { register, handleSubmit, errors, reset } = useForm<PersonnelInput>()

    const inputRef = useRef<HTMLInputElement>(null)

    const {
        uploadImageToStorage,
        addPersonnel,
        editPersonnel,
        setUploadProgression,
        uploadProgression,
        addFinished,
        editFinished,
        loading,
        error
    } = useManagePersonnel()

    const handleOpenUploadBox = () => {
        if (inputRef?.current) inputRef.current.click()
    }

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (!files || !files[0]) return

        const file = files[0]

        if (!typeSignature.includes(file.type)) {
            alert('Wrong file format, allow only ".png",".jpeg",".jpg" and ".pdf".')
            return
        }

        setSelectedFile(file)
    }

    const handleAddPersonnel = handleSubmit((data) => {
        if (!selectedFile || !userInfo) return

        return uploadImageToStorage(
            selectedFile,
            addPersonnel(data, userInfo)
        )
    })

    const handleEditPersonnel = handleSubmit(async (data) => {
        if (!userInfo?.personnel || personnelToEdit?.index === undefined) return

        if (typeof personnelToEdit.index !== 'number') return

        const {
            personnelName,
            imageFileName,
            imageUrl,
            imageRef
        } = personnelToEdit

        const isNotEdited =
            personnelName === data.personnelName &&
            imageFileName === data.imageFileName

        // 1. Nothing Changed
        if (isNotEdited) {
            alert('No changes have been made.')
            return
        }

        // 2. Something changed
        if (imageFileName !== data.imageFileName) {
            // 2.1 If the iamge changed
            if (!selectedFile) return

            // Delete the old image
            const oldImageRef = storageRef.child(imageRef)
            await oldImageRef.delete()

            return uploadImageToStorage(
                selectedFile,
                editPersonnel(data, personnelToEdit.index, userInfo)
            )
        } else {
            // The image has not been changed
            return editPersonnel(
                data,
                personnelToEdit.index,
                userInfo
            )(imageUrl, imageRef)
        }
    })

    useEffect(() => {
        if (addFinished) {
            reset()
            setSelectedFile(null)
            setUploadProgression(0)
            setOpenDialog(false)
        }
    }, [addFinished, reset, setUploadProgression, setSelectedFile, setOpenDialog])

    useEffect(() => {
        if (editFinished) {
            reset()
            setSelectedFile(null)
            setUploadProgression(0)
            setPersonnelToEdit(null)
            setOpenDialog(false)
        }
    }, [
        editFinished,
        reset,
        setUploadProgression,
        setSelectedFile,
        setPersonnelToEdit,
        setOpenDialog
    ])

    return (
        <>
            <PersonnelStyled onClick={() => {
                setPersonnelToEdit(null)
                setOpenDialog(false)
            }}></PersonnelStyled>

            <ModalStyled className="modal modal--auth-form">
                <div
                    className="modal-close"
                    onClick={() => {
                        setPersonnelToEdit(null)
                        setOpenDialog(false)
                    }}
                >
                    &times;
                </div>

                <h3 className="header--center">
                    เพิ่มผู้ใช้งาน
                </h3>

                <form onSubmit={personnelToEdit ? handleEditPersonnel : handleAddPersonnel}>
                    <div className='form-field'>
                        <label htmlFor='personnelName'>ชื่อ-นามสกุล</label>
                        <input
                            type='text'
                            name='personnelName'
                            id='personnelName'
                            placeholder='ชื่อผู้ใช้งาน'
                            defaultValue={personnelToEdit ? personnelToEdit.personnelName : ''}
                            ref={register({ required: 'ชื่อผู้ใช้งาน is required.' })}
                        />
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.personnelName?.message}</p>
                    )}

                    <UploadStyled>
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
                                    <label>ไฟล์ลายเซ็น</label>
                                    <input
                                        readOnly
                                        type='text'
                                        name='imageFileName'
                                        style={{ cursor: 'pointer' }}
                                        placeholder='ขนาดประมาณ 240x80'
                                        onClick={handleOpenUploadBox}
                                        value={selectedFile 
                                                ? selectedFile.name 
                                                : personnelToEdit
                                                    ? personnelToEdit.imageFileName
                                                    : ''
                                        }
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
                    </UploadStyled>

                    <Button
                        loading={loading}
                        width='100%'
                        style={{ margin: '1rem 0' }}
                    >
                        {personnelToEdit ? 'Update' : 'บันทึก'}
                    </Button>

                    {error && <p>{error}</p>}
                </form>
            </ModalStyled>
        </>
    )
}

const PersonnelStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0, 0, 0, 0.4);
  z-index: 1;
`;

const ModalStyled = styled.div`
    position: fixed;
    top: 50vh;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2rem;
    background-color: var(--background-dark-color);
    border-radius: 2px;
    box-shadow: 0px 30px 20px rgba(0, 0, 0, 0.4);
    animation: appear 0.4s linear;
    max-width: 380px;
    z-index: 2;
    
    @keyframes appear {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    .modal--auth-form {
        width: 25%;
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

    .modal-close:hover {
        color: red;
        background-color: rgba(92, 101, 119, 0.3);
    }

    .header--center {
        margin: 1rem 0;
        font-size: 1.7rem;
        font-weight: 700;
        text-align: center;
        color: var(--primary-color);
    }

    .form__input-container {
        text-align: start;
        margin: 1rem auto;
        width: 100%;
    }

    .paragraph-center {
        margin: 5px 0;
        text-align: center;
        margin-bottom: -1rem;
    }

    form {
        padding: 0;
        width: 100%;

        .form-field {
            margin-top: 2rem;
            position: relative;
            width: 100%;

            label {
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

            .upload-progression {
                height: 100%;
                border: 0.6px solid #79849b;
                background-color: #27AE60;
                outline: none;
            }
        }
    }
`;

const UploadStyled = styled.div`
    display: flex;
    margin-top: -0.5rem;
`

const ButtonStyled = styled.section`
    margin-top: 2rem;
    width: 30%;
                
    svg {
        margin-bottom: -5px;
    }
`
export default AddAndEditPersonnel