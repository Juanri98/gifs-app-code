import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY = 'CpYTljXoliCdBEUPtlSyA2U5ZSBS0XoD';
const GIPHY_URL = 'https://api.giphy.com/v1/gifs';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];

  constructor(private httpClient: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHiatory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHiatory.splice(0, 20);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    this._tagsHistory = JSON.parse(localStorage.getItem('history') ?? '[]');
    if (this._tagsHistory.length > 0) {
      this.searchTag(this._tagsHistory[0]);
    }
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);
    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('q', tag)
      .set('limit', '25');

    this.httpClient
      .get<SearchResponse>(`${GIPHY_URL}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }
}
