import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { NcrNotify } from '../../types'

interface Props {
    item: NcrNotify
}

const NcHistoryNotifyItem: React.FC<Props> = ({item}) => {

    return (
        <Link to={`/nc/notify/${item.id}`}>
            <NotifyItem>
                <div className="nc-column">
                    <p className='font-small'>{item.code}</p>
                </div>
                <div className="nc-column">
                    <p>{item.dept}</p>
                </div>
                <div className="nc-column">
                    <div className='truncated'>{item.topic}</div>
                </div>
                <div
                    className="nc-column"
                    style={{
                        color:
                            item.ncStatus === 'รอตอบ'
                                ? '#057FFF'
                                : item.ncStatus === 'ตอบแล้ว'
                                    ? 'chocolate'
                                    : item.ncStatus === 'รอปิด'
                                        ? '#ff5d94'
                                        : item.ncStatus === 'ไม่อนุมัติ'
                                            ? '#FF0505'
                                            : item.ncStatus === 'ปิดแล้ว'
                                                ? '#0cbd0c'
                                                        : undefined,
                    }}
                >
                    <p>{item.ncStatus}</p>
                </div>
            </NotifyItem>
        </Link>
    )
}

const NotifyItem = styled.div`
    padding: 0rem 1rem ;
    border-top: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgb(40, 44, 52, 0.3);
    border-bottom: 0.5px solid rgb(40, 44, 52, 0.3);
    cursor: pointer;
    transition: 0.4s ease-in;
    &:hover {
        background-color: var(--background-hover-color);
    }
    
    .nc-content {
        padding: 0rem .5rem ;
        border-top: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgb(40, 44, 52, 0.3);
        border-bottom: 1px solid rgb(40, 44, 52, 0.3);
    }

    .nc-column {
        width: 25%;
        p {
            margin: 5px 0;
            text-align: center;
            font-style: italic;
        }
    }

    .truncated {
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .font-small {
        font-size: 0.9rem;
    }
    
`
export default NcHistoryNotifyItem