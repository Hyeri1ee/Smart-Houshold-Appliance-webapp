const checkTokenPresent = () => {
  // If the user has already signed in to homeconnect, redirect them to the pages page. They shouldn't be here.
  if (window.localStorage.getItem("refresh_token")) {
    window.location.href="/pages";
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