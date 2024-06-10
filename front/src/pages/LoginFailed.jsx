const checkTokenPresent = () => {
  // If the user has already signed in to homeconnect, redirect them to the dashboard page. They shouldn't be here.
  if (window.localStorage.getItem("refresh_token")) {
    window.location.href="/dashboard";
  }
}

function LoginFailed() {
  checkTokenPresent();
  return (
    <>
      <h1>
        Login to home-connect failed! Please try again.
      </h1>
    </>
  )
}

export default LoginFailed;