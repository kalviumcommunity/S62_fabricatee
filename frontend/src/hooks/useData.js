import axios from "../api/axios";
import useAuth from "./useAuth";

const useData = (url) => {
    const { auth } = useAuth();
    console.log("useData")

    const fetchData = async () => {
        console.log("fetchData")
        if (auth?.loggedIn) {
            try {
                const response = await axios.get(url);
                console.log("Data Fetched:", response.data);
                return { success: true, message: response.data };
            } catch (err) {
                console.error(`Error fetching data: ${err?.response?.data?.message || err.message}`);
                return {
                    success: false,
                    message: `Error fetching data: ${err?.response?.data?.message || err.message}`,
                };
            }
        } else {
            console.error("not logged in.");
            return { success: false, message: "Not Logged In" };
        }
    };

    return fetchData; // Return the function instead of calling it
};

export default useData;
