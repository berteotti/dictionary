import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import InsertTerm from "./InsertTerm";
import Term from "./Term";

export default function Home({ session }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    getTerms();
  }, [session]);

  const getTerms = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("terms")
        .select(`id, term, meaning`)
        .eq("user", user.id)
        .order("created_at", { ascending: true });

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setData(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTerm = async (id) => {
    try {
      const { user } = session;

      const { error } = await supabase
        .from("terms")
        .delete()
        .match({ id, user: user.id });

      if (error) {
        throw error;
      }

      setData(data.filter(({ id: dataId }) => dataId !== id));
    } catch (error) {
      alert(error.message);
    } finally {
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-[50%] space-y-6">
      <h1>Terms</h1>
      <div className="w-full">
        {loading ? (
          "Loading..."
        ) : data && data.length ? (
          <div className="space-y-2">
            {data.map(({ id, term, meaning }) => (
              <Term
                key={id}
                term={term}
                meaning={meaning}
                deleteTerm={() => deleteTerm(id)}
                id={id}
              />
            ))}
          </div>
        ) : (
          "No data"
        )}
      </div>
      <InsertTerm session={session} onSubmit={getTerms} />
    </div>
  );
}
