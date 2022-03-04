import React from 'react'
import { Route, Switch } from "react-router-dom";

import HomePage from "../pages/HomePage";
import PageNotFound from "../pages/PageNotFound";
import IqAuditRouter from "./IqAuditRouter"
import NcRouter from "./NcRouter"
import AdminRoutes from "./AdminRoutes"
import PrivateRoute from './PrivateRoute';

interface Props { }

const Routes: React.FC<Props> = () => {
    return (
        <Switch>
            <Route path="/iqa">
                <PrivateRoute>
                    <IqAuditRouter />
                </PrivateRoute>
            </Route>
            <Route path="/nc">
                <PrivateRoute>
                    <NcRouter />
                </PrivateRoute>
            </Route>
            <Route path="/admin">
                <PrivateRoute>
                    <AdminRoutes /> 
                </PrivateRoute>
            </Route>
            <Route exact path='/'>
                <HomePage />
            </Route>
            <Route path='*'>
                <PageNotFound />
            </Route>
        </Switch>
    )
}

export default Routes