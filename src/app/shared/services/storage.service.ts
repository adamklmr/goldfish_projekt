import { Injectable } from '@angular/core';
import { getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {}

  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path); // Útvonal a Storage-ban
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Opció: Feltöltési állapot figyelése
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          // Feltöltés befejezése után letöltési URL lekérése
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }
}