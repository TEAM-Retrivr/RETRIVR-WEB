import React, { useState } from "react";

const UserIcon = () => {
  const [profileImage, setProfileImage] = useState("");
  if (!profileImage)
    return (
      <div className="flex w-18 h-18 bg-neutral-white items-center justify-center rounded-[50%] border border-neutral-gray-4 border-[0.6px] shadow-profile">
        <img src="/icons/default-profile.svg" alt="기본 프로필" />
      </div>
    );

  return (
    <div className="w-18 h-18 bg-neutral-white items-center">
      <img src={profileImage} alt="프로필 이미지" />
    </div>
  );
};

export default UserIcon;
