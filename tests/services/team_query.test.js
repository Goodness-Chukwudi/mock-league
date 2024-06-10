const { faker } = require("@faker-js/faker");
const { teamRepository } = require("../../src/services/team_service");
const { TEAM_STATUS } = require("../../src/data/enums/enum");

let team = null;

describe('Add New Team', () => {

  test("Add Team Successfully", async () => {
    const data = {
      name: faker.person.fullName,
      slogan: faker.company.catchPhrase(),
      stadium: faker.company.name,
      added_by: faker.database.mongodbObjectId()
    };
    team = await teamRepository.save(data);

    expect(team).not.toBeNull();
    expect(team.status).toBe(TEAM_STATUS.ACTIVE);
  });

  test("Add Team With Error", async () => {
    const data = {
      name: faker.person.fullName,
      slogan: faker.company.catchPhrase(),
      stadium: faker.company.name
    };
    
    let errorTeam = null;
    let addError = null;
    try {
      errorTeam = await teamRepository.save(data);
    } catch (error) {
      addError = error;
    }

    expect(errorTeam).toBeNull();
    expect(addError).not.toBeNull();
  });

})


describe('Update Team', () => {

  test("Update Team Successfully", async () => {
    const newName = "new name";
    team = await teamRepository.updateById(team.id, {name: newName});

    expect(team).not.toBeNull();
    expect(team.name).toBe(newName);
  });

  test("Update Team With Error", async () => {
    const randomString = "string that's not an objectID";
    
    let teamUpdate = null;
    let updateError = null;
    try {
      teamUpdate = await teamRepository.updateById(team.id, {added_by: randomString});
    } catch (error) {
      updateError = error;
    }

    expect(teamUpdate).toBeNull();
    expect(updateError).not.toBeNull();
  });
})


describe('View Team', () => {

  test("Get Team Successfully", async () => {

    team = await teamRepository.findById(team.id);

    expect(team).not.toBeNull();
    expect(team.id).toBe(team.id);
  });

  test("Get Team With Wrong ID", async () => {
    const randomId = faker.database.mongodbObjectId();
    
    try {
      team = await teamRepository.findById(randomId);
    } catch (error) {
    }

    expect(team).toBeNull();
  });
})