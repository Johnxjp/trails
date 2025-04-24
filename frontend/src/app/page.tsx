"use client";

import { useState } from 'react';

export default function Home() {

  const [inputValue, setInputValue] = useState('');

  async function handleSubmit() {
    console.log(inputValue);
    try {
      const url = new URL(`http://localhost:8000/search`);
      url.searchParams.append('query', inputValue);
      let data = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (data.ok) {
        let json = await data.json();
        console.log(json);
      } else {
        console.log('Error: ', data.statusText);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
    setInputValue('');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); handleSubmit() }}>
        <input
          className="border rounded px-4 py-2 w-100"
          type="text"
          id="search-query"
          value={inputValue}
          onChange={(e) => { e.preventDefault(); e.stopPropagation(); setInputValue(e.target.value); }}
          placeholder="Ask a question" />
      </form>
    </div>
  );
}
