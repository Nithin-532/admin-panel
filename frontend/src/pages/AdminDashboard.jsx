import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import FormModal from './EmployeeModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState('');
  const [data, setData] = useState(null);
  const [showEmployeeModel, setShowEmployeeModel] = useState(false);
  const [status, setStatus] = useState(null);
  const [avatarMenu, setAvatarMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/signin");
    }

    const fetchApi = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/dashboard", {
          headers: {
            "Authorization": token
          }
        });
        console.log(response.data.data.users)
        setUsers(response.data.data.users);
        setAdmin(response.data.data.username.split("@")[0])
      } catch (e) {

      }
    }

    fetchApi();
  }, [status]);

  const handleClickOutside = (event) => {
    // console.log(menuRef.current)
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setAvatarMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSave = async (values) => {
    const token = localStorage.getItem('token');
    try {
      if (data === null) {
        const newData = {
          firstname: values.firstname,
          lastname: values.lastname,
          username: values.firstname + "." + values.lastname[0],
          password: values.firstname + "." + values.lastname[0] + "@9090",
          email: values.email,
          location: values.location,
          designation: values.designation,
          serialNumber: values.serialNumber
        }
  
        const response = await axios.post('http://localhost:3000/admin/createuser', newData, { headers : {"Authorization": token}});
        const answer = await response.data;
        setStatus({ error: false, message: answer.message });
      } else {
        console.log(values, data?.serialNumber);
        const response = await axios.post("http://localhost:3000/admin/edituser", {...values, serialNumber: data?.serialNumber}, { headers : {"Authorization": token}});
        const answer = await response.data;
        setStatus({ error: true, message: answer.message });
      }
    } catch(e) {
      console.log(e);
      setStatus({ error: true, message: e.response.message });
    }
  }

  const onDelete = (values) => {

  }

  const employeeEdit = (e, value) => {
    e.preventDefault();
    if (value) {
      const newData = {
        firstname: value.firstname,
        lastname: value.lastname,
        serialNumber: value.serialNumber,
        email: value.email,
        designation: value.designation,
        location: value.location
      }
      console.log(value, newData)
      setData(newData);
    }else {
      setData(value);
    }
    setShowEmployeeModel(true);
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/signin");
  }

  return (
    <div className='bg-slate-100 w-screen h-screen'>
      <nav className="bg-white border-gray-200 border-b-2">
        <div className='p-4 mx-auto flex align-middle justify-between'>
          <div className='flex align-middle justify-center gap-4'>
            <div className='flex align-middle justify-center gap-1'>
              <div className='w-3 h-3 rounded-full bg-blue-500 flex align-middle mt-1.5' />
              <div className='w-3 h-3 rounded-full bg-blue-500 flex align-middle mt-1.5' />
            </div>
            <p className='m-0 font-bold text-center'>Admin <span className='text-center font-normal'>Logo</span></p>
          </div>
          <div className='flex gap-4 align-middle justify-center'>
            <div className='flex align-middle justify-center gap-2'>
              <p className='text-center font-medium'>{admin}</p>
              <div class="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 cursor-pointer" onClick={(e) => setAvatarMenu(prev => !prev)}>
                <span class="font-medium text-gray-600 dark:text-gray-300 capitalize text-center">{admin[0]}</span>
              </div>
              {avatarMenu && (
                <div ref={menuRef} className='p-2 border rounded-sm shadow-sm bg-white absolute origin-top-right right-0 top-16 ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer'>
                  <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 m-0" onClick={handleLogout}>Logout</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className='flex flex-col p-4 w-full'>
        <div className='flex align-middle justify-between mb-7'>
          <div className='flex flex-col'>
            <p className='font-bold text-xl m-0'>Employees</p>
            <p className='font-normal text-gray-600 m-0 text-sm'>Here is a list of all employees</p>
          </div>
          <button type='button' className='text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-sm text-sm px-6 py-2.5 me-2 mb-2' onClick={(e) => employeeEdit(e, null)}>Add Employee</button>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-sm">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Employee name
                </th>
                <th scope="col" className="px-6 py-3">
                  Serial Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Designation
                </th>
                <th scope="col" className="px-6 py-3">
                  Location
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.length > 0 && (
                users.map((val, index) => {
                  return (
                    <tr className='odd:bg-white even:bg-gray-50'>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {val["firstname"] + " " + val["lastname"]}
                      </th>
                      <td scope="col" className="px-6 py-3">
                        {val["serialNumber"]}
                      </td>
                      <td scope="col" className="px-6 py-3">
                        {val["email"]}
                      </td>
                      <td scope="col" className="px-6 py-3">
                        {val["designation"] === 'Developer' ?
                          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Developer</span>
                          :
                          val["designation"] === 'Tester' ?
                            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Tester</span>
                            :
                            val["designation"]}
                      </td>
                      <td scope="col" className="px-6 py-3">
                        {val["location"]}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={(e) => employeeEdit(e, val)}>Edit</div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showEmployeeModel && <FormModal data={data} onSave={onSave} onDelete={onDelete} setShowModal={setShowEmployeeModel} />}
    </div>
  )
}
