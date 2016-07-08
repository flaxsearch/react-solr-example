import React, { Component, PropTypes } from 'react';
import { makeSetFilterAction, makeClearFiltersAction } from "../actions";

const COLLAPSED_LENGTH = 5;

/*
 * A component implementing a simple facet list.
 *
 * props should be like:
 *    multiselect: true|false (defaults to false),
 *    facet: the facet name,
 *    buckets: from Solr response
 *    filters: array of terms which have been selected from this facet list
 *    handleActions: handle one or more actions
 */

class TermFacetList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true   // hide more than COLLAPSED_LENGTH?
    }

    this.toggleShowAll = this.toggleShowAll.bind(this);
    this.unsetAll = this.unsetAll.bind(this);
  }

  render() {
    if (this.props.buckets == undefined ||
        this.props.buckets.length == 0)
    {
      // no facets, so return an empty list
      return <ul className="app_ul"></ul>;
    }

   const collapsible = this.props.buckets.length > COLLAPSED_LENGTH;

    // collapse long facet list by default
   const buckets = (collapsible && this.state.collapsed) ?
     this.props.buckets.slice(0, COLLAPSED_LENGTH) : this.props.buckets;

    /*
     * the <li> elements are different depending on whether we have multiselect
     * facets. If so, we use checkboxes to make this obvious. Otherwise, we
     * use links.
     */

   const filters = [].concat(this.props.filters || []);
   let haveSelectedValue = false;
   let facitems = null;

   if (this.props.multiselect) {
      facitems = buckets.map(bucket => {
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
      facitems = buckets.map(bucket => {
        const key = "facet_" + bucket.val;

        const selected = filters.find(
          term => term === bucket.val) != undefined;

        haveSelectedValue = haveSelectedValue || selected;

        if (selected) {
          return <li key={key}><label className="app_bold">
            {bucket.val + " (" + bucket.count + ")"}</label>
          </li>;
        } else {
          const handler = (event) => {
            event.preventDefault();
            this.setFilter(bucket.val, true);
          };
          return <li key={key}>
            <a href="#" onClick={handler}><label>{bucket.val}</label></a>
            { " (" + bucket.count + ")"}
          </li>;
        }
     });
   }

    /*
     * display a collapse toggle?
     */
    const collapseLink = collapsible ?
      <li><a href="#" onClick={this.toggleShowAll}>
        <em>{this.state.collapsed ? "show more" : "show fewer"}</em>
        </a></li> : "";

    /*
     * the "any" link should only be active when a facet is selected
     */
    const any = haveSelectedValue ? <a href="#"onClick={this.unsetAll}>
      <em>any</em></a> : <em>any</em>;

    return <ul className="app_ul">
      {facitems}
      {collapseLink}
      <li>{any}</li>
    </ul>;
  }

  // set/unset a single filter
  setFilter(term, apply) {
    if (this.props.multiselect) {
      this.props.handleActions([
        makeSetFilterAction(this.props.facet, term, apply)
      ]);
    } else {
      this.props.handleActions([
        makeClearFiltersAction(this.props.facet),
        makeSetFilterAction(this.props.facet, term, apply)
      ]);
    }
  }

  // unset all selected filters
  unsetAll(event) {
    event.preventDefault();
    this.props.handleActions([
      makeClearFiltersAction(this.props.facet)
    ]);
  }

  toggleShowAll(event) {
    event.preventDefault();
    this.setState({ collapsed: !this.state.collapsed });
  }
}

TermFacetList.propTypes = {
  multiselect: PropTypes.bool,
  facet: PropTypes.string,
  buckets: PropTypes.arrayOf(PropTypes.shape({
    val: PropTypes.string,
    count: PropTypes.number
  })),
  filters: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  handleActions: PropTypes.func
};

export default TermFacetList;
