import { put, del } from '@vercel/blob';

export async function saveFile(file: File, prefix: string = 'file'): Promise<string> {
  const fileExtension = file.name ? `.${file.name.split('.').pop()}` : '.jpg';
  const uniqueName = `${prefix}-${Date.now()}${fileExtension}`;
  
  // Upload to Vercel Blob Storage
  const blob = await put(uniqueName, file, { access: 'public' });
  
  // Return the public URL for database storage
  return blob.url;
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    if (fileUrl.includes('vercel-storage.com')) {
      await del(fileUrl);
    }
  } catch (error) {
    console.warn(`Failed to delete blob ${fileUrl}:`, error);
  }
}

export function getFileUrl(filepath: string): string {
  // Check if it's an old local path vs new blob URL
  if (filepath.startsWith('http')) {
    return filepath;
  }
  return filepath.startsWith('/') ? filepath : `/${filepath}`;
}