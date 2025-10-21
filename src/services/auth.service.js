import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import {db} from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        logger.error(`Password Hashing Error: ${e}`);
        throw new Error('Failed to hash password');
    }       
};

export const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (e) {
        logger.error(`Password Compare Error: ${e}`);
        throw new Error('Failed to compare password');
    }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existingUser.length > 0) {
            throw new Error('User with this email already exists');
        }

        const password_hash = await hashPassword(password);

        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: password_hash,
            role,
        }).returning({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt });

        logger.info(`User ${newUser.email} created successfully`);
        return newUser;
    } catch (e) {
        logger.error('Create User Error: ', e);
        throw e;
    }
};

export const authenticateUser = async ({ email, password }) => {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const userRecord = existingUser[0];
        if (!userRecord) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await comparePassword(password, userRecord.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const user = { id: userRecord.id, name: userRecord.name, email: userRecord.email, role: userRecord.role, createdAt: userRecord.createdAt };
        logger.info(`User ${user.email} authenticated successfully`);
        return user;
    } catch (e) {
        logger.error('Authenticate User Error: ', e);
        throw e;
    }
};
