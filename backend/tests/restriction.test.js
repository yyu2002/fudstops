// unit tests for restrictions API endpoints
const test_app = require("../testModule");
const request = require("supertest");

// user info constants for tests
const email = "restriction@test.com";
const username = "restriction";
const password = "restriction";
const phone = "0000000002";
const isAdmin = false;
const initial_rests = ["Soy"];
const after_rests = ["Soy", "Milk"];

// save/update restrictions to/in DB
describe("POST /restriction", () => {
    describe("given a user with no restrictions", () => {
        test("should return a 201", async () => {
            await createUser();
            await login();

            const response = await request(test_app)
                .post("/api/restriction")
                .send({
                    username: username,
                    restrictions: initial_rests
                });
            expect(response.statusCode).toBe(201);
        });
        test("should create new DB entry", async () => { // TODO
            expect(true).toBe(true);
        });
        test("should return a success message", async () => { // TODO
            expect(true).toBe(true);
        });
    });
    describe("given a user with existing restrictions", () => {
        test("should return a 201", async () => {
            const response = await request(test_app)
                .post("/api/restriction")
                .send({
                    username: username,
                    restrictions: after_rests
                });
            expect(response.statusCode).toBe(201);
        });
        test("should update existing DB entry", async () => { // TODO
            expect(true).toBe(true);
        });
        test("should return a success message", async () => { // TODO
            expect(true).toBe(true);
        });
    });
});

// test get restrictions
describe("GET /restriction/:username", () => {
    describe("given a user with restrictions", () => {
        test("should return a 200", async () => {
            const response = await request(test_app)
                .get("/api/restriction/" + username)
                .send();

            expect(response.statusCode).toBe(200);
        });
        test("should return user's restrictions", async () => { // TODO
            expect(true).toBe(true);
        });
    });
    describe("given an invalid username", () => {
        test("should return a 500", async () => {
            const response = await request(test_app)
                .get("/api/restriction/INVALID_USER")
                .send();

            expect(response.statusCode).toBe(500);
        });
        test("should return an error message", async () => { // TODO
            expect(true).toBe(true);
        });
    });
});

// test deleting restrictions
describe("DELETE /restriction", () => {
    describe("given a user with restrictions", () => {
        test("should return a 200", async () => {
            const response = await request(test_app)
                .delete("/api/restriction")
                .send({
                    username: username
                });

            expect(response.statusCode).toBe(200);

            await deleteUserAfterTest();
            await deleteRestrictionsAfterTest();
        });
        test("user's preferences should be deleted from DB", async () => { // TODO
            expect(true).toBe(true);
        });
    });
});

// delete the user's restrictions
async function deleteRestrictionsAfterTest() {
    await request(test_app)
        .delete("/api/restriction")
        .send({
            username: username
        });
}

// delete the user after the test is run
async function deleteUserAfterTest() {
    const loginResponse = await login();

    const userId = loginResponse._body._id;
    const JWTToken = loginResponse._body.accessToken;

    await request(test_app)
        .delete("/api/users/" + userId)
        .set("token", "Bearer " + JWTToken)
        .send();
}

// delete the user after the test is run
async function login() {
    const loginResponse = await request(test_app)
        .post("/api/auth/login")
        .send({
            loginMethod: username,
            password: password,
        });
    return loginResponse;
}

// create a user for tests
async function createUser() {
    const resp = await request(test_app)
        .post("/api/auth/register")
        .send({
            username: username,
            email: email,
            phone: phone,
            password: password,
            isAdmin: isAdmin
        });
}