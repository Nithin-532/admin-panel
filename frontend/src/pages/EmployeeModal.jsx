import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function FormModal({ data, onSave, onDelete, setShowModal }) {
  useEffect(() => {
    if (data) {
      setShowModal(true);
    }
  }, [data]);

  const initialValues = data || {
    firstname: "",
    lastname: "",
    serialNumber: "",
    email: "",
    designation: "",
    location: ""
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required("Required"),
    lastname: Yup.string().required("Required"),
    serialNumber: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    designation: Yup.string().required("Required"),
    location: Yup.string().required("Required")
  });

  const handleSubmit = (values, { setSubmitting }) => {
    onSave(values);
    setShowModal(false);
    setSubmitting(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(data);
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-2 border-gray-200 rounded shadow-sm relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-xl font-semibold">
                {data ? "Edit Employee" : "Add New Employee"}
              </h3>
              <button
                className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className=" text-black h-6 w-6 text-2xl focus:outline-none flex items-center justify-end">
                  ×
                </span>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="flex items-center justify-between gap-6">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          First Name
                        </label>
                        <Field
                          type="text"
                          name="firstname"
                          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <ErrorMessage
                          name="firstname"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Last Name
                        </label>
                        <Field
                          type="text"
                          name="lastname"
                          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <ErrorMessage
                          name="lastname"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Designation
                        </label>
                        <Field
                          type="text"
                          name="designation"
                          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <ErrorMessage
                          name="designation"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Serial Number
                        </label>
                        <Field
                          type="text"
                          name="serialNumber"
                          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <ErrorMessage
                          name="serialNumber"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Location
                      </label>
                      <Field
                        type="text"
                        name="location"
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="location"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="flex items-center justify-end pt-3 border-blueGray-200 rounded-b">
                      {data && (
                        <button
                          className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded-sm shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                      )}
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-sm shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Save Changes
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
