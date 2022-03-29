import React, { useState } from 'react'
import styled from 'styled-components'

import { useManageNcNotify } from '../../hooks/useManageNcNotify'
import { StatusNc, AlertNt, AlertType  } from '../../types'
import { selectStatusNC } from '../../helpers'
import Button from '../Button'

interface Props {
    ncId: string
    ncStatus: StatusNc
    setAlertWarning: React.Dispatch<React.SetStateAction<AlertNt>>
    setAlertState: React.Dispatch<React.SetStateAction<AlertType>>
}

const UpdateNcStatus: React.FC<Props> = ({ ncId, ncStatus, setAlertWarning ,setAlertState}) => {
    const [newStatus, setNewStatus] = useState<StatusNc>(ncStatus)

    const { updateStatus, loading, error } = useManageNcNotify()

    const handleUpdateStatus = async () => {
        if (ncStatus === newStatus) return

        const finished = await updateStatus(ncId, newStatus)

        if (finished) {
            setAlertState('success')
            setAlertWarning('show')
        }

        if (error) alert(error)
    }

    return (
        <SectionStyled>
            <SelectStyled
                name='selectStatusNC'
                className='input'
                defaultValue={ncStatus}
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
                height='30px'
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
    }

    .btn--confirm:hover {
        background-color: #019999;
    }
`

const SelectStyled = styled.select`
    color: inherit;
    background: transparent;
    font-size: 1.2rem;
    border-radius: 5px;
    margin-right: 10px;
`

export default UpdateNcStatus