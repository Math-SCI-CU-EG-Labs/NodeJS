/* eslint-env mocha */
const { expect } = require("chai");
const testServer = require("./test-helper");
const assertResponse = require("./assert-response");

describe("POST /setUserData", function() {
  testServer.useInTest();

  /**
   * Name validation testing
   */
  it("responds with 400 ValidationError if name is missing", async function() {
    const api = this.api;
    const request = api.post("/setUserData", {});
    return assertResponse.isValidationError(request, { name: "required" });
  });

  it("responds with 400 ValidationError if name is empty", async function() {
    const api = this.api;
    const request = api.post("/setUserData", { name: "" });
    return assertResponse.isValidationError(request, { name: "required" });
  });

  it("responds with 400 ValidationError if name is not a string", async function() {
    const api = this.api;
    const request = api.post("/setUserData", { name: 123 });
    return assertResponse.isValidationError(request, {
      name: "must be a string"
    });
  });

  /**
   * Email validation testing
   */
  it("responds with 400 ValidationError if email is missing", async function() {
    const api = this.api;
    const request = api.post("/setUserData", { name: "Mg" });
    return assertResponse.isValidationError(request, { email: "required" });
  });

  it("responds with 400 ValidationError if email is empty", async function() {
    const api = this.api;
    const request = api.post("/setUserData", { name: "Mg", email: "" });
    return assertResponse.isValidationError(request, { email: "required" });
  });

  it("responds with 400 ValidationError if email is not a string", async function() {
    const api = this.api;
    const request = api.post("/setUserData", { name: "Mg", email: 123 });
    return assertResponse.isValidationError(request, {
      email: "must be a string"
    });
  });

  /**
   * Age validation testing
   */
  it("responds with 400 ValidationError if age is missing", async function() {
    const api = this.api;
    const request = api.post("/setUserData", { name: "Mg", email: "mg" });
    return assertResponse.isValidationError(request, { age: "required" });
  });

  it("responds with 400 ValidationError if age is empty", async function() {
    const api = this.api;
    const request = api.post("/setUserData", {
      name: "Mg",
      email: "mg",
      age: ""
    });
    return assertResponse.isValidationError(request, { age: "required" });
  });

  it("responds with 400 ValidationError if age is not a number", async function() {
    const api = this.api;
    const request = api.post("/setUserData", {
      name: "Mg",
      email: "mg",
      age: "123"
    });
    return assertResponse.isValidationError(request, {
      age: "must be a number"
    });
  });

  /**
   * Successful request
   */
  it("responds with 200 { success:true, oldData, newData }", async function() {
    const api = this.api;
    await api
      .post("/setUserData", {
        name: "Mohammed",
        email: "melgayar@sci",
        age: 37
      })
      //.then(res => console.log("Old data: " + JSON.stringify(res.data.newData)));

    const response = await api
      .post("/setUserData", {
        name: "Mg",
        email: "mg",
        age: 40
      });
    //   .then(res => console.log("New data: " + JSON.stringify(res.data.newData)));

    expect(response).to.have.property("status", 200);
    expect(response.data).to.have.property("success", true);

    expect(response.data.oldData)
      .to.have.property("name")
      .that.is.a("string");
    expect(response.data.oldData).to.have.property("name", "Mohammed");

    expect(response.data.oldData)
      .to.have.property("email")
      .that.is.a("string");
    expect(response.data.oldData).to.have.property("email", "melgayar@sci");

    expect(response.data.oldData)
      .to.have.property("age")
      .that.is.a("number");
    expect(response.data.oldData).to.have.property("age", 37);

    expect(response.data.oldData)
      .to.have.property("createdAt")
      .that.is.a("string");
    expect(new Date(response.data.oldData.createdAt).valueOf()).to.be.closeTo(
      Date.now(),
      1000
    );

    expect(response.data.oldData)
      .to.have.property("updatedAt")
      .that.is.a("string");
    expect(response.data.oldData.updatedAt).to.equal(
      response.data.oldData.createdAt
    );

    expect(response.data.newData)
      .to.have.property("name")
      .that.is.a("string");
    expect(response.data.newData).to.have.property("name", "Mg");

    expect(response.data.newData)
      .to.have.property("email")
      .that.is.a("string");
    expect(response.data.newData).to.have.property("email", "mg");

    expect(response.data.newData)
      .to.have.property("age")
      .that.is.a("number");
    expect(response.data.newData).to.have.property("age", 40);

    expect(response.data.newData)
      .to.have.property("createdAt")
      .that.is.a("string");
    expect(new Date(response.data.newData.createdAt).valueOf()).to.be.closeTo(
      Date.now(),
      1000
    );

    expect(response.data.newData)
      .to.have.property("updatedAt")
      .that.is.a("string");
    expect(response.data.newData.updatedAt).to.equal(
      response.data.newData.createdAt
    );
  });

  /**
   * Space trimming
   */
  it("trims name from input", async function() {
    const api = this.api;
    const response = await api.post("/setUserData", {
      name: "  Mg ",
      email: " mg ",
      age: 37
    });
    expect(response).to.have.property("status", 200);
    expect(response.data.newData).to.have.property("name", "Mg");
    expect(response.data.newData).to.have.property("email", "mg");
  });
});
