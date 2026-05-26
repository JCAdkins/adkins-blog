"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import Break from "../ui/break";

type Term = {
  word: string;
  definition: string;
};

type Props = {
  term: Term;
};

export default function WordOfTheDayCard({ term }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <p className="text-lg font-semibold text-black dark:text-login">
        📸 Word of the Day:{" "}
        <span
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => setShow(true)}
        >
          {term.word}
        </span>
      </p>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card
            className="w-full max-w-md rounded-lg bg-white dark:bg-dark-card dark:border-dark-border p-6 shadow-xl"
            header={
              <div className="text-xl font-bold text-black dark:text-login">
                {term.word}
              </div>
            }
            footer={
              <div className="flex justify-end">
                <Button
                  className="bg-login hover:bg-login-hover dark:bg-[#c2826d] dark:hover:bg-login"
                  onClick={() => setShow(false)}
                >
                  Close
                </Button>
              </div>
            }
          >
            <>
              <Break className="dark:border-dark-border" />
              <p className="mt-4 text-gray-700 dark:text-login">
                {term.definition.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </>
          </Card>
        </div>
      )}
    </div>
  );
}
