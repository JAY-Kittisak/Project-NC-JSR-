import { useAsyncCall } from './useAsyncCall'
import { Role, Branch } from '../types'
import { functions } from '../firebase/config'

export const useUpdateUser = () => {
    const { loading, setLoading, error, setError } = useAsyncCall()

    const updateUsers = async (
        userId: string,
        newRole: Role,
        newBranch: Branch,
        newDept: string,
    ) => {
        try {
            setLoading(true)

            const updateUser = functions.httpsCallable('updateUser')

            await updateUser({
                userId,
                newRole,
                newBranch,
                newDept
            })
            setLoading(false)

            return true
        } catch (err) {
            setError('Sorry, something went wrong')
            setLoading(false)

            return false
        }
    }

    return { updateUsers, loading, error }
}