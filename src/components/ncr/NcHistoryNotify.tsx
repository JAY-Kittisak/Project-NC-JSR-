import React from 'react'
import styled from 'styled-components'

import NcHistoryNotifyItem from './NcHistoryNotifyItem'
import Spinner from '../Spinner'
import { useNcContext } from '../../state/nc-context'
import { SpinnerStyled } from '../../styles/LayoutStyle'
import Button from '../Button'

interface Props {}

const NcHistoryNotify: React.FC<Props> = () => {
    const { ncState: { ncNotify, loading, error,queryMoreNc, btnLoading  } } = useNcContext()

    if (loading) return (
        <SpinnerStyled>
            <div className='typography'>
                <Spinner color='#007bff' height={50} width={50} />
                <span>Loading... </span>
            </div>
        </SpinnerStyled>
    )

    if (error) return <h2 className='header--center'>{error}</h2>

    return (
        <NcHistory>
            <HistoryHeader>
                <h4>ประวัติการออก NC</h4>
                {/* <NcPaginationStyled>

                </NcPaginationStyled> */}
            </HistoryHeader>

            <HistoryDetail>
                <div className="nc-content">
                    <div className="nc-column">
                        <h3 className='header--center'>เลขที่</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>ออกให้กับ</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>ประเด็น</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>สถานะ</h3>
                    </div>
                </div>
                {(!ncNotify || ncNotify.All.length === 0) ? (
                    <p className='flex-center'>ยังไม่มีประวัติการออก NC</p>
                ) : ncNotify.All.map(item => (
                    <NcHistoryNotifyItem key={item.id} item={item} />
                ))}
            </HistoryDetail>
            {ncNotify.All.length > 11 && (
                <div className='flex-center'>
                    <Button
                        type='button'
                        loading={btnLoading}
                        width='130px'
                        style={{ margin: '0.5rem 0' }}
                        onClick={() => queryMoreNc()}
                    >
                        โหลดเพิ่ม
                    </Button>
                </div>
            )} 
        </NcHistory>
    )
}
const NcHistory = styled.div`
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

// const NcPaginationStyled = styled.div`
//     margin-bottom: 1rem;
//     display: flex;
//     justify-content: flex-end;
// `

const HistoryHeader = styled.section`
    display: flex;
    justify-content: space-between;
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
        width: 25%;
    }

    .header--center {
        margin: 1rem 0;
        font-weight: 500;
        text-align: center;
    }
`

export default NcHistoryNotify