import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function ContentStrategyGenerator() {
  const [businessStage, setBusinessStage] = useState("");
  const [goal, setGoal] = useState("");
  const [techSolution, setTechSolution] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [result, setResult] = useState(null);

  const generateStrategy = async () => {
    if (!businessStage || !goal || !techSolution || !companyName || !websiteUrl) {
      alert("Please fill out all fields.");
      return;
    }

    const response = await fetch("/api/generate-strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessStage, goal, techSolution, companyName, websiteUrl }),
    });
    const data = await response.json();
    setResult(data.strategy);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        AI-Powered B2B Content Strategy Generator for Tech Companies
      </h1>
      <p className="mb-4 text-center">
        Please enter your tech company’s details and get a sample content plan in seconds!
      </p>

      <Select onValueChange={setBusinessStage}>
        <SelectTrigger className="mb-4">
          <SelectValue placeholder="Select Business Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="startup">Start-up</SelectItem>
          <SelectItem value="scaleup">Scale-up</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setGoal}>
        <SelectTrigger className="mb-4">
          <SelectValue placeholder="Select Marketing Goal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="lead_generation">Lead Generation</SelectItem>
          <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
          <SelectItem value="digital_footprint">Digital Footprint</SelectItem>
          <SelectItem value="thought_leadership">Thought Leadership</SelectItem>
          <SelectItem value="sales_enablement">Sales Enablement</SelectItem>
          <SelectItem value="linkedin_visibility">LinkedIn Visibility</SelectItem>
        </SelectContent>
      </Select>

      <Input
        className="mb-4"
        placeholder="Describe your tech solution in a single sentence (e.g., CRM solution for Restaurants)"
        value={techSolution}
        onChange={(e) => setTechSolution(e.target.value)}
        required
      />

      <Input
        className="mb-4"
        placeholder="Enter your company name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
      />

      <Input
        className="mb-4"
        placeholder="Enter your website URL"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
        required
      />

      <Button onClick={generateStrategy} className="w-full">
        Generate My Content Strategy
      </Button>

      {result && (
        <Card className="mt-6 p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Your Custom Content Plan:</h2>
            {result.map((month, index) => (
              <div key={index} className="mt-4">
                <h3 className="text-md font-semibold">Month {index + 1}</h3>
                <ul className="list-disc ml-6">
                  {month.map((item, i) => (
                    <li key={i}>
                      <strong>{item.type}</strong>
                      {Array.isArray(item.details) ? (
                        <ul className="list-disc ml-4">
                          {item.details.map((post, j) => (
                            <li key={j}>
                              <strong>{post.category}</strong>: <i>{post.title}</i>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span> - {item.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
