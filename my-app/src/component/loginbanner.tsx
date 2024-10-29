const Banner: React.FC = () => {
  return (
    <div className="main-login-left">
      <div className="main-login-left-logo">
        <img src="/download.png" alt="main logo" />
      </div>
      <div className="main-login-left-text">
        <h1 className="login-text">
          Register and apply to<br />
          <span id="banner-text">10000+ opportunities</span>
        </h1>
      </div>
    </div>
  );
}

export default Banner;