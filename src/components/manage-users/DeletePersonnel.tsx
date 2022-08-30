import React from 'react'
import styled from 'styled-components';

import { useManagePersonnel } from '../../hooks/useManagePersonnel';
import { storageRef } from '../../firebase/config'
import { Personnel, UserInfo } from '../../types'
import Button from '../../components/Button'

interface Props {
    userInfo: UserInfo | null
    personnel: Personnel | null
    setConfirmDialog: (value: boolean) => void
    setPersonnelToDelete: (value: Personnel | null) => void
}

const DeletePersonnel: React.FC<Props> = ({
    userInfo,
    personnel,
    setConfirmDialog,
    setPersonnelToDelete
}) => {
    const {
        deletePersonnel,
        error
    } = useManagePersonnel()

    const handleDeletePersonnel = async () => {
        if (!personnel || !userInfo) return
        if (personnel.index === undefined) return

        const response = await deletePersonnel(personnel.index, userInfo)

        const oldImageRef = storageRef.child(personnel.imageRef)
        oldImageRef.delete()

        if (response) {
            setPersonnelToDelete(null)
            setConfirmDialog(false)
        }
    }

    return (
        <>
            <PersonnelStyled onClick={() => {
                setPersonnelToDelete(null)
                setConfirmDialog(false)
            }}></PersonnelStyled>
            
            <ModalStyled className="modal modal--auth-form">
                <h3 className="header--center">
                    Confirm Delete
                </h3>

                <div className='container'>
                    <p>คุณต้องการลบผู้ใช้งาน</p>
                    <p><span className='name-color'>"{personnel?.personnelName}" </span>ใช่หรือไม่</p>
                    
                    <div className="confirm-button">
                        <Button 
                            className='btn--confirm' 
                            onClick={handleDeletePersonnel}
                        >
                            Confirm
                        </Button>
                        <Button 
                            className='btn--cancel' 
                            onClick={() => {
                                setPersonnelToDelete(null)
                                setConfirmDialog(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>

                <p className='paragraph-error'>{error}</p>
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
    padding: 1rem;
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

    .modal-close:hover {
        color: red;
        background-color: rgba(92, 101, 119, 0.3);
    }

    .header--center {
        font-size: 1.7rem;
        font-weight: 700;
        text-align: center;
        color: var(--primary-color);
    }

    .container {
        margin-top: 1rem;
        width: 300px;

        p, span {
            font-size: 20px;
        }

        .name-color {
            color: red;
        }

        .confirm-button {
            margin: 1rem 1rem 0;
            display: flex;
            justify-content: space-between;

            
            button + button {
                margin-left: 50px;
            }
        }
        

        .btn--confirm {
            background-color: teal;
        }

        .btn--confirm:hover {
            background-color: #019999;
        }

        .btn--cancel {
            background-color: red;
        }

        .btn--cancel:hover {
            background-color: #d32f2f;
        }
    }

`
export default DeletePersonnel