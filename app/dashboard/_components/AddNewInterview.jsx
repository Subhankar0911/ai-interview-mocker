"use client"
import React, { useState } from "react";
import Input from "../../../components/ui/input";
import Textarea from "../../../components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { Mockinterview } from "../../../utils/schema";
import { db } from "../../../utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const router = useRouter();
  // Function to find the first balanced JSON substring in a string
  function extractJSON(str) {
    let stack = [];
    let startIndex = -1;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "{" || str[i] === "[") {
        if (stack.length === 0) startIndex = i;
        stack.push(str[i]);
      } else if (str[i] === "}" || str[i] === "]") {
        if (stack.length === 0) continue;
        let last = stack[stack.length - 1];
        if ((str[i] === "}" && last === "{") || (str[i] === "]" && last === "[")) {
          stack.pop();
          if (stack.length === 0) {
            return str.substring(startIndex, i + 1);
          }
        }
      }
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check webcam and microphone permissions before proceeding
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert("Please enable webcam and microphone access to proceed.");
      return;
    }

    if (!jobPosition || !jobDescription || !yearsOfExperience) {
      alert("Please fill all required fields before submitting.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${yearsOfExperience}. Please give us 10 interview questions with answers in JSON format with fields "question" and "answer".`;

      // Call server-side API route
      const response = await fetch("/api/generateInterviewQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate interview questions");
      }

      const data = await response.json();
      const responseText = data.responseText;

      const jsonString = extractJSON(responseText);
      if (!jsonString) {
        throw new Error("No valid JSON found in AI response");
      }
      const parsedResponse = JSON.parse(jsonString);
      setJsonResponse(parsedResponse);

      // Insert into database
      const resp = await db
        .insert(Mockinterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsedResponse),
          jobPosition: jobPosition,
          jobDesc: jobDescription,
          jobExperience: yearsOfExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .returning({ mockId: Mockinterview.mockId });
      console.log("Inserted ID:", resp);
      if (resp && resp.length > 0) {
        router.push(`/dashboard/interview/${resp[0].mockId}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate interview questions or save data. Please try again.");
      setJsonResponse(null);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div
          className="p-5 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-transform active:scale-95"
          onClick={async () => {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
              // If permission granted, stop all tracks and open dialog
              stream.getTracks().forEach(track => track.stop());
              setOpenDialog(true);
            } catch (err) {
              alert("Please enable webcam and microphone access to proceed.");
            }
          }}
        >
          <h2 className="font-bold text-sm md:text-md text-blue-500 cursor-pointer transition-colors duration-200 hover:text-blue-700">Launch Here</h2>
        </div>
          {openDialog && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-90 z-40"></div>
              <div className="fixed z-50 bg-white p-6 rounded shadow-lg max-w-md w-full text-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h2 className="text-base font-semibold mb-4">Tell us more about your job interview</h2>
                <p className="mb-6 text-xs">
                  Add details about your job position role, job description and years of experience
                </p>
                <div className="mb-4 flex flex-col">
                  <label htmlFor="jobPosition" className="text-xs font-semibold mb-2">
                    Job Position/Role
                  </label>
                  <Input
                    id="jobPosition"
                    name="jobPosition"
                    placeholder="Ex. Full Stack Developer"
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>
                <div className="mb-4 flex flex-col">
                  <label htmlFor="jobDescription" className="text-xs font-semibold mb-2">
                    Job Description/Tech Stack(In Short)
                  </label>
                  <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    placeholder="Ex. React, Nextjs, Angular, MySql etc."
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                <div className="mb-4 flex flex-col">
                  <label htmlFor="yearsOfExperience" className="text-xs font-semibold mb-2">
                    Years of experience
                  </label>
                  <input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    placeholder="Ex. 5"
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs transition-transform active:scale-95"
                  disabled={loading}
                >
                  {loading ? "Generating from AI..." : "Start Interview"}
                </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                    onClick={() => setOpenDialog(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
                {error && (
                  <div className="mt-4 text-red-600 text-xs">
                    {error}
                  </div>
                )}
                {jsonResponse && (
                  <div className="mt-4 max-h-48 overflow-auto text-xs bg-gray-100 p-2 rounded">
                    <pre>{JSON.stringify(jsonResponse, null, 2)}</pre>
                  </div>
                )}
              </div>
            </>
          )}
      </div>
    </form>
  );
}

export default AddNewInterview;
