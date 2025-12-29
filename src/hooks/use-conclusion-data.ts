import { useGetConclusionRecommendationsQuery } from "@/redux/services/healthApi";
import { keyToModel } from "@/utils/conclusion-key-mapper";

/**
 * Custom hook to wrap RTK Query and provide Redux-slice-like interface
 * This allows the form component to work with minimal changes
 */
const EMPTY_ARRAY = [];

export function useConclusionData(
  selectedKey: string,
  ageType?: string,
  gender?: string
) {
  // Map frontend key to backend model name
  const model = keyToModel(selectedKey);

  // Fetch data using RTK Query
  const { data, isLoading, isError, error } =
    useGetConclusionRecommendationsQuery({
      key: model,
      ageType,
      gender,
    });

  return {
    conclusionRecommendationList: data?.data || EMPTY_ARRAY,
    loading: isLoading,
    messageInfo: null, // Can be enhanced later for error messages
    error: isError ? error : null,
  };
}
