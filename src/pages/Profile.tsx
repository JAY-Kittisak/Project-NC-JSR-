import React, { useState } from 'react'
import styled from 'styled-components'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import { MainLayout,InnerLayout, SpinnerStyled } from '../styles/LayoutStyle'
import Title from '../components/Title'
import { useAuthContext } from '../state/auth-context'
import AddAndEditPersonnel from '../components/manage-users/AddAndEditPersonnel';
import { Personnel } from '../types'
import { useManagePersonnel } from '../hooks/useManagePersonnel';
import { storageRef } from '../firebase/config'
import Spinner from '../components/Spinner';

interface Props { }

const Profile: React.FC<Props> = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [personnelToEdit, setPersonnelToEdit] = useState<Personnel | null>(null)

    const { authState: { userInfo } } = useAuthContext()

    const {
        deletePersonnel,
        loading,
        error
    } = useManagePersonnel()
    

    if (loading) return (
        <SpinnerStyled>
            <div className='typography'>
                <Spinner color='#007bff' height={50} width={50} />
                <span>Loading... </span>
            </div>
        </SpinnerStyled>
    )

    if (error) return <h2 className='header--center'>{error}</h2>

    return (
        <MainLayout>
            <Title title={'Profile'} span={'Profile'} />
            <InnerLayout>
                {loading}
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
                            && userInfo?.personnel.map((item,index) => (
                                <div key={index} className='user-item'>
                                    <p>{index+1}. {item.personnelName}</p>
                                    <EditIcon onClick={() => {
                                        setPersonnelToEdit({...item, index})
                                        setOpenDialog(true)
                                    }}/>
                                    <DeleteIcon onClick={() => {
                                        deletePersonnel(index, userInfo)
                                        const oldImageRef = storageRef.child(item.imageRef)
                                        oldImageRef.delete()
                                    }}/>
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

        svg {
            margin-left: .5rem;
            cursor: pointer;
            color: white;
            border-radius: 5px;
            box-shadow: 5px 3px 3px rgba(0, 0, 0, .5);
            transition: all 0.3s ease 0s;
        }

        svg:hover {
            transform: translateY(-3px);
        }

        svg:nth-child(2) {
            background-color: #FFC107;
        }

        svg:nth-child(3) {
            background-color: red;
        }

        p {
            width: 350px;
            font-size: 1.3rem;
            padding-left: 3rem;
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