import React, { Component, PropTypes } from 'react';
import { makeSetFilterAction, makeClearFiltersAction } from "../actions";

/*
 * A component implementing a query facet list.
 *
 * props should be like:
 *    multiselect: true|false (defaults to false),
 *    facets: the query facet names in an array
 *    facetData: the .facets response from Solr
 *    searchParams: the URL search params
 *    handleActions: handle one or more actions
 */

class QueryFacetList extends Component {
  render() {
    /*
     * the <li> elements are different depending on whether we have multiselect
     * facets. If so, we use checkboxes to make this obvious. Otherwise, we
     * use links.
     */

   const searchParamKeys = Object.keys(this.props.searchParams);
   let haveSelectedValue = false;
   let facitems = null;

   if (this.props.multiselect) {
      facitems = buckets.map(bucket => {
        //
        // FIXME
        //
        const key = "facet_" + bucket.val;

        const selected = filters.find(
          term => term === bucket.val) != undefined;

        haveSelectedValue = haveSelectedValue || selected;

        const handler = (event) => {
          event.preventDefault();
          this.setFilter(event.target.value, event.target.checked);
        };

        return <li key={key}>
          <input id={key} type="checkbox" onChange={handler}
           value={bucket.val} checked={selected}/>{" "}
          <label for={key}>{bucket.val} ({bucket.count})</label>
        </li>;
      });
    } else {
      facitems = this.props.facets.map(fac => {
        const selected = searchParamKeys.find(key =>
          key === "filter_" + fac.facet) != undefined;

        haveSelectedValue = haveSelectedValue || selected;
        const count = this.props.facetData[fac.facet].count;

        if (selected) {
          return <li key={"facet_" + fac.facet}>
            <label className="app_bold">
            {fac.label + " (" + count + ")"}</label></li>;
        } else {
          const handler = (event) => {
            event.preventDefault();
            this.setFilter(fac.facet, true);
          };
          return <li key={"facet_" + fac.facet}>
            <a href="#" onClick={handler}><label>{fac.label}</label></a>
            { " (" + count + ")"}
          </li>;
        }
     });
   }

    /*
     * the "any" link should only be active when a facet is selected
     */
    const any = haveSelectedValue ? <a href="#" onClick={this.unsetAll.bind(this)}>
      <em>any</em></a> : <em>any</em>;

    return <ul className="app_ul">
      {facitems}
      <li>{any}</li>
    </ul>;
  }

  // set/unset a single filter
  setFilter(facet, apply) {
    let actions = [];
    if (! this.props.multiselect) {
      // remove any other set facets in this group
      this.props.facets.forEach(fac => {
        actions.push(makeClearFiltersAction(fac.facet));
      });
    }
    actions.push(makeSetFilterAction(facet, "true", apply));
    this.props.handleActions(actions);
  }

  // unset all selected filters
  unsetAll(event) {
    event.preventDefault();
    this.props.handleActions(this.props.facets.reduce((o, fac) => {
      o.push(makeClearFiltersAction(fac.facet));
      return o;
    }, []));
  }
}

QueryFacetList.propTypes = {
  multiselect: PropTypes.bool,
  facets: PropTypes.arrayOf(PropTypes.object),
  facetData: PropTypes.object,
  searchParams: PropTypes.object,
  handleActions: PropTypes.func
};

export default QueryFacetList;
