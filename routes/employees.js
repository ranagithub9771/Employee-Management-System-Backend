const router = require('express').Router();
const protect = require('../middleware/auth');
const c = require('../controllers/employeeController');

router.use(protect); // every employee route requires a valid JWT

router.get('/stats', c.getStats); // must be declared before '/:id'
router.route('/').get(c.getEmployees).post(c.createEmployee);
router.route('/:id').get(c.getEmployee).put(c.updateEmployee).delete(c.deleteEmployee);

module.exports = router;
