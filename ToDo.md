# To-Do

##### predefined

- [x] Project structure
- [x] TDD
- [x] Task class
- [x] In-Memory repository
- [x] Unit tests
- [x] E2E tests - addressing the factory to in-memory repository.
- [x] Swagger API Docs.
- [x] User class (not integrated yet)
    - [x] User Entity
    - [x] User Interface
    - [x] Mocked Users
    - [x] TDD ManagerUserTestFile
    - [x] TDD User Repository In-Memory (Start with the methods signature only)
    - [x] TDD Services - UserService
    - [x] Setting up switch mode for e2e tests using .env
    - [x] TDD add cryptography sequence for passwords
    - [x] TDD Router - UserService
    - [x] TDD Controller - UserService
    - [x] Swagger update - add User process

##### This phase

> ⭐️ Save the UUID keys in database as binary type

- [x] Persist data with MySQL
    - [x] Knex migrations;
    - [x] Factory following the new persist repository;
    - [x] Create the persistent repository only with the methods signature;
    - [x] TDD is already done since I made it for in-memory repository;

##### Next phase

- [ ] Integrate with JWT to manage tasks only if logged in
- [ ] Integrate Users authentication (JWT) for Tasks management;