import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axioslnstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import default_avatar from "../../assets/default-avatar.svg";
import AvatarGroup from "../AvatarGroup";
const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUser, setAllUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectUsers, setTempSelectUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (res.data?.length > 0) {
        setAllUser(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectUsers((prev) => {
      return prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
    });
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectUsers);
    setIsModalOpen(false);
  };

  const handCacelClear = () => {
    setSelectedUsers([]);
  };

  const selectedUserAvatars = allUser
    .filter((user) => selectedUsers?.includes(user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUsers && selectedUsers.length === 0) {
      setTempSelectUsers([]);
    }

    return () => {};
  }, [selectedUsers]);

  return (
    <div className="">
      {selectedUserAvatars.length === 0 && (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" />
          Add member
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxvisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto ">
          {allUser.map((user) => (
            <div
              className="flex items-center gap-4 p-3 border-b border-gray-200"
              key={user._id}
            >
              <img
                src={
                  user.profileImageUrl ? user.profileImageUrl : default_avatar
                }
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1">
                <p className="font-medium text-gray-800 ">{user.name}</p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            className="card-btn"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Cancel
          </button>

          {selectedUsers.length > 0 && (
            <button className="card-btn-delete" onClick={handCacelClear}>
              Delete All
            </button>
          )}
          <button className="card-btn-fill" onClick={handleAssign}>
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
