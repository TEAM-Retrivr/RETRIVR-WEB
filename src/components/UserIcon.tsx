type UserIconProps = {
  usage?: "search" | "home";
  imageURL?: string;
  alt?: string;
};

const UserIcon = ({
  imageURL,
  usage = "home",
  alt = "프로필 이미지",
}: UserIconProps) => {
  const iconBoxSize =
    usage === "home"
      ? "w-18 h-18 border border-neutral-gray-4 border-[0.6px] shadow-profile"
      : "w-14 h-14  shadow-[0_0_3px_1px_rgba(92,174,255,0.4)]";
  const iconSize = usage === "home" ? "w-10" : "w-7";
  const wrapperClass = `${iconBoxSize} flex items-center justify-center rounded-full  bg-neutral-white pt-2  overflow-hidden`;
  if (!imageURL)
    return (
      <div className={wrapperClass}>
        <img
          className={iconSize}
          src="/icons/default-profile.svg"
          alt="기본 프로필"
        />
      </div>
    );

  return (
    <div className={wrapperClass}>
      <img src={imageURL} alt={alt} className=" object-cover" />
    </div>
  );
};

export default UserIcon;
