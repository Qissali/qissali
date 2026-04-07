import { redirect } from "next/navigation";
import { TestStoriesClient } from "./test-stories-client";

export default function TestStoriesPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  return <TestStoriesClient />;
}
