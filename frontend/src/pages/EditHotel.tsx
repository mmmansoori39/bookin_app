import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotalForm";

const EditHotel = () => {
  const { hotelId } = useParams();
  const {mutate, isLoading} = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {

    },
    onError: (error) => {

    }
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData)
  }


  const { data: hotel } = useQuery("fetchMyHotelById", () => {
    apiClient.fetchMyHotelById(hotelId || ""),
      {
        enabled: !!hotelId,
      };
  });


  return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />;
};

export default EditHotel;