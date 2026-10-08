const Employee = require('../models/Employee');

const FIELDS = ['name', 'email', 'phone', 'department', 'designation', 'salary', 'joiningDate', 'status'];
const pick = (body) => Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getEmployees = async (req, res, next) => {
  try {
    const { search, department, status } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

    const query = {};
    if (search && search.trim()) {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ name: rx }, { email: rx }];
    }
    if (department) query.department = department;
    if (status) query.status = status;

    const [employees, total] = await Promise.all([
      Employee.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Employee.countDocuments(query),
    ]);
    res.json({ employees, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (e) {
    next(e);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [total, active, departments] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'Active' }),
      Employee.distinct('department'),
    ]);
    res.json({
      total,
      active,
      inactive: total - active,
      totalDepartments: departments.length,
      departments: departments.sort((a, b) => a.localeCompare(b)),
    });
  } catch (e) {
    next(e);
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ employee });
  } catch (e) {
    next(e);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create({ ...pick(req.body), createdBy: req.user._id });
    res.status(201).json({ employee });
  } catch (e) {
    next(e);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ employee });
  } catch (e) {
    next(e);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (e) {
    next(e);
  }
};
