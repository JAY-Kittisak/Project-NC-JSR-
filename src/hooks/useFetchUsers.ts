import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { UserInfo } from '../types'
import { isAdmin } from '../helpers'
import { snapshotToDoc, userCountsRef, usersRef } from '../firebase'

export const useFetchUsers = (userInfo: UserInfo) => {
    const { loading, setLoading, error, setError} = useAsyncCall()
    const [users, setUsers] = useState<UserInfo[] | null>(null)
    const [userCounts, setUserCounts] = useState(0)

    // Query the users collection
    useEffect(() => {
        if (!userInfo || !isAdmin(userInfo.role)) {
            setUsers(null)
            return
        }

        setLoading(true)

        const unsubscribe = usersRef.orderBy('createdAt', 'desc').onSnapshot({
            next: (snapshot) => {
                const users: UserInfo[] = []
                snapshot.forEach(snapshot => {
                    const user = snapshotToDoc<UserInfo>(snapshot)

                    users.push(user)
                })

                setUsers(users)
                setLoading(false)
            },
            error: err => {
                setError(err.message)
                setUsers(null)
                setLoading(false)
            }
        })

        return () => unsubscribe()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // Query the user-counts/counts
    useEffect(() => {
      if (!userInfo || !isAdmin(userInfo.role)) {
        setUserCounts(0)
        return
      }
  
      const unsubscribe = userCountsRef.doc('counts').onSnapshot({
        next: (snapshot) => {
          const { userCounts } = snapshot.data() as { userCounts: number }
  
          setUserCounts(userCounts)
        },
        error: (err) => {
          setError(err.message)
          setUserCounts(0)
        },
      })
  
      return () => unsubscribe()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { users, userCounts, loading, error }
}