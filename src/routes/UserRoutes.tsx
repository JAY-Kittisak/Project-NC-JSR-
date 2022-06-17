import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Profile from '../pages/Profile'
import PageNotFound from '../pages/PageNotFound'

interface Props { }

const UserRoutes: React.FC<Props> = () => {
    return (
        <Switch>
            <Route path='/users/profile'>
                <Profile />
            </Route>
            <Route path='*'>
                <PageNotFound />
            </Route>
        </Switch>
    )
}

export default UserRoutes