import React from 'react'
import { Route, Switch, Redirect } from "react-router-dom";

import NcAdminProvider from '../state/nc-admin-context'
import ManageIqAudit from "../pages/ManageIqAudit";
import ManageIqAuditDetail from "../pages/ManageIqAuditDetail";
import ManageNc from "../pages/ManageNc";
import ManageDepartments from "../pages/ManageDepartments";
import ManageDepartmentsCdc from "../pages/ManageDepartmentsCdc";
import ManageUsers from "../pages/ManageUsers";
import NcReport from "../pages/NcReport";
import PageNotFound from "../pages/PageNotFound";
import DeptContextProvider from '../state/dept-context'
import DeptCdcContextProvider from '../state/dept-cdc-context'
import { UserInfo } from '../types';
import { isAdmin } from '../helpers'

interface Props { }

const AdminRoutes: React.FC<Props> = (props) => {
    const { userInfo } = props as { userInfo: UserInfo}

    if (!isAdmin(userInfo.role)) 
        return <Redirect to='/' />

    return (
        <Switch>
            <Route path="/admin/nc-report">
                <NcReport />
            </Route>
            <Route path="/admin/manage-iqa/:id">
                <ManageIqAuditDetail />
            </Route>
            <Route path="/admin/manage-iqa">
                <ManageIqAudit />
            </Route>
            <Route path="/admin/manage-nc">
                <NcAdminProvider>
                    <ManageNc />
                </NcAdminProvider>
            </Route>
            <Route path="/admin/manage-dept">
                <DeptContextProvider>
                    <ManageDepartments />
                </DeptContextProvider>
            </Route>
            <Route path="/admin/manage-dept-Cdc">
                <DeptCdcContextProvider>
                    <ManageDepartmentsCdc />
                </DeptCdcContextProvider>
            </Route>
            <Route path="/admin/manage-users">
                <DeptContextProvider>
                    <DeptCdcContextProvider>
                        <ManageUsers userInfo={userInfo}/>
                    </DeptCdcContextProvider>
                </DeptContextProvider>
            </Route>
            <Route path='*'>
                <PageNotFound />
            </Route>
        </Switch>
    )
}

export default AdminRoutes