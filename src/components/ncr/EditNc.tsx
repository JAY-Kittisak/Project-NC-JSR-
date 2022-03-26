import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import AttachFileIcon from "@material-ui/icons/AttachFile";

import { AddNcrNotifyData, Branch } from '../../types';
import { useDepartmentsContext } from '../../state/dept-context';
import { useDepartmentsCdcContext } from '../../state/dept-cdc-context';
import Input from '../Input';
import Button from '../Button';

interface Props {
    branch: Branch
    setOpenNcForm: (open: boolean) => void
    //   productToEdit: Product | null
    //   setNcToEdit: (product: Product | null) => void
}

const EditNc: React.FC<Props> = ({ branch, setOpenNcForm }) => {
    const [dept, setDept] = useState('SC')
    const [topic, setTopic] = useState<string[] | undefined>(undefined)
    const {
        register,
        // handleSubmit, 
        errors,
        // reset 
    } = useForm<AddNcrNotifyData>()

    // FIXME: 
    console.log(dept)
    const uploadProgression = 0


    const {
        departmentsState: { departments }
    } = useDepartmentsContext()

    const {
        departmentsState: { departments: deptCdc }
    } = useDepartmentsCdcContext()

    useEffect(() => {

        if (branch === 'ลาดกระบัง') {
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
    }, [branch, departments, deptCdc, dept])

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

                <h3>แก้ไขข้อมูล</h3>

                <form className='form'>
                    <GridStyled>
                        {/* Category */}
                        <Input
                            label='ประเภท'
                            name='category'
                            defaultValue={''}
                            ref={register({ required: 'ประเภท' })}
                            error={errors.category?.message}
                        />
                        {/* Creator Name */}
                        <Input
                            label='ชื่อ-นามสกุล ผู้ออก NC'
                            name='creatorName'
                            defaultValue={''}
                            ref={register({ required: 'โปรดใส่ ชื่อ-นามสกุล ผู้ออก NC' })}
                            error={errors.creatorName?.message}
                        />
                    </GridStyled>

                    <GridStyled>
                        {/* dept */}
                        {branch === 'ลาดกระบัง' ? (
                            departments && <div className='form__input-container'>
                                <label htmlFor='dept' className='form__input-label'>
                                    ถึงแผนก
                                </label>
                                <select
                                    className='input'
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
                            deptCdc && <div className='form__input-container'>
                                <label htmlFor='dept' className='form__input-label'>
                                    ถึงแผนก
                                </label>
                                <select
                                    className='input'
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

                        {/* Topic Type */}
                        <div className='form__input-container'>
                            <label htmlFor='topicType' className='form__input-label'>
                                ประเภทความไม่สอดคล้อง
                            </label>
                            <select
                                name='topicType'
                                className='input'
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
                            rows={5}
                            name='detail'
                            id='detail'
                            ref={register({ required: 'โปรดใส่รายละเอียดความไม่สอดคล้อง/ข้อบกพร่อง' })}
                        />
                    </div>
                    {errors.detail && (
                        <p className='paragraph-error text-center'>{errors.detail?.message}</p>
                    )}

                    {/* Upload File */}
                    <div className='form__input-container'>
                        <label htmlFor='Image' className='form__input-label'>
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
                                    name='imageFileName'
                                    className='input'
                                    readOnly
                                    style={{ width: '70%', cursor: 'pointer' }}
                                    // onClick={handleOpenUploadBox}
                                    // value={
                                    //     selectedFile
                                    //         ? selectedFile.name
                                    //         : productToEdit
                                    //             ? productToEdit.imageFileName
                                    //             : ''
                                    // }
                                    ref={register({ required: 'Product image is required.' })}
                                />
                            )}

                            <ButtonStyled>
                                <Button
                                    width='100%'
                                    type='button'
                                    // onClick={handleOpenUploadBox}
                                    // disabled={loading}
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
                                // ref={inputRef}
                                style={{ display: 'none' }}
                            // onChange={handleSelectFile}
                            />
                        </div>
                    </div>

                    <div className='flex-center'>
                        <Button
                            // type='submit'
                            // loading={loading}
                            width='100%'
                            style={{ margin: '1rem 0rem 0rem' }}
                        >
                            SAVE
                        </Button>
                    </div>
                </form>
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
    
    .form {
        padding: 0;
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