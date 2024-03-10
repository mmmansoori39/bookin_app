import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { loadRazorpay } from "../api-client";
import { PaymentIntentResposne } from "../../../backend/src/shared/types";

const Booking = () => {

  const search = useSearchContext();
  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    const nights =
      Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
      (1000 * 60 * 60 * 24);

    setNumberOfNights(Math.ceil(nights));
  }, [search.checkIn, search.checkOut]);

  const { data: orderId, isLoading } = useQuery<PaymentIntentResposne>(
    "createRazorpayOrder",
    () =>
    apiClient.createRazorpayOrder(hotelId as string, numberOfNights)
      ,
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  const handlePayment = async () => {
    try {
      await loadRazorpay();

      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID, // Replace with your actual Razorpay key
        amount: numberOfNights * hotel?.pricePerNight! * 100, // Amount in paisa
        currency: 'usd',
        name: hotel?.name,
        description: 'Booking for ' + numberOfNights + ' nights',
        order_id: orderId,
        handler: function (response: any) {
          console.log('Payment success:', response);
        },
        prefill: {
          name: currentUser?.firstName || '',
          email: currentUser?.email || '',
        },
        theme: {
          color: '#528FF0',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in handling payment:", error);
    }
  };
  

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {currentUser && orderId && (
        <div>
          <BookingForm currentUser={currentUser} paymentIntent={orderId} />
          <p>Order Id: {orderId.paymentIntentId} </p>
          <button onClick={handlePayment}>Proceed to Payment</button>
        </div>
      )}
      {
      isLoading && <p>Loading...</p>
    }
    </div>
    
  );
};

export default Booking;
