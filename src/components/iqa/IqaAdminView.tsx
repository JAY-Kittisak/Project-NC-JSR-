import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Tab from '../Tab'
import Spinner from '../Spinner'
import Pagination from '../Pagination'
import ButtonActive from '../ButtonActive'
import { useIqaAdminContext } from '../../state/iqa-admin-context'
import { useSelectTab } from '../../hooks/useSelectTab'
import { usePagination } from '../../hooks/usePagination'
import { NcrTab, IqaType } from '../../types'
import { orderTabs } from '../../helpers'
import { SpinnerStyled } from '../../styles/LayoutStyle'
import IqaToDeptItem from './IqaToDeptItem'

const prodTabType = 'iqaStatus'
const iqaPerPage = 10

interface Props { }

const IqaAdminView: React.FC<Props> = () => {
    const {
        iqaState: { iqa, iqaCounts, loading, error, queryMoreIqa, branch },
        iqaDispatch: { setBranch }
    } = useIqaAdminContext()

    const { activeTab } = useSelectTab<NcrTab>(prodTabType, 'All')

    const [iqaToPage, setIqaToPage] = useState(iqa[activeTab])
    const [iqaByStatus, setIqaByStatus] = useState(iqa[activeTab])

    const { page, totalPages } = usePagination<NcrTab, IqaType>(
        iqaCounts[activeTab],
        iqaPerPage,
        activeTab,
        iqaToPage,
        branch
    )

    useEffect(() => {
        const startIndex = iqaPerPage * (page - 1)
        const endIndex = iqaPerPage * page

        if (
            iqa[activeTab].length < iqaCounts[activeTab] &&
            iqa[activeTab].length < iqaPerPage * page
        ) {
            return queryMoreIqa()
        }
        
        setIqaToPage(iqa[activeTab])
        setIqaByStatus(iqa[activeTab].slice(startIndex, endIndex))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, iqa, page, iqaCounts])

    if (error) return <h2 className='header--center'>{error}</h2>

    return (
        <IqaHistory>
            <section className='header-status'>
                <h4>ประวัติการออก IQA ทั้งหมด</h4>
                <div className='tab-status'>
                    {orderTabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            tabType={prodTabType}
                            activeTab={activeTab}
                            withPagination={true}
                        />
                    ))}
                </div>
            </section>

            <IqaPaginationStyled>
                <div className='flex-between'>
                    <ButtonActive active={branch === 'ลาดกระบัง'} onClick={() => setBranch('ลาดกระบัง')}>ลาดกระบัง</ButtonActive>
                    <ButtonActive active={branch === 'ชลบุรี'}  onClick={() => setBranch('ชลบุรี')}>ชลบุรี</ButtonActive>
                </div>

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    tabType={prodTabType}
                    activeTab={activeTab}
                />
            </IqaPaginationStyled>

            {loading ? (
                <SpinnerStyled>
                    <div className='typography' style={{ height: '600px' }}>
                        <Spinner color='#007bff' height={50} width={50} />
                        <span>Loading... </span>
                    </div>
                </SpinnerStyled>
            ) : (
                <HistoryDetail>
                    <div className="nc-content">
                        <div className="nc-column table-cell--hide">
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
                        <div className='nc-column nc-column--hide'>
                            <p className='header--center'>ผิดข้อกำหนด ISO 9001</p>
                        </div>
                        <div className='nc-column-dept'>
                            <p className='header--center'>สถานะ</p>
                        </div>
                    </div>
                    {iqaByStatus.map(item => (
                        <IqaToDeptItem key={item.id} item={item} />
                    ))}
                </HistoryDetail>
            )}
        </IqaHistory>
    )
}

const IqaHistory = styled.div`
    padding: 0rem 0.5rem 0rem 0.5rem;
    background-color: var(--background-dark-color);
`

const IqaPaginationStyled = styled.div`
    display: flex;
    justify-content: space-between;
`

const HistoryDetail = styled.section`
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

    @media screen and (max-width: 900px) {
        .table-cell--hide {
            display: none;
        }
    }
`

export default IqaAdminView