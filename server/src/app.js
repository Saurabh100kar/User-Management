const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const dotenv = require("dotenv");
const HTTP_STATUS = require("./constants/httpStatus");

// Load environment variables first, before database connection
dotenv.config();

const prisma = require("./config/database");

// CORS configuration - temporarily allow all origins for production
// TODO: Restrict to specific frontend domain(s) after testing
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

const validateUserData = (data, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate || data.first_name !== undefined) {
    if (!data.first_name || sanitizeInput(data.first_name).length < 2) {
      errors.push('First name is required and must be at least 2 characters');
    }
  }
  
  if (!isUpdate || data.last_name !== undefined) {
    if (!data.last_name || sanitizeInput(data.last_name).length < 2) {
      errors.push('Last name is required and must be at least 2 characters');
    }
  }
  
  if (!isUpdate || data.email !== undefined) {
    if (!data.email || !validateEmail(data.email)) {
      errors.push('Valid email is required');
    }
  }
  
  if (!isUpdate || data.gender !== undefined) {
    const validGenders = ['MALE', 'FEMALE', 'OTHER'];
    if (!data.gender || !validGenders.includes(data.gender.toUpperCase())) {
      errors.push('Gender must be MALE, FEMALE, or OTHER');
    }
  }
  
  if (!isUpdate || data.phone !== undefined) {
    if (!data.phone || !validatePhone(data.phone)) {
      errors.push('Valid phone number is required (at least 10 digits)');
    }
  }
  
  return errors;
};

router.get("/users/all", async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - All users request hit!`);
        let { page, limit, sortBy, order, gender, search } = req.query;

        // Default pagination
        if (!page && !limit) {
            page = 1;
            limit = 5;
        }

        // Validate pagination
        if (page <= 0) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
                success: false,
                message: "Page value must be 1 or more",
                data: null,
            });
        }

        if (limit <= 0) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
                success: false,
                message: "Limit value must be 1 or more",
                data: null,
            });
        }

        // Validate and sanitize sortBy
        const validSortFields = ['first_name', 'last_name', 'email', 'gender'];
        const sortField = sortBy && validSortFields.includes(sortBy) ? sortBy : 'id';
        const sortOrder = order && (order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc') 
            ? order.toLowerCase() 
            : 'asc';

        // Build where clause
        const whereClause = {};

        // Gender filter
        if (gender) {
            const validGenders = ['MALE', 'FEMALE', 'OTHER'];
            const upperGender = gender.toUpperCase();
            if (validGenders.includes(upperGender)) {
                whereClause.gender = upperGender;
            }
        }

        // Global search - combine with gender filter using AND
        if (search && search.trim()) {
            const searchTerm = sanitizeInput(search.trim());
            const searchConditions = {
                OR: [
                    { first_name: { contains: searchTerm, mode: 'insensitive' } },
                    { last_name: { contains: searchTerm, mode: 'insensitive' } },
                    { email: { contains: searchTerm, mode: 'insensitive' } },
                    { phone: { contains: searchTerm, mode: 'insensitive' } },
                ]
            };

            // If gender filter exists, combine with AND
            if (whereClause.gender) {
                whereClause.AND = [
                    { gender: whereClause.gender },
                    searchConditions
                ];
                delete whereClause.gender;
            } else {
                Object.assign(whereClause, searchConditions);
            }
        }

        // Build orderBy clause
        const orderByClause = {};
        orderByClause[sortField] = sortOrder;

        // Fetch users with filters, sorting, and pagination
        const users = await prisma.user.findMany({
            where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
            orderBy: orderByClause,
            skip: Number(page - 1) * Number(limit),
            take: Number(limit),
        });

        // Count total matching records
        const total = await prisma.user.count({
            where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        });

        return res.status(HTTP_STATUS.OK).send({
            success: true,
            message: "Successfully received all users",
            data: {
                users: users,
                total: total,
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

router.get(`/user/:id`, async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - Single user request hit!`);
        const { id } = req.params;

        const result = await prisma.user.findFirst({ where: { id: Number(id) } });

        if (result) {
            return res.status(HTTP_STATUS.OK).send({
                success: true,
                message: `Successfully received user with id: ${id}`,
                data: result,
            });
        }
        return res.status(HTTP_STATUS.NOT_FOUND).send({
            success: false,
            message: "Could not find user",
            data: null,
        });
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal server error",
        });
    }
});

