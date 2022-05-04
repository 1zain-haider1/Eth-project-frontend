interface World {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  artists: Artist[] | string[];
  drops: Drop[] | string[];
  collections: Collection[] | string[];
  _id: string;
}
