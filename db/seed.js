const db = require('./database');
const { v4: uuidv4 } = require('uuid');

const seed = () => {
  // Clear existing data
  db.exec(`DELETE FROM leave_requests; DELETE FROM users; DELETE FROM leave_types;`);

  // Leave Types
  const leaveTypes = [
    { id: uuidv4(), name: 'Sick', yearly_quota: 10 },
    { id: uuidv4(), name: 'Casual', yearly_quota: 12 },
    { id: uuidv4(), name: 'WFH', yearly_quota: 24 },
    { id: uuidv4(), name: 'Comp-off', yearly_quota: 6 },
  ];

  const insertLeaveType = db.prepare(`INSERT INTO leave_types (id, name, yearly_quota) VALUES (?, ?, ?)`);
  leaveTypes.forEach(lt => insertLeaveType.run(lt.id, lt.name, lt.yearly_quota));

  // Managers
  const managers = [
    { id: uuidv4(), name: 'Rajesh Kumar', email: 'rajesh@company.com', role: 'manager', department: 'Engineering' },
    { id: uuidv4(), name: 'Priya Sharma', email: 'priya@company.com', role: 'manager', department: 'Design' },
    { id: uuidv4(), name: 'Anil Mehta', email: 'anil@company.com', role: 'manager', department: 'Operations' },
  ];

  // Employees
  const employees = [
    { id: uuidv4(), name: 'Amit Singh', email: 'amit@company.com', role: 'employee', department: 'Engineering' },
    { id: uuidv4(), name: 'Sneha Patel', email: 'sneha@company.com', role: 'employee', department: 'Engineering' },
    { id: uuidv4(), name: 'Rahul Verma', email: 'rahul@company.com', role: 'employee', department: 'Design' },
    { id: uuidv4(), name: 'Pooja Nair', email: 'pooja@company.com', role: 'employee', department: 'Design' },
    { id: uuidv4(), name: 'Vikram Das', email: 'vikram@company.com', role: 'employee', department: 'Operations' },
    { id: uuidv4(), name: 'Neha Joshi', email: 'neha@company.com', role: 'employee', department: 'Engineering' },
    { id: uuidv4(), name: 'Karan Malhotra', email: 'karan@company.com', role: 'employee', department: 'Operations' },
    { id: uuidv4(), name: 'Divya Rao', email: 'divya@company.com', role: 'employee', department: 'Design' },
    { id: uuidv4(), name: 'Suresh Iyer', email: 'suresh@company.com', role: 'employee', department: 'Engineering' },
    { id: uuidv4(), name: 'Meera Pillai', email: 'meera@company.com', role: 'employee', department: 'Operations' },
    { id: uuidv4(), name: 'Arjun Khanna', email: 'arjun@company.com', role: 'employee', department: 'Engineering' },
    { id: uuidv4(), name: 'Kavya Menon', email: 'kavya@company.com', role: 'employee', department: 'Design' },
    { id: uuidv4(), name: 'Rohit Gupta', email: 'rohit@company.com', role: 'employee', department: 'Operations' },
    { id: uuidv4(), name: 'Ananya Bose', email: 'ananya@company.com', role: 'employee', department: 'Engineering' },
    { id: uuidv4(), name: 'Siddharth Roy', email: 'siddharth@company.com', role: 'employee', department: 'Design' },
    { id: uuidv4(), name: 'Lakshmi Nair', email: 'lakshmi@company.com', role: 'employee', department: 'Operations' },
    { id: uuidv4(), name: 'Tushar Shah', email: 'tushar@company.com', role: 'employee', department: 'Engineering' },
    { id: uuidv4(), name: 'Riya Desai', email: 'riya@company.com', role: 'employee', department: 'Design' },
    { id: uuidv4(), name: 'Manish Tiwari', email: 'manish@company.com', role: 'employee', department: 'Operations' },
    { id: uuidv4(), name: 'Nisha Kapoor', email: 'nisha@company.com', role: 'employee', department: 'Engineering' },
  ];

  const insertUser = db.prepare(`INSERT INTO users (id, name, email, role, department) VALUES (?, ?, ?, ?, ?)`);
  [...managers, ...employees].forEach(u => insertUser.run(u.id, u.name, u.email, u.role, u.department));

  // Leave Requests
  const statuses = ['pending', 'approved', 'rejected'];
  const insertLeave = db.prepare(`
    INSERT INTO leave_requests (id, user_id, manager_id, leave_type_id, start_date, end_date, working_days, reason, status, manager_comment, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleLeaves = [
    { emp: employees[0], mgr: managers[0], lt: leaveTypes[0], start: '2026-05-06', end: '2026-05-07', days: 2, reason: 'Fever and cold', status: 'approved', comment: 'Get well soon' },
    { emp: employees[1], mgr: managers[0], lt: leaveTypes[1], start: '2026-05-08', end: '2026-05-08', days: 1, reason: 'Personal work', status: 'pending', comment: null },
    { emp: employees[2], mgr: managers[1], lt: leaveTypes[2], start: '2026-05-05', end: '2026-05-05', days: 1, reason: 'Working from home', status: 'approved', comment: 'Okay' },
    { emp: employees[3], mgr: managers[1], lt: leaveTypes[0], start: '2026-04-28', end: '2026-04-30', days: 3, reason: 'Surgery recovery', status: 'approved', comment: 'Take care' },
    { emp: employees[4], mgr: managers[2], lt: leaveTypes[3], start: '2026-05-09', end: '2026-05-09', days: 1, reason: 'Comp-off for weekend work', status: 'pending', comment: null },
    { emp: employees[5], mgr: managers[0], lt: leaveTypes[1], start: '2026-05-12', end: '2026-05-13', days: 2, reason: 'Family function', status: 'pending', comment: null },
    { emp: employees[6], mgr: managers[2], lt: leaveTypes[0], start: '2026-04-21', end: '2026-04-22', days: 2, reason: 'Flu', status: 'rejected', comment: 'Critical deadline' },
    { emp: employees[7], mgr: managers[1], lt: leaveTypes[2], start: '2026-05-06', end: '2026-05-06', days: 1, reason: 'WFH - plumber visit', status: 'approved', comment: 'Fine' },
    { emp: employees[8], mgr: managers[0], lt: leaveTypes[1], start: '2026-05-14', end: '2026-05-15', days: 2, reason: 'Vacation', status: 'pending', comment: null },
    { emp: employees[9], mgr: managers[2], lt: leaveTypes[0], start: '2026-04-15', end: '2026-04-15', days: 1, reason: 'Doctor appointment', status: 'approved', comment: 'Approved' },
    { emp: employees[10], mgr: managers[0], lt: leaveTypes[3], start: '2026-05-07', end: '2026-05-07', days: 1, reason: 'Comp-off adjustment', status: 'pending', comment: null },
    { emp: employees[11], mgr: managers[1], lt: leaveTypes[1], start: '2026-04-10', end: '2026-04-11', days: 2, reason: 'Wedding', status: 'approved', comment: 'Congratulations!' },
    { emp: employees[12], mgr: managers[2], lt: leaveTypes[2], start: '2026-05-08', end: '2026-05-08', days: 1, reason: 'WFH', status: 'pending', comment: null },
    { emp: employees[13], mgr: managers[0], lt: leaveTypes[0], start: '2026-04-22', end: '2026-04-24', days: 3, reason: 'Viral fever', status: 'rejected', comment: 'Project delivery week' },
    { emp: employees[14], mgr: managers[1], lt: leaveTypes[1], start: '2026-05-19', end: '2026-05-20', days: 2, reason: 'Travel', status: 'pending', comment: null },
    { emp: employees[15], mgr: managers[2], lt: leaveTypes[3], start: '2026-04-18', end: '2026-04-18', days: 1, reason: 'Comp-off', status: 'approved', comment: 'Approved' },
    { emp: employees[16], mgr: managers[0], lt: leaveTypes[2], start: '2026-05-09', end: '2026-05-09', days: 1, reason: 'WFH - internet setup', status: 'pending', comment: null },
    { emp: employees[17], mgr: managers[1], lt: leaveTypes[0], start: '2026-04-07', end: '2026-04-08', days: 2, reason: 'Migraine', status: 'approved', comment: 'Rest well' },
    { emp: employees[18], mgr: managers[2], lt: leaveTypes[1], start: '2026-05-21', end: '2026-05-22', days: 2, reason: 'Personal', status: 'pending', comment: null },
    { emp: employees[19], mgr: managers[0], lt: leaveTypes[0], start: '2026-05-06', end: '2026-05-06', days: 1, reason: 'Not feeling well', status: 'approved', comment: 'Okay' },
    { emp: employees[0], mgr: managers[0], lt: leaveTypes[2], start: '2026-05-13', end: '2026-05-13', days: 1, reason: 'WFH', status: 'pending', comment: null },
    { emp: employees[2], mgr: managers[1], lt: leaveTypes[1], start: '2026-03-20', end: '2026-03-21', days: 2, reason: 'Festival', status: 'approved', comment: 'Enjoy!' },
    { emp: employees[4], mgr: managers[2], lt: leaveTypes[0], start: '2026-03-10', end: '2026-03-10', days: 1, reason: 'Cold', status: 'approved', comment: 'Fine' },
    { emp: employees[6], mgr: managers[2], lt: leaveTypes[2], start: '2026-05-07', end: '2026-05-07', days: 1, reason: 'WFH', status: 'pending', comment: null },
    { emp: employees[8], mgr: managers[0], lt: leaveTypes[3], start: '2026-04-25', end: '2026-04-25', days: 1, reason: 'Comp-off', status: 'approved', comment: 'Approved' },
  ];

  sampleLeaves.forEach(l => {
    insertLeave.run(
      uuidv4(), l.emp.id, l.mgr.id, l.lt.id,
      l.start, l.end, l.days, l.reason, l.status,
      l.comment, new Date().toISOString(), new Date().toISOString()
    );
  });

  console.log('✅ Database seeded successfully!');
};

seed();