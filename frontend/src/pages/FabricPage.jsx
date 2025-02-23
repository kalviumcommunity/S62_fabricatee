import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SingleProductPage from '@/components/SingleProductPage';
import axios from '@/api/axios';


function FabricPage() {
    const {id} = useParams();
    const navigator = useNavigate();
    const [error, setError] = useState();
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
      if(!id){
        navigator('/');
      }
      setIsLoading(true);
      const fetchData = async () =>{
        try {
          const res = await axios.get(`/api/fabric/${id}`)
          const product = res.data.message;
          setData({
            description: product.description,
            name: product.name,
            stock: product.stock,
            tags: product.tags,
            images: product.images,
            mrp: product.meterprice.mrp,
            sp: product.meterprice.sp
          })
          setError("");
        } catch (error) {
          console.log(error);
          setError('Unable to fetch fabric data')
        }
      }
      fetchData();
      setIsLoading(false);
    }, [id])

    const handleAddToCart = async () =>{
      console.log("add to cart");
    }

  return (
    <div>
        {error}
        {!error &&
          <SingleProductPage {...data} handleAddToCart={handleAddToCart}/>
        }
    </div>
  )
}

export default FabricPage
