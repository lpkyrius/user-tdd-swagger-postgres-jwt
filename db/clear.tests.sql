SELECT * FROM maintenance_task mt;
SELECT * FROM users usr;
SELECT * FROM login lg;
SELECT * FROM refresh_tokens rt;   

SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'maintenance_tasks')

----------------------------------------------------------------------------
-- < Clear tests >
----------------------------------------------------------------------------

SELECT 
	* 
-- DELETE
FROM 
	maintenance_task 
WHERE 
	SUBSTRING(summary,1,12) in ('Test summary', 'Updating tas', 'E2E Test sum');


SELECT 
	* 
-- DELETE
FROM 
	login 
WHERE 
	SUBSTRING(email,1,11) IN (
		'exist.tech.',
		'peter.tech.', 
		'user.to.fin', 
		'user.to.upd', 
		'user.to.del', 
		'success.tes', 
		'existent.em', 
		'to.update.t',
		'fail.to.upd'
	);
	


SELECT 
	*
-- DELETE
FROM 
	users 
WHERE 
	SUBSTRING(email,1,11) IN (
		'exist.tech.',
		'peter.tech.', 
		'user.to.fin', 
		'user.to.upd', 
		'user.to.del', 
		'success.tes', 
		'existent.em', 
		'to.update.t',
		'fail.to.upd'
	);

SELECT 
	*
-- DELETE
FROM 
	refresh_tokens;


----------------------------------------------------------------------------
-- </ Clear tests >
----------------------------------------------------------------------------