// CREATE - POST /users
router.post("/users", async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - Create user request hit!`);
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const { first_name, last_name, email, gender, phone } = req.body;

        // Validate required fields
        const validationErrors = validateUserData({
            first_name,
            last_name,
            email,
            gender,
            phone
        });

        if (validationErrors.length > 0) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
                data: null,
            });
        }

        // Sanitize and prepare data
        const sanitizedEmail = sanitizeInput(email).toLowerCase();
        const sanitizedGender = gender && typeof gender === 'string' ? gender.toUpperCase() : null;
        
        // Double-check gender is valid
        const validGenders = ['MALE', 'FEMALE', 'OTHER'];
        if (!sanitizedGender || !validGenders.includes(sanitizedGender)) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
                success: false,
                message: "Invalid gender value. Must be MALE, FEMALE, or OTHER",
                data: null,
            });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findFirst({
            where: { email: sanitizedEmail }
        });

        if (existingUser) {
            return res.status(HTTP_STATUS.CONFLICT).send({
                success: false,
                message: "Email already exists",
                data: null,
            });
        }

        // Create user - handle sequence sync issue
        let newUser;
        try {
            newUser = await prisma.user.create({
                data: {
                    first_name: sanitizeInput(first_name),
                    last_name: sanitizeInput(last_name),
                    email: sanitizedEmail,
                    gender: sanitizedGender,
                    phone: sanitizeInput(phone),
                },
            });
        } catch (createError) {
            // If we get a unique constraint error on id, it means the sequence is out of sync
            if (createError.code === 'P2002' && (createError.meta?.target?.includes('id') || createError.message?.includes('id'))) {
                console.log('Sequence out of sync detected. Resetting sequence...');
                
                // Get the maximum ID from the database
                const maxUser = await prisma.user.findFirst({
                    orderBy: { id: 'desc' },
                });
                
                const nextId = maxUser ? maxUser.id + 1 : 1;
                
                // Reset the sequence to the correct value - try dynamic method first
                try {
                    await prisma.$executeRawUnsafe(
                        `SELECT setval(pg_get_serial_sequence('"user"', 'id'), ${nextId}, false)`
                    );
                } catch (seqError) {
                    // Fallback to explicit sequence name
                    await prisma.$executeRawUnsafe(
                        `SELECT setval('"user_id_seq"', ${nextId}, false)`
                    );
                }
                
                console.log(`Sequence reset to ${nextId}. Retrying user creation...`);
                
                // Retry creating the user
                newUser = await prisma.user.create({
                    data: {
                        first_name: sanitizeInput(first_name),
                        last_name: sanitizeInput(last_name),
                        email: sanitizedEmail,
                        gender: sanitizedGender,
                        phone: sanitizeInput(phone),
                    },
                });
            } else {
                // Re-throw if it's a different error
                throw createError;
            }
        }

        console.log('User created successfully:', newUser.id);

        return res.status(HTTP_STATUS.CREATED).send({
            success: true,
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        console.error('Error stack:', error.stack);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        // Return more detailed error information
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message || "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            data: null,
        });
    }
});

// UPDATE - PUT /user/:id
router.put("/user/:id", async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - Update user request hit!`);
        const { id } = req.params;
        const { first_name, last_name, email, gender, phone } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: { id: Number(id) }
        });

        if (!existingUser) {
            return res.status(HTTP_STATUS.NOT_FOUND).send({
                success: false,
                message: "User not found",
                data: null,
            });
        }

        // Validate provided fields
        const updateData = {};
        if (first_name !== undefined) updateData.first_name = first_name;
        if (last_name !== undefined) updateData.last_name = last_name;
        if (email !== undefined) updateData.email = email;
        if (gender !== undefined) updateData.gender = gender;
        if (phone !== undefined) updateData.phone = phone;

        const validationErrors = validateUserData(updateData, true);

        if (validationErrors.length > 0) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
                data: null,
            });
        }

        // Check email uniqueness if email is being updated
        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findFirst({
                where: { 
                    email: sanitizeInput(email),
                    NOT: { id: Number(id) }
                }
            });

            if (emailExists) {
                return res.status(HTTP_STATUS.CONFLICT).send({
                    success: false,
                    message: "Email already exists",
                    data: null,
                });
            }
        }

        // Prepare update data with sanitization
        const sanitizedData = {};
        if (updateData.first_name) sanitizedData.first_name = sanitizeInput(updateData.first_name);
        if (updateData.last_name) sanitizedData.last_name = sanitizeInput(updateData.last_name);
        if (updateData.email) sanitizedData.email = sanitizeInput(updateData.email).toLowerCase();
        if (updateData.gender) sanitizedData.gender = updateData.gender.toUpperCase();
        if (updateData.phone) sanitizedData.phone = sanitizeInput(updateData.phone);

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: sanitizedData,
        });

        return res.status(HTTP_STATUS.OK).send({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
});

