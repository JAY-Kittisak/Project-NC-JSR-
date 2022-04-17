import React from 'react'
import { Route, Switch } from "react-router-dom";

import IqAudit from "../pages/IqAudit";
import IqAuditDetail from "../pages/IqAuditDetail";
import DashboardIqa from '../pages/DashboardIqa';
import AnswerIqa from '../pages/AnswerIqa';
import PageNotFound from "../pages/PageNotFound";
import DeptContextProvider from '../state/dept-context'
import DeptCdcContextProvider from '../state/dept-cdc-context'
import IqaContextProvider from '../state/iqa-context'

interface Props { }

const IqAuditRouter: React.FC<Props> = () => {
    return (
        <DeptContextProvider>
            <DeptCdcContextProvider>
                <IqaContextProvider>
                    <Switch>
                        <Route path="/iqa/dashboard">
                            <DashboardIqa />
                        </Route>
                        <Route path="/iqa/answer">
                            <AnswerIqa />
                        </Route>
                        <Route path="/iqa/notify/:id">
                            <IqAuditDetail />
                        </Route>
                        <Route path="/iqa/notify">
                            <IqAudit />
                        </Route>
                        <Route path='*'>
                            <PageNotFound />
                        </Route>
                    </Switch>
                </IqaContextProvider>
            </DeptCdcContextProvider>
        </DeptContextProvider>
    )
}

export default IqAuditRouter