import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearch, FaCode, FaPalette, FaTrophy, FaChalkboardTeacher, FaCalendarAlt, FaUsers, FaTicketAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { fetchEvents, Event } from '@/services/eventService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toast } = useToast();

  const categories = [
    { name: 'Technical', icon: FaCode, color: 'from-blue-500 to-cyan-500' },
    { name: 'Cultural', icon: FaPalette, color: 'from-purple-500 to-pink-500' },
    { name: 'Sports', icon: FaTrophy, color: 'from-green-500 to-emerald-500' },
    { name: 'Workshop', icon: FaChalkboardTeacher, color: 'from-orange-500 to-red-500' },
  ];

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to load events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load events',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [toast]);

  // Get upcoming events (future dates only)
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get featured events for carousel (top 5 by registration)
  const featuredEvents = events
    .sort((a, b) => b.registrationCount - a.registrationCount)
    .slice(0, 5);

  // Carousel controls
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  }, [featuredEvents.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  }, [featuredEvents.length]);

  // Auto-play carousel
  useEffect(() => {
    if (featuredEvents.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [nextSlide, featuredEvents.length]);

  // Get additional events for the upcoming section
  const additionalEvents = events
    .filter(event => 
      new Date(event.date) > new Date() && 
      !featuredEvents.find(fe => fe._id === event._id)
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  // Calculate statistics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, event) => sum + event.registrationCount, 0);
  const upcomingEventsCount = events.filter(event => new Date(event.date) > new Date()).length;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Discover Amazing
                </span>
                <br />
                <span className="text-foreground">College Events</span>
              </h1>
            </motion.div>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your one-stop platform for exploring, registering, and managing college events.
              Join thousands of students in creating unforgettable experiences.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative glass-card p-2 rounded-xl">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search events, colleges, or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 bg-background border-border h-12"
                    />
                  </div>
                  <Link to={`/events${searchQuery ? `?search=${searchQuery}` : ''}`}>
                    <Button className="h-12 px-8 bg-gradient-to-r from-primary to-accent">
                      Search
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Featured Events Carousel */}
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 glass-card rounded-2xl p-12 text-center"
              >
                <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-muted-foreground">Loading featured events...</p>
              </motion.div>
            ) : featuredEvents.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 relative"
              >
                {/* Carousel Container */}
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Slides */}
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {featuredEvents.map((event, index) => (
                      <div key={event._id} className="min-w-full">
                        <div className="glass-card rounded-2xl overflow-hidden">
                          <div className="relative h-64 md:h-96">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-semibold text-white">
                                  Featured Event
                                </span>
                                <span className="px-3 py-1 rounded-full glass text-xs text-white">
                                  {event.registrationCount} Registered
                                </span>
                                <span className="px-3 py-1 rounded-full glass text-xs text-white capitalize">
                                  {event.category}
                                </span>
                                <span className="px-3 py-1 rounded-full glass text-xs text-white">
                                  📅 {new Date(event.date).toLocaleDateString()}
                                </span>
                              </div>
                              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {event.title}
                              </h2>
                              <p className="text-white/90 mb-1 text-lg">🏢 {event.college}</p>
                              <p className="text-white/80 mb-4">📍 {event.venue}</p>
                              <Link to={`/events/${event._id}`}>
                                <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 transition-all">
                                  Learn More
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {featuredEvents.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 flex items-center justify-center text-white transition-all hover:scale-110"
                        aria-label="Previous slide"
                      >
                        <FaChevronLeft className="text-xl" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 flex items-center justify-center text-white transition-all hover:scale-110"
                        aria-label="Next slide"
                      >
                        <FaChevronRight className="text-xl" />
                      </button>
                    </>
                  )}

                  {/* Dots Indicator */}
                  {featuredEvents.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {featuredEvents.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide
                              ? 'bg-white w-8'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Slide Counter */}
                {featuredEvents.length > 1 && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      {currentSlide + 1} / {featuredEvents.length}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 glass-card rounded-2xl p-12 text-center"
              >
                <p className="text-muted-foreground">No featured events available</p>
                <Link to="/add-event" className="mt-4 inline-block">
                  <Button>Create First Event</Button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-xl text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FaCalendarAlt className="text-2xl text-white" />
              </div>
              <p className="text-3xl font-bold mb-1">{loading ? '...' : totalEvents}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-xl text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FaUsers className="text-2xl text-white" />
              </div>
              <p className="text-3xl font-bold mb-1">{loading ? '...' : totalRegistrations}</p>
              <p className="text-sm text-muted-foreground">Total Registrations</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-xl text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <FaTicketAlt className="text-2xl text-white" />
              </div>
              <p className="text-3xl font-bold mb-1">{loading ? '...' : upcomingEventsCount}</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Event Categories</h2>
            <p className="text-muted-foreground">
              Explore events across different categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <Link to={`/events?category=${category.name.toLowerCase()}`}>
                  <div className="glass-card p-8 rounded-xl text-center cursor-pointer group">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <category.icon className="text-2xl text-white" />
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-muted-foreground">
                Don't miss out on these exciting events
              </p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="hidden md:inline-flex">
                View All Events
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : additionalEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalEvents.map((event, index) => (
                <EventCard key={event._id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-xl text-center">
              <p className="text-muted-foreground mb-4">No upcoming events at the moment</p>
              <Link to="/add-event">
                <Button className="bg-gradient-to-r from-primary to-accent">
                  Create Event
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/events">
              <Button variant="outline" className="w-full">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
