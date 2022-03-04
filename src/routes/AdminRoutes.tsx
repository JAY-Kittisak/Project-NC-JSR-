import React from 'react'
import { Route, Switch, Redirect } from "react-router-dom";

import NcContextProvider from '../state/nc-context'
import ManageIqAudit from "../pages/ManageIqAudit";
import ManageIqAuditDetail from "../pages/ManageIqAuditDetail";
import ManageNc from "../pages/ManageNc";
import ManageNcDetail from "../pages/ManageNcDetail";
import ManageDepartments from "../pages/ManageDepartments";
import ManageUsers from "../pages/ManageUsers";
import PageNotFound from "../pages/PageNotFound";
import DeptContextProvider from '../state/dept-context'
import { UserInfo } from '../types';
import { isAdmin } from '../helpers'

interface Props { }

const AdminRoutes: React.FC<Props> = (props) => {
    const { userInfo } = props as { userInfo: UserInfo}

    if (!isAdmin(userInfo.role)) 
        return <Redirect to='/' />

    return (
        <Switch>
            <Route path="/admin/manage-iqa/:id">
                <ManageIqAuditDetail />
            </Route>
            <Route path="/admin/manage-iqa">
                <ManageIqAudit />
            </Route>
            <Route path="/admin/manage-nc/:id">
                <ManageNcDetail />
            </Route>
            <Route path="/admin/manage-nc">
                <NcContextProvider>
                    <ManageNc />
                </NcContextProvider>
            </Route>
            <Route path="/admin/manage-dept">
                <DeptContextProvider>
                    <ManageDepartments />
                </DeptContextProvider>
            </Route>
            <Route path="/admin/manage-users">
                <DeptContextProvider>
                    <ManageUsers userInfo={userInfo}/>
                </DeptContextProvider>
            </Route>
            <Route path='*'>
                <PageNotFound />
            </Route>
        </Switch>
    )
}

export default AdminRoutes