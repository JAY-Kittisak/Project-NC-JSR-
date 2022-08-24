import React from 'react'
import styled from 'styled-components'

import { NcrNotify } from '../../types'
import NcHistoryToDeptItem from '../ncr/NcHistoryToDeptItem'

interface Props {
    ncToDept: NcrNotify[] | undefined
}

const NcList: React.FC<Props> = ({ ncToDept }) => {
    return (
        <NcListStyled>
            {ncToDept && ncToDept.length > 0 && (
                <section>
                    <div className="nc-content">
                        <div className="nc-column">
                            <p className='header--center'>เลขที่</p>
                        </div>
                        <div className='nc-column table-phone--hide'>
                            <p className='header--center'>วันที่ออก NC</p>
                        </div>
                        <div className='nc-column-dept'>
                                <p className='header--center'>ออกโดย</p>
                        </div>
                        <div className='nc-column-dept'>
                                <p className='header--center'>ออกให้กับ</p>
                        </div>
                        <div className='nc-column table-ipad--hide'>
                            <p className='header--center'>ประเด็น</p>
                        </div>
                        <div className='nc-column'>
                            <p className='header--center'>สถานะ</p>
                        </div>
                    </div>
                    {ncToDept.map(item => (
                        <NcHistoryToDeptItem key={item.id} item={item} />
                    ))}
                </section>
            )}
        </NcListStyled>
    )
}

const NcListStyled =  styled.div`
    section {
        margin-top: 2rem;
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

        .nc-column-dept {
            width: 10%;
        }

        .header--center {
            margin: 1rem 0;
            text-align: center;
            font-size: 1.2rem;
        }
    }
`
export default NcList