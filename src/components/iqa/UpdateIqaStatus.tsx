import React, {useState} from 'react'
import styled from 'styled-components'

import Button from '../Button'
import { StatusNc } from '../../types'
import { selectStatusNC } from '../../helpers'
import { useManageIqa } from '../../hooks/useManageIqa';
import { useAlertContext } from '../../state/alert-context'

interface Props {
    iqaId: string
    iqaStatus: StatusNc
    setIsEditing: (value: boolean) => void
}

const UpdateIqaStatus: React.FC<Props> = ({ iqaId, iqaStatus, setIsEditing }) => {
    const [newStatus, setNewStatus] = useState<StatusNc>(iqaStatus)

    const { setAlertType } = useAlertContext()

    const { updateIqaStatus, loading, error} = useManageIqa()

    const handleUpdateStatus = async () => {
        if (iqaStatus === newStatus) return

        const finished = await updateIqaStatus(iqaId, newStatus)

        if (finished) {
            setAlertType('success')
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