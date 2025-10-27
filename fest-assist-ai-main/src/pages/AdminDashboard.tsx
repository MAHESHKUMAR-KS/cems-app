import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarCheck, FaUserGraduate, FaChartLine, FaEdit, FaTrash, FaEnvelope, FaReply, FaCheck, FaClock, FaPaperPlane } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchEvents, deleteEvent, Event } from '@/services/eventService';
import { fetchContactMessages, updateContactMessage, deleteContactMessage, ContactMessage } from '@/services/contactService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/config/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'event-member' | 'admin';
  createdAt: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setStatsLoading(true);

      // Fetch events
      const eventsData = await fetchEvents();
      setEvents(eventsData);

      // Fetch users
      const token = localStorage.getItem('token');
      const usersResponse = await fetch(`${API_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const usersData = await usersResponse.json();
      if (usersData.success) {
        setUsers(usersData.data);
      }

      // Fetch contact messages
      const contactsData = await fetchContactMessages({ limit: 10 });
      setContacts(contactsData.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };
  
  const totalRegistrations = events.reduce((sum, event) => sum + event.registrationCount, 0);
  const totalUsers = users.length;
  const activeEvents = events.length;
  const pendingContacts = contacts.filter(c => c.status === 'pending').length;

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        toast({
          title: 'User Deleted',
          description: `${userName} has been deleted`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setEvents(events.filter((e) => e._id !== eventId));
      toast({
        title: 'Event Deleted',
        description: `${eventTitle} has been deleted`,
      });
    } catch (error) {
      console.error('Delete event error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleReplyContact = async (contactId: string) => {
    if (!replyText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a response',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updated = await updateContactMessage(contactId, {
        status: 'resolved',
        response: replyText,
      });

      setContacts(contacts.map(c => c._id === contactId ? updated : c));
      setSelectedContact(null);
      setReplyText('');

      toast({
        title: 'Response Sent',
        description: 'Your response has been saved successfully',
      });
    } catch (error) {
      console.error('Reply error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send response',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateContactStatus = async (contactId: string, status: string) => {
    try {
      const updated = await updateContactMessage(contactId, { status });
      setContacts(contacts.map(c => c._id === contactId ? updated : c));

      toast({
        title: 'Status Updated',
        description: `Contact marked as ${status}`,
      });
    } catch (error) {
      console.error('Update status error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await deleteContactMessage(contactId);
      setContacts(contacts.filter(c => c._id !== contactId));

      toast({
        title: 'Message Deleted',
        description: 'Contact message has been deleted',
      });
    } catch (error) {
      console.error('Delete contact error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
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
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome back, {user?.name || 'Admin'}!
              </span>
            </h1>
            <p className="text-muted-foreground">Manage your platform, users, and events</p>
          </motion.div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card p-6 hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <FaUsers className="text-3xl text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalUsers}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card p-6 hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-accent/10">
                    <FaCalendarCheck className="text-3xl text-accent" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{activeEvents}</p>
                    <p className="text-sm text-muted-foreground">Active Events</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card p-6 hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-secondary/10">
                    <FaUserGraduate className="text-3xl text-secondary" />
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
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-card p-6 hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-purple-500/10">
                    <FaChartLine className="text-3xl text-purple-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {activeEvents > 0 ? Math.round(totalRegistrations / activeEvents) : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. per Event</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Manage Users Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
            <Card className="glass-card p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              ) : (
                <div className="space-y-4">
                  {users.slice(0, 5).map((userData, index) => (
                    <motion.div
                      key={userData._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
                          {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold">{userData.name}</h4>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs capitalize">
                              {userData.role === 'event-member' ? 'Event Member' : userData.role}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs">
                              active
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled
                          title="Promote feature coming soon"
                        >
                          Promote
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(userData._id, userData.name)}
                          disabled={userData._id === user?._id}
                          title={userData._id === user?._id ? 'Cannot delete yourself' : 'Delete user'}
                        >
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Contact Messages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaEnvelope className="text-primary" />
                Contact Messages
                {pendingContacts > 0 && (
                  <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm">
                    {pendingContacts} new
                  </span>
                )}
              </h2>
            </div>
            <Card className="glass-card p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
                  <p className="text-muted-foreground">Loading messages...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <FaEnvelope className="text-6xl text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No Messages</h3>
                  <p className="text-muted-foreground">No contact messages have been received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <motion.div
                      key={contact._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-all"
                    >
                      {/* Message Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{contact.subject}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              contact.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                              contact.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' :
                              contact.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                              'bg-gray-500/10 text-gray-500'
                            }`}>
                              {contact.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span>👤 {contact.name}</span>
                            <span>📧 {contact.email}</span>
                            <span>🏷️ {contact.issueType.replace('-', ' ')}</span>
                            <span>📅 {new Date(contact.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {contact.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedContact(selectedContact?._id === contact._id ? null : contact)}
                            >
                              <FaReply className="mr-1" />
                              Reply
                            </Button>
                          )}
                          {contact.status !== 'closed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateContactStatus(contact._id, 'closed')}
                            >
                              <FaCheck className="mr-1" />
                              Close
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteContact(contact._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="mt-3 p-3 rounded-lg bg-muted/30">
                        <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
                      </div>

                      {/* Response Section */}
                      {contact.response && (
                        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-xs text-green-600 dark:text-green-400 mb-1 font-semibold">
                            Response by {contact.respondedBy?.name} • {new Date(contact.respondedAt!).toLocaleDateString()}
                          </p>
                          <p className="text-sm">{contact.response}</p>
                        </div>
                      )}

                      {/* Reply Form */}
                      {selectedContact?._id === contact._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20"
                        >
                          <label className="text-sm font-semibold mb-2 block">Your Response</label>
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response here..."
                            rows={4}
                            className="mb-3 bg-background"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleReplyContact(contact._id)}
                              disabled={!replyText.trim()}
                            >
                              <FaPaperPlane className="mr-1" />
                              Send Response
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedContact(null);
                                setReplyText('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* All Events List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">All Events</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <FaCalendarCheck className="text-6xl text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Events Yet</h3>
                <p className="text-muted-foreground">No events have been created in the system.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card className="glass-card p-6">
                      <div className="flex flex-col gap-4">
                        {/* Event Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                              <span>📍 {event.venue}</span>
                              <span>👥 {event.registrationCount} registered</span>
                              <span>🏢 {event.college}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleEditEvent(event._id)}
                            >
                              <FaEdit />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteEvent(event._id, event.title)}
                              className="gap-2"
                            >
                              <FaTrash />
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Registered Users Section */}
                        {event.registrationCount > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                              <FaUsers className="text-primary" />
                              Registered Participants ({event.registrationCount})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {event.registeredUsers.slice(0, 6).map((registration, i) => {
                                // Find user details
                                const registeredUser = users.find(u => u._id === registration.user);
                                const userName = registeredUser?.name || 'Unknown User';
                                const userEmail = registeredUser?.email || '';
                                const registeredDate = new Date(registration.registeredAt).toLocaleDateString();

                                return (
                                  <div 
                                    key={i} 
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all"
                                    title={`${userEmail}\nRegistered: ${registeredDate}`}
                                  >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                      {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{userName}</p>
                                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                                    </div>
                                  </div>
                                );
                              })}
                              {event.registrationCount > 6 && (
                                <div className="flex items-center justify-center px-3 py-2 rounded-lg bg-muted text-sm font-medium">
                                  +{event.registrationCount - 6} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* No Registrations */}
                        {event.registrationCount === 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground text-center py-2">
                              No registrations yet
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
