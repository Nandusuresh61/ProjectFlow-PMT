export interface IFileStorageService {
  uploadFile(file: Buffer, folder?: string): Promise<void>;
  deleteFile(fileUrl: string): Promise<void>;
}
