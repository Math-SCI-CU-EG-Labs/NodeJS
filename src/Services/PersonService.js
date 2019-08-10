const ValidationError = require("../errors/ValidationError");
const fs = require("fs");

module.exports = class PersonService {

  constructor(fileName) {
    this.personData = { name: "MG", email: "mg", age: 35 };
    this.fileName = fileName;
    try {
      const data = fs.readFileSync(this.fileName, "utf-8");
      console.log(data);
      this.personData = JSON.parse(data);
    } catch (error) {
      fs.writeFileSync(this.fileName, JSON.stringify(this.personData));
    }
  }

  async getData() {
    return this.personData;
  }

  async updateData(newData) {
    if (!newData.name) {
      throw new ValidationError({ name: "required" });
    }
    if (typeof newData.name !== "string") {
      throw new ValidationError({ name: "must be a string" });
    }
    if (!newData.email) {
      throw new ValidationError({ email: "required" });
    }
    if (typeof newData.email !== "string") {
      throw new ValidationError({ email: "must be a string" });
    }
    if (!newData.age) {
      throw new ValidationError({ age: "required" });
    }
    if (typeof newData.age !== "number") {
      throw new ValidationError({ age: "must be a number" });
    }
    newData.name = newData.name.trim();
    newData.email = newData.email.trim();
    newData.createdAt = new Date();
    newData.updatedAt = new Date();

    const oldData = this.personData;

    this.personData = newData;
    fs.writeFile(this.fileName, JSON.stringify(this.personData), "utf8", function(err) {
      if (err) new ValidationError({file: "error writing file",err});
      console.log("Saved!");
    });

    return { success: true, oldData, newData };
  }
};
