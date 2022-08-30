import React, { useState } from 'react'
import styled from 'styled-components'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import { MainLayout, InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import { useAuthContext } from '../state/auth-context'
import AddAndEditPersonnel from '../components/manage-users/AddAndEditPersonnel';
import { Personnel } from '../types'
import DeletePersonnel from '../components/manage-users/DeletePersonnel';

interface Props { }

const Profile: React.FC<Props> = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [personnelToEdit, setPersonnelToEdit] = useState<Personnel | null>(null)
    const [confirmDialog, setConfirmDialog] = useState(false)
    const [personnelToDelete, setPersonnelToDelete] = useState<Personnel | null>(null)

    const { authState: { userInfo } } = useAuthContext()

    return (
        <MainLayout>
            <Title title={'Profile'} span={'Profile'} />
            <InnerLayout>
                <ProfileStyled>
                    <UserDetail>
                        <p><span>Username :</span> &nbsp;{userInfo?.username}</p>
                        <p><span>Email :</span> &nbsp;{userInfo?.email}</p>
                    </UserDetail>
                    <UserDetail>
                        <p><span>Branch :</span> &nbsp;{userInfo?.branch}</p>
                        <p><span>Department :</span> &nbsp;{userInfo?.dept}</p>
                    </UserDetail>

                    <UserCard>
                        <h4>รายชื่อผู้ใช้งาน</h4>

                        {userInfo?.personnel
                            && (userInfo?.personnel?.length > 0)
                            && userInfo?.personnel.map((item, index) => (
                                <div key={index} className='user-item'>
                                    <p>{index + 1}. {item.personnelName}</p>
                                    <div className='icon edit-icon'>
                                        <div className='tooltip'>Edit</div>
                                        <span onClick={() => {
                                            setPersonnelToEdit({ ...item, index })
                                            setOpenDialog(true)
                                        }}>
                                            <EditIcon/>
                                        </span>
                                    </div>
                                    <div className='icon delete-icon'>
                                        <div className='tooltip'>Delete</div>
                                        <span onClick={() => {
                                            setPersonnelToDelete({ ...item, index })
                                            setConfirmDialog(true)
                                        }}>
                                            <DeleteIcon/>
                                        </span>
                                    </div>
                                </div>
                            ))}

                        <div className='button-add'>
                            <ButtonAdd onClick={() => setOpenDialog(true)}>
                                เพิ่มผู้ใช้งาน
                            </ButtonAdd>
                        </div>
                    </UserCard>

                    {openDialog &&
                        <AddAndEditPersonnel
                            userInfo={userInfo}
                            setOpenDialog={setOpenDialog}
                            personnelToEdit={personnelToEdit}
                            setPersonnelToEdit={setPersonnelToEdit}
                        />
                    }
                    {confirmDialog &&
                        <DeletePersonnel
                            userInfo={userInfo}
                            personnel={personnelToDelete}
                            setConfirmDialog={setConfirmDialog}
                            setPersonnelToDelete={setPersonnelToDelete}
                        />}
                </ProfileStyled>
            </InnerLayout>
        </MainLayout>
    )
}

const UserDetail = styled.div`
    margin: 0 1rem;
    padding: 0 1rem;
    background-color: var(--background-dark-color);
    display: grid;
    grid-template-columns: repeat(2,1fr);

    p, span {
        font-size: 1.3rem;
    }

    p span {
        font-weight: 600;
    }
`

const UserCard = styled.div`
    margin: 1rem 3rem;
    padding: 1rem;
    border-radius: 15px;
    border: 1px solid var(--border-color);

    h4 {
        color: var(--white-color);
        font-size: 1.4rem;
        margin: 16px 0;
        border-left: 5px solid #e74c3c;
        padding-left: 16px;
    }

    .user-item {
        display: flex;
        align-items: center;
        padding-top: .5rem;
        
        p {
            width: 350px;
            font-size: 1.3rem;
            padding-left: 3rem;
        } 

        .icon {
            position: relative;
            margin: 0 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            z-index: 2;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);
        }

        .icon .tooltip {
            position: absolute;
            top: -30px;
            background-color: #fff;
            color: #fff;
            font-size: 16px;
            padding: 5px 15px;
            border-radius: 15px;
            box-shadow: 0 10px 10px rgba(0,0,0,0.1);
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);
        }

        .tooltip:before {
            position: absolute;
            content: "";
            height: 10px;
            width: 10px;
            background-color: #fff;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            transition: all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);
        }

        .icon:hover .tooltip {
            top: -45px;
            opacity: 1;
            pointer-events: auto;
        }

        .icon span {
            position: relative;
            padding-top: 5px;
            text-align: center;
            border-radius: 3px;
            z-index: 2;
        }

        .icon:hover span{
            color: #fff;
        }
        
        .icon:hover span,
        .icon:hover .tooltip {
            text-shadow: 0px -1px 0px rgba(0,0,0,0.4);
        }

        .edit-icon:hover span,
        .edit-icon:hover .tooltip,
        .edit-icon:hover .tooltip:before {
            background-color: #FFA500;
        }

        .delete-icon:hover span,
        .delete-icon:hover .tooltip,
        .delete-icon:hover .tooltip:before {
            background-color: #DE463B;
        }
    }

    .button-add {
        margin: 1rem;
        text-align: center;
    }
`

const ButtonAdd = styled.button`
    width: 140px;
    height: 45px;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 600;
    color: inherit;
    background-color: var(--background-dark-color);
    border: none;
    border-radius: 25px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;

    &:hover {
        background-color: #2EE59D;
        box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
        color: #fff;
        transform: translateY(-7px);
    }
`

const ProfileStyled = styled.section`
    padding: 0 3rem;
`

export default Profile