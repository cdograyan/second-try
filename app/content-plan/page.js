"use client";
import { useEffect, useState } from "react";

export default function ContentPlanPage() {
  const [contentPlan, setContentPlan] = useState([]);

  useEffect(() => {
    // ✅ Load content plan from local storage
    const plan = localStorage.getItem("contentPlan");

    if (plan) {
      try {
        // ✅ Parse JSON correctly (fixes `.split()` error)
        const structuredPlan = JSON.parse(plan);

        if (Array.isArray(structuredPlan)) {
          setContentPlan(structuredPlan);
        } else {
          console.error("❌ Invalid format in local storage.");
        }
      } catch (error) {
        console.error("❌ Error parsing content plan:", error);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black text-white rounded-lg shadow-lg mt-16">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Custom Content Plan</h1>
      {contentPlan.length > 0 ? (
        <table className="w-full border-collapse border border-gray-500 mt-4">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-500 p-2">Month</th>
              <th className="border border-gray-500 p-2">Content Type</th>
              <th className="border border-gray-500 p-2">Content Title</th>
              <th className="border border-gray-500 p-2">Brief</th>
            </tr>
          </thead>
          <tbody>
            {contentPlan.map((item, index) => (
              <tr key={index} className="border border-gray-500">
                <td className="border border-gray-500 p-2">{item.month}</td>
                <td className="border border-gray-500 p-2">{item.type}</td>
                <td className="border border-gray-500 p-2">{item.title}</td>
                <td className="border border-gray-500 p-2">{item.brief}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-300">⚠ No content plan found. Please generate one.</p>
      )}
    </div>
  );
}
