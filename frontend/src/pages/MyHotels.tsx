import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {},
    }
  );

  if (!hotelData) {
    return <span>No Hotels Found</span>;
  }

  return (
    <div className="space-x-5">
      <span className="flex justify-between py-4">
        <h1 className="text-2xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-sky-700 text-white text-lg rounded-lg font-bold p-2 hover:bg-sky-800"
        >
          Add Hotel
        </Link>
      </span>

      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div className="flex flex-col justify-between border bg-white shadow-md rounded-xl p-8 gap-5" key={hotel._id}>
            <h2 className="text-2xl text-sky-800 font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-sky-600 rounded-lg p-3 flex items-center">
                <BsMap className="mr-1 text-sky-700" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-sky-600 rounded-lg p-3 flex items-center">
                <BsBuilding className="mr-1 text-sky-700" />
                {hotel.type}
              </div>
              <div className="border border-sky-600 rounded-lg p-3 flex items-center">
                <BiMoney className="mr-1 text-sky-700" />${hotel.pricePerNight} Per Night
              </div>
              <div className="border border-sky-600 rounded-lg p-3 flex items-center">
                <BiHotel className="mr-1 text-sky-700" />
                {hotel.adultCount} adults, {hotel.childCount} Children
              </div>
              <div className="border border-sky-600 rounded-lg p-3 flex items-center">
                <BiStar className="mr-1 text-sky-700" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <span className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-sky-700 text-white text-lg font-bold p-2 hover:bg-sky-800 rounded-lg"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;


// 07:44:01