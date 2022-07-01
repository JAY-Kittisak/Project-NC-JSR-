import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';

import { branchSelect, formatDate } from '../../helpers'
import { UserInfo, Role, Branch, Department } from '../../types'
import { useUpdateUser } from '../../hooks/useUpdateUser'
import Button from '../Button';
import { useDepartmentsContext } from '../../state/dept-context';
import { useDepartmentsCdcContext } from '../../state/dept-cdc-context';

interface Props {
    user: UserInfo
    admin: Role
}

type TableWidth = {
    width?: string
    radius?: string
}

const User: React.FC<Props> = ({
    user: {
        id,
        username,
        email,
        dept,
        branch,
        createdAt,
        role
    },
    admin
}) => {
    const [newRole, setNewRole] = useState(role)
    const [newBranch, setNewBranch] = useState<Branch>(branch)
    const [newDept, setNewDept] = useState(dept)
    const [oldDept, setOldDept] = useState<Department[] | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    const { updateUsers, loading, error } = useUpdateUser()

    const {
        departmentsState: { departments }
    } = useDepartmentsContext()

    const {
        departmentsState: { departments: deptCdc }
    } = useDepartmentsCdcContext()

    const handleUpdateUser = async () => {
        if (
            (role === newRole) &&
            (branch === newBranch) &&
            (dept === newDept)
        ) return

        const finished = await updateUsers(id, newRole, newBranch, newDept)

        if (finished) setIsEditing(false)

        if (error) alert(error)
    }

    useEffect(() => {
        if (newBranch === 'ลาดกระบัง') {
            setOldDept(departments)
        } else {
            setOldDept(deptCdc)
        }
    }, [newBranch, departments, deptCdc])

    return (
        <tr>
            <TdStyled width='20'>
                {username}
            </TdStyled>
            <TdStyled width='20'>
                {email}
            </TdStyled>
            <TdStyled width='10'>
                {!isEditing ? (
                    <p className={dept === 'null' ? 'paragraph-error' : undefined}>{dept}</p>
                ) : (
                    <select onChange={(e) => setNewDept(e.target.value)}>
                        <option value={dept}>{dept}</option>
                        {oldDept && oldDept.map(item => {
                            return (
                                <option key={item.id} value={item.dept}>{item.dept}</option>
                            )
                        })}
                    </select>
                )}
            </TdStyled>
            <TdStyled width='10'>
                {!isEditing ? (
                    <p>{branch}</p>
                ) : (
                    <select defaultValue={branch} onChange={(e) => setNewBranch(e.target.value as Branch)}>
                        {branchSelect.map((value, i) => (
                            <option key={i} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                )}
            </TdStyled>
            <TdStyled width='20'>
                {formatDate(createdAt)}
            </TdStyled>

            <SvgStyled radius={'50%'}>
                {newRole === 'CLIENT' ? (
                    <CheckIcon style={{
                        cursor: isEditing ? 'pointer' : undefined,
                        background: isEditing ? '#27AE60' : '#888',
                    }} />
                ) : isEditing ? (
                    <CloseIcon
                        style={{
                            cursor: 'pointer',
                            background: isEditing ? '#e02d2d' : '#888'
                        }}
                        onClick={() => setNewRole('CLIENT')}
                    />
                ) : (
                    ''
                )}
            </SvgStyled>

            <SvgStyled radius={'50%'}>
                {newRole === 'ADMIN' ? (
                    <CheckIcon style={{
                        cursor: isEditing ? 'pointer' : undefined,
                        background: isEditing ? '#27AE60' : '#888',
                    }} />
                ) : isEditing ? (
                    <CloseIcon
                        style={{
                            cursor: 'pointer',
                            background: isEditing ? '#e02d2d' : '#888'
                        }}
                        onClick={() => setNewRole('ADMIN')}
                    />
                ) : (
                    ''
                )}
            </SvgStyled>

            <SvgStyled radius={'50%'}>
                {newRole === 'SUPER_ADMIN' ? (
                    <CheckIcon style={{
                        cursor: isEditing ? 'pointer' : undefined,
                        background: isEditing ? '#27AE60' : '#888',
                    }} />
                ) : isEditing ? (
                    <CloseIcon
                        style={{
                            cursor: 'pointer',
                            background: isEditing ? '#e02d2d' : '#888'
                        }}
                        onClick={() => setNewRole('SUPER_ADMIN')}
                    />
                ) : (
                    ''
                )}
            </SvgStyled>

            {/* Edit */}
            {admin === 'SUPER_ADMIN' && (
                <SvgStyled radius={'10%'}>
                    {role !== 'SUPER_ADMIN' && (
                        <>
                            {!isEditing ? (
                                <p>
                                    <EditIcon
                                        style={{ cursor: 'pointer', background: '#888' }}
                                        onClick={() => {
                                            setIsEditing(true)
                                        }}
                                    />
                                </p>
                            ) : (
                                <EditStyled>
                                    <Button
                                        width='40%'
                                        height='100%'
                                        className='btn--cancel'
                                        style={{ fontSize: '.8rem' }}
                                        onClick={() => {
                                            setNewRole(role)
                                            setIsEditing(false)
                                        }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        width='40%'
                                        height='100%'
                                        className='btn--confirm'
                                        style={{ fontSize: '.8rem' }}
                                        onClick={handleUpdateUser}
                                        loading={loading}
                                        spinnerHeight={5}
                                        spinnerWidth={5}
                                        disabled={loading}
                                    >
                                        Confirm
                                    </Button>
                                </EditStyled>
                            )}
                        </>
                    )}
                </SvgStyled>
            )}
        </tr>
    )
}

const TdStyled = styled.td`
    margin: 0;
    width: ${(props: TableWidth) => props.width + '%'};
    border: 0.2px solid #596275;
    word-wrap: break-word;
    text-align: center;
    font-size: 1rem;

    select { 
        background-color: var(--background-dark-color);
    }
`

const SvgStyled = styled(TdStyled)`
    padding: 3px;
    svg {
        margin-bottom: -5px;
        width: 20px;
        height: 20px;
        color: #fff;
        border-radius: ${(props: TableWidth) => props.radius};
    }
`

const EditStyled = styled.div`
    button + button {
        margin-left: 10px;
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
`
export default User