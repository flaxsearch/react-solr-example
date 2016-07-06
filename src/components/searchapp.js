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
    return <SolrConnector searchParams={this.getSolrSearchParams()}>
      <SearchAppRenderer searchParams={this.getUrlSearchParams()}
                         handleActions={this.handleActions.bind(this)}/>
    </SolrConnector>;
  }

  handleActions(actions) {
    const newParams = actions.reduce((params, act) => {
      if (act.type === SET_QUERY_ACTION) {
        return update(params, { query: { $set: act.query }});
      }
      else if (act.type === SET_PAGE_ACTION) {
        return update(params, { page: { $set: act.page }});
      }
      else if (act.type === CLEAR_FILTERS_ACTION) {
        let updater = {};
        updater["filter_" + act.facet] = { $set: [] };
        return update(params, updater);
      }
      else if (act.type === SET_FILTER_ACTION) {
        const paramName = "filter_" + act.facet;
        const curValues = [].concat(params[paramName] || []);
        const newValues = act.apply ?
          curValues.concat(act.value) :
          curValues.filter(v => v != act.value);
        let updater = {};
        updater[paramName] = { $set: newValues };
        return update(params, updater);
      }
      else {
        console.log("FIXME action=", act);
        return params;
      }
    }, this.getUrlSearchParams());

    // set the new search params (in the query string)
    this.context.router.push({ query: newParams });
  }

  getUrlSearchParams() {
    return Object.assign({}, this.props.location.query);
  }

  // get search params for SolrConnector
  getSolrSearchParams() {
    const params = this.getUrlSearchParams();
    const page = parseInt(params.page || 0);
    let solrParams = {
      solrSearchUrl: conf.solrSearchUrl,
      query: params.query || "",
      offset: page * conf.pageSize,
      length: conf.pageSize,
      facet: conf.facet,
      filter: []
    };

    const facetMap = makeFacetMap();

    // add filters
    Object.keys(params).forEach(key => {
      if (key.startsWith("filter_")) {
        const mapval = facetMap[key.slice(7)];
        const terms = [].concat(params[key]).map(v => `"${v}"`).join(" OR ");
        const tag = mapval.tag ? `{!tag=${mapval.tag}}` : "";
        solrParams.filter.push(`${tag}${mapval.field}:(${terms})`);
      }
    });

    return solrParams;
  }
}

SearchApp.contextTypes = {
    router: PropTypes.object.isRequired
};

SearchApp.propTypes = {
  location: PropTypes.object.isRequired
};

function makeFacetMap() {
  return Object.keys(conf.facet).reduce((o, key) => {
    const fac = conf.facet[key];
    if (fac.type == "field") {
      const tag = (fac.domain && fac.domain.excludeTags) ?
        fac.domain.excludeTags : undefined;
      o[key] = { field: fac.field, tag };
    }
    return o;
  }, {});
}

export default SearchApp;
