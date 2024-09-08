import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { loginValidationSchema } from '../../components/validation/validationSchma'; // Adjust the path as needed
import api from '../../axiosInterceptors';

const Login = () => {
  const navigate = useNavigate();


  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await api.post('/auth/login', values);
      if(response.status===200){
        // console.log(response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('first_name', response.data.user.first_name);
        
        navigate('/'); 
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
        <h1 className="text-3xl font-bold text-blue-500 mb-6">Login</h1>
        <div className="border-2 border-blue-500 rounded-md p-5">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-4">
                {/* Email */}
                <div className="mb-4">
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <Field
                    type="password"
                    name="password"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                  disabled={isSubmitting}
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-4 text-sm text-gray-500 flex justify-center items-center">
           {`${" Don't have an account?"}`}{' '}
            <span onClick={() => navigate('/register')} className="text-blue-500 cursor-pointer">
              Signup
            </span>
          </p>
          
          <div className="flex justify-center mt-4">
            <button className="bg-blue-500 px-4 py-2 text-white text-sm font-bold border border-gray-300 rounded-md hover:bg-blue-600">
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

