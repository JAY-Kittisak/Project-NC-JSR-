import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

interface Props<T> {
    page: number
    totalPages: number
    tabType?: string
    activeTab?: T
}

const Pagination = <T extends string>({page, totalPages, tabType, activeTab}: Props<T>) => {
    const { pathname } = useLocation()

    return (
        <PaginationStyled>
            <Link 
                to={
                tabType
                    ? `${pathname}?${tabType}=${activeTab}&page=${
                        page > 1 ? page - 1 : 1
                    }`
                    : `${pathname}?page=${page > 1 ? page - 1 : 1}`
                }
                className='pagination__page'
                style={{ cursor: page === 1 ? 'not-allowed' : undefined }}
                onClick={page === 1 ? (e) => e.preventDefault() : undefined}
            >
                <p className="paragraph--center paragraph--hover">Prev</p>
            </Link>

            <div className='page-total'>
                <p className="paragraph--center">
                    {page} of {totalPages}
                </p>
            </div>

            <Link
                to={
                tabType
                    ? `${pathname}?${tabType}=${activeTab}&page=${
                        page < totalPages ? page + 1 : page
                    }`
                    : `${pathname}?page=${page < totalPages ? page + 1 : page}`
                }
                className='pagination__page'
                style={{ cursor: page === totalPages ? 'not-allowed' : undefined }}
                onClick={page === totalPages ? (e) => e.preventDefault() : undefined}
            >
                <p className="paragraph--center paragraph--hover">Next</p>
            </Link>
        </PaginationStyled>
    )
}

const PaginationStyled = styled.div`
    width: 30%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .paragraph--center {
        padding: 5px 0;
        text-align: center;
        transition: ease-out 0.3s;
    }

    .paragraph--hover {
        :hover {
            background-color: var(--background-hover-color);
        }
    }
    
    .page-total {
        width: 40%;
        border-top: 0.5px solid rgb(40, 44, 52, 0.3);
        border-bottom: 0.5px solid rgb(40, 44, 52, 0.3);
    }

    .pagination__page {
        width: 30%;
        border: 0.5px solid rgb(40, 44, 52, 0.3);
        cursor: pointer;
    }
`
export default Pagination