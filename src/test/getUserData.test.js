/* eslint-env mocha */
const { expect } = require("chai");
const testServer = require("./test-helper");

describe("GET /getPersonData", function() {
  testServer.useInTest();

  it("responds with 200, personData", async function() {
    const api = this.api;
    // Create three todos
    await api.post("/setUserData", {
      name: "Mohammed",
      email: "melgayar@sci",
      age: 37
    });
    // Make the actual request to GET /todos
    const response = await api.get("/getUserData");
    // Assert status code 200
    expect(response).to.have.property("status", 200);
    // Assert that all three todos are included
    expect(response)
      .to.have.property("data")
      .that.is.an("object");
    const data = response.data;
    // Assert that every todo contains all desired fields

    expect(data)
      .to.have.property("name")
      .that.is.a("string");
    expect(data)
      .to.have.property("email")
      .that.is.a("string");
    expect(data)
      .to.have.property("age")
      .that.is.a("number");
    expect(data)
      .to.have.property("createdAt")
      .that.is.a("string");
    expect(data)
      .to.have.property("updatedAt")
      .that.is.a("string");
  });
});
