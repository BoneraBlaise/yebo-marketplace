import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";  // Import axios for API requests
import Loader from "../Layout/Loader";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const [openModal, setOpenModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isProcessingForProductId, setIsProcessingForProductId] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    // Load all products for the seller
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  const handleDelete = (id) => {
    setSelectedProductId(id);
    setOpenModal(true);  // Show the confirmation modal
  };

  const handleConfirmDelete = async () => {
    setIsProcessingForProductId(selectedProductId);  // Set the processing state for the selected product

    try {
      // Call the delete API directly using axios
      const response = await axios.delete(
        `${server}/product/delete-shop-product/${selectedProductId}`,  // Update with your API URL
        {
          withCredentials: true,
        }
      );

      // On success, update the products list locally (without needing redux)a
      const updatedProducts = products.filter(product => product._id !== selectedProductId);


      // Update the products in state or show success message
      toast.success(response.data.message || "Product deleted successfully!");
      setIsProcessingForProductId(null);  // Reset processing state
      setOpenModal(false);  // Close the modal
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete product");
      setIsProcessingForProductId(null);  // Reset processing state
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);  // Close the modal without deleting
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7, headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white', },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} className="dark:text-white" />
          </Button>
        </Link>
      ),
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.id)}
          disabled={isProcessingForProductId === params.id} 
        >
          {isProcessingForProductId === params.id ? 'Processing...' : <AiOutlineDelete size={20} className="dark:text-white" />}
        </Button>
      ),
    },
  ];

  // Ensure that products exists before mapping
  const row = (products || []).map(item => ({
    id: item._id,
    name: item.name,
    price: "RWF " + (item.discountPrice || "N/A"),  
    Stock: item.stock || 0,  
    sold: item?.sold_out || 0,  
    headerClassName: 'dark:text-white',
    cellClassName: 'dark:text-white',
  }));


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white dark:bg-[#1f1f1f]">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={25}
            disableSelectionOnClick
            autoHeight
            className="dark:bg-[#1f1f1f]"
            
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this product?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="secondary"
            style={{ backgroundColor: "red", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="primary"
            style={{ backgroundColor: "#29625d", color: "white" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllProducts;
