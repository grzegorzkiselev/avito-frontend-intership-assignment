import { DEFAULT_THEME, ImageProps, Image as StyledImage } from "@mantine/core";
import classes from "./Image.module.css";

export const Image = ({ ...props }: ImageProps & { alt?: string }) => {
  return <StyledImage {...props} src={props.src} className={classes.image} alt={props.alt || "none"} style={{ ...props.style, "--fallback-color": DEFAULT_THEME.colors.gray[3] }} />;
};
