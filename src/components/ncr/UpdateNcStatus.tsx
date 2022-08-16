import React, { useState } from 'react'
import styled from 'styled-components'

import { useManageNcNotify } from '../../hooks/useManageNcNotify'
import { useAlertContext } from '../../state/alert-context'
import { StatusNc } from '../../types'
import { selectStatusNC } from '../../helpers'
import Button from '../Button'

interface Props {
    ncId: string
    ncStatus: StatusNc
    setIsEditing: (value: boolean) => void
}

const UpdateNcStatus: React.FC<Props> = ({ ncId, ncStatus, setIsEditing }) => {
    const [newStatus, setNewStatus] = useState<StatusNc>(ncStatus)

    const { setAlertType } = useAlertContext()

    const { updateStatus, loading, error } = useManageNcNotify()

    const handleUpdateStatus = async () => {
        if (ncStatus === newStatus) return

        const finished = await updateStatus(ncId, newStatus)

        if (finished) {
            setAlertType('success')
            setIsEditing(false)
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

export default UpdateNcStatus