export interface Comment {
  author: string;
  comment: string;
  stars: number;
  location?: {
    lat: number;
    lng: number;
  };
  geo?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  imageUrl?: string;
  source?: 'form' | 'foursquare';
  createdAt?: string;
}

export interface Poi {
  _id?: string;
  name: string;
  location: string;
  description?: string;
  imageUrl?: string;
  dateAdded?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  geo?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  insertedBy?: string;
  source?: 'form' | 'foursquare';
  comments?: Comment[];
}