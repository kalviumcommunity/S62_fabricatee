import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SingleProductPage from '@/components/SingleProductPage';
import axios from '@/api/axios';
import Loader from './Loader';


function DesignPage() {
    const {id} = useParams();
    const navigator = useNavigate();
    const [error, setError] = useState();
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
      if(!id){
        navigator('/');
      }
      const fetchData = async () =>{
        setIsLoading(true);
        try {
          const res = await axios.get(`/api/design/${id}`)
          const product = res.data.message;
          setData({
            description: product.description,
            name: product.name,
            stock: product.stock,
            tags: product.tags,
            images: product.images,
            mrp: product.stitching.mrp,
            sp: product.stitching.sp
          })
          setError("");
        } catch (error) {
          console.log(error);
          setError('Unable to Fetch Design Data')
        }
      }
      fetchData();
      setIsLoading(false);
    }, [id])

    const handleAddToCart = async () =>{
      console.log("add to cart");
      navigator(`/shop/designs/customize/${id}`)
    }

    if(isLoading){
      return <Loader/>
    }

  return (
    <div>
        {error}
        {!error &&
          <SingleProductPage {...data} type="design" btnTxt="Custamize Now" handleAddToCart={handleAddToCart}/>
        }
    </div>
  )
}

export default DesignPage
