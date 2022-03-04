import React from 'react'
import { Route, Switch } from "react-router-dom";

import NonConformances from "../pages/NonConformances";
import NonConformanceDetail from "../pages/NonConformanceDetail";
import NcContextProvider from '../state/nc-context'
import DeptContextProvider from '../state/dept-context'
import AnswerNc from "../pages/AnswerNc";
import PageNotFound from "../pages/PageNotFound";
import { UserInfo } from '../types';

interface Props { }

const NcRouter: React.FC<Props> = (props) => {
    const { userInfo } = props as { userInfo: UserInfo | null }

    return (
        <DeptContextProvider>
            <NcContextProvider>
                <Switch>
                    <Route path="/nc/answer">
                        <AnswerNc />
                    </Route>
                    <Route path="/nc/notify/:id">
                        <NonConformanceDetail />
                    </Route>
                    <Route path="/nc/notify">
                        <NonConformances user={userInfo}/>
                    </Route>
                    <Route path='*'>
                        <PageNotFound />
                    </Route>
                </Switch>
            </NcContextProvider>
        </DeptContextProvider>
    )
}

export default NcRouter