import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import api from "../utils/api";
import { IUser } from "../models/user";

const EmployeeRouting: React.FC = () => {
    const { user } = UserAuth();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<IUser>({
        id: "",
        ime: "",
        priimek: "",
        email: "",
        geslo: "",
        tip: "",
      });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (user) {
            api.get(`/uporabnik/${user.email}`)
                .then(res => {
                    const profile: IUser = res.data;
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
        if (!loading) {
            if (!user) {
                navigate("/login");
            } else if (currentUser && currentUser.tip !== "delavec") {
                navigate("/");
            }
        }
    }, [user, loading, currentUser, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
};

export default EmployeeRouting;