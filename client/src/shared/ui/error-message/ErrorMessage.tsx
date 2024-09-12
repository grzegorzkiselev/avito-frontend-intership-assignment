import { Alert } from "@mantine/core";

export const ErrorMessage = ({ children }) => {
  return <Alert variant="light" color="red" radius="md">
    { children }
  </Alert>;
};
