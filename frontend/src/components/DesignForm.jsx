import axios from "@/api/axios";
import DynamicForm from "./DynamicForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

const FORM_FIELDS = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Design name',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Enter description',
  },
  {
    name: 'discountedPrice',
    label: 'Discounted Price',
    type: 'number',
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
  },
  {
    name: 'costprice',
    label: 'Cost Price',
    type: 'number',
  },
  {
    name: 'commision',
    label: 'Designer Commission',
    type: 'number',
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
      { value: 'formal', label: 'Formal' },
      { value: 'partywear', label: 'Partywear' },
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
  }
];

function DesignForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formFields, setFormFields] = useState(FORM_FIELDS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDesignData = useCallback(async (designId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/design/${designId}`);
      const design = response.data.message;

      const updatedFields = formFields.map(field => ({
        ...field,
        default: field.name === 'tags' ? design.tags :
                field.name === 'discountedPrice' ? design.stitching.sp :
                field.name === 'price' ? design.stitching.mrp :
                field.name === 'costprice' ? design.stitching.cp :
                design[field.name]
      }));

      setFormFields(updatedFields);
    } catch (error) {
      setError('Error fetching design data: ' + error.message);
      console.error("Error fetching design data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDesignData(id);
    }
  }, [id, fetchDesignData]);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      
      // Handle file uploads
      if (data.files?.length) {
        Array.from(data.files).forEach(file => {
          formData.append("files", file);
        });
      }

      // Restructure the data to match backend expectations
      const submitData = {
        ...data,
        stitching: {
          mrp: Number(data.price),
          sp: Number(data.discountedPrice),
          cp: Number(data.costprice)
        }
      };

      // Remove redundant fields
      delete submitData.files;
      delete submitData.price;
      delete submitData.discountedPrice;
      delete submitData.costprice;

      formData.append("data", JSON.stringify(submitData));

      const endpoint = id ? `/api/design/${id}` : "/api/design";
      const method = id ? "put" : "post";

      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate('/');
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

  return (
    <>
      {error &&       
        <div className="text-red-500">{error}</div>
      }
      <DynamicForm
        title={id ? "Update Design" : "Design Entry Form"}
        fields={formFields}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default DesignForm;