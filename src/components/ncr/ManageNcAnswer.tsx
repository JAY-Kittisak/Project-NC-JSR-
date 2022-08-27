import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import { CheckboxStyled } from '../../styles/LayoutStyle';
import Button from '../Button'
import { useManageAnswerNc } from '../../hooks/useManageAnswerNc'
import { useAlertContext } from '../../state/alert-context'
import { AddAnswerNcData, StatusNc, NcAnswer, UserInfo } from '../../types';
import { storageRef } from '../../firebase/config'
import { fileType, formatDate } from '../../helpers';

interface Props {
    ncId: string
    ncAnswer: NcAnswer | null
    ncStatus: StatusNc
    ncToDept: string
    userInfo: UserInfo
}

const ManageNcAnswer: React.FC<Props> = ({
    ncId,
    ncAnswer,
    ncStatus,
    ncToDept,
    userInfo
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const { register, handleSubmit, errors } = useForm<AddAnswerNcData>()

    const inputRef = useRef<HTMLInputElement>(null)

    const { setAlertType } = useAlertContext()

    const {
        uploadImageToStorage,
        addNewAnswerNc,
        editAnswerNc,
        setUploadProgression,
        uploadProgression,
        addAnswerNcFinished,
        editAnswerNcFinished,
        loading,
        error
    } = useManageAnswerNc()

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

    const handleAddAnswerNc = handleSubmit(async (data) => {
        const signature = userInfo.personnel?.find(item => item.personnelName === data.answerName)

        if (!signature?.imageUrl) return alert('!Error No. image signature.')

        return uploadImageToStorage(
            selectedFile,
            addNewAnswerNc(
                data,
                ncId,
                signature.imageUrl
            )
        )
    })

    const handleEditAnswerNc = handleSubmit(async (data) => {
        const signature = userInfo.personnel?.find(item => item.personnelName === data.answerName)

        if (!signature?.imageUrl) return alert('!Error No. image signature.')

        if (!ncAnswer) return

        const {
            containmentAction,
            containmentDueDate,
            containmentName,
            rootCause,
            correctiveAction,
            correctiveDueDate,
            correctiveName,
            fileAnswerNcUrl,
            fileAnswerNcName,
            fileAnswerNcRef,
            editedDoc,
            docDetail,
        } = ncAnswer

        const isNotEdited =
            containmentAction === data.containmentAction &&
            containmentDueDate === data.containmentDueDate &&
            containmentName === data.containmentName &&
            rootCause === data.rootCause &&
            correctiveAction === data.correctiveAction &&
            correctiveDueDate === data.correctiveDueDate &&
            correctiveName === data.correctiveName &&
            fileAnswerNcName === data.fileAnswerNcName &&
            editedDoc === data.editedDoc &&
            docDetail === data.docDetail

        // 1. Nothing Changed
        if (isNotEdited) return

        // 2. fileAnswerNcName is not undefined
        if (fileAnswerNcUrl && fileAnswerNcName && fileAnswerNcRef) {
            // 3. Something changed
            if (fileAnswerNcName !== data.fileAnswerNcName) {
                // 3.1 If the file changed
                if (!selectedFile) return

                // Delete the old file
                const oldImageRef = storageRef.child(fileAnswerNcRef)
                await oldImageRef.delete()

                return uploadImageToStorage(
                    selectedFile,
                    editAnswerNc(
                        ncAnswer.id,
                        data,
                        ncAnswer.ncId,
                        ncStatus,
                        signature.imageUrl
                    )
                )
            } else {
                // The file has not been changed
                return editAnswerNc(
                    ncAnswer.id,
                    data,
                    ncAnswer.ncId,
                    ncStatus,
                    signature.imageUrl
                )(fileAnswerNcUrl, fileAnswerNcRef)
            }

        } else {
            return uploadImageToStorage(
                selectedFile,
                editAnswerNc(
                    ncAnswer.id,
                    data,
                    ncAnswer.ncId,
                    ncStatus,
                    signature.imageUrl
                )
            )
        }
    })

    const editBoolean = (userInfo.dept === ncToDept) && ((ncStatus === 'รอตอบ') || (ncStatus === 'ไม่อนุมัติ'))

    useEffect(() => {
        if (addAnswerNcFinished || editAnswerNcFinished) {
            setSelectedFile(null)
            setUploadProgression(0)
            setAlertType('success')
        }
    }, [addAnswerNcFinished, editAnswerNcFinished, setUploadProgression, setSelectedFile, setAlertType])

    return (
        <NcAnswerStyled className='box-shadows'>
            <h4>ผู้รับผิดชอบการแก้ไข</h4>

            {!userInfo.personnel ? (
                <p className='paragraph-error'>!โปรดเพิ่มชื่อผู้ใช้งานที่ Profile ของคุณ</p>
            ) : (
                <form className="form" onSubmit={ncAnswer ? handleEditAnswerNc : handleAddAnswerNc}>
                    {ncAnswer && (
                        <FlexStyled>
                            <div>
                                <p><span>วันที่ตอบ :</span></p>
                                <p>{formatDate(ncAnswer.createdAt)}</p>
                            </div>
                            <div>
                                <p><span>เอกสาร :</span></p>
                                {ncAnswer.fileAnswerNcUrl ? (
                                    <a
                                        href={ncAnswer.fileAnswerNcUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        ดูเอกสาร / ไฟล์แนบ
                                    </a>
                                ) : (
                                    <p>ไม่มีเอกสาร</p>
                                )}
                            </div>
                        </FlexStyled>
                    )}
                    <div className="form-field">
                        <label htmlFor="answerName">ชื่อ-นามสกุล ผู้ตอบ</label>
                        <select
                            disabled={!editBoolean}
                            name='answerName'
                            id="answerName"
                            defaultValue={ncAnswer ? ncAnswer.answerName : ''}
                            ref={register({ required: 'โปรดใส่ชื่อผู้ตอบ' })}
                        >
                            <option style={{ display: 'none' }}>{ncAnswer?.answerName}</option>
                            {(userInfo.personnel.length > 0) && userInfo.personnel.map((item, i) => (
                                <option key={i} value={item.personnelName}>
                                    {item.personnelName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.answerName?.message}</p>
                    )}
                    <div className="form-field">
                        <label htmlFor="containmentAction">การแก้ไขเบื้องต้น</label>
                        <textarea
                            readOnly={!editBoolean}
                            cols={30}
                            rows={3}
                            name="containmentAction"
                            id="containmentAction"
                            defaultValue={ncAnswer ? ncAnswer.containmentAction : ''}
                            ref={register({ required: 'โปรดใส่การแก้ไขเบื้องต้น' })}
                        />
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.containmentAction?.message}</p>
                    )}
                    <div className="flex-between">
                        <div className="form-field">
                            <label htmlFor="containmentDueDate">กำหนดเสร็จ</label>
                            <input
                                readOnly={!editBoolean}
                                type="date"
                                name='containmentDueDate'
                                id="containmentDueDate"
                                min="2022-01-01"
                                defaultValue={ncAnswer ? ncAnswer.containmentDueDate : ''}
                                ref={register({ required: 'โปรดใส่วันที่กำหนดเสร็จ' })}
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="containmentName">ผู้รับผิดชอบ</label>
                            <input
                                readOnly={!editBoolean}
                                name='containmentName'
                                id="containmentName"
                                defaultValue={ncAnswer ? ncAnswer.containmentName : ''}
                                ref={register({ required: 'โปรดใส่ชื่อผู้รับผิดชอบ' })}
                            />
                        </div>
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.containmentDueDate?.message}</p>
                    )}{errors && (
                        <p className='paragraph-error text-center'>{errors.containmentName?.message}</p>
                    )}

                    <div className="form-field">
                        <label htmlFor="rootCause">สาเหตุของปัญหา</label>
                        <textarea
                            readOnly={!editBoolean}
                            cols={30}
                            rows={3}
                            name="rootCause"
                            id="rootCause"
                            defaultValue={ncAnswer ? ncAnswer.rootCause : ''}
                            ref={register({ required: 'โปรดใส่สาเหตุของปัญหา' })}
                        />
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.rootCause?.message}</p>
                    )}

                    <div className="form-field">
                        <label htmlFor="correctiveAction">การแก้ไขปัญหาและการป้องกัน</label>
                        <textarea
                            readOnly={!editBoolean}
                            cols={30}
                            rows={3}
                            name="correctiveAction"
                            id="correctiveAction"
                            defaultValue={ncAnswer ? ncAnswer.correctiveAction : ''}
                            ref={register({ required: 'โปรดใส่การแก้ไขปัญหาและการป้องกัน' })}
                        />
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.correctiveAction?.message}</p>
                    )}
                    <div className="flex-between">
                        <div className="form-field">
                            <label htmlFor="correctiveDueDate">กำหนดเสร็จ</label>
                            <input
                                readOnly={!editBoolean}
                                type="date"
                                name='correctiveDueDate'
                                id="correctiveDueDate"
                                min="2022-01-01"
                                defaultValue={ncAnswer ? ncAnswer.correctiveDueDate : ''}
                                ref={register({ required: 'โปรดใส่วันที่กำหนดเสร็จ' })}
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="correctiveName">ผู้รับผิดชอบ</label>
                            <input
                                readOnly={!editBoolean}
                                name='correctiveName'
                                id="correctiveName"
                                defaultValue={ncAnswer ? ncAnswer.correctiveName : ''}
                                ref={register({ required: 'โปรดใส่ชื่อผู้รับผิดชอบ' })}
                            />
                        </div>
                    </div>
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.correctiveDueDate?.message}</p>
                    )}
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.correctiveName?.message}</p>
                    )}
                    <p className='title-select-doc'>เอกสารที่ต้องปรับปรุงแก้ไขเบื้องต้น</p>
                    <div className="select-doc">
                        <CheckboxStyled>
                            <div className="group">
                                <input
                                    disabled={!editBoolean}
                                    type="checkbox"
                                    name="editedDoc"
                                    id='qp'
                                    value='QP'
                                    defaultChecked={ncAnswer?.editedDoc.includes('QP')}
                                    ref={register}
                                />
                                <label htmlFor='qp'>QP</label>
                            </div>
                        </CheckboxStyled>
                        <CheckboxStyled>
                            <div className="group">
                                <input
                                    disabled={!editBoolean}
                                    type="checkbox"
                                    name="editedDoc"
                                    id='sd'
                                    value='SD'
                                    defaultChecked={ncAnswer?.editedDoc.includes('SD')}
                                    ref={register}
                                />
                                <label htmlFor='sd'>SD</label>
                            </div>
                        </CheckboxStyled>
                        <CheckboxStyled>
                            <div className="group">
                                <input
                                    disabled={!editBoolean}
                                    type="checkbox"
                                    name="editedDoc"
                                    id='wi'
                                    value='WI'
                                    defaultChecked={ncAnswer?.editedDoc.includes('WI')}
                                    ref={register}
                                />
                                <label htmlFor='wi'>WI</label>
                            </div>
                        </CheckboxStyled>
                        <CheckboxStyled>
                            <div className="group">
                                <input
                                    disabled={!editBoolean}
                                    type="checkbox"
                                    name="editedDoc"
                                    id='km'
                                    value='KM'
                                    defaultChecked={ncAnswer?.editedDoc.includes('KM')}
                                    ref={register}
                                />
                                <label htmlFor='km'>KM</label>
                            </div>
                        </CheckboxStyled>
                        <CheckboxStyled>
                            <div className="group">
                                <input
                                    disabled={!editBoolean}
                                    type="checkbox"
                                    name="editedDoc"
                                    id='opl'
                                    value='OPL'
                                    defaultChecked={ncAnswer?.editedDoc.includes('OPL')}
                                    ref={register}
                                />
                                <label htmlFor='opl'>OPL</label>
                            </div>
                        </CheckboxStyled>
                        <CheckboxStyled>
                            <div className="group">
                                <input
                                    disabled={!editBoolean}
                                    type="checkbox"
                                    name="editedDoc"
                                    id='risk'
                                    value='Risk'
                                    defaultChecked={ncAnswer?.editedDoc.includes('Risk')}
                                    ref={register}
                                />
                                <label htmlFor='risk'>Risk</label>
                            </div>
                        </CheckboxStyled>
                        <CheckboxStyled>
                            <div className="group">
                                <input
                                    disabled={!editBoolean}
                                    type="checkbox"
                                    name="editedDoc"
                                    id='kaizen'
                                    value='Kaizen'
                                    defaultChecked={ncAnswer?.editedDoc.includes('Kaizen')}
                                    ref={register}
                                />
                                <label htmlFor='kaizen'>Kaizen</label>
                            </div>
                        </CheckboxStyled>
                        <CheckboxStyled>
                            <div className="group">
                                <input
                                    disabled={!editBoolean}
                                    type="checkbox"
                                    name="editedDoc"
                                    id='อื่น'
                                    value='อื่นๆ...'
                                    defaultChecked={ncAnswer?.editedDoc.includes('อื่นๆ...')}
                                    ref={register}
                                />
                                <label htmlFor='อื่น'>อื่นๆ...</label>
                            </div>
                        </CheckboxStyled>
                    </div>

                    <div className="form-field mb-one">
                        <label htmlFor="docDetail">เลขที่เอกสาร/เอกสารอื่นๆ(หากมี)</label>
                        <textarea
                            readOnly={!editBoolean}
                            cols={30}
                            rows={3}
                            name="docDetail"
                            id="docDetail"
                            defaultValue={ncAnswer ? ncAnswer.docDetail : ''}
                            ref={register}
                        />
                    </div>

                    {
                        !((ncStatus === 'รอตอบ') || (ncStatus === 'ไม่อนุมัติ')) ?
                            null : (
                                <FlexUploadStyled>
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
                                                    name='fileAnswerNcName'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={handleOpenUploadBox}
                                                    value={
                                                        selectedFile
                                                            ? selectedFile.name
                                                            : ncAnswer?.fileAnswerNcName
                                                                ? ncAnswer.fileAnswerNcName
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
                                        disabled={!editBoolean}
                                        ref={inputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleSelectFile}
                                    />
                                </FlexUploadStyled>

                            )}
                    {editBoolean && (
                        <Button
                            type='submit'
                            loading={loading}
                            disabled={loading}
                            width='100%'
                        >
                            {ncAnswer ? 'อัพเดท' : 'บันทึก'}
                        </Button>
                    )}
                </form>
            )}
            {error && <p className='paragraph-error'>{error}</p>}
        </NcAnswerStyled>
    )
}

