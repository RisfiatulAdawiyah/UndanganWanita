const FloatingParticles = () => {
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    type: ['particle-heart', 'particle-flower', 'particle-sparkle', 'particle-dot'][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle ${particle.type}`}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
