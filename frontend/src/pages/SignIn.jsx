import React, { useState } from 'react'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [role, setRole] = useState('Admin');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const fetchApi = async (values) => {
    if (role === 'Admin') {
      try {
        const response = await axios.post("http://localhost:3000/admin/signin", {
          username: values.username,
          password: values.password
        });
        const token = await response.data.token;
        localStorage.setItem('token', 'Bearer ' + token);
        if (response.data.role === 'admin') {
          navigate("/");
        }
      } catch(e) {
        console.log(e)
        setErrorMessage({
          error: true,
          message: e.response.data.message
        })
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(6, 'Username must be at least 6 characters')
        .required('Required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required'),
    }),
    onSubmit: values => {
      fetchApi(values)
    },
  });

  const changeRole = (e) => {
    setRole(e.target.value);
  }

  return (
    <div className='h-screen w-full flex align-middle justify-center bg-slate-100'>
      <div className='flex flex-col justify-center'>
        <div className='py-4 px-8 flex flex-col align-middle justify-center rounded-lg w-96 bg-white shadow-lg'>
          <p className='text-4xl font-bold text-center mb-6'>Sign In</p>
          <div className='d-flex flex-col align-middle justify-center mb-4'>
            <form className="max-w-sm mx-auto">
              <label htmlFor="role" className="block text-lg font-medium text-center">Role</label>
              <select id="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={changeRole}>
                <option value="Admin">Admin</option>
                {/* <option value="Employee">Employee</option> */}
              </select>
            </form>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <InputBox 
              label={"username"} 
              placeholder={"username"} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              value={formik.values.username} 
              formik={formik}
            />
            <InputBox 
              label={"password"} 
              placeholder={"password"} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              value={formik.values.password} 
              formik={formik}
            />
            <Button label={"Sign In"} onSubmit={formik.handleSubmit} />
          </form>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign Up"} to={"/signup"} />
        </div>
      </div>
    </div>
  )
}
