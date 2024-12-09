import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import api from "../utils/api";

const Routing: React.FC = () => {
    const { user } = UserAuth();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (user) {
            api.get(`/uporabnik/${user.email}`)
                .then(res => {
                    const profile = res.data;
                    setCurrentUser(profile);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching user profile:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!loading && currentUser) {
            navigate("/");
        }
    }, [loading, currentUser, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
};

export default Routing;