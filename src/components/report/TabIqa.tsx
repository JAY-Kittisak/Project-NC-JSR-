import React from 'react'
import styled from 'styled-components'

import { IqaType } from '../../types'
import IqaToDeptItem from '../iqa/IqaToDeptItem'

interface Props {
    dataJsr: IqaType[] | null
    dataCdc: IqaType[] | null
}

const TabIqa: React.FC<Props> = ({ dataJsr, dataCdc}) => {
    return (
        <TabStyled>
            <input type="radio" name="slider" id="branch-jsr" defaultChecked/>
            <input type="radio" name="slider" id="branch-cdc"/>
            <nav>
                <label htmlFor="branch-jsr" className="branch-jsr">ลาดกระบัง</label>
                <label htmlFor="branch-cdc" className="branch-cdc">ชลบุรี</label>
                <div className="slider"></div>
            </nav>

            <section>
                <div className="nc-content">
                    <div className="nc-column table-phone--hide">
                        <p className='header--center'>เลขที่</p>
                    </div>
                    <div className='nc-column'>
                        <p className='header--center'>วันที่ออก IQA</p>
                    </div>
                    <div className='nc-column-dept'>
                        <p className='header--center'>จากทีม</p>
                    </div>
                    <div className='nc-column'>
                        <p className='header--center'>ออกให้กับ</p>
                    </div>
                    <div className='nc-column table-ipad--hide'>
                        <p className='header--center'>ผิดข้อกำหนด ISO 9001</p>
                    </div>
                    <div className='nc-column-dept'>
                        <p className='header--center'>สถานะ</p>
                    </div>
                </div>

                <div className="content content-1">
                    {dataJsr && dataJsr.map(item => (
                        <IqaToDeptItem key={item.id} item={item} />
                    ))}
                </div>

                <div className="content content-2">
                    {dataCdc && dataCdc.map(item => (
                        <IqaToDeptItem key={item.id} item={item} />
                    ))}
                </div>

            </section>
        </TabStyled>
    )
}

const TabStyled = styled.section`
    margin-top: 1.5rem;
    background-color: var(--background-dark-color);

    nav {
        position: relative;
        height: 40px;
        width: 220px;
        display: flex;
    }

    nav label {
        display: block;
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        color: var(--primary-color);
        font-size: 1.2rem;
        position: relative;
        z-index: 1;
        transition: all 0.3s ease;
    }

    #branch-jsr:checked ~ nav label.branch-jsr,
    #branch-cdc:checked ~ nav label.branch-cdc {
        color: #fff;
    }

    input[type="radio"] {
        display: none;
    }

    nav .slider {
        position: absolute;
        height: 100%;
        width: 50%;
        background-color: var(--primary-color);
        border-radius: 5px;
        z-index: 0;
        left: 0;
        bottom: 0;
        transition: all 0.3s ease;
    }

    #branch-cdc:checked ~ nav .slider {
        left: 50%;
    }

    section {
        margin-top: 1rem;
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

    section .content {
        display: none;
    }

    #branch-jsr:checked ~ section .content-1,
    #branch-cdc:checked ~ section .content-2 {
        display: block;
    }
`

export default TabIqa