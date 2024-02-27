import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import { GiJasmine } from "react-icons/gi";
import SearchBar from "../components/SearchBar";
import { AiFillStar } from "react-icons/ai";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);

  const searchParams = {
    desination: search.destination,
    checkIn: search.chechIn.toString(),
    chechOut: search.chechOut.toString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () => {
    return apiClient.searchHotels(searchParams);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-5 ">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
        </div>
        {hotelData?.data.map((hotel) => (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
              <div className="w-full h-[300px]">
                <img
                  src={hotel.imageUrls[0]}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="grid grid-rows-[1fr_2fr_1fr]">
                <div>
                  <div className="flex items-center">
                    <span className="flex">
                      {Array.from({ length: hotel.starRating }).map(() => (
                        <AiFillStar className="fill-yellow-400" />
                      ))}
                    </span>
                    <span className="ml-1 text-sm"> {hotel.type} </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Search;
