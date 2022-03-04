import React from 'react'
import styled from 'styled-components'
import { MainLayout,InnerLayout, SpinnerStyled } from '../styles/LayoutStyle'
import Title from '../components/Title'
import { useFetchUsers } from '../hooks/useFetchUsers'
import { UserInfo } from '../types'
import Spinner from '../components/Spinner'
import User from '../components/manage-users/User'

interface Props {
    userInfo: UserInfo
}

const ManageUsers: React.FC<Props> = ({ userInfo }) => {
    const { users, loading, error} = useFetchUsers(userInfo)

    if (loading) return (
        <SpinnerStyled>
            <div className="typography">
                <Spinner color='gray' height={50} width={50} /> <span>Loading... </span>
            </div>
        </SpinnerStyled>
    )

    if (error) return (
        <ErrorStyled>{error}</ErrorStyled>
    )

    if (!users || users.length === 0 ) return (
        <ErrorStyled>{error}</ErrorStyled>
    )

    return (
        <MainLayout>
            <Title title={'Manage Users'} span={'Manage Users'} />
                <InnerLayout className='manage-users'>
                    <TableStyled>
                        <thead>
                            <tr>
                                <ThStyled rowSpan={2}>Name</ThStyled>
                                <ThStyled rowSpan={2}>Email</ThStyled>
                                <ThStyled rowSpan={2}>แผนก</ThStyled>
                                <ThStyled rowSpan={2}>สาขา</ThStyled>
                                <ThStyled rowSpan={2}>Created At</ThStyled>
                                <ThStyled colSpan={3}>Role</ThStyled>
                            </tr>
                            <tr>
                                <SubThStyled>Client</SubThStyled>
                                <SubThStyled>Admin</SubThStyled>
                                <SubThStyled>Super</SubThStyled>
                            </tr>

                        </thead>

                        <tbody>
                            {users.map(user => <User key={user.id} user={user} admin={userInfo} />)}
                        </tbody>
                    </TableStyled>
                </InnerLayout>
        </MainLayout>
    )
}

const TableStyled = styled.table`
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 1rem;
    text-align: center;
    background-color: var(--background-dark-color);
`

const ThStyled = styled.td`
    margin: 0;
    padding: 0.5rem;
    width: 15%;
    border: 0.2px solid #596275;
    word-wrap: break-word;
    font-weight: 600;

    @media screen and (max-width: 600px) {
        display: none;
    }
`

const SubThStyled = styled(ThStyled)`
    font-size: .9rem;
`

const ErrorStyled = styled.h2`
    color: red;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 80%;
`
export default ManageUsers