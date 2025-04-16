
const Login = () => {
  return (
    <div className="max-w-md h-screen mx-auto text-center mt-50 p-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">team<span className="text-blue-500">.</span></h2>
      <p className="text-lg text-gray-700 mb-1">Get started with our modern project<br />management software</p>
      <p className="text-sm text-gray-500 mb-6">14 day free trial. No credit card required</p>

      <input
        type="email"
        placeholder="Email address"
        className="w-full border border-gray-300 px-4 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-4 transition">
        Get started for free
      </button>

      <div className="text-gray-500 text-sm mb-4">or</div>

      <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-50 transition">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
        Sign up with Google
      </button>

      <p className="text-xs text-gray-500 mt-6">
        By clicking the button, you agree to our <a href="#" className="text-blue-500 underline">Terms of Service</a> and
        <br />
        have read and agreed to our <a href="#" className="text-blue-500 underline">Privacy Policy</a>.
      </p>

      <p className="text-sm text-gray-600 mt-6">
        Already have an account? <a href="#" className="text-blue-500 underline">Sign in here</a>
      </p>
    </div>
  );
};

export default Login;
