import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import VendorTableSection from "../Dashboard/vendor/VendorTableSection";

const AllCoupons = () => {
  const { t } = useTranslation(); // Initialize translation
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !value) {
      toast.error(t("coupons.nameValueRequired"));
      return;
    }

    try {
      const response = await axios.post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          value: parseInt(value),
          minAmount: minAmount ? parseInt(minAmount) : null,
          maxAmount: maxAmount ? parseInt(maxAmount) : null,
          selectedProducts,
          shopId: seller._id,
        },
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (response.data.success) {
        toast.success(t("coupons.createdSuccess"));
        setOpen(false);
        // Refresh coupon list
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("coupons.creationFailed"));
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${server}/coupon/delete-coupon/${id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(t("coupons.deletedSuccess"));
        // Refresh coupon list
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("coupons.deletionFailed"));
    }
  };

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${server}/coupon/get-coupon/${seller._id}`,
        { withCredentials: true }
      );
      setCoupouns(data.couponCodes);
    } catch (error) {
      toast.error(error.response?.data?.message || t("coupons.fetchFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [seller._id]);

  const columns = [
    {
      field: "id", headerName: t("coupons.id"), minWidth: 150, flex: 0.7, headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "name",
      headerName: t("coupons.couponCode"),
      minWidth: 180,
      flex: 1.4,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "price",
      headerName: t("coupons.value"),
      minWidth: 100,
      flex: 0.6,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  coupouns &&
    coupouns.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
        sold: 10,
        headerClassName: 'dark:text-white',
        cellClassName: 'dark:text-white',
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="yebone-fade-up space-y-4 p-1">
          <div className="flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-4 !rounded-xl mr-3 yebone-btn-lift`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">{t("coupons.createCouponCode")}</span>
            </div>
          </div>
          <VendorTableSection title="Discount codes" subtitle="Manage coupon usage and expiration">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
              className="dark:bg-[#1f1f1f]"
            />
          </VendorTableSection>
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white dark:bg-[#1f1f1f] rounded-md shadow p-4 overflow-y-auto hide-scrollbar">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer dark:text-white"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center dark:text-white">
                  {t("coupons.createCouponCode")}
                </h5>
                {/* create coupoun code */}
                <form onSubmit={handleSubmit} aria-required={true}>
                  <br />
                  <div>
                    <label className="pb-2 dark:text-white">
                      {t("coupons.name")} <span className="text-red-700 dark:text-white">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none dark:bg-[#1f1f1f] block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-red-900 focus:border-red-900 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("coupons.enterCouponName")}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2 dark:text-white">
                      {t("coupons.discountPercentage")}{" "}
                      <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={value}
                      required
                      className="mt-2 appearance-none dark:bg-[#1f1f1f] block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-red-900 focus:border-red-900 sm:text-sm"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={t("coupons.enterCouponValue")}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2 dark:text-white">{t("coupons.minAmount")}</label>
                    <input
                      type="number"
                      name="value"
                      value={minAmount}
                      className="mt-2 appearance-none dark:bg-[#1f1f1f] block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-red-900 focus:border-red-900 sm:text-sm"
                      onChange={(e) => setMinAmout(e.target.value)}
                      placeholder={t("coupons.enterMinAmount")}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2 dark:text-white">{t("coupons.maxAmount")}</label>
                    <input
                      type="number"
                      name="value"
                      value={maxAmount}
                      className="mt-2 appearance-none dark:bg-[#1f1f1f] block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-red-900 focus:border-red-900 sm:text-sm"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder={t("coupons.enterMaxAmount")}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2 dark:text-white">{t("coupons.selectedProduct")}</label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]  dark:text-white dark:bg-[#1f1f1f]"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="Choose your selected products">
                        {t("coupons.chooseSelectedProduct")}
                      </option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name} className="dark:text-white">
                            {i.name} 
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    <input
                      type="submit"
                      value={t("coupons.create")}
                      className="mt-2 appearance-none bg-[#29635d] hover:bg-black hover:text-white block w-full px-3 py-3 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-red-900 focus:border-red-900 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
