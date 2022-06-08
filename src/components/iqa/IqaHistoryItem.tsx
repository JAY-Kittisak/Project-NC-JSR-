import React from 'react'
import { Link } from 'react-router-dom'

import { ItemStyled } from '../../styles/LayoutStyle'
import { IqaType } from '../../types'

interface Props {
    item: IqaType
}

const IqaHistoryItem: React.FC<Props> = ({ item }) => {
    return (
        <Link to={`/iqa/notify/${item.id}`}>
            <ItemStyled status={item.iqaStatus}>
                <div className="nc-column">
                    <p>{item.code}</p>
                </div>
                <div className="nc-column">
                    <p>{item.toName} ({item.dept})</p>
                </div>
                <div className="nc-column">
                    <p className='truncated'>{item.checkedProcess}</p>
                </div>
                <div className="nc-column">
                    <p className='font-focus bg-status'>{item.iqaStatus}</p>
                </div>
            </ItemStyled>
        </Link>
    )
}

export default IqaHistoryItem