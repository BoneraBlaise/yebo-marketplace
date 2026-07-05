router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { 
        cart, 
        shippingAddress, 
        user, 
        totalPrice,
        paymentInfo,
        shipping,
        discountPrice,
        referralCodes 
      } = req.body;

      // Validate required fields
      if (!cart || !shippingAddress || !user || !paymentInfo) {
        return next(new ErrorHandler("Missing required fields", 400));
      }

      // Create the order
      const order = await Order.create({
        cart,
        shippingAddress,
        user,
        totalPrice,
        shipping,
        discountPrice,
        paymentInfo: {
          ...paymentInfo,
          status: "Pending"
        }
      });

      // Process commissions for referred products
      if (referralCodes?.length > 0) {
        for (const referralCode of referralCodes) {
          const commission = await Commission.findOne({ referralCode });
          if (commission) {
            // Get products referred by this code
            const referredProducts = cart.filter(item => 
              item.referralCode === referralCode
            );

            for (const product of referredProducts) {
              const commissionRate = calculateCommissionRate(product.discountPrice || product.originalPrice);
              if (commissionRate > 0) {
                const itemTotal = (product.discountPrice || product.originalPrice) * product.qty;
                const commissionAmount = (itemTotal * commissionRate) / 100;

                commission.sales.push({
                  order: order._id,
                  product: product._id,
                  shop: product.shopId,
                  amount: itemTotal,
                  commission: commissionAmount,
                  commissionRate,
                  status: "pending"
                });

                commission.balance.pending += commissionAmount;
                await commission.updateShopStats(product.shopId, commissionAmount, 'pending');
              }
            }
            await commission.save();
          }
        }
      }

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
); 