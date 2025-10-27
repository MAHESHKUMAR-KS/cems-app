import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUser, FaUsers, FaArrowLeft } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchEventById, registerForEvent, unregisterFromEvent, Event } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const EventDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchEventById(id);
        setEvent(data);
        
        // Check if current user is already registered
        if (user && data.registeredUsers) {
          const userRegistered = data.registeredUsers.some(
            (reg) => reg.user === user._id
          );
          setIsRegistered(userRegistered);
        }
      } catch (error) {
        console.error('Failed to load event:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to register for events',
        variant: 'destructive',
      });
      return;
    }

    if (!id) return;

    try {
      setIsRegistering(true);
      await registerForEvent(id);
      
      // Update local state
      setIsRegistered(true);
      if (event) {
        setEvent({
          ...event,
          registrationCount: event.registrationCount + 1,
          registeredUsers: [
            ...event.registeredUsers,
            { user: user!._id, registeredAt: new Date().toISOString() },
          ],
        });
      }

      toast({
        title: 'Registration Successful! 🎉',
        description: `You've successfully registered for ${event?.title}`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Failed to register for event',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!id) return;

    if (!confirm('Are you sure you want to unregister from this event?')) {
      return;
    }

    try {
      setIsRegistering(true);
      await unregisterFromEvent(id);
      
      // Update local state
      setIsRegistered(false);
      if (event) {
        setEvent({
          ...event,
          registrationCount: event.registrationCount - 1,
          registeredUsers: event.registeredUsers.filter(
            (reg) => reg.user !== user!._id
          ),
        });
      }

      toast({
        title: 'Unregistered',
        description: `You've been unregistered from ${event?.title}`,
      });
    } catch (error) {
      console.error('Unregister error:', error);
      toast({
        title: 'Failed to Unregister',
        description: error instanceof Error ? error.message : 'Failed to unregister from event',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const categoryColors = {
    technical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cultural: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    sports: 'bg-green-500/10 text-green-400 border-green-500/20',
    workshop: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24">
        {/* Hero Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container mx-auto px-4 pb-8">
              <Link to="/events">
                <Button variant="ghost" size="sm" className="mb-4">
                  <FaArrowLeft className="mr-2" />
                  Back to Events
                </Button>
              </Link>

              <Badge className={`mb-4 ${categoryColors[event.category]}`}>
                {event.category}
              </Badge>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold mb-4"
              >
                {event.title}
              </motion.h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 rounded-xl"
              >
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </motion.div>

              {/* Event Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-8 rounded-xl"
              >
                <h2 className="text-2xl font-bold mb-6">Event Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <FaCalendar className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date</p>
                      <p className="font-semibold">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <FaClock className="text-accent text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Time</p>
                      <p className="font-semibold">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <FaMapMarkerAlt className="text-secondary text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Venue</p>
                      <p className="font-semibold">{event.venue}</p>
                      <p className="text-sm text-muted-foreground">{event.college}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <FaUser className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Organized by</p>
                      <p className="font-semibold">{event.organizer}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 rounded-xl sticky top-24"
              >
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FaUsers className="text-primary text-2xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{event.registrationCount}</p>
                    <p className="text-sm text-muted-foreground">Registered</p>
                  </div>
                </div>

                {isAuthenticated && user?.role === 'student' && (
                  isRegistered ? (
                    <Button
                      onClick={handleUnregister}
                      disabled={isRegistering}
                      variant="outline"
                      className="w-full h-12 mb-4"
                    >
                      {isRegistering ? 'Processing...' : 'Unregister'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="w-full h-12 bg-gradient-to-r from-primary to-accent mb-4"
                    >
                      {isRegistering ? 'Registering...' : 'Register Now'}
                    </Button>
                  )
                )}

                {!isAuthenticated && (
                  <Link to="/login">
                    <Button className="w-full h-12 bg-gradient-to-r from-primary to-accent mb-4">
                      Login to Register
                    </Button>
                  </Link>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium capitalize">{event.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">College</span>
                    <span className="font-medium">{event.college}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Organizer</span>
                    <span className="font-medium">{event.organizer}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetail;
