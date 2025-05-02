
import { useState } from "react";
import { useRouter } from "next/navigation";

export function FileUploader() {
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const router = useRouter();

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        // Reset states
        setError(false);
        setUploadComplete(false);
        setUploading(true);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);

            // Make the upload request
            const response = await fetch('http://localhost:8000/document/upload/kindle', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }
            setUploadComplete(true);
            router.refresh();
        } catch (err: unknown) {
            console.error('Error uploading file:', err);
            setError(true);
            setUploadComplete(false);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                id="file-input"
                className="hidden"
                accept=".txt"
                onChange={handleFileChange}
            />

            <button className="border rounded p-2 m-2 w-115 hover:cursor-pointer"
                onClick={() => {
                    const fileInput = document.getElementById('file-input')
                    if (fileInput) {
                        (fileInput as HTMLInputElement).click();
                    }
                }}
                disabled={uploading}
            >
                {uploading ? 'Processing...' : 'Choose File'}
            </button>

            {error && <div className="error">Error uploading file</div>}
            {uploadComplete && <div className="success">Upload complete!</div>}
        </div >
    );
};