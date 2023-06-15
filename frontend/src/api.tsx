import { log } from "console";
import { read } from "fs";
import React, { useEffect, useState } from "react";

export function useAsyncFetch(fetchFunction: (...args: any[]) => Promise<any>) {
  const [res, setRes] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const fetch = async (...args: any[]) => {
    setLoading(true);
    console.log("args", args);
    try {
      const full = await fetchFunction(...args);
      const body = await full.json();
      // const readyRes = {
      //   questions: ["what is your name?", "what is your age?"],
      //   user_id: "1234",
      // };
      if (full.status !== 200) {
        throw new Error(body.error);
      }
      setRes(body);
      console.log("response", full, body);
      setLoading(false);
      return body;
    } catch (err: any) {
      console.log("error", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const clear = () => {
    setRes(undefined);
    setError(undefined);
    setLoading(false);
  };

  return { fetch, res, loading, error, setError, clear };
}

export async function sendDreamDescription(
  dreamDescription: string,
  user_id?: string
) {
  return fetch("/tell", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dream: dreamDescription, user_id }),
  });
}

export async function fetchinterpretation(answers: string[], user_id: string) {
  return fetch("/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers, user_id }),
  });
}
