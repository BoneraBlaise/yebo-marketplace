import React, { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBid } from "../../redux/actions/bids";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";

const CreateBid = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.bids);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [startingBid, setStartingBid] = useState();
  const [auctionEndTime, setAuctionEndTime] = useState("");
  const [stock, setStock] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Bid created successfully!");
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
    setLoading(true);

    // Form validation (simple checks)
    if (new Date(auctionEndTime) <= new Date()) {
      toast.error("Auction end time must be in the future.");
      setLoading(false);
      return;
    }

    const newForm = new FormData();

    // If images are uploaded, append them as files (you may need to adjust this if you want to upload via URLs)
    images.forEach((image) => {
      newForm.append("images", image);
    });

    // Append other fields to the form
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("originalPrice", originalPrice);
    newForm.append("startingBid", startingBid);
    newForm.append("auctionEndTime", auctionEndTime);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);

    // Dispatch the createBid action
    dispatch(
      createBid({
        name,
        description,
        category,
        originalPrice,
        startingBid,
        auctionEndTime,
        stock,
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
      <h5 className="text-[30px] font-Poppins text-center dark:text-white">Create Bid</h5>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="pb-2 dark:text-gray-200">
            Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={name}
            className="mt-2 dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>

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


        <div>
          <label className="pb-2 dark:text-gray-200">Original Price</label>
          <input
            type="number"
            value={originalPrice}
            className="mt-2 dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter the original price..."
          />
        </div>

        <div>
          <label className="pb-2 dark:text-gray-200">Starting Bid</label>
          <input
            type="number"
            value={startingBid}
            className="mt-2 dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setStartingBid(e.target.value)}
            placeholder="Enter the starting bid..."
          />
        </div>

        <div>
          <label className="pb-2 dark:text-gray-200">Auction End Time</label>
          <input
            type="datetime-local"
            value={auctionEndTime}
            className="mt-2 dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setAuctionEndTime(e.target.value)}
          />
        </div>

        <div>
          <label className="pb-2 dark:text-gray-200">Product Stock</label>
          <input
            type="number"
            value={stock}
            className="mt-2 dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter the product stock..."
          />
        </div>

        <div>
          <label className="pb-2 dark:text-gray-200">Upload Images</label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap p-2">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} color="#555" />
            </label>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${index}`}
                className="h-[120px] w-[120px] object-cover m-2"
              />
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="mt-2 cursor-pointer text-white bg-[#29625d] hover:bg-black w-full px-3 py-3 rounded-[3px]"
            disabled={loading}
          >
            {loading ? "Processing..." : "Create Bid"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBid;
