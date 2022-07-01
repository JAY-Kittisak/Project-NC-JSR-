import React from 'react'
import { Link } from 'react-router-dom'

import { NcrNotify } from '../../types'
import { formatDate, sumNewDate, formatAddDate } from '../../helpers'
import { ItemStyled } from '../../styles/LayoutStyle'

interface Props {
    item: NcrNotify
}

const NcHistoryToDeptItem: React.FC<Props> = ({ item }) => {
    return (
        <Link to={`/nc/notify/${item.id}`}>
            <ItemStyled status={item.ncStatus}>
                <div className="nc-column">
                    <p>{item.code}</p>
                </div>
                <div className="nc-column table-phone--hide">
                    <p>{formatDate(item.createdAt)}</p>
                    {item.ncStatus === 'รอตอบ' && (
                        <p style={{ color: sumNewDate(item.createdAt) ? 'red' : 'green' }}>
                            ควรตอบภายในวันที่ {formatAddDate(item.createdAt)}
                        </p>
                    )}
                </div>
                <div className="nc-column-dept">
                    <p>{item.creator.dept}</p>
                </div>
                <div className="nc-column-dept">
                    <p>{item.dept}</p>
                </div>
                <div className="nc-column table-ipad--hide">
                    <p className='truncated'>{item.topic}</p>
                </div>
                <div className="nc-column">
                    <p className='font-focus bg-status'>{item.ncStatus}</p>
                </div>
            </ItemStyled>
        </Link>
    )
}

export default NcHistoryToDeptItem