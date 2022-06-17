import React from 'react'
import { Link } from 'react-router-dom'

import { formatDate, sumNewDate, formatAddDate } from '../../helpers'
import { ItemStyled } from '../../styles/LayoutStyle'
import { IqaType } from '../../types'

interface Props {
    item: IqaType
}

const IqaToDeptItem: React.FC<Props> = ({ item }) => {
    return (
        <Link to={`/iqa/notify/${item.id}`}>
            <ItemStyled status={item.iqaStatus}>
                <div className="nc-column nc-column--hide">
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
                <div className="nc-column-dept">
                    <p>{item.team}</p>
                </div>
                <div className="nc-column">
                    <p>{item.toName} ({item.dept})</p>
                </div>
                <div className="nc-column nc-column--hide">
                    <p>{item.requirements}</p>
                </div>
                <div className="nc-column-dept">
                    <p className='font-focus bg-status'>{item.iqaStatus}</p>
                </div>
            </ItemStyled>
        </Link>
    )
}

export default IqaToDeptItem