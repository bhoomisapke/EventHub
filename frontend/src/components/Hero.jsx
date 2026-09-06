import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="hero">

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >

        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          ✦ COLLEGE EVENT PLATFORM
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover.
          <br />
          Connect.
          <br />
          <span>Experience.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Discover exciting college events, connect with
          students and communities, and be part of
          unforgettable campus experiences.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <motion.button
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Events
          </motion.button>

          <motion.button
            className="secondary-btn"
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Create Event
          </motion.button>
        </motion.div>

      </motion.div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.85, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.35 }}
      >

        <motion.div
          className="floating-card card-one"
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span>🎤</span>
          <div>
            <strong>Tech Fest</strong>
            <small>Upcoming Event</small>
          </div>
        </motion.div>

        <motion.div
          className="floating-card card-two"
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span>💡</span>
          <div>
            <strong>Hackathon</strong>
            <small>Register Now</small>
          </div>
        </motion.div>

        <motion.div
          className="hero-orb"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="orb-inner">
            EVENT
            <br />
            HUB
          </div>
        </motion.div>

      </motion.div>

    </section>
  );
}

export default Hero;