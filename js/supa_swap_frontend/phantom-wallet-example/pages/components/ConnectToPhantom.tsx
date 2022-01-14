import { useEffect, useState } from "react";


type Event = "connect" | "disconnect";

interface Phantom {
  on: (event: Event, callback: () => void) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const ConnectToPhantom = () => {
  const [phantom, setPhantom] = useState<Phantom | null>(null);

  useEffect(() => {
    if (window["solana"]?.isPhantom) {
      setPhantom(window["solana"]);
    }
  }, []);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    phantom?.on("connect", () => {
      setConnected(true);
    });

    phantom?.on("disconnect", () => {
      setConnected(false);
    });
  }, [phantom]);

  const connectHandler = () => {
    phantom?.connect();
  };
  
  const swapDirection = () => {
  
  };


  const disconnectHandler = () => {
    phantom?.disconnect();
  };

  if (phantom) {
    if (connected) {

      return (
        <main className="mt-2 items-center z-10" > 
<h2 className="text-6xl pb-5 font-bold text-center text-Black">SupaSwap</h2>
<div className="mt-2 pb-3 items-center z-10"> 
    <button
          onClick={disconnectHandler}
          className="py-2 px-4 border w-full border-white rounded-lg text-md font-medium text-white whitespace-nowrap hover:bg-black hover:border-black"
        >
          Disconnect from Phantom
</button> 
</div>
        

    <div className="mt-2 items-center z-10">
        <form className="bg-white max-w-sm mx-auto rounded-xl shadow-xl overflow-hidden p-6 space-y-10">
            
            <div>
  <label htmlFor="amount" className="pb-3 text-2xl block font-bold text-black">Exchange</label>
  <div className="mt-1 relative rounded-md shadow-md">
    <input type="text" name="price" id="price" className="border-black border focus:border-white block w-full pl-2 pr-12 sm:text-md border-gray rounded-md" placeholder="# of tokens">
      </input>
    <div className="absolute inset-y-0 right-0 flex items-center">
      <label htmlFor="currency" className="sr-only">Currency</label>
      <select id="direction" name="direction" className="h-full pl-2 pr-2 font-semibold bg-black border border-black rounded text-white sm:text-md rounded-lg">
        <option>Send</option>
        <option>Recieve</option>
      </select>
    </div>
  </div>
</div>
            <div className="flex items-center flex items-center justify-center">
                
                
      
      <button
                    className="px-6 py-2 ml-4 font-semibold shadow-lg bg-black border-cyan-900 text-center transition hover:shadow-lg hover:bg-white border border-black hover:text-black rounded-md text-white  ">
          Submit
      </button>
    </div>
  </form>
  </div>

  



        </main>
        
        
      );
    }

    return (
      <button
        onClick={connectHandler}
        className="bg-white py-2 px-4 border border-transparent rounded-md text-sm font-medium text-black whitespace-nowrap hover:bg-black hover:text-white"
      >
        Connect to Phantom
      </button>
    );
  }

  return (
    <a
      href="https://phantom.app/"
      target="_blank"
      className="bg-purple-500 px-4 py-2 border border-transparent rounded-md text-base font-medium text-white"
    >
      Get Phantom
    </a>
  );
};

export default ConnectToPhantom;