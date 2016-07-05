import React, { PropTypes } from 'react';
import update from 'react-addons-update';
import SolrConnector from 'react-solr-connector';
import SearchAppRenderer from './searchapprenderer';
import conf from '../conf';
import { SET_FILTER_ACTION,
         CLEAR_FILTERS_ACTION,
         SET_QUERY_ACTION,
         SET_PAGE_ACTION } from "../actions";


class SearchApp extends React.Component {

  render() {
    const searchParams = this.getSolrSearchParams();
    return <SolrConnector searchParams={searchParams}>
      <SearchAppRenderer handleActions={this.handleActions.bind(this)}/>
    </SolrConnector>;
  }

  handleActions(actions) {
    let searchParams = this.getUrlSearchParams();

    actions.forEach(act => {
      if (act.type === SET_FILTER_ACTION) {
        // const f = queryParams.filters || [];    // default empty array
        // queryParams = update(queryParams, {
        //   filters: { $set: act.apply ?
        //     f.concat([act.filter]) :            // add the new filter
        //     f.filter(x => x != act.filter)      // or remove it
        // }});
      }
      else if (act.type === CLEAR_FILTERS_ACTION) {
        // if (queryParams.filters) {
        //   const prefix = act.fieldname + ":";
        //   const filters = queryParams.filters.filter(x =>
        //     !x.startsWith(prefix));
        //   queryParams = update(queryParams, { filters: { $set: filters }});
        // }
      }
      else if (act.type === SET_QUERY_ACTION) {
        searchParams = update(searchParams, { query: { $set: act.query }});
      }
      else if (act.type === SET_PAGE_ACTION) {
        searchParams = update(searchParams, { page: { $set: act.page }});
      }
    });

    // set the new search params (in the query string)
    this.context.router.push({ query: searchParams });
  }

  // extract the raw search params from the URL
  getUrlSearchParams() {
    const urlquery = this.props.location.query;
    return {
      query: urlquery.query || "",
      page: parseInt(urlquery.page || 0)
    }
  }

  // get search params for SolrConnector
  getSolrSearchParams() {
    const params = this.getUrlSearchParams();
    return {
      solrSearchUrl: conf.solrSearchUrl,
      query: params.query,
      offset: params.page * conf.pageSize,
      length: conf.pageSize
    }
  }


    // let filters = [];
    // if (props.location.query.filt) {
    //   if (props.location.query.filt instanceof Array) {
    //     filters = props.location.query.filt.slice(0);
    //   } else {
    //     filters = [ props.location.query.filt ];
    //   }
    // }

}

SearchApp.contextTypes = {
    router: PropTypes.object.isRequired
};

SearchApp.propTypes = {
  location: PropTypes.object.isRequired
};


export default SearchApp;
