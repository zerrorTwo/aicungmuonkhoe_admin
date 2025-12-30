import { useSearchParams, useNavigate } from "react-router-dom";

export const useQuery = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getParam = (key: string) => searchParams.get(key);

  const push = (url: string) => {
    navigate(url);
  };

  return {
    searchParams,
    getParam,
    push,
    back: () => navigate(-1),
    navigate,
    getSearchParam: getParam,
  };
};
