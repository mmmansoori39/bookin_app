const SearchResultsCard = (hotel) => (
  <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
    <div className="w-full h-[300px]">
      <img
        src={hotel.imageUrls[0]}
        className="w-full h-full object-cover object-center" />
    </div>
    <div className="flex flex-col justify-between">details columns</div>
  </div>
);

export default SearchResultsCard;
