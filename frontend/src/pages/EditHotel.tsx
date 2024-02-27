import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotalForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
  const { hotelId } = useParams();
  const {showToast} = useAppContext();
  const {mutate, isLoading} = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({message: "Hotel data updated successfully", type:"SUCCESS"})
    },
    onError: (error: Error) => {
      showToast({message:error.message, type:"ERROR"})
    }
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData)
  }


  const { data: hotel } = useQuery("fetchMyHotelById", () => {
    return apiClient.fetchMyHotelById(hotelId || "");
  }, {
    enabled: !!hotelId,
  });
  


  return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />;
};

export default EditHotel;