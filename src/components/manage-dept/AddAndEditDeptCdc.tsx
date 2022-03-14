import React, {useEffect} from 'react'
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useManageDeptCdc } from '../../hooks/useManageDeptCdc';
import Button from '../Button';
import Input from '../Input';

interface Props {
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    deptId: string
}

const AddAndEditDeptCdc: React.FC<Props> = ({setOpenDialog, title, deptId}) => {
    const {register, handleSubmit, errors, reset} = useForm<{topic: string}>()
    
    const {
        editDeptCdc,
        editDeptCdcFinished,
        loading,
        error
    } = useManageDeptCdc()
    
    const handleEditDept = handleSubmit((data) => {
        editDeptCdc(deptId,data.topic)
    })
    
    useEffect(() => {
        if (editDeptCdcFinished) {
            reset()
        }
    }, [ editDeptCdcFinished, reset])


    return (
        <>
            <DeptStyled onClick={() => setOpenDialog(false)}></DeptStyled>

            <ModalStyled className="modal modal--auth-form">
                <div
                    className="modal-close"
                    onClick={() => setOpenDialog(false)}
                >
                    &times;
                </div>

                <h3 className="header--center">
                    แผนก {title}
                </h3>

                <form onSubmit={handleEditDept}>

                    <Input
                        name='topic'
                        label='ประเด็นความไม่สอดคล้อง'
                        error={errors.topic?.message}
                        ref={register({
                            required: 'Topic is required.'
                        })}
                    />

                    <Button
                        loading={loading}
                        width='100%'
                        style={{ margin: '0.5rem 0' }}
                    >
                        บันทึก
                    </Button>
                    {error && <p>{error}</p>}
                </form>

            </ModalStyled>
        </>
    )
}

const DeptStyled = styled.div`
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
    background: white;
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
    }
`;
export default AddAndEditDeptCdc