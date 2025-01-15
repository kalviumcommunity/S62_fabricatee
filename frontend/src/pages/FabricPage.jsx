import React from 'react'
import { useParams } from 'react-router-dom'
import SingleProductPage from '@/components/SingleProductPage';


function FabricPage() {
    const {id} = useParams();

  return (
    <div>
        <SingleProductPage productUrl={`/api/fabric/${id}`}/>
    </div>
  )
}

export default FabricPage
