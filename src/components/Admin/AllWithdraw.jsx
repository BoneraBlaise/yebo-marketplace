import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import VendorTableSection from "../Dashboard/vendor/VendorTableSection";
import AdminPageToolbar from "../Dashboard/admin/AdminPageToolbar";
import DashboardStatCard from "../Dashboard/DashboardStatCard";
import { HiOutlineCash, HiOutlineCheck, HiOutlineX } from "react-icons/hi";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus,setWithdrawStatus] = useState('Processing');
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Withdraw Id", minWidth: 150, flex: 0.7, headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white', },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 1.4,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "shopId",
      headerName: "Shop Id",
      minWidth: 180,
      flex: 1.4,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 0.6,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "status",
      headerName: "status",
      type: "text",
      minWidth: 80,
      flex: 0.5,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "createdAt",
      headerName: "Request given at",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
      renderCell: (params) => {

        return (
          <BsPencil
            size={20}
            className={`${params.row.status !== "Processing" ? 'hidden' : '' }dark:text-white mr-5 cursor-pointer`}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
    },
  ];

  const handleSubmit = async () => {
    await axios
      .put(`${server}/withdraw/update-withdraw-request/${withdrawData.id}`,{
        sellerId: withdrawData.shopId,
      },{withCredentials: true})
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      });
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: "RWF " + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });
  const pending = data?.filter((d) => d.status === "Processing").length || 0;
  const approved = data?.filter((d) => d.status === "Succeed").length || 0;
  const rejected = data?.filter((d) => d.status === "Rejected").length || 0;

  return (
    <div className="yebone-fade-up space-y-6 p-1">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <DashboardStatCard title="Pending" value={pending} icon={HiOutlineCash} />
        <DashboardStatCard title="Approved" value={approved} icon={HiOutlineCheck} />
        <DashboardStatCard title="Rejected" value={rejected} icon={HiOutlineX} />
      </div>
      <AdminPageToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search withdrawals…" />
      <VendorTableSection title="Withdrawal requests" subtitle="Review and update payout status">
        <DataGrid
          rows={search ? row.filter((r) => r.name?.toLowerCase().includes(search.toLowerCase())) : row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </VendorTableSection>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] dashboard-section yebone-surface shadow-2xl p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Update Withdraw status
            </h1>
            <br />
            <select
              name=""
              id=""
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded dark:bg-[#1f1f1f]"
            >
              <option value={withdrawStatus}>{withdrawData.status}</option>
              <option value={withdrawStatus}>Succeed</option>
            </select>
            <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
