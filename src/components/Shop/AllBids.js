import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";  // Import axios for API requests
import Loader from "../Layout/Loader";
import { getAllBidsBySeller } from "../../redux/actions/bids";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const AllBids = () => {
  const { sellerBids, isLoading, error } = useSelector((state) => state.bids);
  const { seller } = useSelector((state) => state.seller);  // Ensure seller is present
  const [openModal, setOpenModal] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState(null);
  const [isProcessingForBidId, setIsProcessingForBidId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (seller._id) {
      console.log(`Fetching all bids for seller with ID: ${seller._id}`);
      dispatch(getAllBidsBySeller(seller._id)); // Fetch bids for the seller
    } else {
      console.warn("No seller ID found, skipping bid fetch.");
    }
  }, [dispatch, seller._id]);

  const handleDelete = (id) => {
    setSelectedBidId(id);
    setOpenModal(true); // Show the confirmation modal
  };

  const handleConfirmDelete = async () => {
    setIsProcessingForBidId(selectedBidId);

    try {
      const response = await axios.delete(
        `${server}/bids/delete-bid/${selectedBidId}`,
        { withCredentials: true }
      );

      // On success, remove the deleted bid from sellerBids
      const updatedBids = sellerBids.filter((bid) => bid._id !== selectedBidId);
      toast.success(response.data.message || "Bid deleted successfully!");
      setIsProcessingForBidId(null); // Reset processing state
      setOpenModal(false); // Close the modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete bid");
      setIsProcessingForBidId(null); // Reset processing state
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal without deletion
  };

  const columns = [
    { 
      field: "id", 
      headerName: "Bid ID", 
      minWidth: 150, 
      flex: 0.7,
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
    { 
      field: "name", 
      headerName: "Name", 
      minWidth: 180, 
      flex: 1.4,
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
    { 
      field: "description", 
      headerName: "Description", 
      minWidth: 250, 
      flex: 2,
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
    { 
      field: "category", 
      headerName: "Category", 
      minWidth: 120, 
      flex: 0.6,
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
    { 
      field: "originalPrice", 
      headerName: "Original Price", 
      minWidth: 120, 
      flex: 0.6,
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
    { 
      field: "highestBid", 
      headerName: "Highest Bid", 
      minWidth: 120, 
      flex: 0.6,
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
    { 
      field: "auctionStartTime", 
      headerName: "Start Time", 
      minWidth: 180, 
      flex: 1, 
      renderCell: (params) => new Date(params.value).toLocaleString(),
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
    { 
      field: "auctionEndTime", 
      headerName: "End Time", 
      minWidth: 180, 
      flex: 1, 
      renderCell: (params) => new Date(params.value).toLocaleString(),
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
    {
      field: "Preview", 
      flex: 0.8, 
      minWidth: 100, 
      headerName: "", 
      renderCell: (params) => (
        <Link to={`/bid/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} className="dark:text-white" />
          </Button>
        </Link>
      ),
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
    {
      field: "Delete", 
      flex: 0.8, 
      minWidth: 120, 
      headerName: "", 
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.id)}
          disabled={isProcessingForBidId === params.id}
          className="dark:text-white"
        >
          {isProcessingForBidId === params.id ? 'Processing...' : <AiOutlineDelete size={20} />}
        </Button>
      ),
      headerClassName: 'dark:text-white', 
      cellClassName: 'dark:text-white' 
    },
  ];

  const rows = (sellerBids || []).map((item) => {
    const { auctionProduct = {} } = item;

    return {
      id: item._id,
      name: auctionProduct.name || "N/A",
      description: auctionProduct.description || "No description available",
      category: auctionProduct.category || "N/A",
      originalPrice: auctionProduct.originalPrice ? `RWF ${auctionProduct.originalPrice}` : "N/A",
      highestBid: item.highestBid ? `RWF ${item.highestBid}` : "N/A",
      auctionStartTime: item.auctionStartTime,
      auctionEndTime: item.auctionEndTime,
    };
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="error-message dark:text-white">{error}</div>
      ) : rows.length === 0 ? (
        <div className="text-center dark:text-white">No bids available</div>
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white dark:bg-[#1f1f1f]">
          <h3 className="text-xl m-2 dark:text-white">All Bids by Seller</h3>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={25}
            disableSelectionOnClick
            autoHeight
            className="dark:bg-[#1f1f1f] dark:text-white"
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} className="dark:bg-[#2b2b2b]">
        <DialogTitle className="">Confirm Deletion</DialogTitle>
        <DialogContent>
          <p className="">Are you sure you want to delete this bid?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" style={{ backgroundColor: "red", color: "white" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" style={{ backgroundColor: "#29625d", color: "white" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllBids;
