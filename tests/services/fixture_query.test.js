const { faker } = require("@faker-js/faker")
const { fixtureRepository } = require("../../src/services/fixture_service");
const { FIXTURE_STATUS } = require("../../src/data/enums/enum")

let fixture = null;

describe('Add New Fixture', () => {

  test("Add Fixture Successfully", async () => {
    const data = {
      venue: faker.location.streetAddress(),
      kick_off: faker.date.anytime(),
      home_team: { name: faker.company.name(), team: faker.database.mongodbObjectId() },
      away_team: { name: faker.company.name(), team: faker.database.mongodbObjectId() },
      referee: faker.person.fullName(),
      created_by: faker.database.mongodbObjectId()
    };

    fixture = await fixtureRepository.save(data);

    expect(fixture).not.toBeNull();
    expect(fixture.status).toBe(FIXTURE_STATUS.PENDING);
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


describe('Update Fixture', () => {

  test("Update Fixture Successfully", async () => {
    const newVenue = "new venue";
    fixture = await fixtureRepository.updateById(fixture.id, {venue: newVenue});

    expect(fixture).not.toBeNull();
    expect(fixture.venue).toBe(newVenue);
  });

  test("Update Fixture With Error", async () => {
    const randomString = "string that's not a date";
    
    let fixtureUpdate = null;
    let updateError = null;
    try {
      fixtureUpdate = await fixtureRepository.updateById(fixture.id, {kick_off: randomString});
    } catch (error) {
      updateError = error;
    }

    expect(fixtureUpdate).toBeNull();
    expect(updateError).not.toBeNull();
  });
})


describe('View Fixture', () => {

  test("Get Fixture Successfully", async () => {

    fixture = await fixtureRepository.findById(fixture.id);

    expect(fixture).not.toBeNull();
    expect(fixture.id).toBe(fixture.id);
  });

  test("Get Fixture With Wrong ID", async () => {
    const randomId = faker.database.mongodbObjectId();
    
    try {
      fixture = await fixtureRepository.findById(randomId);
    } catch (error) {
    }

    expect(fixture).toBeNull();
  });
})