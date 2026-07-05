import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { Container, Badge, Button } from "./ui";
import DashboardOrderTimeline from "./Dashboard/DashboardOrderTimeline";
import { typography } from "../design-system/typography";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const refundHandler = async () => {
    await axios.put(`${server}/order/order-refund/${id}`, {
      status: "Processing refund"
    }).then((res) => {
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
    }).catch((error) => {
      toast.error(error.response.data.message);
    })
  };

  return (
    <div className="dashboard-page min-h-screen dark:text-gray-200 py-8">
      <Helmet>
        <title>Order Details | Yebone</title>
      </Helmet>
      <Container>
        <div className="yebone-fade-up space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="primary" className="mb-3">Order details</Badge>
              <h1 className={`${typography.heading} text-2xl`}>Order #{data?._id?.slice(0, 8)}</h1>
              <p className="text-sm text-gray-500 mt-1">Placed on {data?.createdAt?.slice(0, 10)}</p>
            </div>
            {data?.status && <Badge variant="outline">{data.status}</Badge>}
          </div>

          {data && (
            <div className="dashboard-section yebone-surface">
              <h2 className="font-semibold mb-4 dark:text-white">Delivery progress</h2>
              <DashboardOrderTimeline status={data.status} />
            </div>
          )}

          <div className="dashboard-section yebone-surface space-y-4">
            <h2 className="font-semibold dark:text-white">Products</h2>
      {data &&
        data?.cart.map((item, index) => {
          return (
            <div key={index} className="w-full flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <img
                src={`${item.images[0]?.url}`}
                alt=""
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="w-full flex-1">
                <h5 className="font-semibold dark:text-white">{item.name}</h5>
                <h5 className="text-yebone-primary font-medium mt-1">
                  RWF {item.discountPrice} x {item.qty}
                </h5>
              </div>
              {!item.isReviewed && data?.status === "Delivered" ? (
                <Button
                  size="sm"
                  onClick={() => {
                    setOpen(true);
                    setSelectedItem(item);
                  }}
                  className="yebone-btn-lift shrink-0"
                >
                  Rate order
                </Button>
              ) : null}
            </div>
          );
        })}
          </div>

      {/* review popup */}
      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 yebone-fade-up">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500] font-Poppins text-center">
              Give a Review
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={`${selectedItem?.images[0]?.url}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[18px] font-[700]">{selectedItem?.name}</div>
                <h4 className="pl-3 text-[16px]">
                  RWF {selectedItem?.discountPrice} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* ratings */}
            <h5 className="pl-3 text-[20px] font-[500]">
              Give a Rating <span className="text-green-900">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <Button
              type="button"
              className="w-full yebone-btn-lift mt-4"
              disabled={rating <= 1}
              onClick={reviewHandler}
            >
              Submit review
            </Button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="dashboard-section yebone-surface">
          <h4 className="font-semibold mb-3 dark:text-white">Shipping address</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {data?.shippingAddress?.address1} {data?.shippingAddress?.address2}
            <br />
            {data?.shippingAddress?.city} {data?.shippingAddress?.country}
            <br />
            {data?.user?.phoneNumber}
          </p>
        </div>
        <div className="dashboard-section yebone-surface">
          <h4 className="font-semibold mb-3 dark:text-white">Payment summary</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status: {data?.paymentInfo?.status || "Not Paid"}
          </p>
          <p className="text-xl font-bold text-yebone-primary mt-3">
            Total: RWF {data?.totalPrice}
          </p>
          {data?.status === "Delivered" && (
            <Button onClick={refundHandler} variant="outline" className="mt-4 yebone-btn-lift">
              Request refund
            </Button>
          )}
        </div>
      </div>

      <Link to="/">
        <Button variant="ghost" className="mt-4">Contact support</Button>
      </Link>
        </div>
      </Container>
    </div>
  );
};

export default UserOrderDetails;
