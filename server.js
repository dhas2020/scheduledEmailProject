
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const schedule = require('node-schedule')
const nodemailer = require('nodemailer')
const { pool } = require('./config/db')
const constants = require('./constants')
const routes = require('./routes')
const port = 3000
app.use(bodyParser.json({ limit: '50mb' }))

routes(app)

app.use(bodyParser.json())
// Schedule email sending job
const job = schedule.scheduleJob('* * * * *', async () => {
	const unsentEmails = await pool.query('SELECT * FROM scheduled_emails WHERE status = $1', ['scheduled'])

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: constants.mail_cred.mail_user,
			pass: constants.mail_cred.mail_pass
		}
	})

	for (const email of unsentEmails) {
		try {
			await transporter.sendMail({
				to: email.to_email,
				subject: email.subject,
				text: email.body,
			})

			// Update email status to 'sent'
			await pool.query('UPDATE scheduled_emails SET status = $1 WHERE id = $2', ['sent', email.id])
		} catch (error) {
			console.error('Error sending email:', error)
			// Update email status to 'failed'
			await pool.query('UPDATE scheduled_emails SET status = $1 WHERE id = $2', ['failed', email.id])
		}
	}
})
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

app.listen(5000, () => console.log("Server Started"))
module.exports = { app }
