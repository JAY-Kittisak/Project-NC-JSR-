import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';
import AttachFileIcon from '@material-ui/icons/AttachFile';


import Button from '../Button'
// import { CheckboxStyled } from '../../styles/LayoutStyle';
import { storageRef } from '../../firebase/config'
import { AddAnswerIqaData, StatusNc, IqaAnswer, AlertNt, AlertType } from '../../types';
import { fileType, formatDate, selectEditedDoc, selectRootDoc } from '../../helpers';
import { useManageAnswerIqa } from '../../hooks/useManageAnswerIqa'
import { useAuthContext } from '../../state/auth-context';

interface Props {
    iqaId: string
    iqaAnswer: IqaAnswer | null
    iqaStatus: StatusNc
    iqaToDept: string
    setAlertWarning: React.Dispatch<React.SetStateAction<AlertNt>>
    setAlertState: React.Dispatch<React.SetStateAction<AlertType>>
}

const ManageIqaAnswer: React.FC<Props> = ({
    iqaId,
    iqaAnswer,
    iqaStatus,
    iqaToDept,
    setAlertWarning,
    setAlertState,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const { register, handleSubmit, errors } = useForm<AddAnswerIqaData>()

    const inputRef = useRef<HTMLInputElement>(null)

    const { authState: { userInfo } } = useAuthContext()

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
        console.table(data)
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
            editedDoc,
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
            editedDoc === data.editedDoc &&
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

    const editBoolean = (userInfo?.dept === iqaToDept) && ((iqaStatus === 'รอตอบ') || (iqaStatus === 'ไม่อนุมัติ'))

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

    return (
        <IqaAnswerStyled className='box-shadows'>
            <h4>ผู้รับผิดชอบการแก้ไข/ป้องกัน</h4>
            <form className="form" onSubmit={iqaAnswer ? handleEditAnswerIqa : handleAddAnswerIqa}>
                {iqaAnswer && (
                    <div className='flex-iqa'>
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
                    </div>
                )}

                {/* ชื่อ-นามสกุล ผู้ตอบ */}
                <div className="form-field">
                    <label htmlFor="answerName">ชื่อ-นามสกุล ผู้ตอบ</label>
                    <input
                        readOnly={!editBoolean}
                        name='answerName'
                        id="answerName"
                        defaultValue={iqaAnswer ? iqaAnswer.answerName : ''}
                        ref={register({ required: 'โปรดใส่ชื่อผู้ตอบ' })}
                    />
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.answerName?.message}</p>
                )}

                {/* การแก้ไขเบื้องต้น */}
                <div className="form-field">
                    <label htmlFor="containmentAction">การแก้ไขเบื้องต้น</label>
                    <textarea
                        readOnly={!editBoolean}
                        cols={30}
                        rows={3}
                        name="containmentAction"
                        id="containmentAction"
                        defaultValue={iqaAnswer ? iqaAnswer.containmentAction : ''}
                        ref={register({ required: 'โปรดใส่การแก้ไขเบื้องต้น' })}
                    />
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.containmentAction?.message}</p>
                )}

                {/* กำหนดเสร็จ */}
                <div className="flex-between">
                    <div className="form-field">
                        <label htmlFor="containmentDueDate">กำหนดเสร็จ</label>
                        <input
                            readOnly={!editBoolean}
                            type="date"
                            name='containmentDueDate'
                            id="containmentDueDate"
                            min="2022-01-01"
                            defaultValue={iqaAnswer ? iqaAnswer.containmentDueDate : ''}
                            ref={register({ required: 'โปรดใส่วันที่กำหนดเสร็จ' })}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="containmentName">ผู้รับผิดชอบ</label>
                        <input
                            readOnly={!editBoolean}
                            name='containmentName'
                            id="containmentName"
                            defaultValue={iqaAnswer ? iqaAnswer.containmentName : ''}
                            ref={register({ required: 'โปรดใส่ชื่อผู้รับผิดชอบ' })}
                        />
                    </div>
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.containmentDueDate?.message}</p>
                )}{errors && (
                    <p className='paragraph-error text-center'>{errors.containmentName?.message}</p>
                )}

                {/* สาเหตุของปัญหา */}
                
                <div className='form-field'>
                        <label htmlFor='editedRootDoc'>สาเหตุ</label>
                        <select name='editedRootDoc' ref={register({ required: 'โปรดเลือกสาเหตุ' })}>
                            <option style={{ display: 'none' }}></option>
                            {selectRootDoc.map((item, i) => (
                                <option key={i} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>


                <div className="form-field">
                    <label htmlFor="rootCause">รายละเอียดสาเหตุ</label>
                    <textarea
                        readOnly={!editBoolean}
                        cols={30}
                        rows={5}
                        name="rootCause"
                        id="rootCause"
                        defaultValue={iqaAnswer ? iqaAnswer.rootCause : ''}
                        ref={register({ required: 'โปรดใส่สาเหตุของปัญหา' })}
                    />
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.rootCause?.message}</p>
                )}

                {/* การแก้ไขปัญหาและการป้องกัน */}
                <div className="form-field">
                    <label htmlFor="correctiveAction">การแก้ไขปัญหาและการป้องกัน</label>
                    <textarea
                        readOnly={!editBoolean}
                        cols={30}
                        rows={3}
                        name="correctiveAction"
                        id="correctiveAction"
                        defaultValue={iqaAnswer ? iqaAnswer.correctiveAction : ''}
                        ref={register({ required: 'โปรดใส่การแก้ไขปัญหาและการป้องกัน' })}
                    />
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.correctiveAction?.message}</p>
                )}

                {/* กำหนดเสร็จ */}
                <div className="flex-between">
                    <div className="form-field">
                        <label htmlFor="correctiveDueDate">กำหนดเสร็จ</label>
                        <input
                            readOnly={!editBoolean}
                            type="date"
                            name='correctiveDueDate'
                            id="correctiveDueDate"
                            min="2022-01-01"
                            defaultValue={iqaAnswer ? iqaAnswer.correctiveDueDate : ''}
                            ref={register({ required: 'โปรดใส่วันที่กำหนดเสร็จ' })}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="correctiveName">ผู้รับผิดชอบ</label>
                        <input
                            readOnly={!editBoolean}
                            name='correctiveName'
                            id="correctiveName"
                            defaultValue={iqaAnswer ? iqaAnswer.correctiveName : ''}
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
                
                    <div className='form-field'>
                        <label htmlFor='editedDoc'>เอกสารที่ต้องปรับปรุงแก้ไขเบื้องต้น</label>
                        <select name='editedDoc' ref={register({ required: 'โปรดเลือกเอกสารที่ต้องปรับปรุงแก้ไข' })}>
                            <option style={{ display: 'none' }}></option>
                            {selectEditedDoc.map((item, i) => (
                                <option key={i} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    {/* {selectEditedDoc.map((item, i) => (
                        <CheckboxStyled key={i}>
                            <div className="group">
                                <input
                                    disabled={!editBoolean}
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
                    ))} */}

                    {/* {iqaAnswer ? (
                        selectEditedDoc.map((item, i) => {
                            return (
                                <CheckboxStyled key={i}>
                                    <div className="group">
                                        <input
                                            disabled={!editBoolean}
                                            type="checkbox"
                                            name="editedDoc"
                                            id={item}
                                            value={item}
                                            defaultChecked={iqaAnswer.editedDoc.includes(item)}
                                            ref={register}
                                        />
                                        <label htmlFor={item}>{item}</label>
                                    </div>
                                </CheckboxStyled>
                            )
                        })
                    ) : (
                        selectEditedDoc.map((item, i) => {
                            return (
                                <CheckboxStyled key={i}>
                                    <div className="group">
                                        <input
                                            disabled={!editBoolean}
                                            type="checkbox"
                                            name="editedDoc"
                                            id={item}
                                            value={item}
                                            ref={register}
                                        />
                                        <label htmlFor={item}>{item}</label>
                                    </div>
                                </CheckboxStyled>
                            )
                        })
                    )} 
                    */}

                {/* <p className='title-select-doc'>เอกสารที่ต้องปรับปรุงแก้ไขเบื้องต้น</p>
                <div className="select-doc">
                    <CheckboxStyled>
                        <div className="group">
                            <input
                                disabled={!editBoolean}
                                type="checkbox"
                                name="editedDoc"
                                id='qp'
                                value='QP'
                                defaultChecked={iqaAnswer?.editedDoc.includes('QP')}
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
                                defaultChecked={iqaAnswer?.editedDoc.includes('SD')}
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
                                defaultChecked={iqaAnswer?.editedDoc.includes('WI')}
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
                                defaultChecked={iqaAnswer?.editedDoc.includes('KM')}
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
                                defaultChecked={iqaAnswer?.editedDoc.includes('OPL')}
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
                                defaultChecked={iqaAnswer?.editedDoc.includes('Risk')}
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
                                defaultChecked={iqaAnswer?.editedDoc.includes('Kaizen')}
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
                                defaultChecked={iqaAnswer?.editedDoc.includes('อื่นๆ...')}
                                ref={register}
                            />
                            <label htmlFor='อื่น'>อื่นๆ...</label>
                        </div>
                    </CheckboxStyled>
                </div> */}

                <div className="form-field mb-one">
                    <label htmlFor="docDetail">เลขที่เอกสาร/เอกสารอื่นๆ(หากมี)</label>
                    <textarea
                        readOnly={!editBoolean}
                        cols={30}
                        rows={3}
                        name="docDetail"
                        id="docDetail"
                        defaultValue={iqaAnswer ? iqaAnswer.docDetail : ''}
                        ref={register}
                    />
                </div> 

                {/* URL */}
                {!((iqaStatus === 'รอตอบ') || (iqaStatus === 'ไม่อนุมัติ')) ?
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
                                            ชื่อไฟล์ (หากมี)
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
        margin-top: 19px; 
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
export default ManageIqaAnswer