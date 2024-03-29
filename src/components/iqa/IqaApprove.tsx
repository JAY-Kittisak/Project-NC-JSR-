import React, { useState } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';

import Button from '../Button'
import { RadioStyled } from '../../styles/LayoutStyle'
import { useAlertContext } from '../../state/alert-context';
import { useManageIqa } from '../../hooks/useManageIqa'
import { formatDate } from '../../helpers'
import { StatusNc, ApproveIqa, AddApproveIqaData, Approve, UserInfo } from '../../types'

interface Props {
    iqaId: string
    approve: ApproveIqa | undefined
    iqaStatus: StatusNc
    userInfo: UserInfo
}

const IqaApprove: React.FC<Props> = ({ iqaId, approve, iqaStatus, userInfo}) => {
    const [approveBtn, setApproveBtn] = useState<Approve | undefined>(approve?.approveIqa)

    const { register, handleSubmit, errors } = useForm<AddApproveIqaData>()

    const { setAlertType } = useAlertContext()

    const { updateIqaApprove, loading, error } = useManageIqa()

    const isApproveSelected = (value: string): boolean => approveBtn === value
    const handleApproveClick = (e: React.ChangeEvent<HTMLInputElement>): void => setApproveBtn(e.currentTarget.value as Approve)

    const handleUpdateIqaApprove = handleSubmit(async (data) => {
        if (!userInfo.personnel || userInfo.personnel.length < 0) return alert('!Error No. personnel array.')
        const signature = userInfo.personnel[0]

        const qmrName = signature.personnelName

        const spreadOp = { ...data, qmrName }

        const finished = await updateIqaApprove(iqaId, spreadOp, signature.imageUrl)

        if (finished) {
            setAlertType('success')
        } else {
            alert('Approve nc. ไม่สำเร็จ โปรดแจ้งผู้ดูแลระบบ')
        }
    })

    return (
        <IqaApproveStyled className='box-shadows'>
            <div className="flex-between">
                <h4>QMR</h4>
                {approve?.approvedAt && (
                    <p>{formatDate(approve.approvedAt)}</p>
                )}
            </div>
            <form onSubmit={handleUpdateIqaApprove}>
                <RadioStyled>
                    <div className="group">
                        <input
                            type="radio"
                            name="approveIqa"
                            id="approveYes"
                            value='Yes'
                            disabled={userInfo.dept !== 'QMR'}
                            checked={isApproveSelected('Yes')}
                            onChange={handleApproveClick}
                            ref={register({ required: 'จำเป็นต้องเลือกหนึ่งตัวเลือกด้านบน' })}
                        />
                        <label htmlFor="approveYes">อนุมัติเพื่อปิดประเด็น</label>
                    </div>
                    <div className="group">
                        <input
                            type="radio"
                            name="approveIqa"
                            id="approveNo"
                            value='No'
                            disabled={userInfo.dept !== 'QMR'}
                            checked={isApproveSelected('No')}
                            onChange={handleApproveClick}
                            ref={register({ required: 'จำเป็นต้องเลือกหนึ่งตัวเลือกด้านบน' })}
                        />
                        <label htmlFor="approveNo">ไม่อนุมัติ</label>
                    </div>
                </RadioStyled>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.approveIqa?.message}</p>
                )}
                <div className="form-field">
                    <label htmlFor="approveDetail">
                        ความคิดเห็น QMR
                    </label>
                    <textarea
                        cols={30}
                        rows={3}
                        name="approveDetail"
                        id="approveDetail"
                        disabled={userInfo.dept !== 'QMR'}
                        defaultValue={approve?.approveDetail ? approve.approveDetail : ''}
                        ref={register}
                    />
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.approveDetail?.message}</p>
                    )}
                </div>
                {userInfo.dept === 'QMR' && (
                    (iqaStatus === 'รอปิด') && (
                        <Button
                            type='submit'
                            loading={loading}
                            disabled={loading}
                            width='100%'
                            style={{ margin: '0.5rem 0' }}
                        >
                            บันทึก
                        </Button>
                    )
                )}
            </form>
            {error && <p className='paragraph-error'>{error}</p>}
        </IqaApproveStyled>
    )
}

const IqaApproveStyled = styled.section`
    margin-bottom: .5rem;
    padding: 1rem;
    background-color: var(--background-dark-color);
    min-height: 350px;
`

export default IqaApprove