
import React, { useState, useRef, useEffect, ChangeEvent } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import { CheckboxStyled } from '../../styles/LayoutStyle';
import { IqaAnswer, AddAnswerIqaData, StatusNc, AlertNt, AlertType } from '../../types';
import Button from '../Button';
import { useManageAnswerIqa } from '../../hooks/useManageAnswerIqa'
import { selectEditedDoc, selectRootDoc, fileType, formatDate } from '../../helpers'
import { storageRef } from '../../firebase/config'

interface Props {
    iqaId: string
    iqaAnswer: IqaAnswer | null
    iqaStatus: StatusNc
    approveEdit: boolean
    setAlertWarning: React.Dispatch<React.SetStateAction<AlertNt>>
    setAlertState: React.Dispatch<React.SetStateAction<AlertType>>
}

const ManageIqaAnswer: React.FC<Props> = ({
    iqaId,
    iqaAnswer,
    iqaStatus,
    approveEdit,
    setAlertWarning,
    setAlertState
}) => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const { register, handleSubmit, errors } = useForm<AddAnswerIqaData>()

    const inputRef = useRef<HTMLInputElement>(null)

    const {
        uploadFileToStorage,
        addNewAnswerIqa,
        editAnswerIqa,
        setUploadProgression,
        uploadProgression,
        addAnswerIqaFinished,
        editAnswerIqaFinished,
        loading,
        error
    } = useManageAnswerIqa()

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

    const handleAddAnswerIqa = handleSubmit(async (data) => {
        return uploadFileToStorage(
            selectedFile,
            addNewAnswerIqa(
                data,
                iqaId
            )
        )
    })

    const handleEditAnswerIqa = handleSubmit(async (data) => {
        if (!iqaAnswer) return

        const {
            containmentAction,
            containmentDueDate,
            containmentName,
            rootCause,
            correctiveAction,
            correctiveDueDate,
            correctiveName,
            fileAnswerIqaUrl,
            fileAnswerIqaName,
            fileAnswerIqaRef,
            docDetail,
        } = iqaAnswer

        const isNotEdited =
            containmentAction === data.containmentAction &&
            containmentDueDate === data.containmentDueDate &&
            containmentName === data.containmentName &&
            rootCause === data.rootCause &&
            correctiveAction === data.correctiveAction &&
            correctiveDueDate === data.correctiveDueDate &&
            correctiveName === data.correctiveName &&
            fileAnswerIqaName === data.fileAnswerIqaName &&
            docDetail === data.docDetail

        // 1. Nothing Changed
        if (isNotEdited) return

        // 2. fileAnswerNcName is not undefined
        if (fileAnswerIqaUrl && fileAnswerIqaName && fileAnswerIqaRef) {
            // 3. Something changed
            if (fileAnswerIqaName !== data.fileAnswerIqaName) {
                // 3.1 If the file changed
                if (!selectedFile) return

                // Delete the old file
                const oldImageRef = storageRef.child(fileAnswerIqaRef)
                await oldImageRef.delete()

                return uploadFileToStorage(
                    selectedFile,
                    editAnswerIqa(
                        iqaAnswer.id,
                        data,
                        iqaAnswer.iqaId,
                        iqaStatus
                    )
                )
            } else {
                // The file has not been changed
                return editAnswerIqa(
                    iqaAnswer.id,
                    data,
                    iqaAnswer.iqaId,
                    iqaStatus
                )(fileAnswerIqaUrl, fileAnswerIqaRef)
            }

        } else {
            return uploadFileToStorage(
                selectedFile,
                editAnswerIqa(
                    iqaAnswer.id,
                    data,
                    iqaAnswer.iqaId,
                    iqaStatus
                )
            )
        }
    })

    useEffect(() => {
        if (addAnswerIqaFinished) {
            setSelectedFile(null)
            setUploadProgression(0)
            setAlertState('success')
            setAlertWarning('show')
        }
    }, [addAnswerIqaFinished, setUploadProgression, setSelectedFile, setAlertState, setAlertWarning])

    useEffect(() => {
        if (editAnswerIqaFinished) {
            setSelectedFile(null)
            setUploadProgression(0)
            setAlertState('success')
            setAlertWarning('show')
        }
    }, [editAnswerIqaFinished, setUploadProgression, setSelectedFile, setAlertState, setAlertWarning])

    console.log(approveEdit)

    return (
        <IqaAnswerStyled className='box-shadows'>
            <h4>ผู้รับผิดชอบการแก้ไข/ป้องกัน</h4>
            <form className="form" onSubmit={iqaAnswer ? handleEditAnswerIqa : handleAddAnswerIqa}>
                {iqaAnswer?.createdAt && (
                    <FlexStyled>
                        <div>
                            <p><span>วันที่ตอบ :</span></p>
                            <p>{formatDate(iqaAnswer.createdAt)}</p>
                        </div>
                        <div>
                            <p><span>เอกสาร :</span></p>
                            {iqaAnswer.fileAnswerIqaUrl ? (
                                <a
                                    href={iqaAnswer.fileAnswerIqaUrl}
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

                {/* answerName */}
                <div className="form-field">
                    <label htmlFor="answerName">ชื่อ-นามสกุล ผู้ตอบ</label>
                    <input
                        readOnly={approveEdit}
                        name='answerName'
                        id="answerName"
                        defaultValue={iqaAnswer ? iqaAnswer.answerName : ''}
                        ref={register({ required: 'โปรดใส่ชื่อผู้ตอบ' })}
                    />
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.answerName?.message}</p>
                )}

                {/* containmentAction */}
                <div className="form-field">
                    <label htmlFor="containmentAction">การแก้ไขเบื้องต้น</label>
                    <textarea
                        readOnly={approveEdit}
                        cols={30}
                        rows={3}
                        name='containmentAction'
                        id="containmentAction"
                        defaultValue={iqaAnswer ? iqaAnswer.containmentAction : ''}
                        ref={register({ required: 'โปรดใส่ containmentAction' })}
                    />
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.containmentAction?.message}</p>
                )}

                {/* containmentDueDate */}
                <div className='flex-between'>
                    <div className="form-field">
                        <label htmlFor="containmentDueDate">กำหนดเสร็จ</label>
                        <input
                            readOnly={approveEdit}
                            type="date"
                            min="2022-01-01"
                            name='containmentDueDate'
                            id="containmentDueDate"
                            defaultValue={iqaAnswer ? iqaAnswer.containmentDueDate : ''}
                            ref={register({ required: 'โปรดใส่ containmentDueDate' })}
                        />
                    </div>

                    {/* containmentName */}
                    <div className="form-field">
                        <label htmlFor="containmentName">ผู้รับผิดชอบ</label>
                        <input
                            readOnly={approveEdit}
                            name='containmentName'
                            id="containmentName"
                            defaultValue={iqaAnswer ? iqaAnswer.containmentName : ''}
                            ref={register({ required: 'โปรดใส่ containmentName' })}
                        />
                    </div>
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.containmentDueDate?.message}</p>
                )}
                {errors && (
                    <p className='paragraph-error text-center'>{errors.containmentName?.message}</p>
                )}

                {/* editedRootDoc */}
                <div className="flex-root">
                    <p className='title-select-doc'>สาเหตุ</p>
                    <div className="select-root">
                        {selectRootDoc.map((item, i) => (
                            <CheckboxStyled key={i}>
                                <div className="group" style={{ padding: '8px 0px 8px 38px' }}>
                                    <input
                                        disabled={approveEdit}
                                        type="checkbox"
                                        name="editedRootDoc"
                                        id={item}
                                        value={item}
                                        defaultChecked={iqaAnswer?.editedRootDoc?.includes(item)}
                                        ref={register}
                                    />
                                    <label htmlFor={item}>{item}</label>
                                </div>
                            </CheckboxStyled>
                        ))}
                    </div>

                    {/* rootCause */}
                    <div className="form-field">
                        <label htmlFor="rootCause">รายละเอียดสาเหตุ</label>
                        <textarea
                            readOnly={approveEdit}
                            cols={30}
                            rows={11}
                            name="rootCause"
                            id="rootCause"
                            defaultValue={iqaAnswer ? iqaAnswer.rootCause : ''}
                            ref={register({ required: 'โปรดใส่ rootCause' })}
                        />
                    </div>
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.rootCause?.message}</p>
                )}

                {/* correctiveAction */}
                <div className="form-field">
                    <label htmlFor="correctiveAction">การแก้ไขปัญหาและการป้องกัน</label>
                    <textarea
                        readOnly={approveEdit}
                        cols={30}
                        rows={3}
                        name='correctiveAction'
                        id="correctiveAction"
                        defaultValue={iqaAnswer ? iqaAnswer.correctiveAction : ''}
                        ref={register({ required: 'โปรดใส่ correctiveAction' })}
                    />
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.correctiveAction?.message}</p>
                )}

                {/* correctiveDueDate */}
                <div className='flex-between'>
                    <div className="form-field">
                        <label htmlFor="correctiveDueDate">กำหนดเสร็จ</label>
                        <input
                            readOnly={approveEdit}
                            type="date"
                            min="2022-01-01"
                            name='correctiveDueDate'
                            id="correctiveDueDate"
                            defaultValue={iqaAnswer ? iqaAnswer.correctiveDueDate : ''}
                            ref={register({ required: 'โปรดใส่ correctiveDueDate' })}
                        />
                    </div>
                    {/* correctiveName */}
                    <div className="form-field">
                        <label htmlFor="correctiveName">ผู้รับผิดชอบ</label>
                        <input
                            readOnly={approveEdit}
                            name='correctiveName'
                            id="correctiveName"
                            defaultValue={iqaAnswer ? iqaAnswer.correctiveName : ''}
                            ref={register({ required: 'โปรดใส่ correctiveName' })}
                        />
                    </div>
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.correctiveDueDate?.message}</p>
                )}
                {errors && (
                    <p className='paragraph-error text-center'>{errors.correctiveName?.message}</p>
                )}

                {/* editedDoc */}
                <p className='title-select-doc'>เอกสารที่ต้องปรับปรุงแก้ไขเบื้องต้น(หากมี)</p>
                <div className="select-doc">
                    {selectEditedDoc.map((item, i) => (
                        <CheckboxStyled key={i}>
                            <div className="group">
                                <input
                                    disabled={approveEdit}
                                    type="checkbox"
                                    name="editedDoc"
                                    id={item}
                                    value={item}
                                    defaultChecked={iqaAnswer?.editedDoc?.includes(item)}
                                    ref={register}
                                />
                                <label htmlFor={item}>{item}</label>
                            </div>
                        </CheckboxStyled>
                    ))}
                </div>

                {/* docDetail */}
                <div className="form-field">
                    <label htmlFor="docDetail">เลขที่เอกสาร/เอกสารอื่นๆ(หากมี)</label>
                    <textarea
                        readOnly={approveEdit}
                        cols={30}
                        rows={3}
                        name='docDetail'
                        id="docDetail"
                        defaultValue={iqaAnswer ? iqaAnswer.docDetail : ''}
                        ref={register}
                    />
                </div>

                {errors && (
                    <p className='paragraph-error text-center'>{errors.docDetail?.message}</p>
                )}

                {
                    !((iqaStatus === 'รอตอบ') || (iqaStatus === 'ไม่อนุมัติ')) ?
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
                                                // uploadProgression={uploadProgression}
                                                value={`${uploadProgression}%`}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <label>
                                                ชื่อไฟล์
                                            </label>
                                            <input
                                                readOnly
                                                type='text'
                                                name='fileAnswerIqaName'
                                                style={{ cursor: 'pointer' }}
                                                onClick={handleOpenUploadBox}
                                                value={
                                                    selectedFile
                                                        ? selectedFile.name
                                                        : iqaAnswer?.fileAnswerIqaName
                                                            ? iqaAnswer.fileAnswerIqaName
                                                            : ''
                                                }
                                                ref={register}
                                            />
                                            {/* ref={register({ required: 'โปรดแนบไฟล์ของคุณ' })}
                                            {errors && (
                                                <p className='paragraph-error text-center'>{errors.fileAnswerIqaName?.message}</p>
                                            )} */}
                                            {errors && (
                                                <p className='paragraph-error text-center'>{errors.fileAnswerIqaName?.message}</p>
                                            )}
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
                                    disabled={approveEdit}
                                    ref={inputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleSelectFile}
                                />
                            </FlexUploadStyled>

                        )}

                {!approveEdit && (
                    <Button
                        type='submit'
                        loading={loading}
                        disabled={loading}
                        width='100%'
                    >
                        {iqaAnswer ? 'อัพเดท' : 'บันทึก'}
                    </Button>
                )}
            </form>
            {error && <p className='paragraph-error'>{error}</p>}
        </IqaAnswerStyled>
    )
}

const IqaAnswerStyled = styled.div`
    background-color: var(--background-dark-color);
    
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

    .select-root {
        margin: 1.9rem 1rem .5rem 0rem;
        padding: .5rem 0rem 0rem .5rem;
        border: 1px solid var(--border-color);
        width: 450px;
    }

    .flex-root {
        display: flex;
        width: 100%;
    }

`
const FlexUploadStyled = styled.div`
    display: flex;
    margin: -1rem 0rem 1rem;
`

const ButtonStyled = styled.section`
    margin-top: 2rem;
    width: 30%;

    svg {
        margin-bottom: -5px;
    }
`

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

export default ManageIqaAnswer