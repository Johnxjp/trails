"use client";

import { useState } from 'react';
// import { FileUploader } from '@/components/FileImport';
import { Annotation } from '@/lib/types';
import { DataPanel } from '@/components/DataPanel';
// import { DataGrid } from '@/components/DataGrid';
// import { Trail } from '@/components/Trail';

export default function Home() {

  const [inputValue, setInputValue] = useState('');
  // const [data, setData] = useState<Annotation[]>([]);
  const [trailNodes, setTrailNodes] = useState<Annotation[]>([]);
  const [trailSaving, setTrailSaving] = useState(false);
  const [trailSaved, setTrailSaved] = useState(false);

  // useEffect(() => {
  //   async function getAnnotations() {
  //     console.log('Fetching annotations...');
  //     try {
  //       const res = await fetch('http://localhost:8000/annotations?size=9', {
  //         cache: 'no-store' // Ensure fresh data check
  //       });
  //       if (!res.ok) {
  //         return []; // Return null for error cases
  //       }

  //       const response = await res.json();
  //       console.log('Response:', response);
  //       setData(response.annotations);
  //     } catch (error) {
  //       console.error('Failed to fetch annotations:', error);
  //       return [];
  //     }
  //   }
  //   getAnnotations();
  // }, [trailNodes]);

  // useEffect(() => {
  //   console.log('Trail nodes updated:', trailNodes);
  // }, [trailNodes]);

  function updateTrailNodes(annotation: Annotation, panelIndex: number) {
    // Check if panelIndex is equal to length of trailNodes. If so append the annotation to the end of the array
    // Otherwise, break the trail at the index of the panelIndex and insert the annotation
    if (panelIndex === trailNodes.length) {
      console.log('Appending to end of trail nodes');
      const newTrailNodes = [...trailNodes, annotation];
      console.log('New trail nodes:', newTrailNodes);
      setTrailNodes(newTrailNodes);
    } else {
      console.log('Changing branch at index:', panelIndex);
      const newTrailNodes = [...trailNodes.slice(0, panelIndex), annotation];
      setTrailNodes(newTrailNodes);
    }
    setTrailSaved(false);
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

  function resetTrail() {
    console.log('Resetting trail nodes');
    setTrailSaved(false);
    setTrailNodes([]);
  }

  function breakTrail(trailItemId: string) {
    console.log('Breaking trail at:', trailItemId);
    const index = trailNodes.findIndex((node) => node.id === trailItemId);
    if (index !== -1) {
      const newTrailNodes = trailNodes.slice(0, index + 1);
      setTrailNodes(newTrailNodes);
    }
  }
  function removeFromTrailNodes(trailItemId: string) {
    console.log('Removing from trail nodes:', trailItemId);
    const newTrailNodes = trailNodes.filter((node) => node.id !== trailItemId);
    setTrailNodes(newTrailNodes);
  }

  async function saveTrail() {
    console.log('Saving trail nodes:', trailNodes);
    const url = new URL(`http://localhost:8000/trail`);
    const body = {
      trail: trailNodes.map((node: Annotation) => ({
        id: node.id,
        title: node.title,
        content: node.content,
        authors: node.authors,
      })),
    }
    try {
      setTrailSaving(true)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log('Trail saved successfully');
        setTrailSaved(true);
      } else {
        console.error('Error saving trail:', response.statusText);
      }
      setTrailSaving(false)
    }
    catch (error) {
      console.error('Error saving trail:', error);
      setTrailSaving(false)
    }

  }


  return (

    <div className="flex flex-col h-screen w-screen justify-items-start">
      <div>
        <div className="w-full m-2 flex justify-end md:px-4 p-1 gap-2">
          <button className="
            inset-shadow-sm inset-shadow-slate-400/50 
            rounded-full font-bold bg-neutral-grey/80 
            p-1 w-20 hover:bg-carmine-red 
            hover:cursor-pointer
            hover:text-white" onClick={resetTrail}>reset
          </button>
          <button className={`
            inset-shadow-sm inset-shadow-slate-400/50 
            rounded-full font-bold ${trailSaved ? 'bg-emerald-200' : 'bg-neutral-grey/80'}
            p-1 w-20 hover:bg-carmine-red 
            hover:cursor-pointer
            hover:text-white`} onClick={saveTrail}>{`${trailSaved ? 'saved' : trailSaving ? 'saving' : 'save'}`}
          </button>
        </div>
      </div>
      {/* Seed Panel */}
      <div className="h-full flex flex-row w-full overflow-hidden overflow-x-auto scrollbar-thin">
        <DataPanel key={0} seedId={null} panelIndex={0} updateTrailNodes={updateTrailNodes} />
        {
          trailNodes.map((annotation, index) => (
            console.log('Rendering trail node:', annotation),
            <DataPanel
              key={index + 1}
              seedId={annotation.id}
              panelIndex={index + 1}
              updateTrailNodes={updateTrailNodes}
            />
          ))

        }
      </div>
    </div>
  );
}
