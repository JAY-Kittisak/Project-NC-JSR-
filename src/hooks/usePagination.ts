import { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { calculateTotalPages } from '../helpers'
import { Branch } from '../types'

export const usePagination = <T, U>(
  totalItems: number,
  perPage: number,
  activeTab?: T,
  items?: U[] | null,
  branch?: Branch
) => {
  const [page, setPage] = useState(1)
  // const [totalPages, setTotalPages] = useState(1)

  const history = useHistory()
  const { search, pathname } = useLocation()
  const params = new URLSearchParams(search)
  const currentPage = params.get('page')

  // FIXME:
  const totalPages = calculateTotalPages(totalItems, perPage)

  useEffect(() => {
    if (currentPage) setPage(+currentPage)
    else setPage(1)
  }, [currentPage])

  // When the active tab changed, reset the page to 1
  useEffect(() => {
    setPage(1)
  }, [activeTab])

  useEffect(() => {
    setPage(1)
      // Remove the cat query string
      history.replace(`${pathname}?page=1`)
  }, [branch, pathname, history])

  return { page, totalPages }
}