const FlexStyled = styled.div`
    display: flex;
    justify-content: space-between;

    p span {
        margin: 0.5rem;
        font-size: 1.2rem;
    }

    a {
        border-bottom: 1px solid var(--primary-color);
    }

    a:hover {
        font-weight: 600;
        color: var(--primary-color);
    }

    div {
        margin: 0.5rem 0.5rem 0rem 0.5rem;
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`

const ButtonStyled = styled.section`
    margin-top: 2rem;
    width: 30%;
                
    svg {
        margin-bottom: -5px;
    }
`

const FlexUploadStyled = styled.div`
    display: flex;
    margin: -1rem 0rem 1rem;
`

const NcAnswerStyled = styled.div`
    height: 100%;
    background-color: var(--background-dark-color);

    h4 {
        color: var(--white-color);
        font-size: 1.4rem;
        margin: 16px 0;
        border-left: 5px solid #e74c3c;
        padding-left: 16px;
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
                z-index: 2;
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
                background-color: chocolate;
                outline: none;
            }
        }
        
        .title-select-doc {
            margin-top: 14px; 
            margin-left: 17px; 
            padding: 0 .5rem;
            font-size: 1.2rem;
            background-color: var(--background-dark-color);
            position: absolute;
            display: inline-block;
            color: inherit;
        }

        .select-doc {
            margin-top: 1.9rem;
            margin-bottom: .5rem;
            padding: .5rem;
            border: 1px solid var(--border-color);
            display: grid;
            grid-template-columns: repeat(4,1fr);
        }

        .mb-one {
            margin-bottom: 1rem;
        }
    }
`
export default ManageNcAnswer