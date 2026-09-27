const { pool } = require('../config/db');

// Validation helpers
const validateStudentData = ({ name, department, register_number, phone }) => {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Student name is required');
  } else if (name.trim().length < 2 || name.trim().length > 100) {
    errors.push('Student name must be between 2 and 100 characters');
  }

  if (!department || typeof department !== 'string' || department.trim().length === 0) {
    errors.push('Academic department is required');
  }

  if (!register_number || typeof register_number !== 'string' || register_number.trim().length === 0) {
    errors.push('Register number is required');
  } else if (register_number.trim().length > 30) {
    errors.push('Register number cannot exceed 30 characters');
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    errors.push('Phone number is required');
  } else {
    // Basic phone validation (allowing +, spaces, dashes, parentheses, 7-15 digits)
    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      errors.push('Please enter a valid phone number (e.g. +91 98765 43210)');
    }
  }

  return errors;
};

// GET /api/students - List students with search, filter, and pagination
exports.getAllStudents = async (req, res) => {
  try {
    const { search = '', department = '', page = 1, limit = 4 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 4);
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT * FROM students WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM students WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query += ' AND (name LIKE ? OR register_number LIKE ?)';
      countQuery += ' AND (name LIKE ? OR register_number LIKE ?)';
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }

    if (department && department.trim() && department !== 'All Departments') {
      // Allow partial match for department so "Computer Science" matches "Computer Science Engineering"
      query += ' AND department LIKE ?';
      countQuery += ' AND department LIKE ?';
      params.push(`%${department.trim()}%`);
      countParams.push(`%${department.trim()}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const [students] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limitNum) || 1;

    res.json({
      success: true,
      students,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        showingFrom: total === 0 ? 0 : offset + 1,
        showingTo: Math.min(offset + limitNum, total),
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student records.' });
  }
};

// GET /api/students/stats - Aggregate stats for dashboard cards
exports.getStats = async (req, res) => {
  try {
    const [[{ totalStudents }]] = await pool.query('SELECT COUNT(*) as totalStudents FROM students');
    const [[{ totalDepartments }]] = await pool.query('SELECT COUNT(DISTINCT department) as totalDepartments FROM students');
    
    // Recently added in the last 7 days (or last 5 added)
    const [[{ recentAddedCount }]] = await pool.query(
      'SELECT COUNT(*) as recentAddedCount FROM students WHERE created_at >= NOW() - INTERVAL 7 DAY'
    );

    // List of unique departments with counts
    const [deptCounts] = await pool.query(
      'SELECT department, COUNT(*) as count FROM students GROUP BY department ORDER BY count DESC'
    );

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalDepartments: totalDepartments || 6,
        recentAddedCount: recentAddedCount || 0,
        departments: deptCounts,
      },
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};

// GET /api/students/:id - Get single student
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    res.json({ success: true, student: rows[0] });
  } catch (error) {
    console.error('Error getting student:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve student record.' });
  }
};

// POST /api/students - Create new student
exports.createStudent = async (req, res) => {
  try {
    const { name, department, register_number, phone } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
      // Hosted locally
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const validationErrors = validateStudentData({ name, department, register_number, phone });
    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, message: validationErrors[0], errors: validationErrors });
    }

    // Check unique register number
    const [existing] = await pool.query('SELECT id FROM students WHERE register_number = ?', [register_number.trim()]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Register number '${register_number.trim()}' is already in use by another student.`,
      });
    }

    const [result] = await pool.query(
      'INSERT INTO students (name, department, register_number, phone, image_url) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), department.trim(), register_number.trim(), phone.trim(), image_url || null]
    );

    const [newStudent] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      student: newStudent[0],
    });
  } catch (error) {
    console.error('Error creating student:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'A student with this register number already exists.',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to create student record.' });
  }
};

// PUT /api/students/:id - Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, register_number, phone } = req.body;
    let image_url = req.body.image_url;

    // Check if student exists
    const [existing] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (image_url === undefined) {
      image_url = existing[0].image_url;
    }

    const validationErrors = validateStudentData({ name, department, register_number, phone });
    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, message: validationErrors[0], errors: validationErrors });
    }

    // Check unique register number excluding this record
    const [duplicateCheck] = await pool.query(
      'SELECT id FROM students WHERE register_number = ? AND id != ?',
      [register_number.trim(), id]
    );
    if (duplicateCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Register number '${register_number.trim()}' is already used by another student.`,
      });
    }

    await pool.query(
      'UPDATE students SET name = ?, department = ?, register_number = ?, phone = ?, image_url = ? WHERE id = ?',
      [name.trim(), department.trim(), register_number.trim(), phone.trim(), image_url || null, id]
    );

    const [updated] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Student updated successfully',
      student: updated[0],
    });
  } catch (error) {
    console.error('Error updating student:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'A student with this register number already exists.',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to update student record.' });
  }
};

// DELETE /api/students/:id - Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    await pool.query('DELETE FROM students WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Student deleted successfully',
      deletedId: parseInt(id, 10),
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, message: 'Failed to delete student record.' });
  }
};
