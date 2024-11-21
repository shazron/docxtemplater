const expressionParser = require("../../expressions.js");
const expressionParserIE11 = require("../../expressions-ie11.js");
const { expect } = require("../utils.js");

describe("Angular parser", function () {
	it("should work", function () {
		expect(
			expressionParser("x+x", {
				tag: {
					value: "x+x",
				},
				scopePath: [],
			}).get({ x: 1 }, { scopePathItem: [] })
		).to.equal(2);

		expect(
			expressionParser("x(y)", {
				scopePath: [],
			}).get(
				{
					x(y) {
						return y * 2;
					},
					y: 3,
				},
				{ scopePathItem: [] }
			)
		).to.equal(6);
	});

	it("should work with ie 11", function () {
		const result = expressionParserIE11("x+x", {
			tag: {
				value: "x+x",
			},
			scopePath: [],
		}).get({ x: 1 }, { scopePathItem: [] });
		expect(result).to.equal(2);
	});

	it("should be able to get object identifiers", function () {
		expect(
			expressionParser("(x.y.z + x.m) / a").getObjectIdentifiers()
		).to.deep.equal({ a: {}, x: { m: {}, y: { z: {} } } });

		expect(expressionParser("x(a.b.c)").getObjectIdentifiers()).to.deep.equal({
			x: {},
			a: { b: { c: {} } },
		});
	});

	it("should be able to get object identifiers ie11", function () {
		expect(
			expressionParserIE11("(x.y.z + x.m) / a").getObjectIdentifiers()
		).to.deep.equal({ a: {}, x: { m: {}, y: { z: {} } } });

		expect(
			expressionParserIE11("x(a.b.c)").getObjectIdentifiers()
		).to.deep.equal({
			x: {},
			a: { b: { c: {} } },
		});
	});

	it("should be able to getIdentifiers", function () {
		expressionParser.filters.getimg = () => 0;

		expect(
			expressionParser("x+x", {
				scopePath: [],
				tag: {
					value: "x+x",
				},
			}).getIdentifiers()
		).to.deep.equal(["x"]);
		expect(
			expressionParser("x+users", {
				scopePath: [],
				tag: {
					value: "x+users",
				},
			}).getIdentifiers()
		).to.deep.equal(["x", "users"]);
		expect(
			expressionParser("users<= 3 && users!= 0 | getimg:foo", {
				scopePath: [],
				tag: {
					value: "users<= 3 && users!= 0 | getimg:foo",
				},
			}).getIdentifiers()
		).to.deep.equal(["users", "foo"]);
	});

	it("should be able to getIdentifiers with ie 11", function () {
		expressionParserIE11.filters.getimg = function name() {
			return 0;
		};
		expect(
			expressionParserIE11("x+x", {
				tag: {
					value: "x+x",
				},
			}).getIdentifiers()
		).to.deep.equal(["x"]);
		expect(
			expressionParserIE11("x+users", {
				tag: {
					value: "x+users",
				},
			}).getIdentifiers()
		).to.deep.equal(["x", "users"]);
		expect(
			expressionParserIE11("users<= 3 && users!= 0 | getimg:foo", {
				tag: {
					value: "x+x",
				},
			}).getIdentifiers()
		).to.deep.equal(["users", "foo"]);
	});
});
