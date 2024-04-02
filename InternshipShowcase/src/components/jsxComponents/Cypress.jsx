// TODO:
// - Show the console logs in the page
import { useState } from "react";

const CypressForm = () => {
const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
  };

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden bg-black-100 w-full rounded-xl">
      <div className="flex-[0.75] p-8 rounded-xl">
        <p className="sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider">
          Run Cypress from a Web interface
        </p>
        <h2 className="text-red-gradient font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
          Cypress Testing
        </h2>

        <form
          action=""
          className="mt-12 flex flex-col gap-8"
          method=""
          onSubmit={handleSubmit}
        >
          <label htmlFor="selectTest" className="flex flex-col">
            <span className="text-white font-medium mb-4">Test:</span>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="selectTest"
              id="selectTest"
            >
              <option value="0">Test Assesment Site</option>
              <option value="1">Upload File</option>
            </select>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="py-3 px-8 outlined-none w-fit text-white font-bold shadow-md shadow-secondary rounded-xl"
          >
            {loading ? "Starting The Test..." : "Start The Test"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { CypressForm };
