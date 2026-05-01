import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const usePaginatedFetch = ({
  fetchAction,
  selectData,
  selectLoading,
  selectPagination,
  fetchParams = {},
  limit = 12,
}) => {
  const dispatch = useDispatch();
  const [page, setPage]         = useState(1);
  const [fetchKey, setFetchKey] = useState(0); // ✅ force re-fetch even when page stays at 1

  const data       = useSelector(selectData);
  const isLoading  = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);

  const fetchActionRef = useRef(fetchAction);
  const fetchParamsRef = useRef(fetchParams);
  const isLoadingRef   = useRef(isLoading);

  useEffect(() => { fetchActionRef.current = fetchAction; }, [fetchAction]);
  useEffect(() => { fetchParamsRef.current = fetchParams; }, [fetchParams]);
  useEffect(() => { isLoadingRef.current   = isLoading;   }, [isLoading]);

  // ✅ fetchKey in deps — tag/param change pe forcefully re-fetch
  useEffect(() => {
    dispatch(fetchActionRef.current({
      ...fetchParamsRef.current,
      page,
      limit,
    }));
    if (page === 1) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, fetchKey, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ fetchParams change hone pe page reset + fetchKey bump
  const fetchParamsStr     = JSON.stringify(fetchParams);
  const prevFetchParamsStr = useRef(fetchParamsStr);

  useEffect(() => {
    if (prevFetchParamsStr.current !== fetchParamsStr) {
      prevFetchParamsStr.current = fetchParamsStr;
      setPage(1);
      setFetchKey(k => k + 1); // ✅ forces re-fetch even if page was already 1
    }
  }, [fetchParamsStr]);

  const loadMore = useCallback(() => {
    if (pagination?.hasNextPage && !isLoadingRef.current) {
      setPage(prev => prev + 1);
    }
  }, [pagination?.hasNextPage]);

  // ✅ resetPage bhi fetchKey bump kare
  const resetPage = useCallback(() => {
    setPage(1);
    setFetchKey(k => k + 1);
  }, []);

  const isFetchingMore = isLoading && page > 1;

  return {
    data,
    isLoading,
    isFetchingMore,
    pagination,
    page,
    loadMore,
    resetPage,
  };
};

export default usePaginatedFetch;