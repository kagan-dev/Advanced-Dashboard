import { useState, useEffect } from "react";
import { toast } from "react-toastify"; 
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import axios from "axios";

const UserAuth = ({ userData }) => {
  const userId = userData.data.id;
  const [operationClaims, setOperationClaims] = useState([]);
  const [userClaimsMap, setUserClaimsMap] = useState({});
  const [error, setError] = useState(null);

  // API uç noktalarına göre veri al
  const fetchOperationClaims = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found."); // Use toast for errors
      return [];
    }

    try {
      const response = await fetch(
        "http://10.42.41.36:81/api/OperationClaim/getall",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch operation claims.");
      }

      const data = await response.json();
      return data.data || []; // Default to empty array if data is null
    } catch (err) {
      toast.error("Error fetching operation claims."); // Use toast for errors
      return [];
    }
  };

  const fetchUserOperationClaims = async (userId) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found."); // Use toast for errors
      return [];
    }

    try {
      const response = await fetch(
        `http://10.42.41.36:81/api/UserOperationClaim/getall`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user operation claims.");
      }

      const data = await response.json();
      return data.data || []; // Default to empty array if data is null
    } catch (err) {
      toast.error("Error fetching user operation claims."); // Use toast for errors
      return [];
    }
  };

  // Kullanıcı yetkilerini güncelle
  const updateUserOperationClaim = async (
    userId,
    operationClaimId,
    add,
    id
  ) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found."); // Use toast for errors
      return;
    }

    const url = `http://10.42.41.36:81/api/UserOperationClaim/${add ? "add" : "delete"}`;
    const method = add ? "POST" : "DELETE";
    const requestBody = add
      ? { userId, operationClaimId }
      : { userId, operationClaimId, id };

    try {
      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: requestBody,
      });

      if (response.status === 200) {
        toast.success(
          `Successfully ${add ? "added" : "removed"} operation claim.`
        ); // Use toast for success
      } else {
        throw new Error(`Failed to ${add ? "add" : "remove"} operation claim.`);
      }
    } catch (err) {
      toast.error(`Error ${add ? "adding" : "removing"} operation claim.`); // Use toast for errors
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [claims, userClaims] = await Promise.all([
          fetchOperationClaims(),
          fetchUserOperationClaims(userId),
        ]);

        setOperationClaims(claims);

        const claimsMap = {};
        userClaims.forEach(({ id, userId: uId, operationClaimId }) => {
          if (uId === userId) {
            claimsMap[operationClaimId] = { isAssigned: true, id };
          }
        });

        setUserClaimsMap(claimsMap);
      } catch (err) {
        toast.error("Error fetching data."); // Use toast for errors
      }
    };

    fetchData();
  }, [userId]);

  const handleToggle = async (operationClaimId) => {
    const isCurrentlyAssigned =
      userClaimsMap[operationClaimId]?.isAssigned || false;
    const claimId = userClaimsMap[operationClaimId]?.id;

    const newUserClaimsMap = { ...userClaimsMap };

    if (isCurrentlyAssigned) {
      delete newUserClaimsMap[operationClaimId];
    } else {
      newUserClaimsMap[operationClaimId] = { isAssigned: true, id: claimId };
    }

    setUserClaimsMap(newUserClaimsMap);
    await updateUserOperationClaim(
      userId,
      operationClaimId,
      !isCurrentlyAssigned,
      claimId
    );
  };

  return (
    <SettingSection icon={Bell} title={"User Operation"}>
      {error && <div className="error-message">{error}</div>}
      {operationClaims.map((claim) => (
        <ToggleSwitch
          key={claim.id}
          label={claim.name}
          isOn={!!userClaimsMap[claim.id]?.isAssigned} // Switch açık mı kontrolü
          onToggle={() => handleToggle(claim.id)}
        />
      ))}
    </SettingSection>
  );
};

export default UserAuth;
