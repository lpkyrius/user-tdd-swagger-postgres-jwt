/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
      email: 'john.manager@email.com',
      role: '1',
      created_at: '2023-12-24T16:17:18.622Z'
    },
    {
      id: '943b7681-b1c3-4244-8a37-423ae7a3d7bc',
      email: 'mary.tech@email.com',
      role: '2',
      created_at: '2024-01-30T11:32:34.690Z'
    }
  ]);
};