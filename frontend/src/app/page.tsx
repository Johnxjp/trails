"use client";

import { useState } from 'react';
import { FileUploader } from '@/components/fileImport';

export default function Home() {

  const [inputValue, setInputValue] = useState('');

  async function handleSubmit() {
    console.log(inputValue);
    if (inputValue.length === 0) {
      console.log('Input is empty');
      return;
    }
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

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          console.log('File content: ', content);
          try {
            const url = new URL(`http://localhost:8000/upload`);
            let data = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ file_content: content }),
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
        }
      };
      reader.readAsText(file);
    }
    else {
      console.log('No file selected');
    }

  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form className='flex flex-row items-center justify-center'
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); handleSubmit() }}>
        <input
          className="border rounded px-4 py-2 w-100"
          type="text"
          id="search-query"
          value={inputValue}
          onChange={(e) => { e.preventDefault(); e.stopPropagation(); setInputValue(e.target.value); }}
          placeholder="Ask a question" />
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSubmit() }} className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </form>
      <FileUploader />
    </div>
  );
}
