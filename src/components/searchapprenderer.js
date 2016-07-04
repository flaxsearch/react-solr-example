import React from 'react';
import QueryInput from './queryinput';

const SearchAppRenderer = props => {
  const sp = props.solrConnector.searchParams || {
    query: ""
  };

  return <div>
    <QueryInput initialQuery={sp.query}
      handleActions={props.handleActions}/>
    <pre>
      {JSON.stringify(props, null, 2)}
    </pre>
  </div>
};


export default SearchAppRenderer;
