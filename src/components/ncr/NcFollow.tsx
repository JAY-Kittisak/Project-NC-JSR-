import React, { useState } from 'react'

import styled from 'styled-components'
import { useForm } from 'react-hook-form';

import Button from '../Button'
import { useManageNcNotify } from '../../hooks/useManageNcNotify'
import { formatDate } from '../../helpers'
import { useAuthContext } from '../../state/auth-context';
import { RadioStyled } from '../../styles/LayoutStyle'
import { FollowNc, AddFollowNcData, FoundFixNc, StatusNc, AlertNt, AlertType } from '../../types'

interface Props {
    ncId: string
    follow: FollowNc | undefined
    ncStatus: StatusNc
    creatorId: string
    setAlertWarning: React.Dispatch<React.SetStateAction<AlertNt>>
    setAlertState: React.Dispatch<React.SetStateAction<AlertType>>
}

const NcFollow: React.FC<Props> = ({ ncId, follow, ncStatus, creatorId, setAlertWarning, setAlertState }) => {
    const [radioBtn, setRadioBtn] = useState<FoundFixNc | undefined>(follow?.followNc)

    const { register, handleSubmit, errors } = useForm<AddFollowNcData>()

    const { authState: { userInfo } } = useAuthContext()

    const {
        updateNcFollow,
        loading,
        error
    } = useManageNcNotify()

    const isRadioSelected = (value: FoundFixNc): boolean => radioBtn === value
    const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => setRadioBtn(e.currentTarget.value as FoundFixNc)

    const handleUpdateNcFollow = handleSubmit(async (data) => {
        const finished = await updateNcFollow(ncId,data)

        if (finished) {
            setAlertState('success')
            setAlertWarning('show')
        } else {
            alert('Update follow nc. ไม่สำเร็จ โปรดแจ้งผู้ดูแลระบบ')
        }
    })

    return (
        <NcFollowStyled>
            <div className="flex-between">
                <h4>การติดตาม</h4>
                {follow?.followedAt && (
                    <p>{formatDate(follow.followedAt)}</p>
                )}
            </div>
            <form onSubmit={handleUpdateNcFollow} >
                <RadioStyled>
                    <div className="group">
                        <input
                            type="radio"
                            name="followNc"
                            id="foundAFix"
                            value='Found fix'
                            disabled={creatorId !== userInfo?.id}
                            checked={isRadioSelected('Found fix')}
                            onChange={handleRadioClick}
                            ref={register({ required: 'จำเป็นต้องเลือกหนึ่งตัวเลือกด้านบน' })}
                        />
                        <label htmlFor="foundAFix">พบการแก้ไขเชิงระบบ</label>
                    </div>
                    <div className="group">
                        <input
                            type="radio"
                            name="followNc"
                            id="canNotFix"
                            value='Can not fix'
                            disabled={creatorId !== userInfo?.id}
                            checked={isRadioSelected('Can not fix')}
                            onChange={handleRadioClick}
                            ref={register({ required: 'จำเป็นต้องเลือกหนึ่งตัวเลือกด้านบน' })}
                        />
                        <label htmlFor="canNotFix">ไม่สามารถปิดได้</label>
                    </div>
                </RadioStyled>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.followNc?.message}</p>
                )}
                <div className="form-field">
                    <label htmlFor="followDetail">
                        ข้อเสนอแนะเพิ่มเติม
                    </label>
                    <textarea
                        cols={30}
                        rows={3}
                        name="followDetail"
                        id="followDetail"
                        readOnly={creatorId !== userInfo?.id}
                        defaultValue={follow?.followDetail ? follow.followDetail : ''}
                        ref={register}
                    />
                    {errors && (
                        <p className='paragraph-error text-center'>{errors.followDetail?.message}</p>
                    )}
                </div>
                {creatorId === userInfo?.id && (
                    (ncStatus === 'ตอบแล้ว') && (
                        <Button
                            type='submit'
                            loading={loading}
                            width='100%'
                            style={{ margin: '0.5rem 0' }}
                        >
                            บันทึก
                        </Button>
                    )
                )}
            </form>
            {error && <p className='paragraph-error'>{error}</p>}
        </NcFollowStyled>
    )
}

const NcFollowStyled = styled.section`
    margin-top: 1rem;
    margin-bottom: .5rem;
    padding: 1rem;
    border: 2px solid var(--border-color);
    background-color: var(--background-dark-color);
    min-height: 350px;
`

export default NcFollow