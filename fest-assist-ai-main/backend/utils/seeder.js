require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Event = require('../models/Event');
const Chat = require('../models/Chat');

/**
 * Seeder Script
 * Populates database with mock users and events
 * Run: npm run seed
 */

const users = [
  {
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@student.edu',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Jane Smith',
    email: 'jane@student.edu',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Event Coordinator',
    email: 'coordinator@college.edu',
    password: 'event123',
    role: 'event-member',
  },
  {
    name: 'Tech Club Lead',
    email: 'techclub@college.edu',
    password: 'event123',
    role: 'event-member',
  },
];

const createEvents = (userId) => [
  {
    title: 'TechFest 2025',
    description:
      'A grand celebration of technology featuring hackathons, tech talks, and innovation showcases. Join us for 3 days of coding, learning, and networking with industry experts.',
    category: 'technical',
    date: new Date('2025-11-15'),
    time: '09:00 AM',
    venue: 'Main Auditorium',
    college: 'MIT College of Engineering',
    organizer: 'Tech Club',
    capacity: 200,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    createdBy: userId,
    registrationCount: 0,
  },
  {
    title: 'Cultural Night 2025',
    description:
      'Experience the diversity of cultures through music, dance, and drama. A night filled with performances from various cultural groups celebrating unity in diversity.',
    category: 'cultural',
    date: new Date('2025-11-20'),
    time: '06:00 PM',
    venue: 'Open Air Theater',
    college: 'Delhi University',
    organizer: 'Cultural Committee',
    capacity: 300,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop',
    createdBy: userId,
    registrationCount: 0,
  },
  {
    title: 'Sports Tournament',
    description:
      'Inter-college sports championship featuring cricket, football, basketball, and athletics. Compete with the best athletes from colleges across the state.',
    category: 'sports',
    date: new Date('2025-11-25'),
    time: '07:00 AM',
    venue: 'Sports Complex',
    college: 'Mumbai University',
    organizer: 'Sports Council',
    capacity: 150,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
    createdBy: userId,
    registrationCount: 0,
  },
  {
    title: 'AI & ML Workshop',
    description:
      'Hands-on workshop on Artificial Intelligence and Machine Learning. Learn from industry experts and work on real-world projects using Python and TensorFlow.',
    category: 'workshop',
    date: new Date('2025-11-18'),
    time: '10:00 AM',
    venue: 'Computer Lab',
    college: 'IIT Bombay',
    organizer: 'AI Research Group',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    createdBy: userId,
    registrationCount: 0,
  },
  {
    title: 'Startup Conclave',
    description:
      'Meet successful entrepreneurs, pitch your ideas, and network with potential investors. A platform for aspiring startup founders to showcase their innovations.',
    category: 'workshop',
    date: new Date('2025-11-22'),
    time: '11:00 AM',
    venue: 'Innovation Hub',
    college: 'IIM Ahmedabad',
    organizer: 'Entrepreneurship Cell',
    capacity: 120,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    createdBy: userId,
    registrationCount: 0,
  },
  {
    title: 'Music Fest 2025',
    description:
      'Live performances by renowned bands and solo artists. From rock to classical, experience a musical extravaganza that celebrates all genres.',
    category: 'cultural',
    date: new Date('2025-11-28'),
    time: '05:00 PM',
    venue: 'Stadium',
    college: 'Delhi University',
    organizer: 'Music Club',
    capacity: 500,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop',
    createdBy: userId,
    registrationCount: 0,
  },
  {
    title: 'Hackathon 2025',
    description:
      '36-hour coding marathon to solve real-world problems. Form teams, build innovative solutions, and compete for exciting prizes and internship opportunities.',
    category: 'technical',
    date: new Date('2025-12-01'),
    time: '08:00 AM',
    venue: 'Tech Park',
    college: 'BITS Pilani',
    organizer: 'Coding Club',
    capacity: 180,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    createdBy: userId,
    registrationCount: 0,
  },
  {
    title: 'Basketball Championship',
    description:
      'State-level basketball tournament with top teams competing for the championship trophy. Showcase your skills and lead your college to victory.',
    category: 'sports',
    date: new Date('2025-12-05'),
    time: '08:00 AM',
    venue: 'Indoor Stadium',
    college: 'Mumbai University',
    organizer: 'Basketball Association',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop',
    createdBy: userId,
    registrationCount: 0,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Event.deleteMany();
    await Chat.deleteMany();

    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} users created`);

    // Get event member for event creation
    const eventMember = createdUsers.find((u) => u.role === 'event-member');

    console.log('📅 Creating events...');
    const events = createEvents(eventMember._id);
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ ${createdEvents.length} events created`);

    // Update event member's created events
    await User.findByIdAndUpdate(eventMember._id, {
      createdEvents: createdEvents.map((e) => e._id),
    });

    console.log('\n✅ DATABASE SEEDED SUCCESSFULLY!\n');
    console.log('📝 Sample Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@college.edu');
    console.log('  Password: admin123');
    console.log('\nStudent:');
    console.log('  Email: john@student.edu');
    console.log('  Password: student123');
    console.log('\nEvent Member:');
    console.log('  Email: coordinator@college.edu');
    console.log('  Password: event123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
