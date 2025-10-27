import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaStar, FaHeart } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { fetchEvents, Event } from '@/services/eventService';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await fetchEvents();
      setAllEvents(eventsData);
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

  // Filter events based on student's registrations
  const registeredEvents = allEvents.filter(event => 
    event.registeredUsers.some(reg => reg.user === user?._id)
  );

  // Get upcoming events (future dates)
  const upcomingEvents = allEvents
    .filter(event => new Date(event.date) > new Date())
    .slice(0, 6);

  // Get workshop suggestions
  const workshopSuggestions = allEvents
    .filter(event => event.category === 'workshop')
    .slice(0, 6);

  // Calculate stats
  const savedEventsCount = 0; // TODO: Implement saved events feature
  const attendedEventsCount = registeredEvents.filter(
    event => new Date(event.date) < new Date()
  ).length;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome back, {user?.name || 'Student'}!
              </span>
            </h1>
            <p className="text-muted-foreground">Track your events and discover new opportunities</p>
          </motion.div>

          {/* Stats */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <FaCalendarCheck className="text-3xl text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{registeredEvents.length}</p>
                    <p className="text-sm text-muted-foreground">Registered Events</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-accent/10">
                    <FaHeart className="text-3xl text-accent" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{savedEventsCount}</p>
                    <p className="text-sm text-muted-foreground">Saved Events</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-secondary/10">
                    <FaStar className="text-3xl text-secondary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{attendedEventsCount}</p>
                    <p className="text-sm text-muted-foreground">Events Attended</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <FaCalendarCheck className="text-6xl text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Upcoming Events</h3>
                <p className="text-muted-foreground">Check back later for new events!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event, index) => (
                  <EventCard key={event._id} event={event} index={index} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Registered Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">My Registered Events</h2>
            {registeredEvents.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <FaCalendarCheck className="text-6xl text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Registered Events</h3>
                <p className="text-muted-foreground">You haven't registered for any events yet. Explore events and register!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map((event, index) => (
                  <EventCard key={event._id} event={event} index={index} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Workshop Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Workshop Suggestions</h2>
            {workshopSuggestions.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <FaStar className="text-6xl text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Workshops Available</h3>
                <p className="text-muted-foreground">No workshop suggestions available at the moment.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshopSuggestions.map((event, index) => (
                  <EventCard key={event._id} event={event} index={index} />
                ))}
              </div>
            )}
          </motion.div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
