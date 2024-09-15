import { useQuery } from "@tanstack/react-query";

const fetchUsers = async () => {
  const response = await fetch(
    "http://uzak.konyasm.gov.tr:15730/api/User/getAll"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
