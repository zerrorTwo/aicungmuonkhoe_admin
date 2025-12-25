import dayjs from "dayjs";

export const formatDateToDDMMYYYY = (date: string | Date): string => {
  return dayjs(date).format("DD/MM/YYYY");
};

export const tableScrollY = (rowCount: number): number => {
  const headerHeight = 64;
  const tableHeaderHeight = 55;
  const paginationHeight = 64;
  const rowHeight = 47;
  const padding = 48;

  return (
    window.innerHeight -
    headerHeight -
    tableHeaderHeight -
    paginationHeight -
    rowHeight * rowCount -
    padding
  );
};
