import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {  AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import VendorTableSection from "../Dashboard/vendor/VendorTableSection";
import AdminPageToolbar from "../Dashboard/admin/AdminPageToolbar";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
   axios.get(`${server}/event/admin-all-events`, {withCredentials: true}).then((res) =>{
    setEvents(res.data.events);
   })
  }, []);

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
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}?isEvent=true`}>
              <Button>
                <AiOutlineEye size={20} className="dark:text-white" />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "RWF " + item.discountPrice,
        Stock: item.stock,
        sold: item.sold_out,
        headerClassName: 'dark:text-white',
        cellClassName: 'dark:text-white',
      });
    });

  return (
    <div className="yebone-fade-up space-y-4 p-1">
      <AdminPageToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search events…" />
      <VendorTableSection title="Platform events" subtitle="Event listings across all vendors">
        <DataGrid
          rows={search ? row.filter((r) => r.name?.toLowerCase().includes(search.toLowerCase())) : row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </VendorTableSection>
    </div>
  );
};

export default AllEvents;
