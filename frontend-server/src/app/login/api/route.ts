'use server'
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const requestData = await request.json();
    const cookieStore = cookies();
  
    try {
      const response = await fetch("http://localhost:8000/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error(response.statusText);
      }
  
      const data = await response.json();

      cookieStore.set({
        name: "auth",
        value: data.token,
        httpOnly: false,
        secure: true,
        expires: new Date(data.expiry),
      });

      return Response.json({ detail: "ok" });
    } catch (error) {
      console.error("Error occurred:", error);
      return Response.json({ detail: "error" }, { status: 500 });
    }
  }

export async function GET(request: Request) {
    const cookieStore = cookies();
    return Response.json({ token: cookieStore.get("auth") });
  }