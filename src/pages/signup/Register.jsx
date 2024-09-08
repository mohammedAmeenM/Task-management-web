import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { registerValidationSchema } from '../../components/validation/validationSchma'; 
import api from '../../axiosInterceptors';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await api.post('/auth/register', values);
      if(response.status===201){
        // console.log(response.data);
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        setErrors({ email: error.response.data.message });
      } else {
        console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">Signup</h1>
        <div className="border-2 border-blue-500 rounded-md p-5">
          <Formik
            initialValues={{
              first_name: '',
              last_name: '',
              email: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={registerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-3">
                {/* First Name */}
                <div className="mb-2">
                  <Field
                    type="text"
                    name="first_name"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="First name"
                  />
                  <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Last Name */}
                <div className="mb-2">
                  <Field
                    type="text"
                    name="last_name"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Last name"
                  />
                  <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Email */}
                <div className="mb-2">
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Password */}
                <div className="mb-2">
                  <Field
                    type="password"
                    name="password"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Confirm Password */}
                <div className="mb-2">
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Confirm password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                  disabled={isSubmitting}
                >
                  Signup
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-4 flex justify-center text-sm text-gray-500">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="text-blue-500 cursor-pointer">
              Login
            </span>
          </p>
          
          <div className="flex justify-center mt-4">
            <button className="bg-blue-500 px-4 py-2 text-white text-sm font-bold border border-gray-300 rounded-md hover:bg-blue-600">
              Signup with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
