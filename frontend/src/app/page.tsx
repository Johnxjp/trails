"use client";

import { useEffect, useState } from 'react';
import { FileUploader } from '@/components/FileImport';
import { Annotation } from '@/lib/types';
import { DataGrid } from '@/components/DataGrid';
import { Trail } from '@/components/Trail';

export default function Home() {

  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState<Annotation[]>([]);
  const [trailNodes, setTrailNodes] = useState<Annotation[]>([]);

  useEffect(() => {
    async function getAnnotations() {
      console.log('Fetching annotations...');
      try {
        const res = await fetch('http://localhost:8000/annotations?size=9', {
          cache: 'no-store' // Ensure fresh data check
        });
        if (!res.ok) {
          return []; // Return null for error cases
        }

        const response = await res.json();
        console.log('Response:', response);
        setData(response.annotations);
      } catch (error) {
        console.error('Failed to fetch annotations:', error);
        return [];
      }
    }
    getAnnotations();
  }, [trailNodes]);

  useEffect(() => {
    console.log('Trail nodes updated:', trailNodes);
  }, [trailNodes]);

  function addToTrailNodes(annotation: Annotation) {
    console.log('Adding to trail nodes:', annotation);
    const newTrailNodes = [...trailNodes, annotation];
    setTrailNodes(newTrailNodes);
  }

  async function handleSubmit() {
    console.log(inputValue);
    if (inputValue.length === 0) {
      console.log('Input is empty');
      return;
    }
    try {
      const url = new URL(`http://localhost:8000/search`);
      url.searchParams.append('query', inputValue);
      const data = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (data.ok) {
        const json = await data.json();
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

    <div className="flex flex-row h-screen">
      {/* sidebar */}
      {trailNodes.length > 0 ? (
        <div className="max-w-md p-5 pt-10 border-r-2 max-h-screen overflow-y-auto scrollbar-thin">
          <Trail trailNodes={trailNodes} />
        </div>) : null}
      <div className="w-full m-auto">
        {
          data.length > 0 ? (
            <DataGrid data={data} addToTrailNodes={addToTrailNodes} />
          ) : < FileUploader />
        }
        {/* <form className='flex flex-row items-center justify-center'>
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
      </form> */}
      </div>
    </div >
  );
}
