import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = ({ userData }) => {
  const user = userData.data;
  if (!user) return <div>Loading...</div>;

  return (
    <SettingSection icon={User} title={"Profile"}>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="rounded-full w-20 h-20 object-cover mr-4 bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
          {user.fullName.charAt(0)}
          {user.fullName.charAt(1)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-100">
            {user.fullName}
          </h3>
          {/* <p className="text-gray-400">
            Id :{user.id ? user.id : "No email provided"}
          </p> */}
          <p className="text-gray-400">
            {user.mail ? user.mail : "No email provided"}
          </p>
          <p className="text-gray-400">Username: {user.userName}</p>
          <p className="text-gray-400">
            Telephone:{" "}
            {user.telephone ? user.telephone : "No telephone number provided"}
          </p>
        </div>
      </div>
      {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
        Edit Profile
      </button> */}
    </SettingSection>
  );
};

export default Profile;
