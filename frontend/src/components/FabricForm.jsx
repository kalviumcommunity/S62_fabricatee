import { useNavigate, useParams } from "react-router-dom";
import DynamicForm from "./DynamicForm";
import axios from "@/api/axios";
import { useCallback, useEffect, useState } from "react";

// Example usage
const FORM_FIELDS = [
    {
      name: 'name',
      label: 'Fabric Name',
      type: 'text',
      placeholder: 'Enter fabric name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'Enter description'
    },
    {
      name: 'discountedPrice',
      label: 'Discounted Price',
      type: 'number'
    },
    {
      name: 'price',
      label: 'Original Price',
      type: 'number'
    },
    {
      name: 'costprice',
      label: 'Cost Price',
      type: 'number'
    },
    {
      name: 'stock',
      label: 'Stock',
      type: 'number'
    },
    {
        name: 'tags',
        label: 'Tags',
        type: 'checkbox-group',
        options: [
          { value: 'mens', label: 'Mens' },
          { value: 'womens', label: 'Womens' },
          { value: 'ethnic', label: 'Ethnic' },
          { value: 'casual', label: 'Casual' },
          { value: 'formal', label: 'Formal' }
        ],
        fullWidth: true
    },
    {
      name: 'files',
      label: 'Upload Images',
      type: 'file',
      accept: '.jpg, .jpeg, .png',
      multiple: true,
      fullWidth: true
    },
    // {
    //   name: 'rating',
    //   label: 'Rating',
    //   type: 'number',
    //   min: 0,
    //   max: 5,
    //   step: 0.1,
    //   // fullWidth: true
    // }
  ];
  
function FabricForm() {
    const navigator = useNavigate('/');
    const {id} = useParams();
    const [formFields, setFormFields] = useState(FORM_FIELDS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFormData = useCallback(async (fabricId)=>{
      try{
        setIsLoading(true);
        const res = await axios.get(`/api/fabric/${fabricId}`);
        const fabric = res.data.message;
        console.log(fabric);

        const updatedFields = formFields.map(field=>({
          ...field,
          default: field.name === 'tags' ? fabric.tags :
                  field.name === 'discountedPrice' ? fabric.meterprice.sp :
                  field.name === 'price' ? fabric.meterprice.mrp :
                  field.name === 'costprice' ? fabric.meterprice.cp :
                  field.name === 'stock' ? fabric.stock :
                  fabric[field.name],
        }))

        setFormFields(updatedFields);
      }catch(err){
        setError('Error fetching fabric data: ' + err?.response?.data?.message);
        console.error("Error fetching fabric data:", err);
      } finally {
        setIsLoading(false);
      }
    }, [])

    useEffect(()=>{
      if(id){
        fetchFormData(id);
      }
    }, [id, fetchFormData]);

    const handleSubmit = async (data) => {
      try {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();

        // handle file uploads
        if(data.files?.length){
          Array.from(data.files).forEach((img)=>{
            formData.append("files", img)
          })
        }

        const submitData = {
          ...data,
          meterprice: {
            mrp: Number(data.price),
            sp: Number(data.discountedPrice),
            cp: Number(data.costprice)
          }
        };

        delete submitData.files;
        delete submitData.price;
        delete submitData.discountedPrice;
        delete submitData.costprice;
        
        formData.append("data", JSON.stringify(submitData));

        const endpoint = id ? `/api/fabric/${id}` : "/api/fabric";
        const method = id ? "put" : "post";
  
        await axios({
          method, 
          url: endpoint,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        navigator('/');

      } catch (error) {
        setError('Error submitting form: ' + error.message);
        console.error("Error in Design Form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }
    if(error)
      return <div className="text-red-500 bold- w-full font-semibold text-center bg-neutral pt-3">{error}</div>
      
    return (
      <>
        <DynamicForm
          title={id ? "Update Fabric" : "Fabric Entry Form"}
          fields={formFields}
          onSubmit={handleSubmit}
        />
      </>
    );
}
export default FabricForm;