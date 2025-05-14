import { TableContainer } from "./(components)/TableContainer";
import { MetaType, UserType } from "./(components)/types";

export type ApiResponse = {
  data: UserType[];
  meta: MetaType;
};

const getData = async (): Promise<ApiResponse> => {
  const res = await fetch(`${process.env.BASE_URL}/api/users/`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  const json = await res.json();

  // throw error if meta or data is invalid structure
  if (!json.data || !json.meta) {
    throw new Error("Invalid API response: Missing 'data' or 'meta'");
  }

  return json;
};

export default async function UserPage() {
  const data = await getData();

  return <TableContainer data={data.data} meta={data.meta} />;
}
