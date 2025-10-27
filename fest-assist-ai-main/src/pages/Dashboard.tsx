import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaCalendarCheck } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchEvents, Event, deleteEvent } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserEvents = async () => {
      try {
        setLoading(true);
        const allEvents = await fetchEvents();
        
        // Filter events created by current user
        const userEvents = allEvents.filter(
          (event) => event.createdBy._id === user?._id
        );
        
        setEvents(userEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your events',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserEvents();
    }
  }, [user, toast]);

  const totalRegistrations = events.reduce((sum, event) => sum + event.registrationCount, 0);

  const handleEdit = (eventId: string) => {
    // Navigate to edit page (to be implemented)
    toast({
      title: 'Edit Event',
      description: 'Edit functionality coming soon',
    });
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent(eventId);
      
      // Remove from local state
      setEvents(events.filter((e) => e._id !== eventId));
      
      toast({
        title: 'Event Deleted',
        description: 'Event has been successfully deleted',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Welcome back, Event Member!
                  </span>
                </h1>
                <p className="text-muted-foreground">Manage your events and track registrations</p>
              </div>
              <Link to="/add-event">
                <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                  <FaPlus />
                  Create New Event
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
              <p className="text-muted-foreground">Loading your events...</p>
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
                    <p className="text-3xl font-bold">{events.length}</p>
                    <p className="text-sm text-muted-foreground">Total Events</p>
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
                    <FaUsers className="text-3xl text-accent" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalRegistrations}</p>
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
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
                    <FaCalendarCheck className="text-3xl text-secondary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {Math.round(totalRegistrations / events.length)}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. per Event</p>
                  </div>
                </div>
              </Card>
            </motion.div>
              </div>

              {/* Events List with Registrations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6">My Events</h2>
                {events.length === 0 ? (
                  <Card className="glass-card p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <FaCalendarCheck className="text-6xl text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">No Events Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't created any events yet. Start by creating your first event!
                      </p>
                      <Link to="/add-event">
                        <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                          <FaPlus />
                          Create Your First Event
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {events.map((event, index) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="glass-card p-6 rounded-xl hover:border-primary/50 transition-all"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full md:w-48 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {event.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                  <span>📍 {event.venue}</span>
                                  <span>👥 {event.registrationCount} registered</span>
                                </div>
                                
                                {/* Registered Users Section */}
                                <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border">
                                  <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                                    <FaUsers className="text-primary" />
                                    Registered Participants ({event.registrationCount})
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {event.registeredUsers.slice(0, 5).map((registration, i) => (
                                      <div key={i} className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-xs">
                                          {String.fromCharCode(65 + i)}
                                        </div>
                                        <span>Student {i + 1}</span>
                                      </div>
                                    ))}
                                    {event.registrationCount > 5 && (
                                      <div className="px-3 py-1 rounded-full bg-muted text-xs">
                                        +{event.registrationCount - 5} more
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(event._id)}
                                  className="gap-2 w-full"
                                >
                                  <FaEdit />
                                  Edit
                                </Button>
                                {user?.role === 'admin' && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(event._id)}
                                    className="gap-2 w-full"
                                  >
                                    <FaTrash />
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
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

export default Dashboard;
