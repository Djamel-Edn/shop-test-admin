        import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
        import axios from "axios";
        import { useEffect, useState } from "react";

        export default function Categories() {
            
            const [editedCategory,setEditedCategory]=useState(null)
            const [name, setName] = useState('');
            let [parentCategory, setParentCategory] = useState('');
            const [categoriesWithEmptyParent, setCategoriesWithEmptyParent] = useState([]);
            const [categoriesWithParent, setCategoriesWithParent] = useState([]);
            const [categories,setCategories]=useState([]);
            const [isUploading, setIsUploading] = useState(false);
            const [selectedImage, setSelectedImage] = useState(null);
            async function checker(id){
                var result=confirm('are you sure you want to delete it?');
                if (result) {
                    try {
                        await axios.delete(`/api/Categories?id=${id}`);
                    fetchCategories();
                    } catch (error) {
                        console.error('Error deleting category:', error);
                    }
                }
            }
            async function editCategory(category){    
                setEditedCategory(category)
                setName(category.name);            
                setParentCategory(category.parent || '');
                
            }
            async function uploadImage(ev) {
                const file = ev.target.files?.[0];
                if (!file) return;
            
                if (!file.type.includes("image")) {
                alert("Please upload an image!");
                return;
                }
            
                setIsUploading(true);
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", "shop-upload-image");
            
                try {
                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dzviiebsw/image/upload",
                    data
                );
                const imageUrl = response.data.secure_url;
                setSelectedImage(imageUrl);
                } catch (error) {
                console.error("Error uploading image:", error);
                }
                setIsUploading(false);
            }
            
            function deleteSelectedImage() {
                setSelectedImage(null);
            }
            
        
           
            useEffect(() => {
                fetchCategories();
                
                
            }, []);
            function fetchCategories() {
                axios.get('/api/Categories').then(result => {
                    const { categoriesWithEmptyParent, categoriesWithParent, allCategories } = result.data;
                    setCategoriesWithEmptyParent(categoriesWithEmptyParent);
                    setCategoriesWithParent(categoriesWithParent);
                    setCategories(allCategories);
                })
                .catch(error => {
                    console.error("Error fetching categories:", error);
                });
            }
            
            async function saveCategory(ev) {
                ev.preventDefault();
  if (!name) {
    alert("Please fill in the category name field");
    return;
  }
  
  const requestBody = {
    name,
    parentCategory: parentCategory === '' ? null : parentCategory,
    imageUrl: selectedImage, 
  };

  if (editedCategory) {
    requestBody._id = editedCategory._id;

    await axios.put('/api/Categories', requestBody);
    setEditedCategory(null)}
                else {
                    const requestBody = {
                        name,
                        parentCategory,
                    };
                    await axios.post('/api/Categories', requestBody)
                }   
                setName('');
  setParentCategory('');
  setSelectedImage(null); // Réinitialisez l'image sélectionnée
  fetchCategories();
            }
            
            return (
                <Layout>
                    <h2 className="text-white text-2xl mb-4">Categories</h2>
                    <label className="text-white text-xl"> {editedCategory? `Edit Category the category : ${editedCategory.name}` :'Create New category'}</label>

                    <form  onSubmit={saveCategory}>
                        <div className="flex mt-1 w-5/6">
                        <input
                            type="text"
                            placeholder="Category name"
                            value={name}    
                            onChange={ev => setName(ev.target.value)}
                            
                        />
                        <select
                            value={parentCategory}
                            onChange={ev => setParentCategory(ev.target.value)}
                            className="h-8 p-1"
                        >
                            <option value="">Main category</option>
                            {categories.length > 0 &&
                                categories.map(category => (
                                    <option value={category._id} key={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                                
                        </select>
                        
                        </div>
                        <div className="flex flex-col mb-4 justify-center w-1/2 mt-2">
                    
                   
                    <label className="text-xl mt-1 mb-2">Photo</label>
<div className="flex gap-2">
  {selectedImage && (
    <div className="image-container h-36 relative">
      <img
        src={selectedImage}
        alt="Selected Image"
        className="w-36 h-36 object-cover rounded-md cursor-pointer"
      />
      <button
        className="delete-image"
        type="button"
        onClick={deleteSelectedImage}
      >
        Supprimer l'image
      </button>
    </div>
  )}
  <label className="cursor-pointer w-36 h-36 bg-gray-400 flex items-center justify-center gap-1 rounded-lg ml-2 border border-gray-300">
    {isUploading ? (
      <Spinner /> // Assurez-vous que le composant Spinner est correctement défini
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
    )}
    <input type="file" className="hidden" onChange={uploadImage} />
    {isUploading ? <h3>Uploading</h3> : <h3>Upload</h3>}
  </label>
</div>

                        </div>
                        {editedCategory && (
                <button
                type="button"
                onClick={() => {
                    setEditedCategory(null);
                    setName('');
                    setParentCategory('');
                    setProperties([]);
                }}
                className="px-8 py-1 rounded-md text-xl bg-cyan-500 ">Cancel</button>
            )}
                        <button
                            className="ml-4 px-8 py-1 rounded-md text-xl  bg-red-500"
                            type="submit"
                            >
                            Save
                        </button>
                    </form>
                            <div className="mt-4 ml-4 flex flex-col gap-3">
                                <div className="flex flex-wrap gap-3">

                                {categoriesWithEmptyParent.length > 0 &&
                                    categoriesWithEmptyParent.map(category => (
                                        <table key={category._id} className="basic2">
                                            <thead>
                                                <tr>
                                                <td key={category._id} className="flex justify-center gap-2 items-center " style={{ width: '250px' }}>{category.name}
                                                <div className="flex flex-col items-center justify-center ml-1">
                                                <button className="btn-edit text-white"  onClick={()=>editCategory(category)} > Edit</button>
                                                        <button className="btn-primary bg-slate-400 text-white " onClick={() => checker(category._id)}> 
                                                        Delete</button>
                                                        
                                                </div>
                                                        </td>
                                                </tr>
                                            </thead>
                                        <tbody className="table-body">
                                        {categoriesWithParent.length > 0 &&
                                                categoriesWithParent.map(category2 => {
                                        if (category2.parent===category._id){
                                            return(
                                                <tr key={category2._id} >
                                                    <td className="flex flex-col items-center  py-2 w-full">
                                                        {category2.name}
                                                        <div className="flex ">
                                                        <button className="btn-edit" onClick={()=>editCategory(category2)}> Edit</button>
                                                        <button className="btn-primary" onClick={() =>checker(category2._id)}> 
                                                        Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                        );} 
                                            }
                                    )}
                                        </tbody>
                                        </table>
                                    ))}       
                                </div>
                            <div className="flex flex-wrap gap-3">
    {categoriesWithParent.length > 0 && categoriesWithParent.map(category => {
        const childCategories = categoriesWithParent.filter(cat => cat.parent === category._id);

        if (childCategories.length > 0) {
            return (
                <div key={category._id}>
                    <table className="basic2">
                        <thead>
                            <tr>
                                <td className="flex justify-center items-center gap-2 " style={{ width: '250px' }}>{category.name}
                                    <div className="flex flex-col items-center justify-center ml-1">
                                    <button className="btn-edit" onClick={()=>editCategory(category)}> Edit</button>
                                        <button className="btn-primary bg-slate-400 text-white" onClick={() => checker(category._id)}>
                                            Delete
                                        </button>
                                        
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {childCategories.map(childCategory => (
                                <tr key={childCategory._id}>
                                    <td className="flex flex-col items-center gap-1 w-full">
                                        {childCategory.name}
                                        <div className="flex">
                                            <button className="btn-edit" onClick={() => editCategory(childCategory)}> Edit</button>
                                            <button className="btn-primary" onClick={() => checker(childCategory._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        return null;
    })}
                                </div> 


                                    </div>
                </Layout>
            );
        }
