export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'cultural' | 'sports' | 'workshop';
  date: string;
  time: string;
  venue: string;
  college: string;
  organizer: string;
  image: string;
  registrationCount: number;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'TechFest 2025',
    description: 'A grand celebration of technology featuring hackathons, tech talks, and innovation showcases. Join us for 3 days of coding, learning, and networking with industry experts.',
    category: 'technical',
    date: '2025-11-15',
    time: '09:00 AM',
    venue: 'Main Auditorium',
    college: 'MIT College of Engineering',
    organizer: 'Tech Club',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    registrationCount: 245,
  },
  {
    id: '2',
    title: 'Cultural Night 2025',
    description: 'Experience the diversity of cultures through music, dance, and drama. A night filled with performances from various cultural groups celebrating unity in diversity.',
    category: 'cultural',
    date: '2025-11-20',
    time: '06:00 PM',
    venue: 'Open Air Theater',
    college: 'Delhi University',
    organizer: 'Cultural Committee',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop',
    registrationCount: 189,
  },
  {
    id: '3',
    title: 'Sports Tournament',
    description: 'Inter-college sports championship featuring cricket, football, basketball, and athletics. Compete with the best athletes from colleges across the state.',
    category: 'sports',
    date: '2025-11-25',
    time: '07:00 AM',
    venue: 'Sports Complex',
    college: 'Mumbai University',
    organizer: 'Sports Council',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
    registrationCount: 156,
  },
  {
    id: '4',
    title: 'AI & ML Workshop',
    description: 'Hands-on workshop on Artificial Intelligence and Machine Learning. Learn from industry experts and work on real-world projects using Python and TensorFlow.',
    category: 'workshop',
    date: '2025-11-18',
    time: '10:00 AM',
    venue: 'Computer Lab',
    college: 'IIT Bombay',
    organizer: 'AI Research Group',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    registrationCount: 98,
  },
  {
    id: '5',
    title: 'Startup Conclave',
    description: 'Meet successful entrepreneurs, pitch your ideas, and network with potential investors. A platform for aspiring startup founders to showcase their innovations.',
    category: 'workshop',
    date: '2025-11-22',
    time: '11:00 AM',
    venue: 'Innovation Hub',
    college: 'IIM Ahmedabad',
    organizer: 'Entrepreneurship Cell',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    registrationCount: 134,
  },
  {
    id: '6',
    title: 'Music Fest 2025',
    description: 'Live performances by renowned bands and solo artists. From rock to classical, experience a musical extravaganza that celebrates all genres.',
    category: 'cultural',
    date: '2025-11-28',
    time: '05:00 PM',
    venue: 'Stadium',
    college: 'Delhi University',
    organizer: 'Music Club',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop',
    registrationCount: 312,
  },
  {
    id: '7',
    title: 'Hackathon 2025',
    description: '36-hour coding marathon to solve real-world problems. Form teams, build innovative solutions, and compete for exciting prizes and internship opportunities.',
    category: 'technical',
    date: '2025-12-01',
    time: '08:00 AM',
    venue: 'Tech Park',
    college: 'BITS Pilani',
    organizer: 'Coding Club',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    registrationCount: 178,
  },
  {
    id: '8',
    title: 'Basketball Championship',
    description: 'State-level basketball tournament with top teams competing for the championship trophy. Showcase your skills and lead your college to victory.',
    category: 'sports',
    date: '2025-12-05',
    time: '08:00 AM',
    venue: 'Indoor Stadium',
    college: 'Mumbai University',
    organizer: 'Basketball Association',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop',
    registrationCount: 87,
  },
];