// DELETE - DELETE /user/:id
router.delete("/user/:id", async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - Delete user request hit!`);
        const { id } = req.params;

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: { id: Number(id) }
        });

        if (!existingUser) {
            return res.status(HTTP_STATUS.NOT_FOUND).send({
                success: false,
                message: "User not found",
                data: null,
            });
        }

        // Delete user
        await prisma.user.delete({
            where: { id: Number(id) }
        });

        return res.status(HTTP_STATUS.OK).send({
            success: true,
            message: "User deleted successfully",
            data: null,
        });
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
});

// Function to fix sequence if out of sync
async function fixSequence() {
    try {
        // Get the maximum ID from the database
        const maxUser = await prisma.user.findFirst({
            orderBy: { id: 'desc' },
        });
        
        if (maxUser) {
            const nextId = maxUser.id + 1;
            // Reset the sequence to the correct value (false means don't use the value yet)
            await prisma.$executeRawUnsafe(
                `SELECT setval(pg_get_serial_sequence('"user"', 'id'), ${nextId}, false)`
            );
            console.log(`✓ Database sequence synchronized (next ID: ${nextId})`);
        } else {
            // If no users exist, reset to 1
            await prisma.$executeRawUnsafe(
                `SELECT setval(pg_get_serial_sequence('"user"', 'id'), 1, false)`
            );
            console.log(`✓ Database sequence initialized`);
        }
    } catch (error) {
        console.warn('Warning: Could not sync sequence:', error.message);
        // Try alternative method with explicit sequence name
        try {
            const maxUser = await prisma.user.findFirst({
                orderBy: { id: 'desc' },
            });
            const nextId = maxUser ? maxUser.id + 1 : 1;
            await prisma.$executeRawUnsafe(
                `SELECT setval('"user_id_seq"', ${nextId}, false)`
            );
            console.log(`✓ Database sequence synchronized using alternative method`);
        } catch (altError) {
            console.warn('Warning: Alternative sequence sync also failed:', altError.message);
        }
    }
}

// Analytics Routes
router.get("/analytics/gender", async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - Gender analytics request hit!`);
        
        const genderStats = await prisma.user.groupBy({
            by: ['gender'],
            _count: {
                gender: true,
            },
        });

        const result = {
            male: 0,
            female: 0,
            other: 0,
        };

        genderStats.forEach((stat) => {
            const gender = stat.gender.toUpperCase();
            if (gender === 'MALE') {
                result.male = stat._count.gender;
            } else if (gender === 'FEMALE') {
                result.female = stat._count.gender;
            } else {
                result.other = stat._count.gender;
            }
        });

        return res.status(HTTP_STATUS.OK).send({
            success: true,
            message: "Gender analytics retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error('Error fetching gender analytics:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

router.get("/analytics/monthly-users", async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - Monthly users analytics request hit!`);
        
        const users = await prisma.user.findMany({
            select: {
                created_at: true,
            },
            orderBy: {
                created_at: 'asc',
            },
        });

        // Group by month
        const monthlyData = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        users.forEach((user) => {
            if (user.created_at) {
                try {
                    const date = new Date(user.created_at);
                    if (isNaN(date.getTime())) {
                        console.warn(`Invalid date: ${user.created_at}`);
                        return;
                    }
                    const month = date.getMonth() + 1;
                    const monthStr = month < 10 ? `0${month}` : `${month}`;
                    const monthKey = `${date.getFullYear()}-${monthStr}`;
                    const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                    
                    if (!monthlyData[monthKey]) {
                        monthlyData[monthKey] = {
                            month: monthLabel,
                            monthIndex: date.getMonth(),
                            year: date.getFullYear(),
                            count: 0,
                        };
                    }
                    monthlyData[monthKey].count++;
                } catch (err) {
                    console.warn(`Error processing date ${user.created_at}:`, err.message);
                }
            }
        });

        // Convert to array and sort chronologically
        const result = Object.values(monthlyData).sort((a, b) => {
            if (a.year !== b.year) {
                return a.year - b.year;
            }
            return a.monthIndex - b.monthIndex;
        });

        return res.status(HTTP_STATUS.OK).send({
            success: true,
            message: "Monthly users analytics retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error('Error fetching monthly users analytics:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

router.get("/analytics/email-domains", async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - Email domains analytics request hit!`);
        
        const users = await prisma.user.findMany({
            select: {
                email: true,
            },
        });

        // Extract and group by domain
        const domainCounts = {};
        
        users.forEach((user) => {
            if (user.email && user.email.includes('@')) {
                const domain = user.email.split('@')[1]?.toLowerCase();
                if (domain) {
                    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
                }
            }
        });

        // Convert to array and sort by count (descending)
        const result = Object.entries(domainCounts)
            .map(([domain, count]) => ({
                domain,
                count,
            }))
            .sort((a, b) => b.count - a.count);

        return res.status(HTTP_STATUS.OK).send({
            success: true,
            message: "Email domains analytics retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error('Error fetching email domains analytics:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

app.use("/", router);

// Fix sequence on startup
fixSequence().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`✓ Server listening on port: ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
