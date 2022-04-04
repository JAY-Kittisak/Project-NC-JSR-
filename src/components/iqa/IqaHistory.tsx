import React from 'react'
import styled from 'styled-components'

import { useIqaContext } from '../../state/iqa-context'
import Spinner from '../Spinner'
import Button from '../Button'
import IqaHistoryItem from './IqaHistoryItem'

interface Props { }

const IqaHistory: React.FC<Props> = () => {
    const { iqaState: { iqa, loading, error, queryMoreIqa, btnLoading } } = useIqaContext()

    if (loading) return (
        <div className='flex-center'>
            <Spinner color='#007bff' height={50} width={50} />
            <span>Loading... </span>
        </div>
    )

    if (error) return <h2 className='header--center'>{error}</h2>

    return (
        <IqaHistoryStyled>
            <div className="flex-between">
                <h4>ประวัติการออก IQA/OBS</h4>
            </div>

            <HistoryDetail>
                <div className="nc-content">
                    <div className="nc-column">
                        <h3 className='header--center'>เลขที่</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>ออกให้กับ</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>แผนก</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>กระบวนการ</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>สถานะ</h3>
                    </div>
                </div>

                {(!iqa || iqa.All.length === 0) ? (
                    <p className='flex-center'>ยังไม่มีประวัติการออก NC</p>
                ) : iqa.All.map(item => (
                    <IqaHistoryItem key={item.id} item={item} />
                ))}
            </HistoryDetail>
            {iqa.All.length > 11 && (
                <div className='flex-center'>
                    <Button
                        type='button'
                        loading={btnLoading}
                        width='130px'
                        style={{ margin: '0.5rem 0' }}
                        onClick={() => queryMoreIqa()}
                    >
                        โหลดเพิ่ม
                    </Button>
                </div>
            )}
        </IqaHistoryStyled>
    )
}

const IqaHistoryStyled = styled.div`
    padding: 0rem 0.5rem 0rem 0.5rem;
    background-color: var(--background-dark-color);

    h4{
        color: var(--white-color);
        font-size: 1.4rem;
        margin: 16px 0;
        border-left: 5px solid #e74c3c;
        padding-left: 16px;
    }
`

const HistoryDetail = styled.section`
    border-bottom: 0.5px solid rgb(40, 44, 52, 0.3);
    
    .nc-content {
        padding: 0rem 1rem ;
        border-top: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgb(40, 44, 52, 0.3);
        border-bottom: 1px solid rgb(40, 44, 52, 0.3);
    }

    .nc-column {
        width: 20%;
    }

    .header--center {
        margin: 1rem 0;
        font-weight: 500;
        text-align: center;
    }
`

export default IqaHistory