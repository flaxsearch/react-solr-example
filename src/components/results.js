import React, { PropTypes }  from 'react';

/*
 * A component implementing a simple results list.
 *
 * props are:
 *  results: an array of objects holding data for each result
 */

const Results = ({searchResults, highlighting}) => {
  const results = searchResults.map((hit) => {
    const features = (hit.features && hit.features instanceof Array) ?
      hit.features.map((feat) => <div key={feat}>{feat}</div>) : hit.features;

    let title = (highlighting &&
      highlighting[hit.id] && highlighting[hit.id].name) ?
      highlighting[hit.id].name.join("") : "";
    if (title == "") {
      title = hit.name || "product id " + hit.id;
    }
    const titleHtml = { __html: title };

    return <div key={hit.id} className="app_hit">
      <h5 dangerouslySetInnerHTML={titleHtml}></h5>
      <div className="app_vsp03">
        {features}
      </div>
      <div className="text-muted app_vsp03">
        Price: <em>£{hit.price}</em>
        &nbsp;&nbsp;In stock: <em>{hit.inStock ? "yes" : "no"}</em>
      </div>
    </div>;
  });

  return <div className="col-sm-8">
    {results}
  </div>;
};

Results.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  highlighting: PropTypes.object
};

export default Results;
