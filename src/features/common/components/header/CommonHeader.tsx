import { Header, HeaderButton } from "./CommonHeader.styles";
import HeaderLogo from "./header-logo.svg";

type HeaderProps = {
  onClick?: () => void;
};

export const CommonHeader = ({ onClick }: HeaderProps) => {
  const logo = <img src={HeaderLogo} alt="RETRIVR" />;

  return (
    <Header>
      {onClick ? (
        <HeaderButton type="button" onClick={onClick}>
          {logo}
        </HeaderButton>
      ) : (
        logo
      )}
    </Header>
  );
};
