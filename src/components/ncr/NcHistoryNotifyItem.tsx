import React from 'react'
import { Link } from 'react-router-dom'

import { ItemStyled } from '../../styles/LayoutStyle'
import { NcrNotify } from '../../types'

interface Props {
    item: NcrNotify
}

const NcHistoryNotifyItem: React.FC<Props> = ({ item }) => {
    return (
        <Link to={`/nc/notify/${item.id}`}>
            <ItemStyled status={item.ncStatus}>
                <div className="nc-column">
                    <p>{item.code}</p>
                </div>
                <div className="nc-column">
                    <p>{item.dept}</p>
                </div>
                <div className="nc-column">
                    <p className='truncated'>{item.topic}</p>
                </div>
                <div className="nc-column">
                    <p className='font-focus bg-status'>{item.ncStatus}</p>
                </div>
            </ItemStyled>
        </Link>
    )
}

export default NcHistoryNotifyItem