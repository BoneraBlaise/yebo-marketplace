const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  shouldUseServerSearch,
  mapSortToApi,
  buildSearchQueryFromParams,
  buildSearchParams,
} = require("../searchQueryUtils.cjs");

describe("searchQuery helpers", () => {
  it("detects server search params", () => {
    const params = new URLSearchParams("search=phone&page=2");
    assert.equal(shouldUseServerSearch(params), true);

    const empty = new URLSearchParams("");
    assert.equal(shouldUseServerSearch(empty), false);
  });

  it("maps frontend sort keys to API sort keys", () => {
    assert.equal(mapSortToApi("priceLowToHigh"), "priceLowToHigh");
    assert.equal(mapSortToApi(""), "newest");
  });

  it("builds stable API query objects from URL params", () => {
    const params = new URLSearchParams("search=cafe&category=Food&page=3&sortBy=rating");
    const query = buildSearchQueryFromParams({
      searchParams: params,
      sortBy: "rating",
      selectedRating: 4,
      inStock: true,
      productType: "all",
    });

    assert.equal(query.q, "cafe");
    assert.equal(query.category, "Food");
    assert.equal(query.page, "3");
    assert.equal(query.sort, "rating");
    assert.equal(query.inStock, "true");
  });

  it("serializes search params for HTTP requests", () => {
    const serialized = buildSearchParams({ q: "phone", page: 2, sort: "newest" });
    assert.match(serialized, /q=phone/);
    assert.match(serialized, /page=2/);
  });
});
