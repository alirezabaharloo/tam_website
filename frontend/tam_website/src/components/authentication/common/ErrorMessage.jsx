import React from 'react';
import Icons from '../../../data/Icons';

const ErrorMessage = ({ errorMessage }) => {
  return (
    <div className="rounded-md mt-4 gap-1 flex items-center justify-center">
      <Icons.Error className="text-red-600 w-5 h-5" />
      <p className="text-red-600 text-sm ml-2">{errorMessage} </p>
    </div>
  );
};

export default ErrorMessage; 