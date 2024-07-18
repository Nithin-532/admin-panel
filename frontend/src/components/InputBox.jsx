import React, { useState } from 'react';

export default function InputBox({ label, placeholder, onChange, onBlur, value, formik }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='d-flex flex-col align-middle justify-center mb-4'>
      <p className='text-lg text-center font-medium capitalize'>{label}</p>
      {label === 'password' ?
        (<div className="relative">
          <input 
            id={label}
            type={showPassword ? 'text' : 'password'} 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder={placeholder} 
            value={value}
            onChange={onChange} 
            onBlur={onBlur} 
          />
          <button 
            type="button" 
            className="absolute top-0 end-0 p-3.5 rounded-e-md" 
            onClick={() => setShowPassword(prev => !prev)}
          >
            <svg 
              className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path className={!showPassword ? "block" : "hidden"} d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
              <path className={!showPassword ? "block" : "hidden"} d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
              <path className={!showPassword ? "block" : "hidden"} d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
              <line className={!showPassword ? "block" : "hidden"} x1="2" x2="22" y1="2" y2="22"></line>
              <path className={showPassword ? "block" : "hidden"} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle className={showPassword ? "block" : "hidden"} cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>)
        : (
          <input 
            type="text" 
            id={label} 
            placeholder={placeholder} 
            minLength='6' 
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' 
            value={value} 
            onChange={onChange} 
            onBlur={onBlur} 
            required 
          />
        )}
      {formik.touched[label] && formik.errors[label] ? (
        <div>{formik.errors[label]}</div>
      ) : null}
    </div>
  )
}