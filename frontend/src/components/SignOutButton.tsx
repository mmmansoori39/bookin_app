import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {showToast} = useAppContext()

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken")
            showToast({message: "Signed out successfully!", type: "SUCCESS"})
            // navigate("/")
        },
        onError: ( error: Error) => {
            showToast({ message: error.message, type: "ERROR"})
        }
    })

    const handleClick = () => {
        mutation.mutate();
    }

    return (
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold rounded bg-white hover:bg-gray-100">Sign out</button>
    )
};

export default SignOutButton;