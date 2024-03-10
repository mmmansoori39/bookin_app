import { useForm } from "react-hook-form";
import {
  PaymentIntentResposne,
  UserType,
} from "../../../../backend/src/shared/types";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResposne;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
  clientSeceret: string;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {

  const search = useSearchContext();
  const { hotelId } = useParams();

  const { showToast } = useAppContext();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
      },

      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    },
  );
  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
      clientSeceret: paymentIntent.clientSeceret,
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    console.log("PaymentIntent:", paymentIntent);
  
    try {
      const razorpayOptions = {
        key: import.meta.env.RAZORPAY_KEY_ID,
        amount: paymentIntent.totalCost * 100, // Amount in paisa
        currency: 'INR',
        name: 'Your Hotel Name',
        description: 'Booking for ' + hotelId + ' nights',
        order_id: paymentIntent.paymentIntentId,
        prefill: {
          name: formData.firstName + ' ' + formData.lastName,
          email: formData.email,
        },
        theme: {
          color: '#528FF0',
        },
      };
  
      const razorpay = new window.Razorpay(razorpayOptions);
  
      razorpay.on('payment.success', async (response: any) => {
        console.log('Payment success:', response);
  
        // Call your backend to confirm the payment and save the booking
        await bookRoom({ ...formData, paymentIntentId: response.razorpay_payment_id });
      });
  
      razorpay.on('payment.error', (error: any) => {
        console.error('Payment error:', error);
        showToast({ message: 'Payment failed', type: 'ERROR' });
      });
  
      razorpay.open();
    } catch (error) {
      console.error('Error handling Razorpay payment:', error);
      showToast({ message: 'Error processing payment', type: 'ERROR' });
    }
  };
  
  

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 bg-white text-gray-500 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full bg-white py-2 px-3 text-gray-500 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded bg-white w-full py-2 px-3 text-gray-500 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
        <div className="bg-sky-400 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: ₹{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-sky-700 text-white p-2 font-bold hover:bg-sky-800 rounded-lg text-md disabled:bg-gray-500"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
