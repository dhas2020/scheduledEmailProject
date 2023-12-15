
const { pool } = require('../config/db')

const schedule = {}

schedule.create_schedule = async (req) => {
	try {
		const { to_email, subject, body, scheduled_at } = req.body
		const result = await pool.query(
			'INSERT INTO scheduled_emails (to_email, subject, body, scheduled_at) VALUES ($1, $2, $3, $4) RETURNING *',
			[to_email, subject, body, scheduled_at]
		)
		// res.status(201).json(result[0])
		return { result: result[0] }
	} catch (error) {
		console.error('Error scheduling email:', error.message)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
schedule.get = async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM scheduled_emails')
		return { result }
	} catch (error) {
		console.error('Error fetching scheduled emails:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
schedule.getByID = async (req, res) => {
	const { id } = req.params
	try {
		const result = await pool.query('SELECT * FROM scheduled_emails WHERE id = $1', [id])
		if (result.rows.length > 0) {
			res.json(result[0])
		} else {
			res.status(404).json({ error: 'Scheduled email not found' })
		}
	} catch (error) {
		console.error('Error fetching scheduled email:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

schedule.updateSchedule = async (req, res) => {
	const { id } = req.params
	const { to_email, subject, body, scheduled_at } = req.body
	try {
		const result = await pool.query(
			'UPDATE scheduled_emails SET to_email = $1, subject = $2, body = $3, scheduled_at = $4 WHERE id = $5 RETURNING *',
			[to_email, subject, body, scheduled_at, id]
		)

		if (result[0].length > 0) {
			res.json(result.rows[0])
		} else {
			res.status(404).json({ error: 'Scheduled email not found' })
		}
	} catch (error) {
		console.error('Error updating scheduled email:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
schedule.delete = async (req, res) => {
	const { id } = req.params
	try {
		const result = await pool.query('DELETE FROM scheduled_emails WHERE id = $1 RETURNING *', [id])
		if (result[0].length > 0) {
			res.json({ message: 'Scheduled email deleted successfully' })
		} else {
			res.status(404).json({ error: 'Scheduled email not found' })
		}
	} catch (error) {
		console.error('Error deleting scheduled email:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
schedule.getFailedEmail = async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM scheduled_emails WHERE status = $1', ['failed'])
		return {result}
	} catch (error) {
		console.error('Error fetching failed emails:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = schedule