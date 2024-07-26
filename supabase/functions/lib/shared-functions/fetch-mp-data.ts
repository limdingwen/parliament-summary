import { createSupabase } from "../utils/create-supabase.ts";
import { isAdmin } from "../utils/check-admin.ts";
import buildResponseProxy from "../utils/build-response-proxy.ts";
import { wdk } from "npm:wikibase-sdk@10.0.2/wikidata.org";
import { simplifySparqlResults } from "npm:wikibase-sdk@10.0.2";

// Fetches MP data from Wikidata and fills out the database
export default async function fetchMpData(req: Request) {
  const supabase = createSupabase();

  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  const sparql =
    "SELECT DISTINCT ?mp ?mpLabel WHERE {\n" +
    "  ?mp wdt:P39 wd:Q21294917.\n" +
    '  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }\n' +
    "}";
  const url = wdk.sparqlQuery(sparql);
  const rawResults = await fetch(url).then((res) => res.json());
  const simplifiedResults = simplifySparqlResults(rawResults);

  let insertedCount = 0;
  for (const mp of simplifiedResults) {
    const insertData = {
      wikidata_id: mp.mp.value,
      full_name: mp.mp.label,
    };
    // Either insert the MP or update their data if they already exist
    const { error } = await supabase
      .from("mp")
      .upsert(insertData, {
        onConflict: "wikidata_id",
        ignoreDuplicates: false,
      });
    if (error) throw error;
    console.log(`Inserted MP with data ${JSON.stringify(insertData)}`);
    insertedCount++;
  }

  return buildResponseProxy({
    message: `Inserted or updated ${insertedCount} MPs.`,
  });
}
