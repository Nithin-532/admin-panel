import React from 'react'
import { Link } from 'react-router-dom'

export default function BottomWarning({ label, buttonText, to }) {
  return (
    <div className='flex justify-center align-middle pt-2 pb-3 px-2'>
      <div>
        {label}
      </div>
      <Link className='flex underline pl-1' to={to}>
        {buttonText}
      </Link>
    </div>
  )
}
