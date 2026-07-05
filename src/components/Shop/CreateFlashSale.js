import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { createFlashSale } from "../../redux/actions/flashSale"; // assuming you have a createFlashSale action
import { categoriesData } from "../../static/data"; // you can use a predefined categories data like the one in the product creation form
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";

const CreateFlashSale = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.flashSales);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [flashSalePrice, setFlashSalePrice] = useState();
  const [stockAvailable, setStockAvailable] = useState();
  const [discountPercentage, setDiscountPercentage] = useState();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Flash Sale created successfully!");
      // Reset the form after successful submission
      setImages([]);
      setName("");
      setDescription("");
      setCategory("");
      setTags("");
      setOriginalPrice("");
      setFlashSalePrice("");
      setStockAvailable("");
      setDiscountPercentage("");
      setStartTime(new Date());
      setEndTime(new Date());
      navigate("/dashboard"); // Redirect after success
    }
  }, [dispatch, error, success, navigate]);


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
    setLoading(true); // Set loading state

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.append("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("flashSalePrice", flashSalePrice);
    newForm.append("startTime", startTime);
    newForm.append("endTime", endTime);
    newForm.append("stockAvailable", stockAvailable);
    newForm.append("discountPercentage", discountPercentage);
    newForm.append("shopId", seller._id);

    dispatch(
      createFlashSale({
        name,
        description,
        category,
        tags,
        originalPrice,
        flashSalePrice,
        startTime,
        endTime,
        stockAvailable,
        discountPercentage,
        shopId: seller._id,
        images,
      })
    );
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white dark:bg-gray-900 shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll hide-scrollbar">
      <h5 className="text-[30px] font-Poppins text-center dark:text-white">Create Flash Sale</h5>
      <form onSubmit={handleSubmit}>
        <br />
        {/* Flash Sale Name */}
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
            placeholder="Enter flash sale name..."
          />
        </div>
        <br />
        {/* Description */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Description <span className="text-red-700">*</span>
          </label>
          <ReactQuill
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter the flash sale description..."
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
            placeholder="Enter your tags..."
          />
        </div>
        <br />
        {/* Original Price */}
        <div>
          <label className="pb-2 dark:text-gray-200">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            value={originalPrice}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter original price..."
          />
        </div>
        <br />
        {/* Flash Sale Price */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Flash Sale Price <span className="text-red-700">*</span>
          </label>
          <input
            type="number"
            name="flashSalePrice"
            value={flashSalePrice}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setFlashSalePrice(e.target.value)}
            placeholder="Enter flash sale price..."
          />
        </div>
        <br />
        {/* Discount Percentage */}
        <div>
          <label className="pb-2 dark:text-gray-200">Discount Percentage</label>
          <input
            type="number"
            name="discountPercentage"
            value={discountPercentage}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setDiscountPercentage(e.target.value)}
            placeholder="Enter discount percentage..."
          />
        </div>
        <br />
        {/* Stock Available */}
        <div>
          <label className="pb-2 dark:text-gray-200">Stock Available</label>
          <input
            type="number"
            name="stockAvailable"
            value={stockAvailable}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setStockAvailable(e.target.value)}
            placeholder="Enter stock available..."
          />
        </div>
        <br />
        {/* Start Time */}
        <div>
          <label className="pb-2 dark:text-gray-200">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px]"
          />
        </div>
        <br />
        {/* End Time */}
        <div>
          <label className="pb-2 dark:text-gray-200">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px]"
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
                  alt="flash sale"
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
              disabled={loading} // Disable button when loading
            >
              {loading ? "Processing..." : "Create Flash Sale"} {/* Show Processing... */}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateFlashSale;
