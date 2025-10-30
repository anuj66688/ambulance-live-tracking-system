export interface Location {
  lat: number;
  lng: number;
}

export interface AmbulanceData {
  id: string;
  location: Location;
  speed: number;
  heading: number;
  status: 'idle' | 'active' | 'emergency';
  timestamp: number;
  driver?: string;
}

export interface TripData {
  ambulanceId: string;
  origin: Location;
  destination: Location;
  status: 'active' | 'completed' | 'cancelled';
  startTime: number;
  endTime?: number;
  currentLocation: Location;
  primaryRoute: any;
  shortcutRoute: any;
  distance?: number;
  eta?: number;
}

export interface RouteData {
  overview_polyline: {
    points: string;
  };
  legs: Array<{
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    start_location: Location;
    end_location: Location;
    steps: Array<any>;
  }>;
  bounds: {
    northeast: Location;
    southwest: Location;
  };
  summary: string;
}
