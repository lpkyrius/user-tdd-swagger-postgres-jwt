/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('maintenance_task').del()
  await knex('maintenance_task').insert([
    {
      id: '500994c6-b51b-4544-8dfb-ccced2b87e73',
      user_id: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',    
      summary: 'Initial task summary #1 - from repository',
      created_at: '2023-12-24T16:17:18.622Z'
    },
    {
      id: '23c35874-d81e-4fd6-a942-3d9cb04bc87e',
      user_id: '943b7681-b1c3-4244-8a37-423ae7a3d7bc',
      summary: 'Initial task summary #2 - from repository',
      created_at: '2024-01-30T11:32:34.690Z'
    }
  ]);
};