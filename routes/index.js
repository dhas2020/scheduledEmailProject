const scheduleController = require('../controllers/scheduledEmailController')
module.exports = (app) => {
	app.post('/schedule-email', scheduleController.scheduleEmail)
	app.get('/scheduled-emails', scheduleController.getScheduledEmail)
	app.get('/scheduled-emails/:id', scheduleController.getScheduledEmailById)
	app.put('/scheduled-emails/:id', scheduleController.updateScheduledEmail)
	app.delete('/scheduled-emails/:id', scheduleController.deletedScheduledEmail)
	app.get('/failed-emails', scheduleController.failedEmails)
}
