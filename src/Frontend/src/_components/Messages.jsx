import { useState } from "react";
import { useSelector } from "react-redux";

export { Messages };

function Messages(props){

    const auth = useSelector(x => x.auth.value);

    const [message, setMessage] = useState("");

    const sendMessage = async () => {
      try {

          const user = auth?.firstName;
          await props.connection.invoke("SendMessage", { user, message });
          setMessage("");
      } catch (error) {
        console.log('custom error: ' + error)
      }
    }

    const handleInputChange = (e) => {
      setMessage(e.target.value)
    }

    const onKeyUp = (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        sendMessage();
      }
    }

  return (
    <div className="container mx-auto px-4 py-8">
        <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Incoming messages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-screen">
            <div className="p-8 overflow-hidden">
              { props.messages.map((m, i) => (
                <div key={i}>
                  <h3 className="text-md font-bold mb-2">{m.user}</h3>
                  <p>{m.message}</p>
                </div>
              ))}
            </div>
        </div>

        <div className="flex-grow ml-4">
          <div className="relative flex w-full">
            <input
              id="message-input"
              onChange={handleInputChange}
              onKeyUp={onKeyUp}
              type="text"
              className="w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
              value={message}
            />
            <button
              onClick={sendMessage}
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0 ml-2"
            >
              <span>Send</span>
              <span className="ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
        </section>
    </div>
  )
}