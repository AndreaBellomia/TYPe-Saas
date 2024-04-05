"use client"

import { DjangoApi } from "@/libs/fetch";

const API = new DjangoApi()

export default function _ () {

  const handlerClick = async () => {
    const resp = await fetch("http://localhost:8000/authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@admin.it",
        password: "admin",
      }),
      credentials: "include"
    });

    console.log(resp)

    const data = await resp.json()

    console.log(data)
  
    if (!resp.ok) {
      
    }

  
  }


  const handlerTest = () => {
    API.get("authentication/authenticated", (resp) => {
      console.log(resp)
    }, (err) => {console.log(err)})
  }


  return (
    <>
    <button onClick={handlerClick} >login</button>
    <button onClick={handlerTest} >test</button>
    </>
  )
}