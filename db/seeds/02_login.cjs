/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  console.log('The password for the 3 users created will be each email user (until the @) + 123. For example, john.manager@123 will be the password for the manager john.manager@email.com')
  await knex('login').del()
  await knex('login').insert([
    {
      id: '534b7681-b1c3-4244-8a37-423ae7a3d8ad',
      email: 'john.manager@email.com',
      password: '$2a$10$Vyu.KpCEqyiRQV1iiJLD4OBuYd598E9kFUDo.HDwZfQTaixyR1MSK'
    },
    {
      id: '944b7681-b1c3-4244-8a37-423ae7a3d7bd',
      email: 'mary.tech@email.com',
      password: '$2a$10$ivVPqg7qdwZpUG6Ad566/.VpbPhCADQl3fEH8eHIlHPU.OdgwywSm'
    }
  ]);
};
