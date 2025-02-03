import React from 'react';

interface LoggerActionsContextProps {
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  order?: boolean;
  sortKey?: string;
  setSortDetails?: (order: boolean, sortKey: string) => void;
  newLogsCount?: number;
  setNewLogsCount?: (value: number) => void;
  toggleConnection?: () => void;
  isConnected?: boolean;
}

export const LoggerActionsContext = React.createContext<LoggerActionsContextProps>({});

export const useLoggerActions = () => React.useContext(LoggerActionsContext);
