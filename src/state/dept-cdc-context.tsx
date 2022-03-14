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
import { departmentCdcRef, snapshotToDoc } from '../firebase'

interface Props { }

type DepartmentsState = {
    departments: Department[] | null
    loading: boolean
    error: string
}

type DepartmentsDispatch = {
    setDepartments: Dispatch<SetStateAction<Department[] | null>>
}

const DepartmentsCdcStateContext = createContext<DepartmentsState | undefined>(undefined)
const DepartmentsCdcDispatchContext = createContext<DepartmentsDispatch | undefined>(undefined)

const DeptCdcContextProvider: React.FC<Props> = ({ children }) => {
    const [departments, setDepartments] = useState<Department[] | null>(null)
    const { loading, setLoading, error, setError } = useAsyncCall()
    const {authState: { userInfo }} = useAuthContext()

    useEffect(() => {
        
        setLoading(true)

        if (!userInfo) {
            return setDepartments(null)
        } else {
            const unsubscribe = departmentCdcRef
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
        <DepartmentsCdcStateContext.Provider value={{ departments, loading, error }}>
            <DepartmentsCdcDispatchContext.Provider value={{ setDepartments }}>
                {children}
            </DepartmentsCdcDispatchContext.Provider>
        </DepartmentsCdcStateContext.Provider>
    )
}

export default DeptCdcContextProvider

export const useDepartmentsCdcContext = () => {
    const departmentsState = useContext(DepartmentsCdcStateContext)
    const departmentsDispatch = useContext(DepartmentsCdcDispatchContext)

    if (departmentsState === undefined || departmentsDispatch === undefined) {
        throw new Error('useDepartmentsContext must be used within DepartmentsContextProvider.')
    }

    return {departmentsState, departmentsDispatch}
}