import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const search = useSearchContext();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search")
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-white shadow-md rounded-lg grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 "
    >
      <div className="flex flex-row items-center flex-1  bg-slate-200 rounded-lg p-2">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          placeholder="WHere are you going?"
          className="text-md bg-slate-200 w-full focus:outline-none"
          value={destination}
          onChange={(event) => {
            setDestination(event.target.value);
          }}
        />
      </div>

      <div className="flex  bg-slate-200 rounded-lg px-2 gap-2">
        <label className="items-center flex">
          Adults:
          <input
            className="w-full bg-slate-200 p-1 focus:outline-none font-bold"
            type="number"
            min={1}
            max={20}
            value={adultCount}
            onChange={(event) => {
              setAdultCount(parseInt(event.target.value));
            }}
          />
        </label>
        <label className="items-center flex">
          Children:
          <input
            className="w-full bg-slate-200 p-1 focus:outline-none font-bold"
            type="number"
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => {
              setChildCount(parseInt(event.target.value));
            }}
          />
        </label>
      </div>
      <div>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in Date"
          className="min-w-full  bg-slate-200 rounded-lg p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-out Date"
          className="min-w-full bg-slate-200 rounded-lg p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex gap-1">
        <button className="w-3/4 bg-sky-700 rounded-lg text-white h-full p-2 font-bold text-lg hover:bg-sky-800">
          Search
        </button>
        <button className="w-2/4 bg-red-600 rounded-lg text-white h-full p-2 font-bold text-lg hover:bg-red-500">
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
