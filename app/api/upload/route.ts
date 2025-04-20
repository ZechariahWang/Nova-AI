import { NextResponse } from "next/server";
import { storage } from "@/firebase/admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate a unique filename
    const filename = `${Date.now()}-${file.name}`;
    
    // Upload to Firebase Storage
    const bucket = storage.bucket();
    const fileRef = bucket.file(`profile-pictures/${filename}`);
    
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Get the public URL
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Long expiration for profile pictures
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
} 