// 전체 화면 기본 틀
export const Layout = ({
  children,
  overflowVisible = false,
}: {
  children: React.ReactNode;
  overflowVisible?: boolean;
}) => {
  return (
    <div className="min-h-screen bg-neutral-gray flex justify-center content-center md:items-center">
      {/* 앱 컨테이너: 디자인 기준인 402px가 max-width */}
      <main
        className={`w-full max-w-[402px] h-screen max-h-[874px] bg-neutral-white shadow-xl no-scrollbar relative flex flex-col ${
          overflowVisible ? "overflow-visible" : "overflow-y-auto"
        }`}
      >
        {children}
      </main>
    </div>
  );
};
