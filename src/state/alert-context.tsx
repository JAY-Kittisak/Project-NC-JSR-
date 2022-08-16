import React, {
    ReactElement,
    Dispatch,
    SetStateAction,
    createContext,
    useState,
    useEffect,
    useContext
} from 'react'

import AlertSuccess from '../components/dialogs/AlertSuccess'
import AlertWarning from '../components/dialogs/AlertWarning'

interface Props { }

type AlertType = 'close' | 'success' | 'warning'
type Alerts ={
    [key in AlertType]: ReactElement | null
}

type AlertState = {
    alertState: ReactElement | null
}

type AlertDispatch = {
    setAlertType: Dispatch<SetStateAction<AlertType>>
}

const AlertStateContext = createContext<AlertState | undefined>(undefined)
const AlertDispatchContext = createContext<AlertDispatch | undefined>(undefined)

const alerts: Alerts = {
    close: null,
    success: <AlertSuccess />,
    warning: <AlertWarning />
}

const AlertContextProvider: React.FC<Props> = ({ children }) => {
    const [alertState, setAlertState] = useState<ReactElement | null>(null)
    const [alertType, setAlertType] = useState<AlertType>('close')

    useEffect(() => {
        if (alertType === 'close') return
        
        setAlertState(alerts[alertType])

        const hideAlert = setTimeout(() => {
            setAlertState(alerts['close'])
            setAlertType('close')
        }, 6000);

        return () => clearTimeout(hideAlert)

    },[alertType])

    return (
        <AlertStateContext.Provider value={{alertState}}>
            <AlertDispatchContext.Provider value={{setAlertType}}>
                {children}
            </AlertDispatchContext.Provider>
        </AlertStateContext.Provider>
    )
}

export default AlertContextProvider

export const useAlertContext = () => {
    const alertStateA = useContext(AlertStateContext)
    const alertDispatch = useContext(AlertDispatchContext)

    if ((alertStateA === undefined) || (alertDispatch === undefined)) throw new Error(
        'useAlertContext must be used within the AlertContextProvider.'
    )

    return { ...alertStateA, ...alertDispatch }
}