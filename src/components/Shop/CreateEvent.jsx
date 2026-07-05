import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";
import ReactQuill from 'react-quill';

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);  // Track loading state

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
    document.getElementById("end-date").min = minEndDate.toISOString().slice(0, 10);
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
    : "";

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event created successfully!");
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.split('/')[0] === 'image');

    if (validImages.length !== files.length) {
      toast.error("Some files are not images.");
    }

    setImages([]);  // Clear existing images

    validImages.forEach((file) => {
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
    setLoading(true);  // Set loading to true when form submission starts

    const data = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images,
      shopId: seller._id,
      start_Date: startDate?.toISOString(),
      Finish_Date: endDate?.toISOString(),
    };

    dispatch(createevent(data));  // Dispatch the action to create the event
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white dark:bg-gray-900 shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center dark:text-white">Create Event</h5>
      <form onSubmit={handleSubmit}>
        <br />
        {/* Event Name */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Name <span className="text-green-700">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your event name..."
          />
        </div>
        <br />
        {/* Event Description */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Description <span className="text-green-700">*</span>
          </label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Enter your event description..."
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image', 'clean'],
              ],
            }}
            className="mt-2 border dark:text-white border-gray-300 rounded-[3px]"
          />
        </div>
        <br />
        {/* Category */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Category <span className="text-green-700">*</span>
          </label>
          <select
            className="w-full dark:bg-gray-900 dark:text-white mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
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
            placeholder="Enter your event tags..."
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
            placeholder="Enter your event price..."
          />
        </div>
        <br />
        {/* Discount Price */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Price (With Discount) <span className="text-green-700">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your event price with discount..."
          />
        </div>
        <br />
        {/* Stock */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Event Stock <span className="text-green-700">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your event stock..."
          />
        </div>
        <br />
        {/* Start Date */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Event Start Date <span className="text-green-700">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="start-date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={handleStartDateChange}
            min={today}
          />
        </div>
        <br />
        {/* End Date */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Event End Date <span className="text-green-700">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="end-date"
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none dark:text-white dark:bg-gray-900 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            onChange={handleEndDateChange}
            min={minEndDate}
          />
        </div>
        <br />
        {/* Image Upload */}
        <div>
          <label className="pb-2 dark:text-gray-200">
            Upload Images <span className="text-green-700">*</span>
          </label>
          <input
            type="file"
            name=""
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
              images.map((i) => (
                <img
                  src={i}
                  key={i}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <br />
          {/* Submit Button with Processing Indicator */}
          <div>
            <input
              type="submit"
              value={loading ? "Processing..." : "Create Event"}  // Show Processing... when loading
              className="mt-2 cursor-pointer appearance-none dark:text-white bg-[#29625d] hover:bg-black text-center block w-full px-3 py-3  rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 text-white font-semibold"
              disabled={loading}  // Disable button while processing
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
