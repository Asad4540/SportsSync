require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Tournament = require('./models/Tournament');
const Announcement = require('./models/Announcement');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tournament_registration_app';

/**
 * Seed script to populate the database with:
 * - Admin user
 * - Sample tournaments (5 sports)
 * - Sample announcements
 */
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Database');

    // --- Seed Admin User ---
    let admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);

      admin = new User({
        username: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        phone: '9876543210',
        college: 'SportSync Administration',
      });
      await admin.save();
      console.log('Admin user created');
      console.log('  Email: admin@gmail.com');
      console.log('  Password: Admin@123');
    } else {
      // Update existing admin to have admin role
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log('Existing admin user role updated to admin');
      } else {
        console.log('Admin user already exists');
      }
    }

    // --- Seed Sample Tournaments ---
    const tournamentCount = await Tournament.countDocuments();
    if (tournamentCount === 0) {
      const tournaments = [
        {
          sport: 'Cricket',
          description: 'Inter-college cricket tournament featuring T20 format matches. Showcase your batting, bowling, and fielding skills in this prestigious tournament.',
          rules: '1. Each team must have exactly 11 players and 4 substitutes.\n2. Match format: T20 (20 overs per side).\n3. DRS is not available.\n4. Each bowler can bowl a maximum of 4 overs.\n5. Power play rules apply for first 6 overs.\n6. Super over in case of a tie.\n7. All players must wear proper cricket whites/team jersey.\n8. Decision of the umpire is final.',
          venue: 'Central Sports Complex',
          venueAddress: 'Nehru Stadium Road, Mumbai, Maharashtra 400001',
          venueCoordinates: { lat: 19.0760, lng: 72.8777 },
          teamSize: 15,
          registrationFees: 1500,
          tournamentDate: new Date('2026-07-15'),
          registrationDeadline: new Date('2026-07-01'),
          maxParticipants: 16,
          status: 'upcoming',
          image: '',
          createdBy: admin._id,
        },
        {
          sport: 'Football',
          description: 'Annual inter-college football championship. 11-a-side full ground matches with knockout rounds leading to the grand finale.',
          rules: '1. Each team must have 11 players and 5 substitutes.\n2. Match duration: 30 minutes each half.\n3. Maximum 3 substitutions per match.\n4. Yellow and red card rules apply.\n5. Penalty shootout in case of a draw in knockout rounds.\n6. All players must wear proper football boots (studs allowed).\n7. Shin guards are mandatory.\n8. Referee decision is final.',
          venue: 'University Football Ground',
          venueAddress: 'Sports Complex, Pune, Maharashtra 411001',
          venueCoordinates: { lat: 18.5204, lng: 73.8567 },
          teamSize: 16,
          registrationFees: 2000,
          tournamentDate: new Date('2026-07-20'),
          registrationDeadline: new Date('2026-07-05'),
          maxParticipants: 12,
          status: 'upcoming',
          image: '',
          createdBy: admin._id,
        },
        {
          sport: 'Volleyball',
          description: 'Exciting inter-college volleyball championship. Indoor court matches with group stages followed by elimination rounds.',
          rules: '1. Each team must have 6 players and 2 substitutes.\n2. Best of 3 sets (25 points each, win by 2).\n3. Final set to 15 points if needed.\n4. Rotation rules must be followed.\n5. Libero rules apply.\n6. Double touch and carry fouls will be called.\n7. Players must wear proper sports shoes (no bare feet).\n8. Net height: 2.43m for men, 2.24m for women.',
          venue: 'Indoor Sports Arena',
          venueAddress: 'BKC Sports Complex, Mumbai, Maharashtra 400051',
          venueCoordinates: { lat: 19.0596, lng: 72.8656 },
          teamSize: 8,
          registrationFees: 800,
          tournamentDate: new Date('2026-08-05'),
          registrationDeadline: new Date('2026-07-20'),
          maxParticipants: 20,
          status: 'upcoming',
          image: '',
          createdBy: admin._id,
        },
        {
          sport: 'Badminton',
          description: 'Inter-college badminton doubles tournament. Fast-paced indoor shuttle action with group stage and knockout format.',
          rules: '1. Doubles format only (2 players per team).\n2. Best of 3 games (21 points each).\n3. Players must bring their own rackets.\n4. Shuttlecocks will be provided by organizers.\n5. Service rules as per BWF regulations.\n6. Let serves are replayed.\n7. Players must wear non-marking shoes.\n8. Coaching during matches is not allowed.',
          venue: 'City Badminton Hall',
          venueAddress: 'Andheri Sports Complex, Mumbai, Maharashtra 400053',
          venueCoordinates: { lat: 19.1136, lng: 72.8697 },
          teamSize: 2,
          registrationFees: 500,
          tournamentDate: new Date('2026-08-10'),
          registrationDeadline: new Date('2026-07-25'),
          maxParticipants: 32,
          status: 'upcoming',
          image: '',
          createdBy: admin._id,
        },
        {
          sport: 'Chess',
          description: 'Strategic minds battle it out in this inter-college chess championship. Individual tournament with Swiss-system pairing.',
          rules: '1. Individual tournament (1 player per entry).\n2. Swiss-system pairing for preliminary rounds.\n3. Time control: 15 minutes + 10 seconds increment.\n4. FIDE rules apply.\n5. Touch-move rule is strictly enforced.\n6. Mobile phones must be switched off during games.\n7. No electronic devices allowed at the playing area.\n8. Players must record their moves.',
          venue: 'College Auditorium',
          venueAddress: 'University Campus, Bangalore, Karnataka 560001',
          venueCoordinates: { lat: 12.9716, lng: 77.5946 },
          teamSize: 1,
          registrationFees: 200,
          tournamentDate: new Date('2026-08-15'),
          registrationDeadline: new Date('2026-08-01'),
          maxParticipants: 64,
          status: 'upcoming',
          image: '',
          createdBy: admin._id,
        },
      ];

      await Tournament.insertMany(tournaments);
      console.log('5 sample tournaments created (Cricket, Football, Volleyball, Badminton, Chess)');
    } else {
      console.log(`${tournamentCount} tournaments already exist, skipping...`);
    }

    // --- Seed Sample Announcements ---
    const announcementCount = await Announcement.countDocuments();
    if (announcementCount === 0) {
      const announcements = [
        {
          title: 'Welcome to SportSync Tournament Portal!',
          content: 'We are excited to launch the SportSync Tournament Registration Portal. Browse through available tournaments, register your team, and compete for glory! Stay tuned for upcoming events and updates.',
          priority: 'high',
          createdBy: admin._id,
        },
        {
          title: 'Registration Guidelines',
          content: 'Please ensure you fill in all team member details accurately during registration. Upload a clear payment screenshot for faster approval. Registration fees are non-refundable once approved.',
          priority: 'medium',
          createdBy: admin._id,
        },
        {
          title: 'Cricket Tournament Date Announced',
          content: 'The Inter-College Cricket Tournament will be held on July 15, 2026. Registration deadline is July 1, 2026. Limited spots available - register early!',
          priority: 'high',
          createdBy: admin._id,
        },
      ];

      await Announcement.insertMany(announcements);
      console.log('3 sample announcements created');
    } else {
      console.log(`${announcementCount} announcements already exist, skipping...`);
    }

    console.log('\nSeed completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
