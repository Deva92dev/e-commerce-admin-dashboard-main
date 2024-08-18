"use client"
import { ProductType } from '@/lib/types'
import React from 'react'

interface FilterProps {
    products: ProductType[]
}

const Filters = ({products} : FilterProps) => {
  return (
    <div>Filters</div>
  )
}

export default Filters