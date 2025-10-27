import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                About CEMS
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              CEMS (College Event Management System) is your comprehensive platform for discovering,
              managing, and participating in college events. We connect students, organizers, and
              institutions to create unforgettable experiences.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
