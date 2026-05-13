export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1f2229]">
      <img
        src="https://www.svgrepo.com/show/426192/cogs-settings.svg"
        alt="Logo"
        className=" h-40"
      />

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white my-4">
        Site is under maintenance
      </h1>

      <p className="text-center text-gray-300 text-lg md:text-xl lg:text-2xl mb-8">
        We apologize for the inconvenience. Our website is currently undergoing
        maintenance and improvements to provide a better user experience.
        If you would still like to make a loan request, please click the button below.
      </p>

      <div className="flex space-x-4">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScar5qlWr9O3uR9xWcE6peQy2mIYfSv8sBXLRkeAx7oCxwB1Q/viewform"
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Form
        </a>

        <a
          href="https://docs.google.com/spreadsheets/d/1EeqJWCVgvg9JLVBZOcdErbbZjPJ1_XbtKroZChCf02Y/edit?resourcekey=&gid=615759348#gid=615759348"
          className="border-2 border-gray-800 text-white font-bold py-3 px-6 rounded dark:border-white"
        >
          Request Status
        </a>
      </div>
    </div>
  );
}