import React from 'react'

export default function Button({ label, onSubmit }) {
  return (
    <button type="button" className="w-full focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900" onClick={onSubmit}>{label}</button>
  )
}
