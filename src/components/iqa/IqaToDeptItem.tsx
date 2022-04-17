import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { formatDate, sumNewDate, formatAddDate } from '../../helpers'
import { IqaType } from '../../types'

interface Props {
    item: IqaType
}

const IqaToDeptItem: React.FC<Props> = ({ item }) => {
    return (
        <Link to={`/iqa/notify/${item.id}`}>
            <DeptItemStyled>
                <div className="nc-column">
                    <p>{item.code}</p>
                </div>
                <div className="nc-column">
                    <p>{formatDate(item.createdAt)}</p>
                    {item.iqaStatus === 'รอตอบ' && (
                        <p style={{ color: sumNewDate(item.createdAt) ? 'red' : 'green' }}>
                            ควรตอบภายในวันที่ {formatAddDate(item.createdAt)}
                        </p>
                    )}
                </div>
                <div className="nc-column">
                    <p>{item.toName}</p>
                </div>
                <div className="nc-column">
                    <p>{item.requirements}</p>
                </div>
                <div
                    className="nc-column"
                    style={{
                        color:
                            item.iqaStatus === 'รอตอบ'
                                ? '#057FFF'
                                : item.iqaStatus === 'ตอบแล้ว'
                                    ? 'chocolate'
                                    : item.iqaStatus === 'รอปิด'
                                        ? '#ff5d94'
                                        : item.iqaStatus === 'ไม่อนุมัติ'
                                            ? '#FF0505'
                                            : item.iqaStatus === 'ปิดแล้ว'
                                                ? '#0cbd0c'
                                                : item.iqaStatus === 'ยกเลิก'
                                                    ? '#7a05ff'
                                                    : undefined,
                    }}
                >
                    <p className='font-focus'>{item.iqaStatus}</p>
                </div>
            </DeptItemStyled>
        </Link>
    )
}

const DeptItemStyled = styled.div`
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
    width: 20%;
    p {
        margin: 5px 0;
        text-align: center;
        font-style: italic;
        font-size: 0.9rem;
    }
}
`
export default IqaToDeptItem