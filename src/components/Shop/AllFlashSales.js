import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";  // Import axios for API requests
import Loader from "../Layout/Loader";
import { getAllFlashSales } from "../../redux/actions/flashSale"; 
import { server } from "../../server";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const AllFlashSales = () => {
  const { flashSales, isLoading } = useSelector((state) => state.flashSales);
  const { seller } = useSelector((state) => state.seller);

  const [openModal, setOpenModal] = useState(false);
  const [selectedFlashSaleId, setSelectedFlashSaleId] = useState(null);
  const [isProcessingForFlashSaleId, setIsProcessingForFlashSaleId] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    // Load all flash sales for the seller
    dispatch(getAllFlashSales(seller._id));
  }, [dispatch, seller._id]);

  const handleDelete = (id) => {
    setSelectedFlashSaleId(id);
    setOpenModal(true);  // Show the confirmation modal
  };

  const handleConfirmDelete = async () => {
    setIsProcessingForFlashSaleId(selectedFlashSaleId);  

    try {
      // Call the delete API directly using axios
      const response = await axios.delete(
        `${server}/flashsale/delete-flashsale/${selectedFlashSaleId}`,  // Update with your API URL
        {
          withCredentials: true,
        }
      );

      // On success, update the flash sales list locally (without needing redux)
      const updatedFlashSales = flashSales.filter(flashSale => flashSale._id !== selectedFlashSaleId);

      // Update the flash sales in state or show success message
      toast.success(response.data.message || "Flash Sale deleted successfully!");
      setIsProcessingForFlashSaleId(null);  // Reset processing state
      setOpenModal(false);  // Close the modal
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete flash sale");
      setIsProcessingForFlashSaleId(null);  // Reset processing state
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);  // Close the modal without deleting
  };

  const columns = [
    { field: "id", headerName: "Flash Sale Id", minWidth: 150, flex: 0.7, headerClassName: 'dark:text-white',
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
      field: "flashSalePrice",
      headerName: "Flash Sale Price",
      minWidth: 120,
      flex: 0.6,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "originalPrice",
      headerName: "Original Price",
      minWidth: 120,
      flex: 0.6,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "stockAvailable",
      headerName: "Stock Available",
      type: "number",
      minWidth: 100,
      flex: 0.6,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "discountPercentage",
      headerName: "Discount Percentage",
      type: "number",
      minWidth: 150,
      flex: 0.7,
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
        <Link to={`/flashsale/${params.id}`}>
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
          disabled={isProcessingForFlashSaleId === params.id} 
        >
          {isProcessingForFlashSaleId === params.id ? 'Processing...' : <AiOutlineDelete size={20} className="dark:text-white" />}
        </Button>
      ),
    },
  ];

  // Ensure that flash sales exists before mapping
  const rows = (flashSales || []).map(item => ({
    id: item._id,
    name: item.name,
    flashSalePrice: "RWF " + (item.flashSalePrice || "N/A"),
    originalPrice: "RWF " + (item.originalPrice || "N/A"),
    stockAvailable: item.stockAvailable || 0,
    discountPercentage: item.discountPercentage || "N/A",
    headerClassName: 'dark:text-white',
    cellClassName: 'dark:text-white',
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white dark:bg-[#1f1f1f]">
        <h3 className="text-xl dark:text-white m-2">All Flash Sales</h3>
          <DataGrid
            rows={rows}
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
          <p>Are you sure you want to delete this flash sale?</p>
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

export default AllFlashSales;
