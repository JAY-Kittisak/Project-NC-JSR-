import React, { useState } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';

import Button from '../Button'
import { useManageNcNotify } from '../../hooks/useManageNcNotify'
import { useAlertContext } from '../../state/alert-context'
import { formatDate } from '../../helpers'
import { RadioStyled } from '../../styles/LayoutStyle'
import { StatusNc, ApproveNc, AddApproveNcData, Approve , UserInfo } from '../../types'

interface Props {
    ncId: string
    approve: ApproveNc | undefined
    ncStatus: StatusNc
    userInfo: UserInfo
}

const NcApprove: React.FC<Props> = ({ ncId, approve, ncStatus, userInfo }) => {
    const [approveBtn, setApproveBtn] = useState<Approve | undefined>(approve?.approveNc)

    const { register, handleSubmit, errors } = useForm<AddApproveNcData>()
    
    const { setAlertType } = useAlertContext()

    const {
        updateNcApprove,
        loading,
        error
    } = useManageNcNotify()

    const isApproveSelected = (value: string): boolean => approveBtn === value
    const handleApproveClick = (e: React.ChangeEvent<HTMLInputElement>): void => setApproveBtn(e.currentTarget.value as Approve)

    
    const handleUpdateNcApprove = handleSubmit(async (data) => {
        if (!userInfo.personnel || userInfo.personnel.length < 0) return alert('!Error No. personnel array.')
        const signature = userInfo.personnel[0]

        const qmrName = signature.personnelName

        const spreadOp = { ...data, qmrName }

        const finished = await updateNcApprove(ncId, spreadOp, signature.imageUrl)

        if (finished) {
            setAlertType('success')
        } else {
            alert('Approve nc. ไม่สำเร็จ โปรดแจ้งผู้ดูแลระบบ')
        }
    })

    return (
        <NcApproveStyled className='box-shadows'>
            <div className="flex-between">
                <h4>QMR</h4>
                {approve?.approvedAt && (
                    <p>{formatDate(approve.approvedAt)}</p>
                )}
            </div>
            <form onSubmit={handleUpdateNcApprove} >
                <RadioStyled>
                    <div className="group">
                        <input
                            type="radio"
                            name="approveNc"
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
                            name="approveNc"
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
                    <p className='paragraph-error text-center'>{errors.approveNc?.message}</p>
                )}
                <div className="form-field">
                    <label htmlFor="approveDetail">
                        ข้อเสนอแนะเพิ่มเติม
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
                    (ncStatus === 'รอปิด') && (
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
        </NcApproveStyled>
    )
}

const NcApproveStyled = styled.section`
    margin-bottom: .5rem;
    padding: 1rem;
    background-color: var(--background-dark-color);
    min-height: 350px;
`

export default NcApprove