import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Image from "next/future/image";
import { useSettings } from "../hooks/use-settings";

type Variant = "light" | "primary";

interface LogoProps {
  src?: string;
  variant?: Variant;
}

export const LightBgLogo = styled((props: LogoProps) => {
  const { src, ...other } = props;
  const { settings } = useSettings();

  // const color = variant === 'light' ? '#C1C4D6' : '#5048E5';

  return (
    <>
      <Image
        alt="logo"
        src={
          src || settings.theme === "light"
            ? "/static/go-manager-light-bg-logo.png"
            : "/static/logo-dark-theame-light-bg.png"
        }
        width={56}
        height={42}
        {...other}
        style={{
          overflow: "visible",
        }}
      />
      <style>{`
        .image {
          overflow: visible;
        }
      `}</style>
    </>
  );
})`
  .image {
    overflow: visible;
  }
`;

LightBgLogo.defaultProps = {
  variant: "primary",
};

LightBgLogo.propTypes = {
  variant: PropTypes.oneOf<Variant>(["light", "primary"]),
};