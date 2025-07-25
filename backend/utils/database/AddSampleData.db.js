require('dotenv').config();
const User = require('../../models/User.model');
const connectDB = require('../../config/db.config');

const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin@123',
    userType: 'A'
  },
  {
    username: 'john',
    email: 'john@example.com',
    password: 'User@123',
    userType: 'U'
  },
  {
    username: 'jane',
    email: 'jane@example.com',
    password: 'User@123',
    userType: 'U'
  },
  {
    username: 'alex',
    email: 'alex@example.com',
    password: 'User@123',
    userType: 'U'
  },
  {
    username: 'maria',
    email: 'maria@example.com',
    password: 'User@123',
    userType: 'U'
  },
  {
    username: 'sara',
    email: 'sara@example.com',
    password: 'User@123',
    userType: 'U'
  },
  {
    username: 'leo',
    email: 'leo@example.com',
    password: 'User@123',
    userType: 'U'
  },
  {
    username: 'david',
    email: 'david@example.com',
    password: 'User@123',
    userType: 'U'
  },
  {
    username: 'emma',
    email: 'emma@example.com',
    password: 'User@123',
    userType: 'U'
  },
  {
    username: 'olivia',
    email: 'olivia@example.com',
    password: 'User@123',
    userType: 'U'
  },
];

async function insertUsers() {
  try {
    let c = 0;
    await connectDB();
    await User.deleteMany(); // Optional: clear existing users
    for(let user of sampleUsers){
        await User.create(user);
        c++;
    }
    console.log(`Inserted ${c} users.`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to insert users:', err);
    process.exit(1);
  }
}

insertUsers();
