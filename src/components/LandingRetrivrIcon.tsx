import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LandingRetrivrIcon = () => {
  return (
    <div className="relative h-[200px] w-[200px] shrink-0 overflow-y-visible">
      <div
        className="h-[146px] w-[146px] shrink-0"
        role="img"
        aria-label="리트리버 캐릭터 로고"
      >
        <DotLottieReact
          src="/animations/landing-retrivr-icon.lottie"
          loop
          autoplay
          width={200}
          height={200}
          layout={{ fit: "contain", align: [0.5, 0.5] }}
          style={{ width: "200px", height: "200px" }}
        />
      </div>
    </div>
  );
};

export default LandingRetrivrIcon;
