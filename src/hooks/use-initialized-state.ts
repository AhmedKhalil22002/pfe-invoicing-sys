import React from 'react';
import _ from 'lodash';

interface UseInitializedStateProps<T> {
  data: T;
  getCurrentData: () => T;
  setFormData: (data: T) => void;
  resetData: () => void;
  loading: boolean;
}

const useInitializedState = <T>({
  data,
  getCurrentData,
  setFormData,
  resetData,
  loading
}: UseInitializedStateProps<T>) => {
  const [initialData, setInitialData] = React.useState<T | null>(null);
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);

  const initializeData = () => {
    if (data) {
      setFormData(data);
      setInitialData(getCurrentData());
      setIsDataLoaded(true);
    }
  };

  React.useEffect(() => {
    if (!loading && data && !isDataLoaded) {
      initializeData();
    }
  }, [data, loading, isDataLoaded]);

  const globalReset = () => {
    resetData();
    initializeData();
  };

  const isDisabled = React.useMemo(() => {
    if (!isDataLoaded || loading) return true;
    return _.isEqual(initialData, getCurrentData());
  }, [initialData, getCurrentData, isDataLoaded, loading]);

  return {
    isDisabled,
    globalReset,
    setInitialData,
    isDataLoaded
  };
};

export default useInitializedState;
