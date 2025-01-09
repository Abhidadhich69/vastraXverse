import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 py-10 px-6 sm:px-12 lg:px-24">
      <div className="max-w-screen-xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          About Us
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Welcome to our website! We are dedicated to providing the best shopping
          experience to our customers. Our mission is to offer high-quality products,
          exceptional customer service, and a seamless shopping experience. Learn more
          about who we are and why we do what we do.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="flex flex-col items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Our Mission"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Our Mission</h3>
            <p className="text-gray-600">
              We strive to provide our customers with a wide variety of products, at
              affordable prices, while maintaining the highest standards of quality and
              customer service.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Our Vision"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Our Vision</h3>
            <p className="text-gray-600">
              Our vision is to become the leading online store in the industry by
              continuously improving our products, services, and overall customer
              experience.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Our Values"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Our Values</h3>
            <p className="text-gray-600">
              Integrity, honesty, and dedication are at the heart of everything we do.
              We are committed to upholding these values as we grow and serve our
              customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
