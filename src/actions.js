//
// actions which the app can handle
//

export const SET_FILTER_ACTION = "SET_FILTER_ACTION";
export const CLEAR_FILTERS_ACTION = "CLEAR_FILTERS_ACTION";
export const SET_QUERY_ACTION = "SET_QUERY_ACTION";
export const SET_PAGE_ACTION = "SET_PAGE_ACTION";

export function makeSetFilterAction(facet, value, apply) {
  return {
    type: SET_FILTER_ACTION,
    facet, value, apply
  };
}

export function makeClearFiltersAction(facet) {
  return {
    type: CLEAR_FILTERS_ACTION,
    facet
  };
}

export function makeSetQueryAction(query) {
  return {
    type: SET_QUERY_ACTION,
    query
  };
}

export function makeSetPageAction(page) {
  return {
    type: SET_PAGE_ACTION,
    page
  };
}
