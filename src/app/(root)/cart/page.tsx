/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { formatPrice } from "@/lib/formatPrice";
import useCart from "@/lib/hooks/useCart";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

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

  const handlePaymentWithRazorPay = async () => {
    if (!isRazorpayLoaded) {
      console.error("Razorpay script not loaded yet");
      return;
    }

    setIsProcessing(true);
    try {
      if (!user) {
        return (
          <div>
            <SignInButton mode="modal">
              <Button className="w-full text-center outline bg-black text-white hover:bg-blue-400 text-base font-bold rounded-lg px-2 py-3">
                Login
              </Button>
            </SignInButton>
          </div>
        );
      } else {
        // create order
        const response = await fetch("/api/createOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: roundOffSubTotal * 100, // Razorpay expects the amount in paise
            currency: "INR",
            cartItems: cart.cartItems.map((cartItem) => ({
              ...cartItem,
              item: JSON.stringify(cartItem.item),
            })),
            customer,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Error creating order:", error);
          throw new Error("Error creating order");
        }

        const data = await response.json();
        console.log(data);
        console.log("Order ID from backend:", data.orderId);
        setOrderId(data.orderId);

        const handlePaymentSuccess = async (response: any) => {
          console.log("Payment Successful", response);
          try {
            const verifyResponse = await fetch("/api/verifyPayment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customerId: customer.clerkId,
                cartItems: cart.cartItems,
              }),
            });

            console.log(
              "Razorpay Response Order ID:",
              response.razorpay_order_id
            );

            const result = await verifyResponse.json();

            if (result.success) {
              cart.clearCart();
              router.push("/payment_success");
            } else {
              console.error("Payment verification failed:", result.message);
              alert(`Payment verification failed: ${result.message}`);
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert(
              "An error occurred while verifying the payment. Please contact support."
            );
          }
        };

        // initialize razorpay
        if (isRazorpayLoaded) {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: roundOffSubTotal * 100, // Razorpay expects the amount in paise
            currency: "INR",
            name: "Cloth-Fever",
            description: "Test description",
            order_id: data.orderId,

            handler: handlePaymentSuccess,
            prefill: {
              name: customer.name,
              email: customer.email,
            },
            theme: {
              color: "#3399cc",
            },
          };

          console.log("Order ID passed to Razorpay:", options.order_id);

          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        } else {
          console.error("Razorpay script not loaded yet");
        }
      }
    } catch (error) {
      console.error("Error handling payment", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayLoaded(true)}
      />
      <section className="flex gap-20 px-4 md:px-6 lg:px-12 xl:px-24 py-16  max-lg:flex-col bg-cartPage-primary">
        <article className="max-lg:w-full lg:w-2/3">
          <h1 className="font-bold text-3xl mb-4">Shopping Cart</h1>
          <hr />
          {cart.cartItems.length === 0 ? (
            <p className="font-bold">No items is in the cart</p>
          ) : (
            <div className="space-y-6">
              {cart.cartItems.map((cartItem) => (
                <div
                  key={`${cartItem.item._id}-${cartItem.color}-${cartItem.sizes}`}
                  className="grid grid-cols-[auto,1fr,auto] gap-4 items-center bg-cream hover:bg-sand-light p-4 rounded-lg transition-colors duration-200"
                >
                  <Image
                    src={cartItem.item.media[0]}
                    alt={cartItem.item.title}
                    width={100}
                    height={100}
                    className="rounded-lg w-24 h-24 object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <h2 className="font-bold text-lg text-olive-dark">
                      {cartItem.item.title}
                    </h2>
                    <p className="font-medium text-bronze">
                      {formatPrice(cartItem.item.price)}
                    </p>
                    <div className="flex gap-2 text-sm text-olive">
                      {cartItem.color && <span>{cartItem.color}</span>}
                      {cartItem.sizes && <span>| Size: {cartItem.sizes}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          cart.decreaseQuantity(
                            cartItem.item._id,
                            cartItem.color,
                            cartItem.sizes
                          )
                        }
                        className="text-olive hover:text-olive-dark transition-colors"
                      >
                        <MinusCircle size={20} />
                      </button>
                      <span className="font-medium text-olive-dark w-8 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          cart.increaseQuantity(
                            cartItem.item._id,
                            cartItem.color,
                            cartItem.sizes
                          )
                        }
                        className="text-olive hover:text-olive-dark transition-colors"
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        cart.removeItem(
                          cartItem.item._id,
                          cartItem.color,
                          cartItem.sizes
                        )
                      }
                      className="text-coral hover:text-red-600 transition-colors"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
        <article className="flex flex-col gap-16 px-4 py-5 bg-gray-400 rounded-lg lg:w-1/3 max-lg:w-full max-h-72">
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
            <button
              className="border rounded-lg text-lg bg-cartPage-accent py-3 hover:bg-cartPage-accent/70 text-gray-900"
              onClick={handlePaymentWithRazorPay}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay Here"}
            </button>
          </div>
        </article>
      </section>
    </>
  );
};

export default CartPage;
