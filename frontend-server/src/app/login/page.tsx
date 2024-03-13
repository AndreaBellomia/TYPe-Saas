
"use client"

import { SyntheticEvent, useState, MouseEvent } from 'react'
import Cookies from "js-cookie";
import { DjangoApi } from "@/libs/fetch";


// import { useCookies } from 'react-cookie';

interface FormValue {
    email: string;
    password: string
}

export default function _() {

    const [form, setForm] = useState<FormValue>({
        email: '',
        password: '',
    });

    // const [cookies, setCookie] = useCookies(['jwt']);

    const onChange: (event: SyntheticEvent<HTMLInputElement, Event>) => void = (event) => {

        const target = event.target as HTMLInputElement;
        const value: string = target.value;

        setForm({
            ...form,
            [target.name]: value
        })
    }

    const onSubmit : (event: MouseEvent<HTMLButtonElement>) => void = (event) => {
      fetch("login/api/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then((data) => {
              console.log(data)

          })
          .catch((error) => {
            console.error("Error occurred:", error);
          });
}
    

    const printToken = () => {
      const client = new DjangoApi()
      client.get("/authentication/authenticated", (resp) => {console.log(resp)}, (err) => {console.log(err)})
    }

    

    return (
        <>  
            <div className='relative top-2/4 h-100 w-100'>
                <div className='flex flex-col'>
                <input name="email" type="email" placeholder="Email" onChange={onChange} className='text-black mt-2'/>
                <input type="password"  name="password" onChange={onChange} className='text-black mt-2'/>

                <button onClick={onSubmit}>Submit</button>
                <button onClick={printToken}>Print token</button>
                </div>
            </div>

 
        </>
    );
}