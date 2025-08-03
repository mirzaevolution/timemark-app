import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 selectedImage: string | ArrayBuffer | null = null;
  watermarkId: string = '';
  name = 'ANDI ROSANDI';
  description = 'BRU  1L & SADAP 1a';
  tangglWaktu = 'Minggu, 03 Agustus 2025 15:34';
  address = 'Jl. AH Nasution No. 213, ABC 222 30A Adirejo Pekalongan, Lampung Timur 34391';
  gps = '-5.11017615023039, 105.30055143619265';
  compass = '76';
  note = 'AIR OFF';

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const cropped = this.cropImageToCenter(img, 1200, 1600);
        this.selectedImage = cropped;
        this.watermarkId = uuidv4().replace(/-/g, '').substring(0, 14).toUpperCase();
      };
      if (reader.result) {
        img.src = reader.result.toString();
      }
    };
    reader.readAsDataURL(file);
  }

  private cropImageToCenter(img: HTMLImageElement, targetWidth: number, targetHeight: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const sx = Math.max(0, (img.width - targetWidth) / 2);
    const sy = Math.max(0, (img.height - targetHeight) / 2);
    const sWidth = Math.min(targetWidth, img.width);
    const sHeight = Math.min(targetHeight, img.height);

    ctx.drawImage(
      img,
      sx, sy, sWidth, sHeight,
      0, 0, targetWidth, targetHeight
    );

    return canvas.toDataURL('image/jpeg'); // or 'image/png'
  }

  downloadImage(): void {
    const element = document.getElementById('watermarkedImage');
    if (!element) return;

    html2canvas(element, {
      useCORS: true,
      backgroundColor: null
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `timemark_${this.watermarkId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
}
