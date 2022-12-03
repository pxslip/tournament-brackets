export interface Group {
  teams: string[];
  matches: number[];
}

export interface Groups {
  [name: string]: Group;
}

export interface Fixture {
  date: string;
  location: string;
  match: number;
  round: number | string;
  home: string; // TODO: this should be explicitly one of the members of thte Tournament.teams array
  away: string; // TODO: ditto
  group: string | null;
}

export interface Fixtures {
  [number: string]: Fixture;
}

export interface Tournament {
  name: string;
  location: string;
  start: string;
  end: string;
  teams: string[];
  groups: Groups;
  fixtures: Fixtures;
}
