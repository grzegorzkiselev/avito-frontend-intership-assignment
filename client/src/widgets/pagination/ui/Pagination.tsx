import { Center, Pagination as StyledPagination } from "@mantine/core";

export const Pagination = ({ pagesCount, page, dispatch }) => {
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