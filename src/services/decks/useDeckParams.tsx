import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Sort } from '@/components/decks'
import { Tab } from '@/components/ui'
import { ErrorResponse } from '@/services/decks/decks.types'
import { useGetDecksQuery, useMinMaxCardsDeckQuery } from '@/services/decks/decksApi'

export const useDeckParams = () => {
  const [deckSearchParams, setDeckSearchParams] = useSearchParams()
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sort, setSort] = useState<Sort>(null)
  const {
    data: cardsInDeck,
    error: cardsInDeckError,
    isLoading: cardsInDeckLoading,
  } = useMinMaxCardsDeckQuery()

  const minCardsInDeck = cardsInDeck?.min ?? 0
  const maxCardsInDeck = cardsInDeck?.max ?? 100
  const [cardsRange, setCardsRange] = useState<number[]>([minCardsInDeck, maxCardsInDeck])

  useEffect(() => {
    if (cardsInDeck) {
      if (sessionStorage.getItem('min') || sessionStorage.getItem('max')) {
        setCardsRange([
          Number(sessionStorage.getItem('min')),
          Number(sessionStorage.getItem('max')),
        ])
      } else {
        setCardsRange([cardsInDeck.min ?? 0, cardsInDeck.max ?? 100])
        sessionStorage.setItem('min', cardsRange[0]?.toString())
        sessionStorage.setItem('max', cardsRange[1]?.toString())
      }
    }
  }, [cardsInDeck])

  const handleSliderValueChange = (value: number[]) => {
    setCardsRange(value)
    sessionStorage.setItem('min', value[0].toString())
    sessionStorage.setItem('max', value[1].toString())
  }
  //
  // const handleSliderValueChange = (value: number[]) => {
  //   setCardsRange(value)
  // }

  //deck name search query
  const handleSearchChange = (value: string) => {
    if (value.length) {
      deckSearchParams.set('name', value)
    } else {
      deckSearchParams.delete('name')
    }
    setDeckSearchParams(deckSearchParams)
  }

  const handleClearInput = () => {
    deckSearchParams.delete('name')
    setDeckSearchParams(deckSearchParams)
  }

  // tabs query
  const tabs: Tab[] = [
    { disabled: false, title: 'My decks', value: 'my' },
    { disabled: false, title: 'All decks', value: 'all' },
  ]

  const currentTab =
    sessionStorage.getItem('currentTab') ?? deckSearchParams.get('currentTab' || 'all')
  const handleTabChange = (tab: string) => {
    if (tab === 'all') {
      sessionStorage.removeItem('authorId')
    }
    deckSearchParams.set('currentTab', tab)
    setDeckSearchParams(deckSearchParams)
  }

  //current page query
  const currentPage = Number(
    deckSearchParams.get('currentPage') || sessionStorage.getItem('currentPage') || 1
  )
  const handlePageChange = (page: number) => {
    deckSearchParams.set('currentPage', page.toString())
    setDeckSearchParams(deckSearchParams)
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
  }

  const clearFilters = () => {
    setSort(null)
    setCardsRange([0, maxCardsInDeck])
    setDeckSearchParams({})
    sessionStorage.clear()
    // sessionStorage.removeItem('min')
    // sessionStorage.removeItem('max')
  }

  const {
    data: decks,
    error: getDecksError,
    isLoading: getDecksLoading,
  } = useGetDecksQuery({
    authorId: deckSearchParams.get('authorId') ?? sessionStorage.getItem('authorId') ?? '',
    currentPage,
    itemsPerPage,
    maxCardsCount: cardsRange[1],
    minCardsCount: cardsRange[0],
    name: deckSearchParams.get('name') ?? sessionStorage.getItem('name') ?? undefined,
    orderBy: sort ? `${sort.key}-${sort.direction}` : undefined,
  })

  const decksLoading = getDecksLoading || cardsInDeckLoading

  const error = [
    ...((cardsInDeckError as ErrorResponse)?.data.errorMessages || []),
    ...((getDecksError as ErrorResponse)?.data.errorMessages || []),
  ]
  const decksError = error.length ? error : null

  return {
    cardsRange,
    clearFilters,
    currentPage,
    currentTab,
    deckSearchParams,
    decks,
    decksError,
    decksLoading,
    handleClearInput,
    handleItemsPerPageChange,
    handlePageChange,
    handleSearchChange,
    handleSliderValueChange,
    handleTabChange,
    itemsPerPage,
    maxCardsInDeck,
    minCardsInDeck,
    setSort,
    sort,
    tabs,
  }
}
