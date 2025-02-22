"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import { Card, CardContent } from "./ui/card";
import * as Select from "@radix-ui/react-select";

// Custom Button Component
export function Button({ children, ...props }) {
  return (
    <button
      className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full transition-all"
      {...props}
    >
      {children}
    </button>
  );
}

// Custom Input Component
export function Input(props) {
  return (
    <input
      className="p-3 border border-gray-300 rounded-md w-full bg-white text-gray-900 placeholder-gray-500"
      {...props}
    />
  );
}

export default function ContentStrategyGenerator() {
  const router = useRouter(); // ✅ Initialize router for redirection
  const [businessStage, setBusinessStage] = useState("");
  const [goal, setGoal] = useState("");
  const [techSolution, setTechSolution] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStrategy = async () => {
    if (!businessStage || !goal || !techSolution || !companyName || !websiteUrl) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessStage, goal, techSolution, companyName }),
      });

      const data = await response.json();

      if (data.strategy) {
        // ✅ Parse response into structured format
        const formattedPlan = data.strategy.split("\n").map((line) => {
          const parts = line.split(" - ");
          if (parts.length === 4) {
            return {
              month: parts[0].trim(),
              type: parts[1].trim(),
              title: parts[2].trim(),
              brief: parts[3].trim(),
            };
          }
          return null;
        }).filter(Boolean);

        // ✅ Store structured plan in localStorage
        localStorage.setItem("contentPlan", JSON.stringify(formattedPlan));

        // ✅ Redirect user to new page
        router.push("/content-plan");
      } else {
        alert("Failed to generate strategy.");
      }
    } catch (error) {
      console.error("Error generating strategy:", error);
      alert("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-black text-white rounded-lg shadow-lg mt-16">
      <h1 className="text-2xl font-bold mb-4 text-center">AI-Powered B2B Content Strategy Generator</h1>
      <p className="mb-6 text-center text-gray-400">
        Please enter your tech company’s details and get a sample content plan in seconds!
      </p>

      {/* Business Stage Selection */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Business Stage</label>
        <Select.Root onValueChange={setBusinessStage}>
          <Select.Trigger className="p-3 border border-gray-600 rounded-md w-full bg-gray-800 text-gray-300 flex justify-between items-center">
            <Select.Value placeholder="Select Business Stage" />
            <Select.Icon className="text-gray-400">▼</Select.Icon>
          </Select.Trigger>
          <Select.Content className="bg-gray-800 border border-gray-600 rounded-md shadow-md w-full">
            <Select.Viewport>
              <Select.Item value="startup" className="p-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                Start-up
              </Select.Item>
              <Select.Item value="scaleup" className="p-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                Scale-up
              </Select.Item>
              <Select.Item value="enterprise" className="p-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                Enterprise
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Marketing Goal Selection */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Marketing Goal</label>
        <Select.Root onValueChange={setGoal}>
          <Select.Trigger className="p-3 border border-gray-600 rounded-md w-full bg-gray-800 text-gray-300 flex justify-between items-center">
            <Select.Value placeholder="Select Marketing Goal" />
            <Select.Icon className="text-gray-400">▼</Select.Icon>
          </Select.Trigger>
          <Select.Content className="bg-gray-800 border border-gray-600 rounded-md shadow-md w-full">
            <Select.Viewport>
              <Select.Item value="lead_generation" className="p-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                Lead Generation
              </Select.Item>
              <Select.Item value="brand_awareness" className="p-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                Brand Awareness
              </Select.Item>
              <Select.Item value="digital_footprint" className="p-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                Digital Footprint
              </Select.Item>
              <Select.Item value="thought_leadership" className="p-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                Thought Leadership
              </Select.Item>
              <Select.Item value="sales_enablement" className="p-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                Sales Enablement
              </Select.Item>
              <Select.Item value="linkedin_visibility" className="p-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                LinkedIn Visibility
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Input Fields */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Tech Solution</label>
        <Input placeholder="Describe your tech solution..." value={techSolution} onChange={(e) => setTechSolution(e.target.value)} required />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Company Name</label>
        <Input placeholder="Enter your company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 mb-1">Website URL</label>
        <Input placeholder="Enter your website URL" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} required />
      </div>

      {/* Generate Button */}
      <Button onClick={generateStrategy}>
        {loading ? "Generating..." : "Generate My Content Strategy"}
      </Button>

      {loading && <p className="text-center text-gray-400 mt-4">Generating your content strategy...</p>}
    </div>
  );
}
