import React, {useState} from 'react'
import styled from 'styled-components'

import Button from '../Button'
import { StatusNc, AlertNt, AlertType } from '../../types'
import { selectStatusNC } from '../../helpers'
import { useManageIqa } from '../../hooks/useManageIqa';

interface Props {
    iqaId: string
    iqaStatus: StatusNc
    setAlertWarning: React.Dispatch<React.SetStateAction<AlertNt>>
    setAlertState: React.Dispatch<React.SetStateAction<AlertType>>
    setIsEditing: (value: boolean) => void
}

const UpdateIqaStatus: React.FC<Props> = ({ iqaId, iqaStatus, setAlertWarning, setAlertState, setIsEditing }) => {
    const [newStatus, setNewStatus] = useState<StatusNc>(iqaStatus)

    const { updateIqaStatus, loading, error} = useManageIqa()

    const handleUpdateStatus = async () => {
        if (iqaStatus === newStatus) return

        const finished = await updateIqaStatus(iqaId, newStatus)

        if (finished) {
            setAlertState('success')
            setAlertWarning('show')
            setIsEditing(false)
        }

        if (error) alert(error)
    }

    return (
        <SectionStyled>
            <SelectStyled
                name='selectStatusIqa'
                className='input'
                defaultValue={iqaStatus}
                onChange={(e) => setNewStatus(e.target.value as StatusNc)}
            >
                <option style={{ display: 'none' }}></option>
                {selectStatusNC.map((val) => (
                    <option key={val} value={val}>
                        {val}
                    </option>
                ))}
            </SelectStyled>
            <Button
                width='70px'
                height='25px'
                className='btn--confirm'
                onClick={handleUpdateStatus}
                loading={loading}
                spinnerHeight={5}
                spinnerWidth={5}
                disabled={loading}
            >
                บันทึก
            </Button>
        </SectionStyled>
    )
}
const SectionStyled = styled.section`
    .btn--confirm {
        background-color: teal;
        margin-left: 10px;
    }

    .btn--confirm:hover {
        background-color: #019999;
    }
`

const SelectStyled = styled.select`
    color: inherit;
    background: transparent;
    border-radius: 5px;
`

export default UpdateIqaStatus