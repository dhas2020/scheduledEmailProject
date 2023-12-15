const schedule = require('../models/scheduledEmailModel.js')
const constants = require('../constants')

module.exports = {
	scheduleEmail(req, res) {
		schedule.create_schedule(req)
			.then(data => {
				res.status(200).send({ status_code: 200,success: true, title: constants.insert_schedule_data, result: data.result })
			})
			.catch(err => res.status(400).json({ status_code: 400, error_msg: err }))
	},
	getScheduledEmail(req, res) {
		schedule.get(req)
			.then(data => res.status(200).json({ status_code: 200, success: true, title: constants.schedule_data, result: data }))
			.catch(err => res.status(400).json({ err }))
	},
	getScheduledEmailById(req, res) {
		schedule.getByID(req)
			.then(data => res.status(200).json({ total_records: data.resultCount, status_code: 200, success: true, title: constants.schedule_data_byid, result: data.result }))
			.catch(err => res.status(400).json({ err }))
	},
	updateScheduledEmail(req, res) {
		schedule.updateSchedule(req)
			.then(data => {
				res.status(200).send({ status_code: 200, title: constants.updated_schedule_data,result: data.result })
			})
			.catch(err => res.status(400).json({ status_code: 400, error_msg: err }))
	},
	deletedScheduledEmail(req, res) {
		let id = req.params.id
		/* Call the user delete function with the provided user ID   */
		schedule.delete(req.decoded, id)
			.then(data => res.status(200).json({ status_code: 200, success: true, message: constants.deleted_schedule_data }))
			.catch(err => res.status(400).json({ err }))
	},
	failedEmails(req, res) {
		schedule.getFailedEmail(req)
			.then(data => res.status(200).json({ total_records: data.resultCount, status_code: 200, success: true, title: constants.failed_email_data, result: data.result[0] }))
			.catch(err => res.status(400).json({ err }))
	}
}