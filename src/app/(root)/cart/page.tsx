"use client";
import { formatPrice } from "@/lib/formatPrice";
import useCart from "@/lib/hooks/useCart";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// use the script in layout.tsx file the code you written in useEffect make another file for RazorPay Payment
// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

const CartPage = () => {
  const router = useRouter();
  const { user } = useUser();
  // const [isProcessing, setIsProcessing] = useState(false);
  // const [orderId, setOrderId] = useState<string | null>(null);
  // const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  const cart = useCart();
  const subTotal = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const roundOffSubTotal = parseFloat(subTotal.toFixed(2));

  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.onload = () => {
  //     setIsRazorpayLoaded(true);
  //   };
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  // const handlePaymentWithRazorPay = async () => {
  //   setIsProcessing(true);
  //   try {
  //     if (!user) {
  //       return router.push("/sign-in");
  //     } else {
  //       // create order
  //       const response = await fetch("/api/createOrder", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ cartItems: cart.cartItems, customer }),
  //       });

  //       if (!response.ok) {
  //         const error = await response.json();
  //         console.error("Error creating order:", error);
  //         throw new Error("Error creating order");
  //       }

  //       const data = await response.json();
  //       setOrderId(data.orderId);

  //       // initialize razorpay
  //       if (isRazorpayLoaded) {
  //         const options = {
  //           key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  //           amount: roundOffSubTotal * 100, // Razorpay expects the amount in paise
  //           currency: "INR",
  //           name: "Cloth-Fever",
  //           description: "Test description",
  //           order_id: data.orderId,
  //           // this will call when payment is successful, update UI send data to server
  //           handler: function (response: any) {
  //             console.log("Payment Successful", response);
  //             // Update the UI and send the payment data to the server
  //           },
  //           prefill: {
  //             name: customer.name,
  //             email: customer.email,
  //           },
  //           theme: {
  //             color: "#3399cc",
  //           },
  //         };
  //         const rzp1 = new window.Razorpay(options);
  //         rzp1.open();
  //       } else {
  //         console.error("Razorpay script not loaded yet");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error handling payment", error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const handlePaymentWithStripe = async () => {
    try {
      if (!user) {
        router.push("/sign-in");
      } else {
        const res = await fetch(`/api/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartItems: cart.cartItems, customer }),
        });
        const data = await res.json();
        window.location.href = data.url;
        console.log(data);
      }
    } catch (err) {
      console.log("[checkout_POST]", err);
    }
  };

  return (
    <div className="flex gap-20 px-4 py-16 md:px-8 max-lg:flex-col lg:px-16 xl:px-32">
      <div className="max-lg:w-full lg:w-2/3">
        <p className="font-bold text-3xl mb-4">Shopping Cart</p>
        <hr />
        {cart.cartItems.length === 0 ? (
          <p className="font-bold">No items is in the cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem) => (
              <div
                key={cartItem.item._id}
                className="w-full flex hover:bg-gray-50 px-4 py-3 justify-between items-center max-sm:flex-col max-sm:gap-4 max-sm:items-start"
              >
                <div className="flex items-center">
                  <Image
                    src={cartItem.item.media[0]}
                    alt={cartItem.item.title}
                    width={100}
                    height={100}
                    className="rounded-lg w-32 h-32 object-cover"
                  />
                  <div className="flex flex-col gap-2 ml-4">
                    <p className="font-medium">{cartItem.item.title} </p>
                    <p className="font-medium">
                      {formatPrice(cartItem.item.price)}
                    </p>
                    {cartItem.color && (
                      <p className="text-sm">{cartItem.color}</p>
                    )}
                    {cartItem.sizes && (
                      <p className="text-sm">{cartItem.sizes}</p>
                    )}
                  </div>
                </div>
                {/* quantity etc */}
                <div className="flex items-center gap-4">
                  <MinusCircle
                    className="cursor-pointer"
                    onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                  />
                  <p className="font-medium">{cartItem.quantity}</p>
                  <PlusCircle
                    className="cursor-pointer"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                  />
                </div>
                <Trash
                  className="text-red-500 cursor-pointer"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-16 px-4 py-5 bg-gray-400 rounded-lg lg:w-1/3 max-lg:w-full">
        <p className="font-bold text-xl">
          Summary
          <span>
            {`(${cart.cartItems.length} ${
              cart.cartItems.length > 1 ? "items" : "item"
            }) `}
          </span>
        </p>
        <div className="flex justify-between font-semibold">
          <span>Total Amount : </span>
          <span>{formatPrice(roundOffSubTotal)}</span>
        </div>
        {/* checkout */}
        <div className="flex flex-col gap-4">
          {/* <button
            className=" border rounded-lg text-lg bg-white py-3 hover:bg-black hover:text-white"
            onClick={handlePaymentWithRazorPay}
          >
            Pay with Wallet etc.
          </button> */}
          <button
            className=" border rounded-lg text-lg bg-white py-3 hover:bg-black hover:text-white"
            onClick={handlePaymentWithStripe}
          >
            Pay With Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

// razorpay_order_id
// :
// "order_OnINE8GFqrjaq5"
// razorpay_payment_id
// :
// "pay_OnINYyVAfrAjdW"
// razorpay_signature
// :
// "daeb01b84a7f83c6c8190b1d635210a26ff7544708c94d5f8dbd70575e984df6"
