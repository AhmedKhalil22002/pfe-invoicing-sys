import { api } from '@/api';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { DOCUMENT_TYPE } from '@/types/enums/document-type';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useDefaultCondition = (activity_type: ACTIVITY_TYPE, document_type: DOCUMENT_TYPE) => {
  const { isPending: isFetchDefaultConditionPending, data: defaultConditionResp } = useQuery({
    queryKey: ['currencies', activity_type, document_type],
    queryFn: () => api.defaultCondition.find(activity_type, document_type)
  });

  const defaultCondition = React.useMemo(() => {
    if (defaultConditionResp) {
      return defaultConditionResp[0].value;
    } else return '';
  }, [defaultConditionResp]);

  return {
    defaultCondition,
    isFetchDefaultConditionPending
  };
};

export default useDefaultCondition;
