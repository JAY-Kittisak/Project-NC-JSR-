import React, {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useState,
    useEffect,
} from 'react'

import { useAsyncCall } from '../hooks/useAsyncCall'
import { Department } from '../types'
import { useAuthContext } from './auth-context'
import { departmentRef, snapshotToDoc } from '../firebase'

interface Props { }

type DepartmentsState = {
    departments: Department[] | null
    loading: boolean
    error: string
}

type DepartmentsDispatch = {
    setDepartments: Dispatch<SetStateAction<Department[] | null>>
}

const DepartmentsStateContext = createContext<DepartmentsState | undefined>(undefined)
const DepartmentsDispatchContext = createContext<DepartmentsDispatch | undefined>(undefined)

const DeptContextProvider: React.FC<Props> = ({ children }) => {
    const [departments, setDepartments] = useState<Department[] | null>(null)
    const { loading, setLoading, error, setError } = useAsyncCall()
    const {authState: { userInfo }} = useAuthContext()

    useEffect(() => {
        
        setLoading(true)

        if (!userInfo) {
            return setDepartments(null)
        } else {
            const unsubscribe = departmentRef
                .orderBy('dept', 'desc')
                .onSnapshot({
                    next: (snapshots) => {
                        const departments: Department[] = []
                        snapshots.forEach(snapshot => {
                            const dept = snapshotToDoc<Department>(snapshot)
                            departments.push(dept)
                        })

                        setDepartments(departments)
                        setLoading(false)
                    },
                    error: (err) => {
                        setError(err.message)
                        setDepartments(null)
                        setLoading(false)
                    }
            })
            return () => unsubscribe()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <DepartmentsStateContext.Provider value={{ departments, loading, error }}>
            <DepartmentsDispatchContext.Provider value={{ setDepartments }}>
                {children}
            </DepartmentsDispatchContext.Provider>
        </DepartmentsStateContext.Provider>
    )
}

export default DeptContextProvider

export const useDepartmentsContext = () => {
    const departmentsState = useContext(DepartmentsStateContext)
    const departmentsDispatch = useContext(DepartmentsDispatchContext)

    if (departmentsState === undefined || departmentsDispatch === undefined) {
        throw new Error('useDepartmentsContext must be used within DepartmentsContextProvider.')
    }

    return {departmentsState, departmentsDispatch}
}