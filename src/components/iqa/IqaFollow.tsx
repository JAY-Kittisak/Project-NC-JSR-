import React, { useState } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';

import Button from '../Button'
import { FollowIqa, StatusNc, AlertNt, AlertType, FoundFix, AddFollowIqaData } from '../../types'
import { formatDate } from '../../helpers'
import { useAuthContext } from '../../state/auth-context';
import { RadioStyled } from '../../styles/LayoutStyle'
import { useManageIqa } from '../../hooks/useManageIqa';

interface Props {
    iqaId: string
    follow: FollowIqa | undefined
    iqaStatus: StatusNc
    creatorId: string
    setAlertWarning: React.Dispatch<React.SetStateAction<AlertNt>>
    setAlertState: React.Dispatch<React.SetStateAction<AlertType>>
}

const IqaFollow: React.FC<Props> = ({
    iqaId,
    follow,
    iqaStatus,
    creatorId,
    setAlertWarning,
    setAlertState
}) => {
    const [radioBtn, setRadioBtn] = useState<FoundFix | undefined>(follow?.followIqa)

    const { register, handleSubmit, errors } = useForm<AddFollowIqaData>()

    const { authState: { userInfo } } = useAuthContext()

    const { updateIqaFollow, loading, error} = useManageIqa()

    const isRadioSelected = (value: FoundFix): boolean => radioBtn === value
    const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => setRadioBtn(e.currentTarget.value as FoundFix)

    const handleUpdateIqaFollow = handleSubmit(async (data) => {
        const finished = await updateIqaFollow(iqaId,data)

        if (finished) {
            setAlertState('success')
            setAlertWarning('show')
        } else {
            alert('Update follow nc. ไม่สำเร็จ โปรดแจ้งผู้ดูแลระบบ')
        }
    })

    return (
        <IqaFollowStyled className='box-shadows'>
            <div className="flex-between">
                <h4>การติดตาม</h4>
                {follow?.followedAt && (
                    <p>{formatDate(follow.followedAt)}</p>
                )}
            </div>

            <form onSubmit={handleUpdateIqaFollow} >
                <RadioStyled>
                    <div className="group">
                        <input
                            type="radio"
                            name="followIqa"
                            id="foundAFix"
                            value='Found fix'
                            disabled={creatorId !== userInfo?.id}
                            checked={isRadioSelected('Found fix')}
                            onChange={handleRadioClick}
                            ref={register({ required: 'จำเป็นต้องเลือกหนึ่งตัวเลือกด้านบน' })}
                        />
                        <label htmlFor="foundAFix">การแก้ไขเรียบร้อย</label>
                    </div>
                    <div className="group">
                        <input
                            type="radio"
                            name="followIqa"
                            id="canNotFix"
                            value='Can not fix'
                            disabled={creatorId !== userInfo?.id}
                            checked={isRadioSelected('Can not fix')}
                            onChange={handleRadioClick}
                            ref={register({ required: 'จำเป็นต้องเลือกหนึ่งตัวเลือกด้านบน' })}
                        />
                        <label htmlFor="canNotFix">การแก้ไขยังไม่เรียบร้อย</label>
                    </div>
                </RadioStyled>
                {errors && (
                    <p className='paragraph-error text-center'>{errors.followIqa?.message}</p>
                )}
                <div className="form-field">
                    <label htmlFor="followDetail">
                        ความเห็น Auditor
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
                    (iqaStatus === 'ตอบแล้ว') && (
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
        </IqaFollowStyled>
    )
}

const IqaFollowStyled = styled.div`
    margin-bottom: .5rem;
    padding: 1rem;
    background-color: var(--background-dark-color);
    min-height: 350px;
`
export default IqaFollow