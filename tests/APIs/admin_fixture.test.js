const { faker } = require("@faker-js/faker")
// const { FIXTURE_STATUS } = require("../../src/data/enums/enum");
const app = require("../../src/App").default
const supertest = require("supertest");

const request = supertest(app);
const base = "/api/v1/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXIiOiI2NjY1MDg2NmU2ZmU5ZGIwODFjNTIzNGYiLCJsb2dpblNlc3Npb24iOiI2NjY1MWZkNDVkODY0YzEyZGJjNzJjNDIifSwiaWF0IjoxNzE3OTAzMzE2LCJleHAiOjE3MTc5ODk3MTZ9.Eqp_XvFw02hTAN0kFzSQFTwhpfbbea-yySdVT4Mrr5w";

describe('POST - Add New Fixture', () => {

  test("Add Fixture Successfully With 201 Response", async () => {
    const fixture = {
      kick_off: faker.date.anytime(),
      home_team: faker.database.mongodbObjectId(),
      away_team: faker.database.mongodbObjectId(),
      referee: faker.person.fullName()
    };

    const response = await request
      .post(base+'/fixtures')
      .set('Authorization', `bearer ${token}`)
      .set('Accept', 'application/json')
      .send(fixture);
      
      expect(response.status).toBe(201);
  });

  test("Add Fixture With Error", async () => {
    const data = {
      kick_off: faker.date.anytime(),
      home_team: faker.company.name(),
      away_team: faker.company.name(),
      referee: faker.person.fullName()
    };
    
    let errorFixture = null;
    let addError = null;
    try {
      errorFixture = await fixtureRepository.save(data);
    } catch (error) {
      addError = error;
    }

    expect(errorFixture).toBeNull();
    expect(addError).not.toBeNull();
  });

})