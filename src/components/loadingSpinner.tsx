import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-600"></div>
      <p className="mt-4 text-color text-xl font-bold">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
