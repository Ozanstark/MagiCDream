import React from "react";

const Header = () => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold rainbow-text">
        AI Dream Image Generator
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
        Create quickly unlimited images in any style and without any censorship.
      </p>
    </div>
  );
};

export default Header;