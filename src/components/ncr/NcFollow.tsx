import React, { useState } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';

import Button from '../Button'
import { useManageNcNotify } from '../../hooks/useManageNcNotify'
import { useAlertContext } from '../../state/alert-context'
import { formatDate } from '../../helpers'
import { useAuthContext } from '../../state/auth-context';
import { RadioStyled } from '../../styles/LayoutStyle'
import { FollowNc, AddFollowNcData, FoundFix, StatusNc } from '../../types'

interface Props {
    ncId: string
    follow: FollowNc | undefined
    ncStatus: StatusNc
    creatorId: string
}

const NcFollow: React.FC<Props> = ({ ncId, follow, ncStatus, creatorId }) => {
    const [radioBtn, setRadioBtn] = useState<FoundFix | undefined>(follow?.followNc)

    const { register, handleSubmit, errors } = useForm<AddFollowNcData>()

    const { authState: { userInfo } } = useAuthContext()

    const { setAlertType } = useAlertContext()

    const {
        updateNcFollow,
        loading,
        error
    } = useManageNcNotify()

    const isRadioSelected = (value: FoundFix): boolean => radioBtn === value
    const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => setRadioBtn(e.currentTarget.value as FoundFix)

    const handleUpdateNcFollow = handleSubmit(async (data) => {
        const finished = await updateNcFollow(ncId,data)

        if (finished) {
            setAlertType('success')
        } else {
            alert('Update follow nc. ไม่สำเร็จ โปรดแจ้งผู้ดูแลระบบ')
        }
    })

    return (
        <NcFollowStyled className='box-shadows'>
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
        </NcFollowStyled>
    )
}

const NcFollowStyled = styled.section`
    margin-bottom: .5rem;
    padding: 1rem;
    background-color: var(--background-dark-color);
    min-height: 350px;
`

export default NcFollow