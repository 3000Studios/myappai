"use client";

import { useState, useEffect } from "react";
import AddCollaborator from "@/components/AddCollaborator";

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/collaborators/list");
      const data = await res.json();
      setCollaborators(data.list || []);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen p-10 text-white bg-black">
      <h1 className="text-4xl font-bold mb-6">Collaborators</h1>
      <AddCollaborator />

      <ul className="mt-6 space-y-2">
        {collaborators.map((x) => (
          <li
            key={x}
            className="bg-gray-800 p-3 rounded-md border border-gray-700"
          >
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

