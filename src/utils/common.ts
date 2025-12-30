import dayjs from "dayjs";

export const formatDateToDDMMYYYY = (date: string | Date): string => {
  return dayjs(date).format("DD/MM/YYYY");
};

export const formatDateToHHmmDDMMYYYY = (date: string | Date): string => {
  return dayjs(date).format("HH:mm DD/MM/YYYY");
};

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

export const handleDownload = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handlePositiveNumberInputKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (["-", "e", "E", "+"].includes(e.key)) {
    e.preventDefault();
  }
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
