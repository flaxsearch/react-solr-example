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
    console.log("FIXME searchapp.render", searchParams);
    return <SolrConnector searchParams={searchParams}>
      <SearchAppRenderer handleActions={this.handleActions.bind(this)}/>
    </SolrConnector>;
  }

  handleActions(actions) {
    let searchParams = this.getUrlSearchParams();

    actions.forEach(act => {
      if (act.type === SET_QUERY_ACTION) {
        searchParams = update(searchParams, { query: { $set: act.query }});
      }
      else if (act.type === SET_PAGE_ACTION) {
        searchParams = update(searchParams, { page: { $set: act.page }});
      }
      else {
        console.log("FIXME action=", act);
      }
    });

    // set the new search params (in the query string)
    this.context.router.push({ query: searchParams });
  }

  // extract the raw search params from the URL
  getUrlSearchParams() {
    const urlquery = this.props.location.query;
    let ret = {
      query: urlquery.query || "",
      page: parseInt(urlquery.page || 0)
    };

    // collect facet filters
    Object.keys(urlquery).forEach(key => {
      if (key.startsWith("filter.")) {
        ret[key] = urlquery[key];
      }
    });

    return ret;
  }

  // get search params for SolrConnector
  getSolrSearchParams() {
    const params = this.getUrlSearchParams();
    return {
      solrSearchUrl: conf.solrSearchUrl,
      query: params.query,
      offset: params.page * conf.pageSize,
      length: conf.pageSize,
      facet: conf.facet
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
