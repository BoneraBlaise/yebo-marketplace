import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";
import AdminPageToolbar from "../Dashboard/admin/AdminPageToolbar";
import VendorTableSection from "../Dashboard/vendor/VendorTableSection";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllSellers());
  };

  const handleVerifyUnverify = async (id, isVerified) => {
    try {
      const response = await axios.put(
        `${server}/shop/${isVerified ? `unverify-shop` : `verify-shop`}/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success(response.data.message);
      dispatch(getAllSellers()); // Refresh the sellers list
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "Something went wrong"
      );
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Seller ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },

    {
      field: "name",
      headerName: "name",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "address",
      headerName: "Seller Address",
      type: "text",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },

    {
      field: "joinedAt",
      headerName: "joinedAt",
      type: "text",
      minWidth: 130,
      flex: 0.8,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "verify",
      headerName: "Verification",
      flex: 1,
      minWidth: 150,
      sortable: false,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
      renderCell: (params) => {
        const isVerified = params.row.isVerified;
        const buttonClass = `${
          isVerified
            ? "bg-red-500 dark:bg-red-500 dark:rounded-full dark:px-4 dark:py-0 dark:cursor-pointer"
            : "bg-blue-500 dark:bg-blue-500 dark:rounded-full dark:px-4 dark:py-0 dark:cursor-pointer"
        } text-white dark:text-white px-4 py-2 rounded-full`;

        return (
          <Button
            onClick={() => handleVerifyUnverify(params.id, isVerified)}
            className={buttonClass}
          >
            {isVerified ? "Unverify" : "Verify"}
          </Button>
        );
      },
    },

    {
      field: "  ",
      flex: 1,
      minWidth: 150,
      headerName: "Preview Shop",
      type: "number",
      sortable: false,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
      renderCell: (params) => {
        return (
          <>
            <Link to={`/shop/preview/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} className="dark:text-white" />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Delete Seller",
      type: "number",
      sortable: false,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpen(true)}>
              <AiOutlineDelete size={20} className="dark:text-white" />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
        isVerified: item.isVerified,
      });
    });

  return (
    <div className="yebone-fade-up space-y-4 p-1">
      <AdminPageToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search vendors…" />
      <VendorTableSection title="Vendor management" subtitle="Verification, stores, and seller accounts">
        <DataGrid
          rows={search ? row.filter((r) => r.name?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase())) : row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </VendorTableSection>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white dark:bg-[#1f1f1f] rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[18px] text-center dark:text-gray-200 py-5 font-Poppins text-[#000000cb]">
                Are you sure you wanna delete this user?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => setOpen(false) || handleDelete(userId)}
                >
                  confirm
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AllSellers;
