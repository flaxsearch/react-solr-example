export default {
  solrSearchUrl: "http://localhost:8983/solr/techproducts/select",
  pageSize: 10,
  facet: {
    manufacturer: {
      type: "field",
      field: "manu_id_s",
      domain: { excludeTags: "MANU" }
    },
    category: {
      type: "field",
      field: "cat",
      domain: { excludeTags: "CAT" }
    },
    price_0_100: {
      type: "query",
      q: "price:[0 TO 100]"
    },
    price_101_: {
      type: "query",
      q: "price:[100 TO *]"
    }
  }
};
