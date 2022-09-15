import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function InsertTerm({ session, onSubmit }) {
  const [term, setTerm] = useState(null);
  const [meaning, setMeaning] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);

  const insertTerm = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        term,
        meaning,
        translation,
        user: user.id,
      };

      let { error } = await supabase.from("terms").insert([updates]);

      if (error) {
        throw error;
      }

      setTerm(null);
      setMeaning(null);
      setTranslation(null);
      onSubmit();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={insertTerm}
      className="mt-5 space-y-3 w-full
    "
    >
      <div>
        <label
          for="term"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Term
        </label>
        <input
          id="term"
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={term || ""}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>
      <div>
        <label
          for="meaning"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Meaning
        </label>
        <textarea
          id="meaning"
          type="text"
          rows="4"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Meaning..."
          value={meaning || ""}
          onChange={(e) => setMeaning(e.target.value)}
        />
      </div>
      <div>
        <label
          for="translation"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Translation
        </label>
        <input
          id="translation"
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={translation || ""}
          onChange={(e) => setTranslation(e.target.value)}
        />
      </div>
      <div>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={loading}
        >
          Add Term
        </button>
      </div>
    </form>
  );
}
