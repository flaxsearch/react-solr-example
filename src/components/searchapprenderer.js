import React from 'react';
import QueryInput from './queryinput';
import Stats from './stats';
import Results from './results';
import Pager from './pager';
import TermFacetList from './termfacetlist';
import conf from '../conf';


const SearchAppRenderer = props => {
  console.log("FIXME SearchAppRenderer props:", props);

  const params = props.solrConnector.searchParams;
  const response = props.solrConnector.response ?
    props.solrConnector.response.response : null;
  const header = props.solrConnector.response ?
    props.solrConnector.response.responseHeader : null;
  const haveResults = response && response.numFound > 0;

  let row2 = null;
  let row3 = null;
  let row4 = null;

  if (response) {
    row2 = <div className="row app_vsp05">
      <Stats qtime={header.QTime}
        numFound={response.numFound}
        start={response.start}
        len={response.docs.length} />
      <div className="col-sm-4">
        <strong>Refine search</strong>
      </div>
    </div>;

    if (haveResults) {
      const facets = props.solrConnector.response.facets;

      row3 = <div className="row app_vsp15">
        <Results searchResults={response.docs}/>
        <div className="col-sm-4">
          <h5>Manufacturer:</h5>
          <TermFacetList multiselect={false}
            facet={"manufacturer"}
            buckets={facets.manufacturer.buckets}
            filters={[]}
            handleActions={props.handleActions} />
          <h5 className="app_vsp15">Category:</h5>
          FIXME
          <h5 className="app_vsp15">Price range:</h5>
          FIXME
        </div>
      </div>;

      // only show pager if required
      if (response.start > 0 || response.numFound > response.docs.length) {
        row4 = <div className="row app_vsp05">
          <div className="col-sm-8">
            <Pager numFound={response.numFound}
              start={response.start}
              len={response.docs.length}
              handleActions={props.handleActions}
              pageSize={conf.pageSize} />
          </div>
        </div>;
      }
    }
  }

  const busy = props.solrConnector.busy ? <h4>searching...</h4> : null;

  return <div className="container">
    <div className="row">
      <QueryInput initialQuery={params.query} handleActions={props.handleActions}/>
    </div>
    {row2} {row3} {row4}
    {busy}
  </div>;

};


export default SearchAppRenderer;
