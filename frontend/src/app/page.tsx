"use client";

import { useState } from 'react';
import { Annotation } from '@/lib/types';
import { DataPanel } from '@/components/DataPanel';

export default function Home() {

  const [trailNodes, setTrailNodes] = useState<Annotation[]>([]);
  const [trailSaving, setTrailSaving] = useState(false);
  const [trailSaved, setTrailSaved] = useState(false);

  function updateTrailNodes(annotation: Annotation, panelIndex: number) {
    // Check if panelIndex is equal to length of trailNodes. If so append the annotation to the end of the array
    // Otherwise, break the trail at the index of the panelIndex and insert the annotation
    if (panelIndex === trailNodes.length) {
      console.log('Appending to end of trail nodes');
      const newTrailNodes = [...trailNodes, annotation];
      setTrailNodes(newTrailNodes);
    } else {
      const newTrailNodes = [...trailNodes.slice(0, panelIndex), annotation];
      setTrailNodes(newTrailNodes);
    }
    setTrailSaved(false);
  }


  function resetTrail() {
    console.log('Resetting trail nodes');
    setTrailSaved(false);
    setTrailNodes([]);
  }

  async function saveTrail() {
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
        setTrailSaved(true);
      } else {
        setTrailSaved(false);
      }
      setTrailSaving(false)
    }
    catch {
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
