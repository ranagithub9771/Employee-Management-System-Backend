const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: [2, 'Name must be at least 2 characters'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,15}$/, 'Please enter a valid phone number'],
    },
    department: { type: String, required: [true, 'Department is required'], trim: true },
    designation: { type: String, required: [true, 'Designation is required'], trim: true },
    salary: { type: Number, required: [true, 'Salary is required'], min: [0, 'Salary cannot be negative'] },
    joiningDate: { type: Date, required: [true, 'Joining date is required'] },
    status: { type: String, enum: { values: ['Active', 'Inactive'], message: 'Status must be Active or Inactive' }, default: 'Active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
