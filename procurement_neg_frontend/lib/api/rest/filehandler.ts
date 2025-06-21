import { BASE } from "@/lib/constants";


// 1. Upload the file
export async function uploadFileApi(base64Data: any, mimetype: any, id: any, user_id: any, session_id: any) {
  const res = await fetch(`${BASE}/api/upload-file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      base64_data: base64Data,
      mimetype,
      id,
      user_id,
      session_id
    })
  });

  const data = await res.json();
  console.log("Uploaded file, signed URL:", data.url);
  return data;
}

// 2. Get a signed URL for download
export async function viewfileApi(id: any, user_id: any, session_id: any) {
  const res = await fetch(`${BASE}/api/download-file?id=${id}&user_id=${user_id}&session_id=${session_id}`);
  const data = await res.json();
  return data.url;
}

