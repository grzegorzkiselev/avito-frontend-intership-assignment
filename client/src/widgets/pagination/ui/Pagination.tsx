import { Center, Pagination as StyledPagination } from "@mantine/core";
import { Dispatch } from "react";

export const Pagination = (
  { pagesCount, page, dispatch }
  : { pagesCount: number, page: number, dispatch: Dispatch<unknown> },
) => {
  const handlePaginationChange = (event: number) => {
    dispatch({ type: "page", value: event });
  };

  return <Center><StyledPagination
    total={pagesCount}
    value={page}
    onChange={handlePaginationChange}
    siblings={ pagesCount < 10 ? pagesCount : 1 }
    gap={3}
    withEdges
  /></Center>;
};
