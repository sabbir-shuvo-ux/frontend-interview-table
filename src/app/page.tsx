import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">
        Frontend Developer Assignment | Digital Pylot
      </h1>
      <div className="text-center">
        <Link className="hover:underline" href={"/users"}>
          User List
        </Link>
      </div>
    </div>
  );
}
