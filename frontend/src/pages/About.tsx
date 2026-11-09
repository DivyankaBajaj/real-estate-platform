const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">About RealEstate</h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        We are dedicated to helping you find your dream home. 
        Our platform connects buyers, sellers, and renters with the best properties in India.
      </p>
      <div className="flex justify-center gap-4">
        <div className="bg-emerald-50 p-4 rounded-lg w-32">
          <h3 className="text-2xl font-bold text-emerald-600">10k+</h3>
          <p className="text-sm text-gray-500">Properties</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg w-32">
          <h3 className="text-2xl font-bold text-emerald-600">5k+</h3>
          <p className="text-sm text-gray-500">Happy Clients</p>
        </div>
      </div>
    </div>
  );
};

export default About;