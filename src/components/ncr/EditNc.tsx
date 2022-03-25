import React, { useState } from 'react'
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import { AddNcrNotifyData } from '../../types';
import { useDepartmentsContext } from '../../state/dept-context';

interface Props {
  setOpenNcForm: (open: boolean) => void
//   productToEdit: Product | null
//   setNcToEdit: (product: Product | null) => void
}

const EditNc: React.FC<Props> = ({ setOpenNcForm }) => {
    const [dept, setDept] = useState('SC')
    const { 
        register, 
        // handleSubmit, 
        errors, 
        // reset 
    } = useForm<AddNcrNotifyData>()

    console.log(dept)

    const {
        departmentsState: { departments }
    } = useDepartmentsContext()

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

            <h2>แก้ไข NC</h2>

            <form className='form'>
                <div className="form-field">
                    <label htmlFor="containmentName">ชื่อ-นามสกุล ผู้ออก NC</label>
                    <input
                        type="text"
                        name='creatorName'
                        id="creatorName"
                        ref={register({ required: 'โปรดใส่ ชื่อ-นามสกุล ผู้ออก NC' })}
                    />
                </div>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.creatorName?.message}</p>
                )}
                {departments && <div className="form-field">
                            <label htmlFor="dept">
                                ถึงแผนก
                            </label>
                            <select
                                name="dept"
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
                        </div>}

            </form>
        </ModalStyled>
    </>
)
}

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

    h2 {
        margin: 1rem 0;
        font-weight: 500;
        text-align: center;
    }
`
export default EditNc