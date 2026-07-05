import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [productType, setProductType] = useState('normal');
  const [condition, setCondition] = useState('new');
  const [location, setLocation] = useState('Kigali-Rwanda');

  const [loading, setLoading] = useState(false);  // Track loading state

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      toast.error("You can only upload between 1 to 5 images.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true when submission starts

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.append("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);
    newForm.append("productType", productType);
    newForm.append("condition", condition);
    newForm.append("location", location);

    dispatch(
      createProduct({
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        productType,
        condition,
        location,
        shopId: seller._id,
        images,
      })
    );
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  return (
    <div className="vendor-form-section yebone-surface yebone-fade-up max-h-[80vh] overflow-y-auto">
      <h5 className="text-2xl font-Poppins font-semibold text-center dark:text-white mb-6">Create Product</h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <br />
        {/* Product Name */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        {/* Product Description */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Description <span className="text-red-700">*</span>
          </label>
          <ReactQuill
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter your event product description..."
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "clean"],
              ],
            }}
            className="mt-2 border dark:text-white border-gray-300 rounded-[3px]"
          />
        </div>
        <br />
        {/* Category */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Category <span className="text-red-700">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px] dark:bg-gray-900 dark:text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData &&
              categoriesData.flatMap((category) =>
                category.subcategories.map((subcategory) => (
                  <option value={subcategory.title} key={subcategory.id}>
                    {subcategory.title}
                  </option>
                ))
              )}
          </select>
        </div>
        <br />
        {/* Tags */}
        <div>
          <label className="pb-2 dark:text-gray-200">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        {/* Original Price */}
        <div>
          <label className="pb-2 dark:text-gray-200">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        {/* Discount Price */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Price (With Discount) <span className="text-red-700">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        {/* Product Stock */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Product Stock <span className="text-red-700">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2 dark:text-gray-200">
            Product Type <span className="text-red-700">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px] dark:bg-gray-900 dark:text-white"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="flashsale">Flash Sale</option>
            <option value="wholesale">Wholesale</option>
            <option value="daily deal">Daily Deal</option>
            <option value="Pay Later">Pay Later</option>
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2 dark:text-gray-200">
            Condition
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px] dark:bg-gray-900 dark:text-white"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2 dark:text-gray-200">
            Location
          </label>
          <input
            type="text"
            value={location}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter product location..."
          />
        </div>
        <br />
        {/* Upload Images */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Upload Images <span className="text-red-700">*</span>
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i, index) => (
                <img
                  src={i}
                  key={index}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <br />
          <div>
            <label htmlFor="upload" className="cursor-pointer text-blue-600 underline">
              Add more images
            </label>
          </div>
          <br />
          <div>
            <button
              type="submit"
              className="mt-2 cursor-pointer text-white font-semibold appearance-none dark:text-white bg-[#29625d] hover:bg-black text-center block w-full px-3 py-3 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900"
              disabled={loading} // Disable the button when loading
            >
              {loading ? "Processing..." : "Create Product"} {/* Show "Processing..." while loading */}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
