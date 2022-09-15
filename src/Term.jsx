import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, SpeakerWaveIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const utterThis = new SpeechSynthesisUtterance();
const synth = window.speechSynthesis;

export default function Term({ term, meaning, deleteTerm, id }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTerm, setTerm] = useState(term);
  const [newMeaning, setMeaning] = useState(meaning);
  const voices = speechSynthesis.getVoices();

  const updateTerm = async () => {
    try {
      const updates = {
        term: newTerm,
        meaning: newMeaning,
      };

      const { data, error } = await supabase
        .from("terms")
        .update(updates)
        .match({ id });

      if (error) {
        throw error;
      }
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    } finally {
    }
  };

  const speak = (e) => {
    e.preventDefault();
    utterThis.text = term;
    utterThis.lang = "en-US";
    utterThis.voice = voices[0];

    synth.speak(utterThis);
  };

  return (
    <Disclosure key={id}>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={`flex w-full justify-between bg-gray-800 px-4 py-2 text-left text-sm font-medium text-gray-100 hover:bg-gray-600 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 ${
              open ? "rounded-t-lg" : "rounded-lg"
            }`}
          >
            <div className="flex">
              {isEditing ? (
                <input
                  id="term"
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={newTerm || ""}
                  onClick={(e) => e.preventDefault()}
                  onChange={(e) => setTerm(e.target.value)}
                />
              ) : (
                newTerm
              )}
              <SpeakerWaveIcon onClick={speak} className="ml-3 h-5 w-5" />
            </div>
            <ChevronUpIcon
              className={`${
                open ? "" : "rotate-180 transform"
              } h-5 w-5 text-purple-100`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-100 bg-gray-700 w-full flex flex-col space-y-4">
            <span>
              {isEditing ? (
                <textarea
                  id="meaning"
                  type="text"
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Meaning..."
                  value={newMeaning || ""}
                  onChange={(e) => setMeaning(e.target.value)}
                />
              ) : (
                newMeaning
              )}
            </span>
            <div className="space-x-2">
              {!isEditing && (
                <>
                  <button
                    type="button"
                    class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 w-fit"
                    onClick={deleteTerm}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900 w-fit"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                </>
              )}
              {isEditing && (
                <>
                  <button
                    type="button"
                    class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900 w-fit"
                    onClick={() => updateTerm()}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900 w-fit"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
