import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import styled from 'styled-components'

import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import Button from '../components/Button';
import DeptItemCdc from '../components/manage-dept/DeptItemCdc'
import Input from '../components/Input';
import { AddDepartment, AlertNt, AlertType} from '../types';
import { useManageDeptCdc } from '../hooks/useManageDeptCdc';
import AlertNotification from '../components/dialogs/AlertNotification';

interface Props { }

const ManageDepartmentsCdc: React.FC<Props> = () => {
    const [alertWarning, setAlertWarning] = useState<AlertNt>('hide');
    const [alertState, setAlertState] = useState<AlertType>('success');

    const {
        addNewDeptCdc,
        addDeptCdcFinished,
        loading,
        error
    } = useManageDeptCdc()
    
    const { 
        register, 
        handleSubmit, 
        errors, 
        reset 
    } = useForm<AddDepartment>()

    const handleAddDept = handleSubmit((data) => {
        addNewDeptCdc(data)
    })

    useEffect(() => { 
        if (addDeptCdcFinished) {
            reset()
            setAlertState('success')
            setAlertWarning('show')
        }
    },[addDeptCdcFinished,reset] )

    return (
        <MainLayout>
            <AlertNotification
                alertWarning={alertWarning}
                setAlertWarning={setAlertWarning}
                alert={alertState}
            />
            <Title title={'Manage Dept'} span={'Manage Departments'} />
            <ManageDeptStyled>
                <InnerLayout>
                    <div className="nc-notify-title">
                        <h3>ประเด็นความไม่สอดคล้อง</h3>
                    </div>

                    <form className="form" onSubmit={handleAddDept}>
                        <div className="form-field">
                            <label htmlFor="dept">
                                เพิ่มแผนกที่จะกำหนดประเด็น
                            </label>
                            <Input
                                name="dept"
                                placeholder='ชื่อแผนก(ตัวย่อ)...'
                                ref={register({ 
                                    required: 'Dept is required.',
                                    minLength: {
                                        value: 2,
                                        message: 'Department name must be at least 3 characters.'
                                    },
                                    maxLength: {
                                        value: 3,
                                        message: 'Department name be not more than 200 characters.'
                                    }
                                })}
                                error={errors.dept?.message}
                            />
                        </div>
                        <Button 
                            type='submit' 
                            loading={loading}
                            width='25%' 
                            style={{ marginLeft: '1rem' }}
                        >
                            SAVE
                        </Button>
                    </form>
                    {error && <p className='paragraph-error'>{error}</p>}

                    <DeptItemCdc />

                </InnerLayout>
            </ManageDeptStyled>
        </MainLayout>
    )
}

const ManageDeptStyled = styled.div`
    .nc-notify-title{
        h3 {
            color: var(--white-color);
            font-size: 1.4rem;
            margin: 16px 0;
            border-left: 5px solid #e74c3c;
            padding-left: 16px;
        }
    }

    .form{
        display: flex;
        align-items: center;
        width: 100%;

        @media screen and (max-width: 502px){
            width: 100%;
        }

        button {
            margin-top: 1rem;
        }

        div:first-child {
            margin-left: 1rem;
            margin-right: 1rem;
        }

        .form-field{

            margin-top: 1rem;
            position: relative;
            width: 30%;
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
                height: 50px;
                padding: 0 15px;
                width: 100%;
                color: inherit;
                box-shadow: none;
            }
        }
    }
`
export default ManageDepartmentsCdc