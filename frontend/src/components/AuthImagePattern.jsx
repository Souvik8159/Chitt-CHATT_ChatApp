const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
      

        <div className="hidden lg:flex items-center mb-12 justify-center flex-1 bg-base-200">
          <div className="space-y-5">
            <div className="chat chat-start animate-bounce">
              <div className="chat-bubble text-3xl w-52">👋👋👋</div>
            </div>

            <div
              className="chat chat-end animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="chat-bubble chat-bubble-primary text-3xl w-40">😎😎😎</div>
            </div>

            <div
              className="chat chat-start animate-bounce"
              style={{ animationDelay: "1s" }}
            >
              <div className="chat-bubble text-3xl w-60">😊😀🙂☺️</div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
